import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { generateMeta } from '@/utilities/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'

export async function generateStaticParams() {
  // Pre-render published pages at build time when the database is reachable;
  // otherwise they are rendered on first request and cached.
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })
    return pages.docs.filter((doc) => doc.slug && doc.slug !== 'home').map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

type Args = {
  params: Promise<{ slug?: string }>
}

const HERO_BLOCKS = new Set(['heroHome', 'pageHero'])

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  const page = await queryPageBySlug({ slug: decodedSlug })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const crumbs =
    decodedSlug === 'home'
      ? undefined
      : [
          { name: 'Home', path: '/' },
          { name: page.title, path: url },
        ]
  const firstIsHero = HERO_BLOCKS.has(page.layout?.[0]?.blockType ?? '')

  return (
    <article>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      {!firstIsHero ? <h1 className="sr-only">{page.title}</h1> : null}
      <RenderBlocks blocks={page.layout} crumbs={crumbs} />
      {!page.hideCtaBand ? <SiteCtaBand /> : null}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({ slug: decodedSlug })
  const meta = await generateMeta({
    doc: page,
    path: decodedSlug === 'home' ? '/' : `/${decodedSlug}`,
  })
  if (decodedSlug === 'home') {
    // Home: "Company | tagline" without the per-page suffix template.
    const site = await getGlobal('site-settings', 0)
    const title = page?.meta?.title || [site.companyName, site.tagline].filter(Boolean).join(' | ')
    return { ...meta, title: { absolute: title }, openGraph: { ...meta.openGraph, title } }
  }
  return meta
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
