import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { PageHeroView } from '@/blocks/PageHero/Component'
import { getAllServices } from '@/blocks/ServicesGrid/Component'
import { Icon } from '@/components/site/Icon'
import { ProjectCard } from '@/components/site/ProjectCard'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { generateMeta } from '@/utilities/generateMeta'

type Args = { params: Promise<{ slug?: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'service-areas',
      where: { hasPage: { not_equals: false } },
      limit: 500,
      pagination: false,
      select: { slug: true },
    })
    return res.docs.filter((d) => d.slug).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

const getArea = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'service-areas',
    where: { and: [{ slug: { equals: slug } }, { hasPage: { not_equals: false } }] },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

export default async function AreaPage({ params }: Args) {
  const { slug = '' } = await params
  const decoded = decodeURIComponent(slug)
  const area = await getArea(decoded)
  if (!area) notFound()

  const payload = await getPayload({ config: configPromise })
  const [projects, services] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { and: [{ _status: { equals: 'published' } }, { area: { equals: area.id } }] },
      sort: '-completedAt',
      limit: 6,
      depth: 1,
      overrideAccess: false,
    }),
    getAllServices(),
  ])
  const place = [area.name, area.state].filter(Boolean).join(', ')

  return (
    <article>
      <PageHeroView
        actions={
          <Link className="btn btn-primary" href="/contact">
            Get a free estimate
          </Link>
        }
        crumbs={[
          { name: 'Home', path: '/' },
          { name: area.name, path: `/areas/${area.slug}` },
        ]}
        heading={`Site work & construction in *${place}*`}
        lede={
          area.description ||
          `Land clearing, grading, excavation, driveways and more for homeowners and builders in ${place}${area.county ? ` and across ${area.county}` : ''}.`
        }
        variant="simple"
      />
      <section className="sec pad-md">
        <div className="wrap">
          <div className="sec-head">
            <h2>
              Services in <span className="o">{area.name}</span>
            </h2>
          </div>
          <ul className="s-list">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.slug}`}>
                  <span className="ico">
                    <Icon name={s.icon} />
                  </span>
                  <span className="svc-name">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {projects.docs.length ? (
        <section className="sec pad-md bg-tint">
          <div className="wrap">
            <div className="sec-head">
              <h2>
                Projects in <span className="o">{area.name}</span>
              </h2>
              <Link className="btn btn-outline" href={`/projects?area=${area.slug}`}>
                View all
              </Link>
            </div>
            <div className="proj-grid">
              {projects.docs.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <SiteCtaBand />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const decoded = decodeURIComponent(slug)
  const area = await getArea(decoded)
  if (!area) return {}
  const place = [area.name, area.state].filter(Boolean).join(', ')
  return generateMeta({
    doc: area,
    title: area.meta?.title || `Site work & construction in ${place}`,
    description: area.description,
    path: `/areas/${decoded}`,
  })
}
