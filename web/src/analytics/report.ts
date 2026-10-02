import type { Payload } from 'payload'

import { sql } from '@payloadcms/db-postgres'

import { clickLabels, dayOf, lastDays } from './rules'

type Db = {
  execute: (query: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }>
}
const db = (payload: Payload) => (payload.db as unknown as { drizzle: Db }).drizzle

export type Row = { label: string; count: number }
export type Totals = { visitors: number; views: number; calls: number; leads: number }
export type Report = {
  days: number
  from: string
  to: string
  totals: Totals
  /** the same number of days just before, for "compared with the previous period" */
  previous: Totals
  daily: { day: string; visitors: number; views: number }[]
  pages: Row[]
  sources: Row[]
  clicks: Row[]
  devices: Row[]
  redirects: Row[]
  notFound: Row[]
  /** false until the first visit has been counted */
  hasData: boolean
}

const KEEP_DAYS = 400

/** Everything the Statistics screen shows, for the last `days` days. */
export const getReport = async (payload: Payload, days: number): Promise<Report> => {
  const now = new Date()
  const range = lastDays(days, now)
  const before = lastDays(days * 2, now).slice(0, days)
  const [from, to] = [range[0], range[range.length - 1]]

  // housekeeping, done here because this screen is opened now and then: old rows go
  await db(payload).execute(
    sql`DELETE FROM analytics_daily WHERE day < ${dayOf(new Date(now.getTime() - KEEP_DAYS * 864e5))}`,
  )
  await db(payload).execute(
    sql`DELETE FROM analytics_visitors WHERE day < ${dayOf(new Date(now.getTime() - 2 * 864e5))}`,
  )

  const { rows } = await db(payload).execute(sql`
    SELECT day, kind, key, count FROM analytics_daily WHERE day >= ${before[0]} AND day <= ${to}`)
  const data = rows.map((r) => ({
    day: String(r.day),
    kind: String(r.kind),
    key: String(r.key),
    count: Number(r.count),
  }))

  const inRange = data.filter((r) => r.day >= from)
  const sum = (list: typeof data, kind: string, key?: string) =>
    list
      .filter((r) => r.kind === kind && (key === undefined || r.key === key))
      .reduce((n, r) => n + r.count, 0)
  const top = (kind: string, limit: number, label: (key: string) => string = (k) => k): Row[] => {
    const totals = new Map<string, number>()
    for (const r of inRange)
      if (r.kind === kind) totals.set(r.key, (totals.get(r.key) ?? 0) + r.count)
    return [...totals]
      .map(([key, count]) => ({ label: label(key), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // quote requests come from the real records, so they are right even for the days before tracking
  const leadsBetween = async (daysAgoFrom: number, daysAgoTo: number) =>
    (
      await payload.count({
        collection: 'form-submissions',
        where: {
          and: [
            {
              createdAt: {
                greater_than: new Date(now.getTime() - daysAgoFrom * 864e5).toISOString(),
              },
            },
            {
              createdAt: {
                less_than_equal: new Date(now.getTime() - daysAgoTo * 864e5).toISOString(),
              },
            },
          ],
        },
      })
    ).totalDocs

  const earlier = data.filter((r) => r.day < from)
  return {
    days,
    from,
    to,
    totals: {
      visitors: sum(inRange, 'visitor'),
      views: sum(inRange, 'view'),
      calls: sum(inRange, 'click', 'call'),
      leads: await leadsBetween(days, 0),
    },
    previous: {
      visitors: sum(earlier, 'visitor'),
      views: sum(earlier, 'view'),
      calls: sum(earlier, 'click', 'call'),
      leads: await leadsBetween(days * 2, days),
    },
    daily: range.map((day) => ({
      day,
      visitors: sum(
        inRange.filter((r) => r.day === day),
        'visitor',
      ),
      views: sum(
        inRange.filter((r) => r.day === day),
        'view',
      ),
    })),
    pages: top('view', 10, (k) => (k === '/' ? 'Home page' : k)),
    sources: top('source', 8),
    clicks: top('click', 8, (k) => clickLabels[k] ?? k),
    devices: top('device', 3),
    redirects: top('redirect', 8),
    notFound: top('notfound', 8),
    hasData: data.length > 0,
  }
}
