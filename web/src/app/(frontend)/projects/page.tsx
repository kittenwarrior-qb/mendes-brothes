import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { PageHeroView } from '@/blocks/PageHero/Component'
import { clientTypeOptions } from '@/collections/Projects'
import { plainText } from '@/components/site/Highlight'
import { ProjectCard } from '@/components/site/ProjectCard'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { generateMeta } from '@/utilities/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'
import {
  buildProjectsWhere,
  parseProjectParams,
  sizeBuckets,
  sortOptions,
  toQueryString,
} from '@/utilities/projectsQuery'

import { ProjectFilters } from './ProjectFilters'

type Args = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function ProjectsPage({ searchParams }: Args) {
  const params = parseProjectParams(await searchParams)
  const [listing, payload] = await Promise.all([
    getGlobal('listing-pages', 1),
    getPayload({ config: configPromise }),
  ])
  const cfg = listing.projects
  const buckets = sizeBuckets(cfg)
  const perPage = cfg?.perPage || 12
  const page = Math.max(1, Number(params.page) || 1)

  const [results, services, areas, yearsRaw, total] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: await buildProjectsWhere(payload, params, buckets),
      sort: sortOptions.find((s) => s.value === params.sort)?.sort ?? '-completedAt',
      limit: perPage,
      page,
      depth: 1,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'services',
      sort: 'order',
      limit: 100,
      depth: 0,
      pagination: false,
      select: { title: true, slug: true },
    }),
    payload.find({
      collection: 'service-areas',
      sort: 'name',
      limit: 200,
      depth: 0,
      pagination: false,
      select: { name: true, slug: true },
    }),
    payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      pagination: false,
      overrideAccess: false,
      select: { year: true },
    }),
    payload.count({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      overrideAccess: false,
    }),
  ])

  const years = [...new Set(yearsRaw.docs.map((d) => d.year).filter(Boolean))].sort(
    (a, b) => b! - a!,
  )
  const values = {
    q: params.q ?? '',
    service: params.service ?? '',
    area: params.area ?? '',
    size: params.size ?? '',
    year: params.year ?? '',
    type: params.type ?? '',
    sort: params.sort ?? 'new',
  }

  return (
    <>
      <PageHeroView
        eyebrow={cfg?.eyebrow}
        crumbs={[
          { name: 'Home', path: '/' },
          { name: plainText(cfg?.heading) || 'Projects', path: '/projects' },
        ]}
        heading={cfg?.heading || 'Finished *projects*'}
        lede={cfg?.lede}
        variant="simple"
      />
      <ProjectFilters
        options={{
          services: services.docs.map((s) => ({ value: s.slug!, label: s.title })),
          areas: areas.docs.map((a) => ({ value: a.slug!, label: a.name })),
          sizes: buckets.map((b) => ({ value: b.key, label: b.label })),
          years: years.map((y) => ({ value: String(y), label: String(y) })),
          types: clientTypeOptions,
          sorts: sortOptions.map(({ value, label }) => ({ value, label })),
          visible: cfg?.filters ?? ['q', 'service', 'area', 'size', 'sort'],
        }}
        values={values}
      >
        <section className="sec pad-md" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div aria-live="polite" className="result-bar">
              <span>
                <strong>{results.totalDocs}</strong> of {total.totalDocs} projects
              </span>
            </div>
            <h2 className="sr-only">Project results</h2>
            {results.docs.length ? (
              <div className="proj-grid">
                {results.docs.map((p, i) => (
                  <ProjectCard key={p.id} priority={i < 3} project={p} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h3>No projects match these filters</h3>
                <p>Try another service or lot size, or clear the filters to see everything.</p>
                <Link className="btn btn-primary" href="/projects">
                  Clear filters
                </Link>
              </div>
            )}
            {results.totalPages > 1 ? (
              <nav aria-label="Pagination" className="pager">
                {Array.from({ length: results.totalPages }, (_, i) => i + 1).map((n) =>
                  n === results.page ? (
                    <span aria-current="page" key={n}>
                      {n}
                    </span>
                  ) : (
                    <Link
                      href={`/projects${toQueryString(params, { page: n === 1 ? undefined : String(n) })}`}
                      key={n}
                      scroll={false}
                    >
                      {n}
                    </Link>
                  ),
                )}
              </nav>
            ) : null}
          </div>
        </section>
      </ProjectFilters>
      <SiteCtaBand />
    </>
  )
}

export async function generateMetadata({ searchParams }: Args): Promise<Metadata> {
  const listing = await getGlobal('listing-pages', 1)
  const params = parseProjectParams(await searchParams)
  const filtered = Object.values(params).some(Boolean)
  const meta = await generateMeta({
    doc: null,
    title: plainText(listing.projects?.heading) || 'Projects',
    description: listing.projects?.lede,
    fallbackImage: listing.projects?.image,
    path: '/projects',
  })
  // filtered variations point search engines at the main listing
  return filtered ? { ...meta, robots: { index: false, follow: true } } : meta
}
