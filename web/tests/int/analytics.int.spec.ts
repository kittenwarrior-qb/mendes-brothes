import { describe, expect, it } from 'vitest'

import { cleanPath, dayOf, deviceOf, isBot, lastDays, sourceOf } from '@/analytics/rules'

const CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'

describe('what is counted', () => {
  it('counts people, not robots', () => {
    expect(isBot(CHROME)).toBe(false)
    expect(isBot(IPHONE)).toBe(false)
    for (const ua of [
      '',
      null,
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/140.0.0.0',
      'curl/8.4.0',
      'facebookexternalhit/1.1',
      'Mozilla/5.0 Chrome-Lighthouse',
    ])
      expect(isBot(ua)).toBe(true)
  })

  it('names the device', () => {
    expect(deviceOf(CHROME)).toBe('Computer')
    expect(deviceOf(IPHONE)).toBe('Phone')
    expect(deviceOf('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)')).toBe('Tablet')
    expect(deviceOf('Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari')).toBe('Phone')
    expect(deviceOf('Mozilla/5.0 (Linux; Android 14; SM-X710) Safari')).toBe('Tablet')
  })

  it('keeps only public page paths', () => {
    expect(cleanPath('/projects/?service=grading#top')).toBe('/projects')
    expect(cleanPath('/')).toBe('/')
    expect(cleanPath('/services/excavation/')).toBe('/services/excavation')
    for (const bad of [
      '/admin',
      '/admin/collections/pages',
      '/api/track',
      '//evil.example',
      'projects',
      '/a b<script>',
      5,
      null,
    ])
      expect(cleanPath(bad)).toBeNull()
  })

  it('names where a visit came from', () => {
    expect(sourceOf('https://www.google.com/search?q=land+clearing')).toBe('Google')
    expect(sourceOf('https://google.co.uk/')).toBe('Google')
    expect(sourceOf('https://m.facebook.com/')).toBe('Facebook')
    expect(sourceOf('https://l.instagram.com/')).toBe('Instagram')
    expect(sourceOf('https://www.houzz.com/pro/x')).toBe('houzz.com')
    expect(sourceOf('')).toMatch(/^Direct/)
    expect(sourceOf('not a url')).toMatch(/^Direct/)
    // a click inside the site is not a source
    expect(sourceOf('https://www.mendez.test/about', 'mendez.test')).toMatch(/^Direct/)
  })

  it('uses the business day, not the server day', () => {
    // 02:30 UTC on Oct 2 is still Oct 1 in Delaware
    const lateEvening = new Date('2026-10-02T02:30:00Z')
    expect(dayOf(lateEvening, 'America/New_York')).toBe('2026-10-01')
    expect(dayOf(lateEvening, 'UTC')).toBe('2026-10-02')
    expect(lastDays(3, lateEvening, 'America/New_York')).toEqual([
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
    ])
  })
})
