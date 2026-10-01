import type { MetadataRoute } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { docPath } from '@/utilities/docPath'
import { getServerSideURL } from '@/utilities/getURL'

// Regenerated at most hourly; content changes also refresh it (revalidateSite).
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/projects`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/posts`, changeFrequency: 'weekly', priority: 0.5 },
  ]

  try {
    const payload = await getPayload({ config: configPromise })
    const published = { _status: { equals: 'published' } } as const
    const opts = { limit: 5000, depth: 0, pagination: false, overrideAccess: false } as const
    const [pages, projects, posts, services, areas] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: published,
        ...opts,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'projects',
        where: published,
        ...opts,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'posts',
        where: published,
        ...opts,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({ collection: 'services', ...opts, select: { slug: true, updatedAt: true } }),
      payload.find({
        collection: 'service-areas',
        where: { hasPage: { not_equals: false } },
        ...opts,
        select: { slug: true, updatedAt: true },
      }),
    ])
    const add = (
      collection: string,
      docs: { slug?: string | null; updatedAt: string }[],
      priority: number,
    ) => {
      for (const d of docs) {
        if (!d.slug) continue
        entries.push({
          url: `${base}${docPath(collection, d.slug)}`,
          lastModified: d.updatedAt,
          priority: collection === 'pages' && d.slug === 'home' ? 1 : priority,
        })
      }
    }
    add('pages', pages.docs, 0.8)
    add('services', services.docs, 0.8)
    add('projects', projects.docs, 0.7)
    add('service-areas', areas.docs, 0.6)
    add('posts', posts.docs, 0.5)
  } catch {
    // database unavailable (e.g. during an offline build) — serve the static part
  }
  return entries
}
