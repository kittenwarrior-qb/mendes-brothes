import type { Endpoint, Payload } from 'payload'

import { sql } from '@payloadcms/db-postgres'
import crypto from 'crypto'

import { cleanPath, clickLabels, dayOf, deviceOf, isBot, sourceOf } from './rules'

type Db = {
  execute: (query: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }>
}
const db = (payload: Payload) => (payload.db as unknown as { drizzle: Db }).drizzle

/** Adds to today's count of `kind` / `key` (one row per day, created on first use). */
export const bump = async (
  payload: Payload,
  kind: string,
  key: string,
  day = dayOf(new Date()),
) => {
  await db(payload).execute(sql`
    INSERT INTO analytics_daily (day, kind, key, count) VALUES (${day}, ${kind}, ${key.slice(0, 200)}, 1)
    ON CONFLICT (day, kind, key) DO UPDATE SET count = analytics_daily.count + 1`)
}

/** Counting must never break or slow a page: errors are logged and swallowed. */
export const bumpQuietly = (payload: Payload, kind: string, key: string) =>
  bump(payload, kind, key).catch((err) =>
    payload.logger.warn({ err, msg: 'statistics: could not count' }),
  )

/** True the first time this visitor is seen today. */
const firstVisitToday = async (payload: Payload, day: string, ip: string, userAgent: string) => {
  const hash = crypto
    .createHash('sha256')
    .update(`${day}|${ip}|${userAgent}|${process.env.PAYLOAD_SECRET ?? ''}`)
    .digest('hex')
    .slice(0, 32)
  const res = await db(payload).execute(sql`
    INSERT INTO analytics_visitors (day, hash) VALUES (${day}, ${hash})
    ON CONFLICT (day, hash) DO NOTHING RETURNING id`)
  return res.rows.length > 0
}

// one browser cannot inflate the numbers: at most 60 events a minute per address
const recent = new Map<string, number[]>()
const tooMany = (ip: string) => {
  const now = Date.now()
  const times = (recent.get(ip) ?? []).filter((t) => now - t < 60_000)
  times.push(now)
  recent.set(ip, times)
  if (recent.size > 5000) recent.clear()
  return times.length > 60
}

const done = () => new Response(null, { status: 204 })

/**
 * POST /api/track — called by the small script on the public site (components/site/Track.tsx).
 * Body: { t: 'view' | 'click' | '404', p: path, n?: click name, r?: referrer, first?: boolean }
 * No cookies, nothing personal stored: only daily totals.
 */
export const trackEndpoint: Endpoint = {
  path: '/track',
  method: 'post',
  handler: async (req) => {
    const userAgent = req.headers.get('user-agent') ?? ''
    // staff looking at their own site, and robots, are not visitors
    if (req.user || isBot(userAgent)) return done()
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    if (tooMany(ip)) return done()

    let body: Record<string, unknown>
    try {
      body = ((await req.json?.()) ?? {}) as Record<string, unknown>
    } catch {
      return done()
    }
    const path = cleanPath(body.p)
    if (!path) return done()
    const { payload } = req
    const day = dayOf(new Date())

    try {
      if (body.t === 'view') {
        await bump(payload, 'view', path, day)
        if (await firstVisitToday(payload, day, ip, userAgent)) {
          await bump(payload, 'visitor', 'all', day)
          await bump(payload, 'device', deviceOf(userAgent), day)
        }
        // how they arrived: counted once per visit, on the first page they open
        if (body.first)
          await bump(payload, 'source', sourceOf(body.r, req.headers.get('host') ?? undefined), day)
      } else if (body.t === 'click' && typeof body.n === 'string' && body.n in clickLabels) {
        await bump(payload, 'click', body.n, day)
      } else if (body.t === '404') {
        await bump(payload, 'notfound', path, day)
      }
    } catch (err) {
      payload.logger.warn({ err, msg: 'statistics: could not count' })
    }
    return done()
  },
}
