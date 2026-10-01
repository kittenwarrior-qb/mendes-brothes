import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Faq } from '@/payload-types'

import { FaqList } from '@/blocks/FAQ/Component'
import { PageHeroView } from '@/blocks/PageHero/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { Icon } from '@/components/site/Icon'
import { absoluteUrl, JsonLd } from '@/components/site/JsonLd'
import { ProjectCard } from '@/components/site/ProjectCard'
import { Arrow, SectionHead } from '@/components/site/Section'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { generateMeta } from '@/utilities/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'
import { asDocs } from '@/utilities/site'

type Args = { params: Promise<{ slug?: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'services',
      limit: 200,
      pagination: false,
      select: { slug: true },
    })
    return res.docs.filter((d) => d.slug).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

const getService = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

export default async function ServicePage({ params }: Args) {
  const { slug = '' } = await params
  const decoded = decodeURIComponent(slug)
  const url = `/services/${decoded}`
  const service = await getService(decoded)
  if (!service) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })
  const [projects, site, others] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: {
        and: [{ _status: { equals: 'published' } }, { services: { contains: service.id } }],
      },
      sort: '-completedAt',
      limit: 6,
      depth: 1,
      overrideAccess: false,
    }),
    getGlobal('site-settings', 0),
    payload.find({
      collection: 'services',
      where: { id: { not_equals: service.id } },
      sort: 'order',
      limit: 20,
      depth: 0,
      select: { title: true, slug: true, shortDescription: true },
    }),
  ])
  const faqs = asDocs<Faq>(service.faqs)

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />
      <PageHeroView
        actions={
          <>
            <Link className="btn btn-primary" href={`/contact?service=${service.slug}`}>
              Get a free estimate
            </Link>
            {projects.totalDocs ? (
              <Link className="btn btn-outline" href={`/projects?service=${service.slug}`}>
                See {projects.totalDocs} project{projects.totalDocs === 1 ? '' : 's'}
              </Link>
            ) : null}
          </>
        }
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: url },
        ]}
        heading={service.title}
        image={service.image}
        lede={service.shortDescription}
      />

      {service.body || service.highlights?.length ? (
        <section className="sec pad-md">
          <div className="wrap detail-grid">
            <div>
              {service.body ? (
                <RichText
                  className="prose-site"
                  data={service.body}
                  enableGutter={false}
                  enableProse={false}
                />
              ) : null}
            </div>
            {service.highlights?.length ? (
              <aside className="facts">
                <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>What&apos;s included</h3>
                <ul className="checks">
                  {service.highlights.map((h) => (
                    <li key={h.id ?? h.text}>
                      <Icon name="check" strokeWidth={2.6} />
                      <span>{h.text}</span>
                    </li>
                  ))}
                </ul>
                <Link className="btn btn-primary" href={`/contact?service=${service.slug}`}>
                  Request an estimate
                </Link>
              </aside>
            ) : null}
          </div>
        </section>
      ) : null}

      {projects.docs.length ? (
        <section className="sec pad-md">
          <div className="wrap">
            <SectionHead
              eyebrow="Projects"
              heading={`Recent *${service.title.toLowerCase()}* jobs`}
              link={{ label: 'View all', url: `/projects?service=${service.slug}` }}
            />
            <div className="proj-grid">
              {projects.docs.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="sec pad-md">
          <div className="wrap">
            <SectionHead eyebrow="FAQ" heading="Common *questions*" />
            <FaqList items={faqs} />
          </div>
        </section>
      ) : null}

      {others.docs.length ? (
        <section className="sec pad-md">
          <div className="wrap">
            <SectionHead eyebrow="More" heading="Other *services*" />
            <ul className="s-list">
              {others.docs.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-name">{s.title}</span>
                    <span className="desc">{s.shortDescription}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
          url: absoluteUrl(url),
          provider: { '@id': `${absoluteUrl('/')}#business`, name: site.companyName },
          areaServed: site.serviceAreaText || undefined,
        }}
      />
      <SiteCtaBand />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '' } = await params
  const decoded = decodeURIComponent(slug)
  const service = await getService(decoded)
  return generateMeta({ doc: service, fallbackImage: service?.image, path: `/services/${decoded}` })
}
