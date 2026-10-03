/*
 * Answers that need to know THIS website, without any AI: where a piece of text on the
 * site comes from, and how to edit, remove, hide, move or add a given section.
 * Pure functions over a snapshot of the site (built in siteIndex.ts) — used by the chat's
 * built-in answers, as background for the AI, and by the unit tests.
 */
import { blockMeta } from '../blocks/blockMeta'
import type { HelpImageId } from './helpImages'
import { matchTopic, normalise } from './helpKnowledge'

export type Place = {
  /** unique per place: "pages/2#4", "service-areas/3", "global/footer" */
  key: string
  kind: 'section' | 'doc' | 'global'
  /** admin screen to open */
  href: string
  /** "About Us", "Lewes", "Company info & logo" */
  title: string
  managerOnly?: boolean
  // sections
  row?: number
  sectionType?: string
  heading?: string
  // documents
  collection?: string
}

export type Entry = { place: Place; text: string }

export type PageInfo = {
  id: number | string
  title: string
  slug: string
  sections: { row: number; type: string; heading: string; hidden: boolean }[]
}

export type Site = {
  pages: PageInfo[]
  entries: Entry[]
  counts: Record<string, number>
}

export type GuidePart = {
  title: string
  steps: string[]
  link?: { label: string; href: string }
  managerOnly?: boolean
}

export type GuideAnswer = {
  kind: 'found' | 'section' | 'topic' | 'none'
  text: string
  parts: GuidePart[]
  topicId?: string
  images?: HelpImageId[]
}

/** Admin names of the lists and settings screens. */
export const collectionLabels: Record<string, string> = {
  pages: 'Pages',
  projects: 'Projects',
  posts: 'News',
  services: 'Services',
  equipment: 'Equipment',
  'service-areas': 'Towns we serve',
  testimonials: 'Reviews',
  faqs: 'FAQs',
  categories: 'News categories',
  forms: 'Forms',
}
export const globalLabels: Record<string, string> = {
  'site-settings': 'Company info & logo',
  header: 'Website menu',
  footer: 'Footer',
  'listing-pages': 'List page headings & filters',
}

/** Sections that show a list kept somewhere else: edit the list there, not in the section. */
export const sectionSource: Record<string, { from: string; href: string; what: string }> = {
  servicesGrid: {
    from: 'Services',
    href: '/admin/collections/services',
    what: 'the service names and short descriptions',
  },
  featuredProjects: {
    from: 'Projects',
    href: '/admin/collections/projects',
    what: 'the projects, their photos and facts',
  },
  equipmentGrid: {
    from: 'Equipment',
    href: '/admin/collections/equipment',
    what: 'the machines',
  },
  serviceAreas: {
    from: 'Towns we serve',
    href: '/admin/collections/service-areas',
    what: 'the town names',
  },
  testimonials: {
    from: 'Reviews',
    href: '/admin/collections/testimonials',
    what: 'the customer reviews',
  },
  faq: { from: 'FAQs', href: '/admin/collections/faqs', what: 'the questions and answers' },
  archive: { from: 'News', href: '/admin/collections/posts', what: 'the news posts' },
  contactSection: {
    from: 'Company info & logo',
    href: '/admin/globals/site-settings',
    what: 'the phone number, address and hours',
  },
  ctaBand: {
    from: 'Company info & logo',
    href: '/admin/globals/site-settings',
    what: 'the phone number',
  },
}

// Words people use for each kind of section (any language the staff may type in).
const sectionWords: Record<string, string[]> = {
  heroHome: ['banner', 'hero', 'big photo', 'cover photo', 'anh bia', 'anh nen', 'portada'],
  pageHero: ['page title', 'title header', 'tieu de trang'],
  servicesGrid: ['services', 'dich vu', 'servicios'],
  featuredProjects: ['projects', 'recent work', 'cong trinh', 'du an', 'proyectos'],
  equipmentGrid: ['equipment', 'machines', 'may moc', 'thiet bi'],
  serviceAreas: [
    'service area',
    'service areas',
    'towns',
    'areas',
    'khu vuc',
    'thi tran',
    'vung phuc vu',
    'dia ban',
  ],
  split: ['text photo', 'text and photo', 'chu va anh'],
  cards: ['cards', 'feature cards'],
  steps: ['steps', 'how it works', 'process', 'quy trinh', 'cac buoc'],
  stats: ['numbers', 'big numbers', 'stats', 'figures', 'con so', 'so lieu'],
  checklist: ['checklist', 'danh sach tick'],
  gallery: ['gallery', 'photo gallery', 'thu vien anh', 'bo anh'],
  marquee: ['scrolling text', 'marquee', 'moving text', 'chu chay'],
  testimonials: ['reviews', 'testimonials', 'danh gia', 'nhan xet', 'resenas'],
  faq: ['faq', 'faqs', 'questions', 'cau hoi'],
  contactSection: ['contact form', 'contact', 'form lien he', 'lien he'],
  ctaBand: ['call to action', 'cta', 'call banner'],
  content: ['rich text', 'text columns'],
  mediaBlock: ['single image', 'video'],
  formBlock: ['form'],
  archive: ['news list', 'danh sach tin'],
}

const SECTION_WORD =
  /\b(section|sections|block|blocks|band|strip|row|khoi|phan|muc|khung|seccion|bloque)\b/

type Intent = 'delete' | 'hide' | 'move' | 'add' | 'edit'
const intentOf = (text: string): Intent => {
  if (/\b(delete|remove|erase|get rid|xoa|go bo|bo di|loai bo|eliminar|quitar|borrar)\b/.test(text))
    return 'delete'
  if (/\b(hide|hidden|unhide|an di|tam an|an (section|khoi|phan|muc)|ocultar)\b/.test(text))
    return 'hide'
  if (/\b(move|reorder|order|swap|di chuyen|doi cho|doi vi tri|sap xep|keo|mover)\b/.test(text))
    return 'move'
  if (/\b(add|insert|new|create|them|tao|chen|anadir|agregar|crear)\b/.test(text)) return 'add'
  return 'edit'
}

// ── where does this text come from ──

/** The pieces of a message worth looking up: quoted bits and whole lines. */
export const fragmentsOf = (message: string): string[] => {
  const out = new Set<string>()
  for (const m of message.matchAll(/["“”«»]([^"“”«»\n]{3,200})["“”«»]/g)) out.add(m[1].trim())
  for (const line of message.split(/\r?\n/)) {
    const t = line.replace(/^[\s>*•·–—-]+/, '').trim()
    if (t.length >= 3) out.add(t)
  }
  return [...out].slice(0, 40)
}

export type Hit = { place: Place; matched: string[]; score: number }

/** Places on the site holding the given text. Whole-line matches, or long partial ones. */
export const findText = (message: string, site: Site): Hit[] => {
  const hits = new Map<string, Hit>()
  for (const fragment of fragmentsOf(message)) {
    const f = normalise(fragment)
    if (f.length < 3) continue
    for (const entry of site.entries) {
      const e = normalise(entry.text)
      const same = e === f
      // a long piece of a sentence counts either way round; short words must match whole
      const partial =
        !same &&
        ((f.length >= 14 && f.includes(' ') && e.includes(f)) ||
          (e.length >= 14 && e.includes(' ') && f.includes(e)))
      if (!same && !partial) continue
      const hit = hits.get(entry.place.key) ?? { place: entry.place, matched: [], score: 0 }
      if (!hit.matched.includes(entry.text)) {
        hit.matched.push(entry.text)
        hit.score += Math.min(e.length, f.length) + (same ? 6 : 0)
      }
      hits.set(entry.place.key, hit)
    }
  }
  // Items of one list count together (twelve towns are one find). Then drop the stray
  // matches: a town name that also appears in the address or in a review is not the answer.
  const bucketOf = (h: Hit) => (h.place.kind === 'doc' ? `list:${h.place.collection}` : h.place.key)
  const buckets = new Map<string, number>()
  for (const h of hits.values()) buckets.set(bucketOf(h), (buckets.get(bucketOf(h)) ?? 0) + h.score)
  const top = Math.max(0, ...buckets.values())
  return [...hits.values()]
    .filter((h) => buckets.get(bucketOf(h))! >= top * 0.2)
    .sort((a, b) => buckets.get(bucketOf(b))! - buckets.get(bucketOf(a))! || b.score - a.score)
}

const quote = (s: string) => (s.length > 70 ? `${s.slice(0, 67)}…` : s)
const sectionName = (type: string) => blockMeta[type]?.label ?? type
const rowLabel = (p: Place) =>
  `row ${p.row} “${sectionName(p.sectionType ?? '')}${p.heading ? ` — ${p.heading}` : ''}”`

const REMOVE_HINT =
  'To take the whole section away instead: press ⋯ at the right end of its row → Remove, then Publish changes.'

const partForHit = (hit: Hit): GuidePart => {
  const p = hit.place
  const what = hit.matched
    .slice(0, 2)
    .map((m) => `“${quote(m)}”`)
    .join(' and ')
  if (p.kind === 'section') {
    const source = sectionSource[p.sectionType ?? '']
    return {
      title: `Page “${p.title}” → section ${p.row} (${sectionName(p.sectionType ?? '')})`,
      steps: [
        `Open the page and click ${rowLabel(p)} to open it.`,
        `Change ${what} in the box where it is typed.`,
        'Press “Publish changes” (top right). The website updates straight away.',
        ...(source
          ? [`This section also lists ${source.what}: those are edited under ${source.from}.`]
          : []),
        REMOVE_HINT,
      ],
      link: { label: `Open ${p.title}`, href: p.href },
    }
  }
  if (p.kind === 'global')
    return {
      title: `Settings → ${p.title}`,
      managerOnly: true,
      steps: [
        `Open ${p.title}.`,
        `Change ${what} and press Save. It changes everywhere on the website.`,
      ],
      link: { label: `Open ${p.title}`, href: p.href },
    }
  const list = collectionLabels[p.collection ?? ''] ?? p.collection
  return {
    title: `${list} → “${quote(p.title)}”`,
    steps: [
      `Open it and change ${what}.`,
      'Press “Publish changes” (or Save). Every page that shows it updates by itself.',
      `To remove it completely: open ${list}, tick it in the list and choose Delete.`,
    ],
    link: { label: `Open “${quote(p.title)}”`, href: p.href },
  }
}

/** Several items of one list (twelve towns…) become one part. */
const groupHits = (hits: Hit[]): GuidePart[] => {
  const parts: GuidePart[] = []
  const byList = new Map<string, Hit[]>()
  for (const hit of hits) {
    if (hit.place.kind === 'doc' && hit.place.collection) {
      const list = byList.get(hit.place.collection) ?? []
      list.push(hit)
      byList.set(hit.place.collection, list)
    }
  }
  const done = new Set<string>()
  for (const hit of hits) {
    const c = hit.place.kind === 'doc' ? hit.place.collection : undefined
    const group = c ? byList.get(c)! : []
    if (c && group.length > 1) {
      if (done.has(c)) continue
      done.add(c)
      const label = collectionLabels[c] ?? c
      const names = group.map((h) => h.place.title)
      parts.push({
        title: `${label}: ${names.slice(0, 6).join(', ')}${names.length > 6 ? ` and ${names.length - 6} more` : ''}`,
        steps: [
          `Open ${label}. Each of these is one item in that list.`,
          'Click an item to change it. “Create New” adds one. To remove one, tick it and choose Delete.',
          'Every section and filter that shows this list updates by itself.',
        ],
        link: { label: `Open ${label}`, href: `/admin/collections/${c}` },
      })
    } else parts.push(partForHit(hit))
    if (parts.length >= 4) break
  }
  return parts
}

// ── a given section: edit, remove, hide, move, add ──

type Target = { type: string; places: { page: PageInfo; row: number; heading: string }[] }

/** The section a question is about: named by its heading on the site, or by its kind. */
export const findSection = (question: string, site: Site): Target | null => {
  const text = ` ${normalise(question)} `
  // 1. the heading of a real section ("four steps no surprises")
  let best: { type: string; len: number } | null = null
  for (const page of site.pages)
    for (const s of page.sections) {
      const h = normalise(s.heading)
      if (h.length >= 6 && text.includes(` ${h} `) && (!best || h.length > best.len))
        best = { type: s.type, len: h.length }
    }
  // 2. the kind of section, when the question talks about sections
  if (!best && (SECTION_WORD.test(text) || / banner | hero /.test(text))) {
    for (const [type, words] of Object.entries(sectionWords)) {
      const names = [...words, normalise(blockMeta[type]?.label ?? '')].filter(Boolean)
      for (const w of names)
        if (text.includes(` ${w} `) && (!best || w.length > best.len))
          best = { type, len: w.length }
    }
  }
  if (!best) return null
  const places = site.pages.flatMap((page) =>
    page.sections
      .filter((s) => s.type === best!.type)
      .map((s) => ({ page, row: s.row, heading: s.heading })),
  )
  return { type: best.type, places }
}

const answerSection = (question: string, target: Target): GuideAnswer => {
  const intent = intentOf(` ${normalise(question)} `)
  const name = sectionName(target.type)
  const meta = blockMeta[target.type]
  const source = sectionSource[target.type]

  if (intent === 'add' || !target.places.length) {
    return {
      kind: 'section',
      text: target.places.length
        ? `Adding a “${name}” section:`
        : `No page has a “${name}” section yet. To add one:`,
      parts: [
        {
          title: `Add “${name}”`,
          steps: [
            'Open Pages and click the page it should go on.',
            `Scroll to the end of the list of sections and press “Add section”. Pick “${name}”${meta ? ` (group “${meta.group.replace(/^\d+ · /, '')}”)` : ''}.`,
            'Fill in the heading and text, then drag the row by its handle to where it belongs.',
            ...(source ? [`It shows ${source.what} from ${source.from} by itself.`] : []),
            'Press “Publish changes”.',
          ],
          link: { label: 'Open Pages', href: '/admin/collections/pages' },
        },
      ],
      images: ['adm-page-add-section', 'adm-page-sections'],
    }
  }

  const act: Record<Exclude<Intent, 'add'>, { lead: string; steps: (row: string) => string[] }> = {
    delete: {
      lead: `Removing the “${name}” section:`,
      steps: (row) => [
        `Open the page and find ${row}.`,
        'Press ⋯ at the right end of that row and choose “Remove”.',
        'Press “Publish changes”. The section is gone from the website.',
        'Changed your mind? Open “Versions” at the top of the page and restore the earlier one.',
        ...(source
          ? [`Only the section is removed. ${source.from} keeps its items for other pages.`]
          : []),
      ],
    },
    hide: {
      lead: `Hiding the “${name}” section without deleting it:`,
      steps: (row) => [
        `Open the page and click ${row} to open it.`,
        'Open “Look of this section” at the bottom and set “Hide on” to “Hidden everywhere” (or only mobile / desktop).',
        'Press “Publish changes”. Set it back to “Always visible” to show it again.',
      ],
    },
    move: {
      lead: `Moving the “${name}” section:`,
      steps: (row) => [
        `Open the page and find ${row}.`,
        'Drag the row by the handle on its left, up or down, and drop it where it belongs.',
        'Press “Publish changes”.',
      ],
    },
    edit: {
      lead: `Changing the “${name}” section:`,
      steps: (row) => [
        `Open the page and click ${row} to open it.`,
        'Change the heading, text or photo in its boxes.',
        ...(source
          ? [`It lists ${source.what}. Those are not typed here: change them under ${source.from}.`]
          : []),
        'Press “Publish changes”. Use the eye icon first if you want to preview.',
      ],
    },
  }
  const a = act[intent]
  const parts: GuidePart[] = target.places.slice(0, 4).map(({ page, row, heading }) => ({
    title: `Page “${page.title}” → section ${row}`,
    steps: a.steps(`row ${row} “${name}${heading ? ` — ${heading}` : ''}”`),
    link: { label: `Open ${page.title}`, href: `/admin/collections/pages/${page.id}` },
  }))
  // same steps on every page: say them once, then just list the other pages
  for (const p of parts.slice(1)) p.steps = ['Same steps as above, on this page.']
  if (source && (intent === 'edit' || intent === 'delete'))
    parts.push({
      title: `${source.from}: ${source.what}`,
      steps: [
        `Open ${source.from} to add, change or delete ${source.what}.`,
        'Every section that shows them updates by itself.',
      ],
      link: { label: `Open ${source.from}`, href: source.href },
      managerOnly: source.href.includes('/globals/'),
    })
  return {
    kind: 'section',
    text: a.lead,
    parts,
    images: ['adm-page-sections', 'adm-page-section-open'],
  }
}

/**
 * The built-in answer to a question. Looks, in order, for text copied from the website,
 * for a section being asked about, and for a how-to topic.
 */
export const answer = (question: string, site: Site): GuideAnswer => {
  const hits = findText(question, site)
  const strong = hits.filter((h) => h.score >= 14)
  const total = hits.reduce((n, h) => n + h.score, 0)
  if (strong.length || (hits.length >= 2 && total >= 12)) {
    const parts = groupHits(hits)
    return {
      kind: 'found',
      text:
        parts.length > 1
          ? 'That text comes from these places. Each one is changed where it lives:'
          : 'That text comes from here:',
      parts,
      images: parts.some((p) => p.title.startsWith('Page ')) ? ['adm-page-sections'] : [],
    }
  }
  const target = findSection(question, site)
  if (target) return answerSection(question, target)
  const topic = matchTopic(question)
  if (topic) return { kind: 'topic', text: `${topic.q}:`, parts: [], topicId: topic.id }
  if (hits.length)
    return { kind: 'found', text: 'That text comes from here:', parts: groupHits(hits) }
  return { kind: 'none', text: '', parts: [] }
}

/** For the AI: every page with its sections in order, and how many items each list has. */
export const siteMapAsText = (site: Site) =>
  [
    ...site.pages.map(
      (p) =>
        `Page “${p.title}” (/admin/collections/pages/${p.id}):\n${p.sections
          .map(
            (s) =>
              `  ${s.row}. ${sectionName(s.type)}${s.heading ? ` — “${s.heading}”` : ''}${s.hidden ? ' (hidden)' : ''}${sectionSource[s.type] ? ` [lists ${sectionSource[s.type].what} from ${sectionSource[s.type].from}]` : ''}`,
          )
          .join('\n')}`,
    ),
    `Lists: ${Object.entries(site.counts)
      .map(([c, n]) => `${collectionLabels[c] ?? c} ${n} (/admin/collections/${c})`)
      .join(', ')}`,
  ].join('\n')

/** For the AI: what the built-in guide found for the question, as plain text. */
export const answerAsText = (a: GuideAnswer) =>
  a.parts
    .map(
      (p) =>
        `${p.title}${p.managerOnly ? ' (managers only)' : ''}\n${p.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}${p.link ? `\n  Screen: ${p.link.href}` : ''}`,
    )
    .join('\n')
