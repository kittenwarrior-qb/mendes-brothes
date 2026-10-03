import { describe, expect, it } from 'vitest'

import { blockMeta } from '@/blocks/blockMeta'
import { helpTopics, matchTopic } from '@/ai/helpKnowledge'
import { answer, answerAsText, findSection, findText, siteMapAsText } from '@/ai/siteGuide'
import { buildSite, stringsIn } from '@/ai/siteIndex'

const text = (t: string) => ({
  root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: t }] }] },
})

const site = buildSite({
  pages: [
    {
      id: 1,
      title: 'Home',
      slug: 'home',
      layout: [
        {
          blockType: 'heroHome',
          heading: 'We move dirt. *We build ground.*',
          eyebrow: 'Lewes, Delaware',
        },
        { blockType: 'servicesGrid', heading: 'From raw land to *finished site*' },
        {
          blockType: 'steps',
          heading: 'Four steps, *no surprises*',
          steps: [{ title: 'Call or send the form', text: 'We answer the same day.' }],
        },
      ],
    },
    {
      id: 2,
      title: 'About Us',
      slug: 'about',
      layout: [
        { blockType: 'pageHero', heading: 'Built on *groundwork*' },
        {
          blockType: 'serviceAreas',
          heading: 'Service *area*',
          lede: "All of Sussex County and nearby parts of Kent County. Not sure you're in range? Call and ask.",
          settings: { hideOn: 'none', background: 'alt' },
        },
      ],
    },
  ],
  collections: {
    'service-areas': [
      { id: 1, name: 'Lewes', slug: 'lewes' },
      { id: 2, name: 'Rehoboth Beach', slug: 'rehoboth-beach' },
      { id: 3, name: 'Milton', slug: 'milton' },
    ],
    faqs: [
      {
        id: 5,
        question: 'Which areas do you serve?',
        answer: text('All of Sussex County and nearby parts of Kent County, Delaware.'),
      },
    ],
    testimonials: [
      {
        id: 9,
        author: 'Coastal Custom Homes',
        location: 'Rehoboth Beach, DE',
        quote: 'Great work.',
      },
    ],
    services: [{ id: 7, title: 'Excavation', shortDescription: 'Foundations, basements, pools.' }],
  },
  globals: {
    'site-settings': {
      companyName: 'Mendez Brothes General Construction',
      phone: '+1 302-563-8888',
      address: { city: 'Lewes', state: 'DE' },
    },
    footer: {},
  },
})

const pasted = `Service area
All of Sussex County and nearby parts of Kent County. Not sure you're in range? Call and ask.

Lewes
Rehoboth Beach
Milton

 data này đâu ra z, sửa đc ko`

describe('site guide: where a text comes from', () => {
  it('reads strings out of fields and rich text, skipping ids and links', () => {
    expect(
      stringsIn({
        id: 3,
        slug: 'x',
        heading: 'Hello *there*',
        url: '/contact',
        body: text('One. Two.'),
      }),
    ).toEqual(['Hello there', 'One. Two.'])
  })

  it('finds the section and the list behind text pasted from the website', () => {
    const a = answer(pasted, site)
    expect(a.kind).toBe('found')
    const titles = a.parts.map((p) => p.title)
    expect(titles[0]).toBe('Page “About Us” → section 2 (Towns we serve)')
    expect(a.parts[0].link?.href).toBe('/admin/collections/pages/2')
    expect(a.parts[0].steps.join(' ')).toContain('Towns we serve')
    // the three towns are one answer, pointing at the list
    const towns = a.parts.find((p) => p.title.startsWith('Towns we serve:'))
    for (const town of ['Lewes', 'Rehoboth Beach', 'Milton']) expect(towns?.title).toContain(town)
    expect(towns?.link?.href).toBe('/admin/collections/service-areas')
    // a town name that also sits in the address or in a review is not listed as a source
    expect(titles.join(' | ')).not.toMatch(/Settings|Reviews/)
    expect(a.parts).toHaveLength(2)
  })

  it('finds quoted text, text in settings and single items', () => {
    expect(answer('where is "Four steps, no surprises" written?', site).parts[0].title).toBe(
      'Page “Home” → section 3 (Steps (how it works))',
    )
    const phone = answer('+1 302-563-8888', site)
    expect(phone.parts[0]).toMatchObject({
      title: 'Settings → Company info & logo',
      managerOnly: true,
    })
    expect(findText('Foundations, basements, pools.', site)[0].place.href).toBe(
      '/admin/collections/services/7',
    )
  })

  it('does not mistake an ordinary question for website text', () => {
    expect(findText('how do I change the logo?', site)).toEqual([])
    expect(answer('how do I change the logo?', site)).toMatchObject({
      kind: 'topic',
      topicId: 'company',
    })
    expect(answer('qwerty zxcvb', site).kind).toBe('none')
  })
})

describe('site guide: one section', () => {
  it('knows a section by its heading or by its kind', () => {
    expect(findSection('delete the service area section', site)?.type).toBe('serviceAreas')
    expect(findSection('xóa section service area', site)?.places[0].page.title).toBe('About Us')
    expect(findSection('change four steps no surprises', site)?.type).toBe('steps')
    expect(findSection('change the banner', site)?.type).toBe('heroHome')
    expect(findSection('how do I add a service', site)).toBeNull()
  })

  it('explains removing, hiding, moving and editing with the exact page and row', () => {
    const del = answer('how do I delete the service area section?', site)
    expect(del.kind).toBe('section')
    expect(del.parts[0].title).toBe('Page “About Us” → section 2')
    expect(del.parts[0].steps.join(' ')).toMatch(/row 2 “Towns we serve — Service area”.*Remove/)
    expect(del.parts.at(-1)?.link?.href).toBe('/admin/collections/service-areas')

    expect(answer('ẩn section banner', site).parts[0].steps.join(' ')).toContain(
      'Hidden everywhere',
    )
    expect(answer('move the steps section up', site).parts[0].steps.join(' ')).toContain(
      'Drag the row',
    )
    expect(answer('sửa section dịch vụ', site).parts[0].steps.join(' ')).toContain(
      'change them under Services',
    )
  })

  it('explains adding a section that no page has yet', () => {
    const a = answer('add a reviews section', site)
    expect(a.text).toContain('No page has a “Reviews” section yet')
    expect(a.parts[0].steps.join(' ')).toContain('Add section')
  })

  it('has words for every kind of section', () => {
    for (const type of Object.keys(blockMeta))
      expect(findSection(`remove the ${blockMeta[type].label} section`, site)?.type, type).toBe(
        type,
      )
  })
})

describe('site guide: topics and the AI', () => {
  it('routes list questions to their topic, in English and Vietnamese', () => {
    const cases: [string, string][] = [
      ['how do I add a town', 'towns'],
      ['xóa thị trấn', 'towns'],
      ['sửa câu hỏi thường gặp faq', 'faqs'],
      ['add a customer review', 'reviews'],
      ['thêm dịch vụ mới', 'services'],
      ['change the equipment list', 'equipment'],
      ['who receives the contact form email', 'form'],
      ['delete a project', 'project'],
      ['how do I delete something', 'delete'],
      ['change the google description', 'seo'],
    ]
    for (const [q, id] of cases) expect(matchTopic(q)?.id, q).toBe(id)
    expect(new Set(helpTopics.map((t) => t.id)).size).toBe(helpTopics.length)
  })

  it('gives the AI the site map and what was looked up', () => {
    const map = siteMapAsText(site)
    expect(map).toContain('Page “About Us” (/admin/collections/pages/2):')
    expect(map).toContain(
      '2. Towns we serve — “Service area” [lists the town names from Towns we serve]',
    )
    expect(map).toContain('Towns we serve 3 (/admin/collections/service-areas)')
    expect(answerAsText(answer(pasted, site))).toContain('Screen: /admin/collections/pages/2')
  })
})
