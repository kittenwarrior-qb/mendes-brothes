/*
 * Downloads a photo from a link someone pasted into the assistant, safely:
 * only http(s) on the normal ports, never to an address inside the server's own network
 * (checked on every connection, so a DNS trick or a redirect cannot get around it),
 * images only (checked by decoding them, not by trusting the header), 10 MB at most.
 */
import dns from 'node:dns'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const TIMEOUT_MS = 12_000
const MAX_REDIRECTS = 3

export class FetchImageError extends Error {}

const v4 = (ip: string) => ip.split('.').map(Number)

/** True for loopback, private, link-local, shared, multicast and other non-public addresses. */
export const isPrivateAddress = (ip: string): boolean => {
  if (net.isIPv4(ip)) {
    const [a, b] = v4(ip)
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    )
  }
  if (net.isIPv6(ip)) {
    const low = ip.toLowerCase()
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(low)
    if (mapped) return isPrivateAddress(mapped[1])
    return (
      low === '::' ||
      low === '::1' ||
      /^f[cd]/.test(low) ||
      /^fe[89ab]/.test(low) ||
      /^ff/.test(low) ||
      low.startsWith('64:ff9b:') ||
      low.startsWith('2001:db8')
    )
  }
  return true
}

/** Checks a link before anything is fetched. Returns the parsed URL. */
export const checkImageUrl = (raw: string): URL => {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    throw new FetchImageError('That is not a valid link.')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:')
    throw new FetchImageError('Only http and https links can be used.')
  if (url.username || url.password) throw new FetchImageError('Links with a password are not used.')
  if (url.port && url.port !== '80' && url.port !== '443')
    throw new FetchImageError('That link uses an unusual port.')
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (net.isIP(host) && isPrivateAddress(host))
    throw new FetchImageError('That link points inside a private network.')
  if (/^localhost$|\.localhost$|\.local$|\.internal$/i.test(host))
    throw new FetchImageError('That link points inside a private network.')
  return url
}

// Every connection resolves the name here and refuses private addresses.
const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, '', 4)
    const list = addresses as dns.LookupAddress[]
    const bad = list.find((a) => isPrivateAddress(a.address))
    if (!list.length || bad) {
      const e = new FetchImageError('That link points inside a private network.')
      return callback(e as NodeJS.ErrnoException, '', 4)
    }
    if ((options as dns.LookupOptions).all) return callback(null, list as never, 4)
    callback(null, list[0].address, list[0].family)
  })
}

type Download = { data: Buffer; mimetype: string; name: string }

const getOnce = (url: URL): Promise<{ redirect?: string } & Partial<Download>> =>
  new Promise((resolve, reject) => {
    const lib = url.protocol === 'https:' ? https : http
    const req = lib.get(
      url,
      {
        lookup: safeLookup,
        timeout: TIMEOUT_MS,
        headers: { 'user-agent': 'MendezBrothesWebsite/1.0 (image import)', accept: 'image/*' },
      },
      (res) => {
        const status = res.statusCode ?? 0
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume()
          return resolve({ redirect: new URL(res.headers.location, url).toString() })
        }
        if (status !== 200) {
          res.resume()
          return reject(new FetchImageError(`The link answered with an error (${status}).`))
        }
        const type = String(res.headers['content-type'] ?? '')
          .split(';')[0]
          .trim()
          .toLowerCase()
        if (type && !type.startsWith('image/') && type !== 'application/octet-stream') {
          res.resume()
          return reject(new FetchImageError('That link is a web page, not a photo.'))
        }
        if (Number(res.headers['content-length'] ?? 0) > MAX_IMAGE_BYTES) {
          res.resume()
          return reject(new FetchImageError('That photo is bigger than 10 MB.'))
        }
        const chunks: Buffer[] = []
        let size = 0
        res.on('data', (chunk: Buffer) => {
          size += chunk.length
          if (size > MAX_IMAGE_BYTES) {
            req.destroy(new FetchImageError('That photo is bigger than 10 MB.'))
            return
          }
          chunks.push(chunk)
        })
        res.on('end', () => {
          const name = decodeURIComponent(url.pathname.split('/').pop() || 'image')
          resolve({ data: Buffer.concat(chunks), mimetype: type, name })
        })
        res.on('error', reject)
      },
    )
    req.on('timeout', () => req.destroy(new FetchImageError('The link took too long to answer.')))
    req.on('error', (err) =>
      reject(
        err instanceof FetchImageError
          ? err
          : new FetchImageError('That link could not be opened.'),
      ),
    )
  })

const formats: Record<string, { mime: string; ext: string }> = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg' },
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
  gif: { mime: 'image/gif', ext: 'gif' },
  avif: { mime: 'image/avif', ext: 'avif' },
  heif: { mime: 'image/heic', ext: 'heic' },
  tiff: { mime: 'image/tiff', ext: 'tiff' },
}

/** Downloads the photo behind a link. Throws FetchImageError with a message for people. */
export const fetchImage = async (raw: string): Promise<Download> => {
  let url = checkImageUrl(raw)
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await getOnce(url)
    if (res.redirect) {
      url = checkImageUrl(res.redirect)
      continue
    }
    // decode it: the file must really be a photo (SVG is refused, it can carry scripts)
    const sharp = (await import('sharp')).default
    const meta = await sharp(res.data!)
      .metadata()
      .catch(() => null)
    const format = meta?.format ? formats[meta.format] : undefined
    if (!format) throw new FetchImageError('That link is not a photo (JPG, PNG, WebP or GIF).')
    const base =
      res
        .name!.replace(/\.[a-z0-9]+$/i, '')
        .replace(/[^\w-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'image'
    return { data: res.data!, mimetype: format.mime, name: `${base}.${format.ext}` }
  }
  throw new FetchImageError('That link redirects too many times.')
}
