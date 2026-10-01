import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { FeaturedProjectsBlock as Props, Project } from '@/payload-types'

import { ProjectCard } from '@/components/site/ProjectCard'
import { Section, SectionHead } from '@/components/site/Section'
import { asDoc, asDocs } from '@/utilities/site'

export const FeaturedProjectsBlock: React.FC<Props & { id?: string }> = async (props) => {
  const { heading, lede, headerLink, source, limit, settings, id } = props
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
        <SectionHead heading={heading} id={titleId} lede={lede} link={headerLink} />
        <div className="proj-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </Section>
  )
}
