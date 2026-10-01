import type { Media, SiteSetting } from '@/payload-types'

export const telHref = (phone?: string | null) =>
  phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined

export const smsHref = (phone?: string | null, body?: string) =>
  phone
    ? `sms:${phone.replace(/[^\d+]/g, '')}${body ? `?&body=${encodeURIComponent(body)}` : ''}`
    : undefined

export const fullAddress = (s?: SiteSetting | null) => {
  const a = s?.address
  if (!a) return ''
  const cityLine = [a.city, [a.state, a.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  return [a.street, cityLine].filter(Boolean).join(', ')
}

export const mapLink = (s?: SiteSetting | null) => {
  if (s?.address?.mapUrl) return s.address.mapUrl
  const addr = fullAddress(s)
  return addr
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`
    : undefined
}

export const asMedia = (m: unknown): Media | null =>
  m && typeof m === 'object' && 'url' in (m as Media) ? (m as Media) : null

export const asDoc = <T extends { id: number | string }>(v: unknown): T | null =>
  v && typeof v === 'object' && 'id' in (v as T) ? (v as T) : null

export const asDocs = <T extends { id: number | string }>(v: unknown): T[] =>
  Array.isArray(v) ? (v.map((x) => asDoc<T>(x)).filter(Boolean) as T[]) : []

export const formatAcres = (acres?: number | null) => {
  if (acres === null || acres === undefined) return ''
  if (acres < 0.1) return `${Math.round(acres * 43560).toLocaleString('en-US')} sq ft`
  return `${Number(acres.toFixed(acres < 10 ? 1 : 0))} acres`
}

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const formatMonthYear = (iso?: string | null) => {
  if (!iso) return ''
  // shift by 15 days so month-only dates stay in the right month in any timezone
  const d = new Date(new Date(iso).getTime() + 15 * 864e5)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
