import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Service, ServicesGridBlock as Props } from '@/payload-types'

import { Icon } from '@/components/site/Icon'
import { Img } from '@/components/site/Img'
import { Section, SectionHead } from '@/components/site/Section'
import { asDocs } from '@/utilities/site'

export const getAllServices = async () => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'services',
    sort: 'order',
    limit: 50,
    depth: 1,
    pagination: false,
  })
  return res.docs
}

export const ServicesGridBlock: React.FC<Props & { id?: string }> = async (props) => {
  const { heading, lede, headerLink, variant, source, settings, linkTo, id } = props
  const services = source === 'manual' ? asDocs<Service>(props.services) : await getAllServices()
  if (!services.length) return null

  const href = (s: Service) =>
    linkTo === 'projects' ? `/projects?service=${s.slug}` : `/services/${s.slug}`
  const photoIds = new Set(asDocs<Service>(props.photoTiles).map((s) => s.id))
  const titleId = `svc-${id ?? 'grid'}`

  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead heading={heading} id={titleId} lede={lede} link={headerLink} />

        {variant === 'list' ? (
          <ul className="s-list">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={href(s)}>
                  <span className="ico">
                    <Icon name={s.icon} />
                  </span>
                  <span className="svc-name">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : variant === 'cards' ? (
          <div className="s-cards">
            {services.map((s) => (
              <Link className="s-card reveal" href={href(s)} key={s.id}>
                <span className="ico">
                  <Icon name={s.icon} />
                </span>
                <h3 className="svc-name">{s.title}</h3>
                <p>{s.shortDescription}</p>
                <span className="more">Learn more →</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bento">
            {services.map((s) =>
              photoIds.has(s.id) && s.image ? (
                <Link className="b-photo reveal" href={href(s)} key={s.id}>
                  <Img
                    fill
                    media={s.image}
                    sizes="(max-width: 560px) 100vw, (max-width: 980px) 100vw, 620px"
                  />
                  <div className="cap">
                    <span className="ico">
                      <Icon name={s.icon} />
                    </span>
                    <h3 className="svc-name">{s.title}</h3>
                    <p>{s.shortDescription}</p>
                  </div>
                </Link>
              ) : (
                <Link className="b-tile reveal" href={href(s)} key={s.id}>
                  <span className="ico">
                    <Icon name={s.icon} />
                  </span>
                  <h3 className="svc-name">{s.title}</h3>
                  <p>{s.shortDescription}</p>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
