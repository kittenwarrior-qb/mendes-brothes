import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { ServiceAreasBlock as Props } from '@/payload-types'

import { Section, SectionHead } from '@/components/site/Section'

export const ServiceAreasBlockComponent: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  lede,
  linkToPages,
  settings,
  id,
}) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'service-areas',
    sort: 'order',
    limit: 100,
    depth: 0,
    pagination: false,
    select: { name: true, slug: true, hasPage: true },
  })
  if (!docs.length) return null
  const titleId = `areas-${id ?? 'x'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} heading={heading} id={titleId} lede={lede} />
        <ul className="towns">
          {docs.map((a) => (
            <li key={a.id}>
              {linkToPages && a.hasPage !== false ? (
                <Link href={`/areas/${a.slug}`}>{a.name}</Link>
              ) : (
                <span>{a.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
