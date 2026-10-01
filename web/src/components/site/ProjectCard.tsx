import Link from 'next/link'
import React from 'react'

import type { Project, Service, ServiceArea } from '@/payload-types'

import { asDoc, asDocs, formatAcres } from '@/utilities/site'

import { Img } from './Img'
import { Arrow } from './Section'

/** "Forestry Mulching · Lewes · 3.2 acres" */
export const projectMetaLine = (project: Project) => {
  const service = asDocs<Service>(project.services)[0]
  const area = asDoc<ServiceArea>(project.area)
  return [
    service?.title,
    area?.name,
    typeof project.acres === 'number' ? formatAcres(project.acres) : null,
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Project card: the photo is the card, the details sit under it in plain text. */
export const ProjectCard: React.FC<{
  project: Project
  priority?: boolean
  /** `sizes` hint for the image when the card is rendered larger than a grid cell. */
  sizes?: string
}> = ({ project, priority, sizes }) => {
  const meta = projectMetaLine(project)
  return (
    <Link className="pcard reveal" href={`/projects/${project.slug}`}>
      <div className="pthumb">
        <Img
          fill
          media={project.cover}
          priority={priority}
          sizes={sizes ?? '(max-width: 760px) 100vw, 50vw'}
        />
        <span aria-hidden="true" className="pgo">
          View project <Arrow />
        </span>
      </div>
      <div className="pbody">
        <h3>{project.title}</h3>
        {project.year ? <span className="pyear">{project.year}</span> : null}
        {meta ? <p className="pmeta">{meta}</p> : null}
      </div>
    </Link>
  )
}
