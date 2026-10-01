import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Post } from '@/payload-types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { Img } from '@/components/site/Img'
import { absoluteUrl, JsonLd } from '@/components/site/JsonLd'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { formatAuthors } from '@/utilities/formatAuthors'
import { generateMeta } from '@/utilities/generateMeta'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia } from '@/utilities/site'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })
    return posts.docs.filter((p) => p.slug).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

type Args = { params: Promise<{ slug?: string }> }

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const hero = asMedia(post.heroImage)
  const authors = post.populatedAuthors?.length ? formatAuthors(post.populatedAuthors) : ''
  const related = (post.relatedPosts ?? []).filter((p): p is Post => typeof p === 'object')

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />
      <section className="phero phero-simple sec">
        <div className="wrap" style={{ maxWidth: 900 }}>
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'News', path: '/posts' },
              { name: post.title, path: url },
            ]}
          />
          <h1 style={{ textTransform: 'none' }}>{post.title}</h1>
          <p className="lede">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : null}
            {authors ? ` · ${authors}` : null}
          </p>
        </div>
      </section>
      <section className="sec pad-md">
        <div className="wrap" style={{ maxWidth: 900 }}>
          {hero ? (
            <div className="cover-img">
              <Img media={hero} priority sizes="(max-width: 900px) 100vw, 860px" />
            </div>
          ) : null}
          <RichText
            className="prose-site"
            data={post.content}
            enableGutter={false}
            enableProse={false}
          />
        </div>
      </section>
      {related.length ? (
        <section className="sec pad-md bg-alt">
          <div className="wrap">
            <div className="sec-head">
              <h2>
                Related <span className="o">posts</span>
              </h2>
            </div>
            <CollectionArchive posts={related} />
          </div>
        </section>
      ) : null}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.publishedAt || undefined,
          dateModified: post.updatedAt,
          image: hero?.url ? absoluteUrl(getMediaUrl(hero.url)) : undefined,
          author: authors ? { '@type': 'Person', name: authors } : undefined,
          mainEntityOfPage: absoluteUrl(url),
        }}
      />
      <SiteCtaBand />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })
  return generateMeta({ doc: post, fallbackImage: post?.heroImage, path: `/posts/${decodedSlug}` })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
