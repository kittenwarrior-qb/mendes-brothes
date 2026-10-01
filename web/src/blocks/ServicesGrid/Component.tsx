import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Service, ServicesGridBlock as Props } from '@/payload-types'

import { Icon } from '@/components/site/Icon'
import { Img } from '@/components/site/Img'
import { Arrow, Section, SectionHead } from '@/components/site/Section'
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
  const { eyebrow, heading, lede, headerLink, variant, source, settings, linkTo, id } = props
  const services = source === 'manual' ? asDocs<Service>(props.services) : await getAllServices()
  if (!services.length) return null

  const href = (s: Service) =>
    linkTo === 'projects' ? `/projects?service=${s.slug}` : `/services/${s.slug}`
  const photoIds = new Set(asDocs<Service>(props.photoTiles).map((s) => s.id))
  const titleId = `svc-${id ?? 'grid'}`

  // Bento order: a photo tile, four small tiles, two small tiles, a photo tile, the rest.
  // With dense grid flow this always fills complete rows (no holes) on a 4-column grid.
  const photos = services.filter((s) => photoIds.has(s.id) && s.image)
  const tiles = services.filter((s) => !photos.includes(s))
  const bento =
    variant === 'bento' || !variant
      ? [
          ...photos.slice(0, 1),
          ...tiles.slice(0, 6),
          ...photos.slice(1, 2),
          ...tiles.slice(6),
          ...photos.slice(2),
        ]
      : services

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

        {variant === 'list' ? (
          <ul className="s-list">
            {services.map((s, i) => (
              <li key={s.id}>
                <Link href={href(s)}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svc-name">{s.title}</span>
                  <span className="desc">{s.shortDescription}</span>
                  <Arrow />
                  {s.image ? (
                    <span aria-hidden="true" className="s-preview">
                      <Img alt="" fill media={s.image} sizes="300px" />
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : variant === 'cards' ? (
          <div className="s-cards">
            {services.map((s, i) => (
              <Link className="b-tile reveal" href={href(s)} key={s.id}>
                <span className="tile-top">
                  <span className="ico">
                    <Icon name={s.icon} />
                  </span>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <h3 className="svc-name">{s.title}</h3>
                <p>{s.shortDescription}</p>
                <span className="more">
                  Learn more <Arrow />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bento">
            {bento.map((s, i) =>
              photoIds.has(s.id) && s.image ? (
                <Link className="b-photo reveal" href={href(s)} key={s.id}>
                  <Img
                    fill
                    media={s.image}
                    sizes="(max-width: 560px) 100vw, (max-width: 980px) 100vw, 620px"
                  />
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="cap">
                    <h3 className="svc-name">{s.title}</h3>
                    <p>{s.shortDescription}</p>
                  </div>
                </Link>
              ) : (
                <Link className="b-tile reveal" href={href(s)} key={s.id}>
                  <span className="tile-top">
                    <span className="ico">
                      <Icon name={s.icon} />
                    </span>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
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
