/*
 * What counts and how it is named. Pure functions, shared by the tracking endpoint
 * and the tests.
 */

export const TIME_ZONE = process.env.ANALYTICS_TZ || 'America/New_York'

/** "2026-10-02" in the business's time zone, so a day on the chart is a local day. */
export const dayOf = (date: Date, timeZone = TIME_ZONE) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

/** The last `n` days, oldest first, ending today. */
export const lastDays = (n: number, now = new Date(), timeZone = TIME_ZONE) =>
  Array.from({ length: n }, (_, i) =>
    dayOf(new Date(now.getTime() - (n - 1 - i) * 864e5), timeZone),
  )

const BOT =
  /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime|monitor|preview|facebookexternalhit|whatsapp|curl|wget|python|axios|node-fetch|go-http|java\/|scrapy|phantom/i

export const isBot = (userAgent: string | null | undefined) => !userAgent || BOT.test(userAgent)

export const deviceOf = (userAgent: string) =>
  /ipad|tablet|kindle|silk|playbook/i.test(userAgent) ||
  (/android/i.test(userAgent) && !/mobile/i.test(userAgent))
    ? 'Tablet'
    : /mobi|iphone|ipod|android/i.test(userAgent)
      ? 'Phone'
      : 'Computer'

/** A public page path, without query string or trailing slash; null for anything not worth counting. */
export const cleanPath = (input: unknown): string | null => {
  if (typeof input !== 'string' || !input.startsWith('/') || input.startsWith('//')) return null
  let path = input.split(/[?#]/)[0].slice(0, 200)
  if (path.length > 1) path = path.replace(/\/+$/, '')
  if (/^\/(admin|api|next|_next)(\/|$)/.test(path)) return null
  if (!/^[\w\-./%~]*$/.test(path.slice(1))) return null
  return path || '/'
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)yahoo\./, 'Yahoo'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'Facebook'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'YouTube'],
  [/(^|\.)(t\.co|twitter\.com|x\.com)$/, 'X (Twitter)'],
  [/(^|\.)nextdoor\.com$/, 'Nextdoor'],
  [/(^|\.)yelp\.com$/, 'Yelp'],
  [/(^|\.)linkedin\.com$/, 'LinkedIn'],
]

/** Where a visit came from: a known name, the other website's host, or "Direct". */
export const sourceOf = (referrer: unknown, ownHost?: string): string => {
  if (typeof referrer !== 'string' || !referrer) return 'Direct (typed, bookmark or app)'
  let host: string
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return 'Direct (typed, bookmark or app)'
  }
  if (!host || host === ownHost?.toLowerCase().replace(/^www\./, ''))
    return 'Direct (typed, bookmark or app)'
  return SOURCES.find(([pattern]) => pattern.test(host))?.[1] ?? host.slice(0, 80)
}

/** The clicks worth counting on a contractor's website, with the label shown in the admin. */
export const clickLabels: Record<string, string> = {
  call: 'Phone number clicked',
  email: 'Email address clicked',
  estimate: '“Free estimate” button clicked',
  map: 'Map / directions opened',
  social: 'Social media link clicked',
  outbound: 'Link to another website clicked',
}
