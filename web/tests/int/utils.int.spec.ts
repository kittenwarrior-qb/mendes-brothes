import { describe, expect, it } from 'vitest'

import { docPath } from '@/utilities/docPath'
import { parseProjectParams, sizeBuckets, toQueryString } from '@/utilities/projectsQuery'
import { formatAcres, formatMonthYear, telHref } from '@/utilities/site'

describe('docPath', () => {
  it('maps collections to public URLs', () => {
    expect(docPath('pages', 'home')).toBe('/')
    expect(docPath('pages', 'about')).toBe('/about')
    expect(docPath('projects', 'barn-pad')).toBe('/projects/barn-pad')
    expect(docPath('services', 'grading')).toBe('/services/grading')
    expect(docPath('service-areas', 'lewes')).toBe('/areas/lewes')
    expect(docPath('posts', 'news')).toBe('/posts/news')
  })
})

describe('project filter params', () => {
  it('keeps known values and drops junk', () => {
    const p = parseProjectParams({
      q: '  pool  ',
      service: 'excavation',
      year: '20x5',
      sort: 'drop table',
      page: '2',
      size: ['1', '2'],
    })
    expect(p).toMatchObject({ q: 'pool', service: 'excavation', page: '2', size: '1' })
    expect(p.year).toBeUndefined()
    expect(p.sort).toBeUndefined()
  })

  it('bounds long input', () => {
    expect(parseProjectParams({ q: 'x'.repeat(500) }).q).toHaveLength(100)
  })

  it('builds query strings', () => {
    expect(toQueryString({ service: 'grading' }, { page: '3' })).toBe('?service=grading&page=3')
    expect(toQueryString({})).toBe('')
  })

  it('reads size buckets from settings', () => {
    const b = sizeBuckets({
      sizeBuckets: [
        { label: 'Small', min: 0, max: 1 },
        { label: 'Big', min: 1 },
      ],
    })
    expect(b).toEqual([
      { key: '0', label: 'Small', min: 0, max: 1 },
      { key: '1', label: 'Big', min: 1, max: null },
    ])
  })
})

describe('formatting', () => {
  it('formats lot sizes', () => {
    expect(formatAcres(3.2)).toBe('3.2 acres')
    expect(formatAcres(0.05)).toBe('2,178 sq ft')
    expect(formatAcres(12)).toBe('12 acres')
  })

  it('keeps month-only dates in the right month in any timezone', () => {
    expect(formatMonthYear('2025-09-01T00:00:00.000Z')).toBe('Sep 2025')
    expect(formatMonthYear('2025-08-31T17:00:00.000Z')).toBe('Sep 2025') // Sep 1 in UTC+7
  })

  it('builds tel links', () => {
    expect(telHref('+1 302-563-8888')).toBe('tel:+13025638888')
  })
})
