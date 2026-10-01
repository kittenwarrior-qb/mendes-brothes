import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { FeaturedProjectsBlock as Props, Project } from '@/payload-types'

import { ProjectCard } from '@/components/site/ProjectCard'
import { Section, SectionHead } from '@/components/site/Section'
import { asDoc, asDocs } from '@/utilities/site'

export const FeaturedProjectsBlock: React.FC<Props & { id?: string }> = async (props) => {
  const { eyebrow, heading, lede, headerLink, source, limit, layout, settings, id } = props
  let projects: Project[]

  if (source === 'manual') {
    projects = asDocs<Project>(props.projects)
  } else {
    const payload = await getPayload({ config: configPromise })
    const service = asDoc<{ id: number }>(props.filterService)?.id ?? props.filterService
    const where: Where = { _status: { equals: 'published' } }
    if (source === 'featured') where.featured = { equals: true }
    if (service) where.services = { contains: service }
    const res = await payload.find({
      collection: 'projects',
      where,
      sort: '-completedAt',
      limit: limit || 3,
      depth: 1,
      overrideAccess: false,
    })
    projects = res.docs
  }
  if (!projects.length) return null

  const titleId = `feat-${id ?? 'projects'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          id={titleId}
          lede={lede}
          link={headerLink}
        />
        <div className={layout === 'grid' ? 'proj-grid' : 'proj-grid proj-feature'}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              sizes={layout !== 'grid' && i === 0 ? '(max-width: 900px) 100vw, 760px' : undefined}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
