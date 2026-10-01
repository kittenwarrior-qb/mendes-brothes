import Link from 'next/link'
import React from 'react'

import type { Project, Service, ServiceArea } from '@/payload-types'

import { asDoc, asDocs, formatAcres } from '@/utilities/site'

import { Img } from './Img'

const PinIcon = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)
const AreaIcon = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M4 4h16v16H4z" strokeDasharray="3 3" />
  </svg>
)
const CalIcon = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect height="16" rx="2" width="18" x="3" y="5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export const ProjectMeta: React.FC<{ project: Project }> = ({ project }) => {
  const area = asDoc<ServiceArea>(project.area)
  return (
    <div className="pmeta">
      {area ? (
        <span>
          <PinIcon />
          {area.name}
        </span>
      ) : null}
      {typeof project.acres === 'number' ? (
        <span>
          <AreaIcon />
          {formatAcres(project.acres)}
        </span>
      ) : null}
      {project.year ? (
        <span>
          <CalIcon />
          {project.year}
        </span>
      ) : null}
    </div>
  )
}

export const ProjectCard: React.FC<{ project: Project; priority?: boolean }> = ({
  project,
  priority,
}) => {
  const services = asDocs<Service>(project.services)
  return (
    <Link className="pcard reveal" href={`/projects/${project.slug}`}>
      <div className="pthumb">
        <Img
          fill
          media={project.cover}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
        {services[0] ? <span className="pbadge">{services[0].title}</span> : null}
      </div>
      <div className="pbody">
        <h3>{project.title}</h3>
        <ProjectMeta project={project} />
        {services.length > 1 ? (
          <div className="tags">
            {services.slice(1).map((s) => (
              <span className="tag" key={s.id}>
                {s.title}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
