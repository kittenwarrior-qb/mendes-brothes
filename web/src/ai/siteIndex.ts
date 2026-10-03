/*
 * A snapshot of what is on the website right now — every page with its sections, and every
 * piece of visitor-facing text with the admin screen it is edited on. Feeds siteGuide.ts.
 * Rebuilt at most once a minute.
 */
import type { CollectionSlug, GlobalSlug, Payload } from 'payload'

import { blockTitleOf } from '../blocks/blockMeta'
import { type Entry, globalLabels, type PageInfo, type Place, type Site } from './siteGuide'

type Json = Record<string, unknown>

// Not text a visitor reads: ids, links, layout choices, dates.
const SKIP = new Set([
  'id',
  'slug',
  'blockType',
  'blockName',
  'settings',
  'meta',
  'url',
  'href',
  'link',
  'icon',
  'variant',
  'layout',
  'source',
  'imagePosition',
  'appearance',
  'lotUnit',
  'clientType',
  'linkTo',
  'platform',
  'type',
  'relationTo',
  'format',
  'mode',
  'direction',
  'style',
  'businessType',
  'generateSlug',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'completedAt',
  '_status',
  'mapUrl',
  'gaId',
  'plausibleDomain',
  'anchor',
])

/** Every readable string inside a value; rich text gives one string per paragraph. */
export const stringsIn = (value: unknown, key = ''): string[] => {
  if (typeof value === 'string') {
    const t = value.replace(/\*/g, '').trim()
    return t.length > 1 && !/^(https?:|\/|#[0-9a-f]{3,8}$|\d{4}-\d\d-\d\dT)/i.test(t) ? [t] : []
  }
  if (Array.isArray(value)) return value.flatMap((v) => stringsIn(v, key))
  if (value && typeof value === 'object') {
    const obj = value as Json
    // rich text: the words of each paragraph, joined
    if (obj.root && typeof obj.root === 'object') {
      const out: string[] = []
      const para = (node: Json): string =>
        typeof node.text === 'string'
          ? node.text
          : Array.isArray(node.children)
            ? (node.children as Json[]).map(para).join('')
            : ''
      const walk = (node: Json) => {
        const kids = Array.isArray(node.children) ? (node.children as Json[]) : []
        if (kids.some((k) => typeof k.text === 'string' || k.type === 'link')) {
          const t = para(node).trim()
          if (t.length > 1) out.push(t)
        } else kids.forEach(walk)
      }
      walk(obj.root as Json)
      return out
    }
    return Object.entries(obj).flatMap(([k, v]) => (SKIP.has(k) ? [] : stringsIn(v, k)))
  }
  return []
}

const titleField: Record<string, string> = {
  projects: 'title',
  posts: 'title',
  services: 'title',
  equipment: 'name',
  'service-areas': 'name',
  testimonials: 'author',
  faqs: 'question',
  categories: 'title',
  forms: 'title',
}

export const buildSite = (data: {
  pages: Json[]
  collections: Record<string, Json[]>
  globals: Record<string, Json>
}): Site => {
  const entries: Entry[] = []
  const add = (place: Place, value: unknown) => {
    for (const text of new Set(stringsIn(value))) entries.push({ place, text })
  }

  const pages: PageInfo[] = data.pages.map((page) => {
    const layout = (Array.isArray(page.layout) ? page.layout : []) as Json[]
    const title = String(page.title ?? page.slug ?? 'Page')
    const href = `/admin/collections/pages/${page.id}`
    const sections = layout.map((block, i) => {
      const type = String(block.blockType ?? '')
      const heading = blockTitleOf(block)
      add(
        {
          key: `pages/${page.id}#${i + 1}`,
          kind: 'section',
          href,
          title,
          row: i + 1,
          sectionType: type,
          heading,
        },
        block,
      )
      return {
        row: i + 1,
        type,
        heading,
        hidden: (block.settings as Json | undefined)?.hideOn === 'all',
      }
    })
    return { id: page.id as number, title, slug: String(page.slug ?? ''), sections }
  })

  const counts: Record<string, number> = { pages: pages.length }
  for (const [collection, docs] of Object.entries(data.collections)) {
    counts[collection] = docs.length
    for (const doc of docs) {
      const title = String(doc[titleField[collection]] ?? doc.id)
      add(
        {
          key: `${collection}/${doc.id}`,
          kind: 'doc',
          href: `/admin/collections/${collection}/${doc.id}`,
          title,
          collection,
        },
        doc,
      )
    }
  }
  for (const [slug, doc] of Object.entries(data.globals))
    add(
      {
        key: `global/${slug}`,
        kind: 'global',
        href: `/admin/globals/${slug}`,
        title: globalLabels[slug] ?? slug,
        managerOnly: true,
      },
      doc,
    )
  return { pages, entries, counts }
}

let cached: { at: number; site: Site } | null = null

export const loadSite = async (payload: Payload): Promise<Site> => {
  if (cached && Date.now() - cached.at < 60_000) return cached.site
  const all = async (collection: string) =>
    (
      await payload.find({
        collection: collection as CollectionSlug,
        depth: 0,
        limit: 300,
        pagination: false,
      })
    ).docs as unknown as Json[]
  const names = Object.keys(titleField)
  const [pages, lists, globals] = await Promise.all([
    all('pages'),
    Promise.all(names.map((c) => all(c).catch(() => [] as Json[]))),
    Promise.all(
      Object.keys(globalLabels).map((slug) =>
        payload
          .findGlobal({ slug: slug as GlobalSlug, depth: 0 })
          .then((g) => g as unknown as Json)
          .catch(() => ({}) as Json),
      ),
    ),
  ])
  const site = buildSite({
    pages,
    collections: Object.fromEntries(names.map((c, i) => [c, lists[i]])),
    globals: Object.fromEntries(Object.keys(globalLabels).map((s, i) => [s, globals[i]])),
  })
  cached = { at: Date.now(), site }
  return site
}
