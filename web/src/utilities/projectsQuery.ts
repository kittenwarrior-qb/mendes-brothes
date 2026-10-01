import type { Payload, Where } from 'payload'

import type { ListingPage } from '@/payload-types'

export type ProjectFilterParams = {
  q?: string
  service?: string
  area?: string
  size?: string
  year?: string
  type?: string
  sort?: string
  page?: string
}

export type SizeBucket = { key: string; label: string; min: number; max?: number | null }

export const sortOptions = [
  { value: 'new', label: 'Newest first', sort: '-completedAt' },
  { value: 'old', label: 'Oldest first', sort: 'completedAt' },
  { value: 'big', label: 'Largest lot first', sort: '-acres' },
  { value: 'small', label: 'Smallest lot first', sort: 'acres' },
] as const

const one = (v: unknown) => (Array.isArray(v) ? v[0] : v)
const clean = (v: unknown, max = 80) =>
  typeof one(v) === 'string' ? (one(v) as string).trim().slice(0, max) : undefined

/** Normalise untrusted URL params into a known, bounded shape. */
export const parseProjectParams = (
  raw: Record<string, string | string[] | undefined>,
): ProjectFilterParams => ({
  q: clean(raw.q, 100),
  service: clean(raw.service),
  area: clean(raw.area),
  size: clean(raw.size, 4),
  year: /^\d{4}$/.test(clean(raw.year) ?? '') ? clean(raw.year) : undefined,
  type: clean(raw.type, 20),
  sort: sortOptions.some((s) => s.value === clean(raw.sort)) ? clean(raw.sort) : undefined,
  page: /^\d{1,4}$/.test(clean(raw.page) ?? '') ? clean(raw.page) : undefined,
})

export const sizeBuckets = (settings?: ListingPage['projects'] | null): SizeBucket[] =>
  (settings?.sizeBuckets ?? []).map((b, i) => ({
    key: String(i),
    label: b.label,
    min: b.min ?? 0,
    max: b.max ?? null,
  }))

export const buildProjectsWhere = async (
  payload: Payload,
  params: ProjectFilterParams,
  buckets: SizeBucket[],
): Promise<Where> => {
  const and: Where[] = [{ _status: { equals: 'published' } }]

  if (params.service) {
    const s = await payload.find({
      collection: 'services',
      where: { slug: { equals: params.service } },
      limit: 1,
      depth: 0,
      select: {},
    })
    // unknown slug → no results rather than ignoring the filter
    and.push({ services: { contains: s.docs[0]?.id ?? -1 } })
  }
  if (params.area) {
    const a = await payload.find({
      collection: 'service-areas',
      where: { slug: { equals: params.area } },
      limit: 1,
      depth: 0,
      select: {},
    })
    and.push({ area: { equals: a.docs[0]?.id ?? -1 } })
  }
  const bucket = buckets.find((b) => b.key === params.size)
  if (bucket) {
    and.push({ acres: { greater_than_equal: bucket.min } })
    if (typeof bucket.max === 'number') and.push({ acres: { less_than: bucket.max } })
  }
  if (params.year) and.push({ year: { equals: Number(params.year) } })
  if (params.type) and.push({ clientType: { equals: params.type } })
  if (params.q) {
    and.push({
      or: [
        { title: { like: params.q } },
        { summary: { like: params.q } },
        { locationNote: { like: params.q } },
      ],
    })
  }
  return { and }
}

export const toQueryString = (
  params: ProjectFilterParams,
  overrides: Partial<ProjectFilterParams> = {},
) => {
  const merged = { ...params, ...overrides }
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v)
  const s = sp.toString()
  return s ? `?${s}` : ''
}
