import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { PageHeroView } from '@/blocks/PageHero/Component'
import { CollectionArchive } from '@/components/CollectionArchive'
import { plainText } from '@/components/site/Highlight'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { getGlobal } from '@/utilities/getGlobals'

export const POSTS_PER_PAGE = 12

/** Shared renderer for /posts and /posts/page/[n]. */
export async function PostsListing({ page }: { page: number }) {
  const payload = await getPayload({ config: configPromise })
  const [listing, posts] = await Promise.all([
    getGlobal('listing-pages', 1),
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: POSTS_PER_PAGE,
      page,
      sort: '-publishedAt',
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        heroImage: true,
        publishedAt: true,
      },
    }),
  ])
  if (page > 1 && page > posts.totalPages) notFound()
  const cfg = listing.posts

  return (
    <>
      <PageHeroView
        crumbs={[
          { name: 'Home', path: '/' },
          { name: plainText(cfg?.heading) || 'News', path: '/posts' },
        ]}
        heading={cfg?.heading || 'News & *tips*'}
        image={cfg?.image}
        lede={cfg?.lede}
      />
      <section className="sec pad-md">
        <div className="wrap">
          {posts.docs.length ? (
            <CollectionArchive posts={posts.docs} />
          ) : (
            <div className="empty">
              <h3>No posts yet</h3>
              <p>Check back soon for project updates and tips.</p>
            </div>
          )}
          {posts.totalPages > 1 ? (
            <nav aria-label="Pagination" className="pager">
              {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span aria-current="page" key={n}>
                    {n}
                  </span>
                ) : (
                  <Link href={n === 1 ? '/posts' : `/posts/page/${n}`} key={n}>
                    {n}
                  </Link>
                ),
              )}
            </nav>
          ) : null}
        </div>
      </section>
      <SiteCtaBand />
    </>
  )
}
