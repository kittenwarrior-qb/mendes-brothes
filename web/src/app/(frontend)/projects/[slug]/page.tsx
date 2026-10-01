import type { Metadata } from 'next'

import configPromise from '@payload-config'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { Equipment, Project, Service, ServiceArea, Testimonial } from '@/payload-types'

import { toLightboxImages } from '@/blocks/Gallery/Component'
import { ReviewCard } from '@/blocks/Testimonials/Component'
import { clientTypeOptions } from '@/collections/Projects'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { BeforeAfter } from '@/components/site/BeforeAfter'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { Img } from '@/components/site/Img'
import { Lightbox } from '@/components/site/Lightbox'
import { ProjectCard } from '@/components/site/ProjectCard'
import { Arrow, SectionHead } from '@/components/site/Section'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { generateMeta } from '@/utilities/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asDoc, asDocs, asMedia, formatAcres, formatMonthYear } from '@/utilities/site'

type Args = { params: Promise<{ slug?: string }> }

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'projects',
      draft: false,
      limit: 1000,
      pagination: false,
      overrideAccess: false,
      select: { slug: true },
    })
    return res.docs.filter((d) => d.slug).map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

const getProject = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'projects',
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    pagination: false,
  })
  return res.docs[0] ?? null
})

const pic = (m: unknown) => {
  const media = asMedia(m)
  return media?.url
    ? {
        src: getMediaUrl(media.url, media.updatedAt),
        width: media.width ?? 1600,
        height: media.height ?? 900,
        alt: media.alt ?? '',
      }
    : null
}

export default async function ProjectPage({ params }: Args) {
  const { slug = '' } = await params
  const decoded = decodeURIComponent(slug)
  const url = `/projects/${decoded}`
  const project = await getProject(decoded)
  if (!project) return <PayloadRedirects url={url} />

  const listing = await getGlobal('listing-pages', 0)
  const services = asDocs<Service>(project.services)
  const equipment = asDocs<Equipment>(project.equipment)
  const area = asDoc<ServiceArea>(project.area)
  const testimonial = asDoc<Testimonial>(project.testimonial)
  const before = pic(project.beforeAfter?.before)
  const after = pic(project.beforeAfter?.after)
  const gallery = toLightboxImages(
    (project.gallery ?? []).map((g) => ({ media: g.image, caption: g.caption })),
  )

  const payload = await getPayload({ config: configPromise })
  const related = services[0]
    ? (
        await payload.find({
          collection: 'projects',
          where: {
            and: [
              { _status: { equals: 'published' } },
              { id: { not_equals: project.id } },
              { services: { contains: services[0].id } },
            ],
          },
          sort: '-completedAt',
          limit: 3,
          depth: 1,
          overrideAccess: false,
        })
      ).docs
    : []

  const facts: [string, React.ReactNode][] = [
    [
      'Town',
      area ? (
        <Link href={`/areas/${area.slug}`}>
          {[area.name, area.state].filter(Boolean).join(', ')}
        </Link>
      ) : null,
    ],
    ['Lot size', typeof project.acres === 'number' ? formatAcres(project.acres) : null],
    ['Completed', formatMonthYear(project.completedAt)],
    ['Duration', project.duration],
    ['Client', clientTypeOptions.find((c) => c.value === project.clientType)?.label],
  ]

  return (
    <article className="case">
      <PayloadRedirects disableNotFound url={url} />

      <section className="phero phero-simple sec">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Projects', path: '/projects' },
              { name: project.title, path: url },
            ]}
          />
          <h1>{project.title}</h1>
          <p className="lede">{project.summary}</p>
        </div>
      </section>

      <section className="sec pad-md" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="case-cover">
            <Img fill media={project.cover} priority sizes="(max-width: 1400px) 96vw, 1320px" />
          </div>
          <div className="facts">
            <dl>
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {project.body ? (
            <div className="chapter">
              <h2>The job</h2>
              <RichText
                className="prose-site"
                data={project.body}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          ) : null}
          {before && after ? (
            <div className="chapter">
              <h2>Before &amp; after</h2>
              <BeforeAfter after={after} before={before} />
            </div>
          ) : null}
          {gallery.length ? (
            <div className="chapter">
              <h2>Photos</h2>
              <Lightbox columns={2} images={gallery} />
            </div>
          ) : null}
          {services.length || equipment.length || project.extraEquipment?.length ? (
            <div className="chapter">
              <h2>Services &amp; equipment</h2>
              <div className="tags">
                {services.map((sv) => (
                  <Link className="tag" href={`/projects?service=${sv.slug}`} key={sv.id}>
                    {sv.title}
                  </Link>
                ))}
                {equipment.map((e) => (
                  <span className="tag" key={e.id}>
                    {e.name}
                  </span>
                ))}
                {project.extraEquipment?.map((e) => (
                  <span className="tag" key={e}>
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {testimonial ? (
            <div className="chapter">
              <h2>From the client</h2>
              <ReviewCard t={testimonial} />
            </div>
          ) : null}

          <div className="case-cta">
            <Link
              className="btn btn-primary"
              href={`/contact${services[0] ? `?service=${services[0].slug}` : ''}`}
            >
              {listing.projects?.detailCtaLabel || 'Get an estimate for a similar job'}
              <Arrow />
            </Link>
            <Link className="link-arrow" href="/projects">
              All projects
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="sec pad-md" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <SectionHead
              eyebrow="More work"
              heading="Similar *projects*"
              link={{
                label: `More ${services[0]?.title ?? 'projects'}`,
                url: `/projects?service=${services[0]?.slug}`,
              }}
            />
            <div className="proj-grid">
              {related.map((p: Project) => (
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
  const project = await getProject(decoded)
  return generateMeta({ doc: project, fallbackImage: project?.cover, path: `/projects/${decoded}` })
}
