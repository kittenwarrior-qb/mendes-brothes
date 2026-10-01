import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PageHeroView } from '@/blocks/PageHero/Component'
import { PostCard } from '@/components/site/PostCard'
import { docPath } from '@/utilities/docPath'

const typeLabel: Record<string, string> = {
  posts: 'News',
  projects: 'Project',
  services: 'Service',
  pages: 'Page',
}

type Args = { searchParams: Promise<{ q?: string | string[] }> }

export default async function SearchPage({ searchParams }: Args) {
  const raw = (await searchParams).q
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? ''
  const payload = await getPayload({ config: configPromise })

  const results = query
    ? await payload.find({
        collection: 'search',
        depth: 1,
        limit: 24,
        pagination: false,
        where: {
          or: [
            { title: { like: query } },
            { 'meta.description': { like: query } },
            { 'meta.title': { like: query } },
          ],
        },
      })
    : null

  return (
    <>
      <PageHeroView
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Search', path: '/search' },
        ]}
        heading="Search"
        variant="simple"
        actions={
          <form
            action="/search"
            className="frow"
            role="search"
            style={{ width: '100%', maxWidth: 640 }}
          >
            <div className="field grow">
              <label className="sr-only" htmlFor="sq">
                Search the site
              </label>
              <input
                defaultValue={query}
                id="sq"
                name="q"
                placeholder="Projects, services, news…"
                type="search"
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
        }
      />
      <section className="sec pad-md">
        <div className="wrap">
          {results ? (
            results.docs.length ? (
              <>
                <p className="result-bar">
                  <span>
                    <strong>{results.docs.length}</strong> result
                    {results.docs.length === 1 ? '' : 's'} for “{query}”
                  </span>
                </p>
                <div className="proj-grid">
                  {results.docs.map((r) => {
                    const collection = r.doc?.relationTo
                    return (
                      <PostCard
                        badge={typeLabel[collection] ?? undefined}
                        doc={{
                          title: r.title ?? undefined,
                          slug: r.slug ?? undefined,
                          meta: r.meta as never,
                        }}
                        href={docPath(collection, r.slug)}
                        key={r.id}
                      />
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="empty">
                <h3>No results for “{query}”</h3>
                <p>Try a different word, or browse our projects and services.</p>
              </div>
            )
          ) : null}
        </div>
      </section>
    </>
  )
}

export function generateMetadata(): Metadata {
  return { title: 'Search', robots: { index: false, follow: true } }
}
