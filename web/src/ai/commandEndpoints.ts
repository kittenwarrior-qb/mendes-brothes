import type { Endpoint, PayloadRequest } from 'payload'

import { isManagerUser } from '../access/roles'
import { AUTO_PALETTE } from '../theme/presets'
import {
  type Address,
  checkText,
  formatAddress,
  imageFields,
  isPaletteKey,
  normalizeHex,
  paletteLabel,
  textFields,
} from './commands'
import { FetchImageError, fetchImage } from './fetchImage'

/*
 * What the assistant's quick commands do once the person presses "Apply" on the preview
 * card. Each request is checked here again (role, values, photo ids) — the chat is only
 * a convenience, never the gatekeeper. Access rules of the collections still apply too
 * (overrideAccess: false), so an editor cannot change the logo even by calling this directly.
 */

const json = (data: unknown, status = 200) => Response.json(data, { status })

const body = async (req: PayloadRequest): Promise<Record<string, unknown>> => {
  try {
    return ((await req.json?.()) ?? {}) as Record<string, unknown>
  } catch {
    return {}
  }
}

const recent = new Map<string, number[]>()
const tooMany = (key: string, max: number) => {
  const now = Date.now()
  const times = (recent.get(key) ?? []).filter((t) => now - t < 60_000)
  times.push(now)
  recent.set(key, times)
  return times.length > max
}

const fieldLabels: Record<string, string> = {
  logo: 'Logo',
  logoOnDark: 'Logo on dark',
  logoMark: 'Badge logo',
  favicon: 'Favicon',
  phone: 'Phone',
  email: 'Email',
  hours: 'Hours',
  tagline: 'Tagline',
  address: 'Address',
}

class Refused extends Error {}

const idOf = (value: unknown): number | null => {
  if (value && typeof value === 'object' && 'id' in value) return Number(value.id)
  return typeof value === 'number' ? value : null
}

/** A media id that exists and is a photo. */
const photoId = async (req: PayloadRequest, value: unknown): Promise<number | null> => {
  if (value === null) return null
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) throw new Refused('That photo was not found.')
  const doc = await req.payload
    .findByID({ collection: 'media', id, depth: 0, req, overrideAccess: false })
    .catch(() => null)
  if (!doc?.mimeType?.startsWith('image/')) throw new Refused('That file is not a photo.')
  return id
}

const applySettings = async (req: PayloadRequest, fields: Record<string, unknown>) => {
  if (!isManagerUser(req.user))
    throw new Refused('Only a manager can change company info and logos.')
  const data: Record<string, unknown> = {}
  for (const key of Object.keys(fields)) {
    const value = fields[key]
    if ((imageFields as readonly string[]).includes(key)) data[key] = await photoId(req, value)
    else if ((textFields as readonly string[]).includes(key)) {
      const text = typeof value === 'string' ? value.trim() : ''
      const problem = checkText(key as (typeof textFields)[number], text)
      if (problem) throw new Refused(problem)
      data[key] = text
    } else if (key === 'address') {
      const a = (value ?? {}) as Partial<Address>
      const address = {
        street: String(a.street ?? '').slice(0, 80),
        city: String(a.city ?? '').slice(0, 80),
        state: String(a.state ?? '').slice(0, 20),
        zip: String(a.zip ?? '').slice(0, 12),
      }
      data.address = address
    } else throw new Refused('That cannot be changed from the assistant.')
  }
  if (!Object.keys(data).length) throw new Refused('Nothing to change.')

  const before = (await req.payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    req,
  })) as unknown as Record<string, unknown>
  const undo: Record<string, unknown> = {}
  for (const key of Object.keys(data)) {
    if ((imageFields as readonly string[]).includes(key)) undo[key] = idOf(before[key])
    else if (key === 'address') {
      const a = (before.address ?? {}) as Partial<Address>
      // keep the map link: only the four parts are changed
      data.address = { ...a, ...(data.address as Address) }
      undo.address = {
        street: a.street ?? '',
        city: a.city ?? '',
        state: a.state ?? '',
        zip: a.zip ?? '',
      }
    } else undo[key] = before[key] ?? ''
  }

  await req.payload.updateGlobal({ slug: 'site-settings', data, req, overrideAccess: false })
  req.payload.logger.info(
    `Assistant: ${Object.keys(data).join(', ')} changed by ${req.user?.email}`,
  )
  const names = Object.keys(data).map((k) => fieldLabels[k] ?? k)
  return {
    message: `${names.join(', ')} saved. It is on the website now.`,
    link: { label: 'Open Company info & logo', href: '/admin/globals/site-settings' },
    undo: { action: 'settings', fields: undo },
    summary: 'address' in data ? formatAddress(data.address as Address) : undefined,
  }
}

const applyTheme = async (req: PayloadRequest, input: Record<string, unknown>) => {
  if (!isManagerUser(req.user)) throw new Refused('Only a manager can change the colours.')
  const preset = String(input.preset ?? '')
  const brandColor = input.brandColor ? normalizeHex(String(input.brandColor)) : null
  if (input.brandColor && !brandColor) throw new Refused('Use a hex colour like #1D5FA8.')
  if (preset !== AUTO_PALETTE && !isPaletteKey(preset)) throw new Refused('Unknown palette.')
  if (preset === AUTO_PALETTE && !brandColor) throw new Refused('Give the brand colour too.')

  const before = (await req.payload.findGlobal({ slug: 'theme', depth: 0, draft: true, req })) as {
    preset?: string
    brandColor?: string
  }
  const data: Record<string, unknown> = { preset, _status: 'draft' }
  if (brandColor) data.brandColor = brandColor
  await req.payload.updateGlobal({ slug: 'theme', data, draft: true, req, overrideAccess: false })
  req.payload.logger.info(`Assistant: theme draft "${preset}" by ${req.user?.email}`)
  return {
    message: `Saved as a draft: ${paletteLabel(preset)}${brandColor ? ` ${brandColor}` : ''}. Visitors still see the old colours — open Colours & fonts, look at the live preview, then press Publish.`,
    link: { label: 'Preview and publish', href: '/admin/globals/theme' },
    undo: {
      action: 'theme',
      preset: before.preset ?? 'studio',
      brandColor: before.brandColor ?? undefined,
    },
  }
}

const applyProject = async (req: PayloadRequest, input: Record<string, unknown>) => {
  const title = String(input.title ?? '')
    .trim()
    .slice(0, 120)
  if (!title) throw new Refused('Give the project a title: /project Pool dig in Lewes')
  const ids = (Array.isArray(input.mediaIds) ? input.mediaIds : []).slice(0, 40)
  if (!ids.length) throw new Refused('Add at least one photo for the cover.')
  const photos: number[] = []
  for (const id of ids) photos.push((await photoId(req, id))!)

  const doc = await req.payload.create({
    collection: 'projects',
    data: {
      title,
      cover: photos[0],
      gallery: photos.slice(1).map((image) => ({ image })),
      _status: 'draft',
    } as never,
    draft: true,
    req,
    overrideAccess: false,
  })
  req.payload.logger.info(`Assistant: draft project ${doc.id} by ${req.user?.email}`)
  return {
    message: `Draft project “${title}” created with ${photos.length} photo${photos.length > 1 ? 's' : ''}. Add the summary, services, town, size and date, then press Publish.`,
    link: { label: 'Finish the project', href: `/admin/collections/projects/${doc.id}` },
  }
}

const fail = (req: PayloadRequest, err: unknown) => {
  if (err instanceof Refused || err instanceof FetchImageError)
    return json({ error: err.message }, 400)
  const status = (err as { status?: number })?.status
  if (status === 403) return json({ error: 'You are not allowed to do that.' }, 403)
  req.payload.logger.error({ err, msg: 'Assistant command failed' })
  return json(
    { error: err instanceof Error ? err.message : 'Something went wrong. Try again.' },
    500,
  )
}

export const commandEndpoints: Endpoint[] = [
  {
    // A photo from a link: downloaded by the server (safely) into the photo library.
    path: '/assistant/image-url',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return json({ error: 'Log in first.' }, 401)
      if (tooMany(`url:${req.user.id}`, 10))
        return json({ error: 'That is a lot of links. Wait a minute and try again.' }, 429)
      const data = await body(req)
      try {
        const file = await fetchImage(String(data.url ?? ''))
        const alt = typeof data.alt === 'string' ? data.alt.trim().slice(0, 200) : ''
        const doc = await req.payload.create({
          collection: 'media',
          data: alt ? { alt } : {},
          file: { ...file, size: file.data.length },
          req,
          overrideAccess: false,
        })
        return json({ doc: { id: doc.id, url: doc.url, filename: doc.filename, alt: doc.alt } })
      } catch (err) {
        return fail(req, err)
      }
    },
  },
  {
    path: '/assistant/apply',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return json({ error: 'Log in first.' }, 401)
      if (tooMany(`apply:${req.user.id}`, 30))
        return json({ error: 'Too many changes at once. Wait a minute.' }, 429)
      const data = await body(req)
      try {
        switch (data.action) {
          case 'settings':
            return json(await applySettings(req, (data.fields ?? {}) as Record<string, unknown>))
          case 'theme':
            return json(await applyTheme(req, data))
          case 'project':
            return json(await applyProject(req, data))
          default:
            return json({ error: 'Unknown command.' }, 400)
        }
      } catch (err) {
        return fail(req, err)
      }
    },
  },
]
