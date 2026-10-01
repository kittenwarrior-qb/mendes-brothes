import React from 'react'

import type { CardsBlock as Props } from '@/payload-types'

import { Icon } from '@/components/site/Icon'
import { Section, SectionHead } from '@/components/site/Section'

export const CardsBlock: React.FC<Props & { id?: string }> = ({
  eyebrow,
  heading,
  lede,
  headerLink,
  variant,
  columns,
  items,
  settings,
  id,
}) => {
  const titleId = `cards-${id ?? 'x'}`
  const cols = variant === 'row' ? Math.min(Number(columns) || 2, 2) : Number(columns) || 3
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
        <div className="cards" style={{ ['--cols' as string]: cols }}>
          {items?.map((item) =>
            variant === 'row' ? (
              <div className="tech-item reveal" key={item.id ?? item.title}>
                <div className="t-ico">
                  <Icon name={item.icon || 'check'} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  {item.text ? <p>{item.text}</p> : null}
                </div>
              </div>
            ) : variant === 'icon' ? (
              <div className="card-icon reveal" key={item.id ?? item.title}>
                {item.icon ? (
                  <span className="ico">
                    <Icon name={item.icon} />
                  </span>
                ) : null}
                <h3>{item.title}</h3>
                {item.text ? <p>{item.text}</p> : null}
              </div>
            ) : (
              <div className="card-value reveal" key={item.id ?? item.title}>
                <h3>{item.title}</h3>
                {item.text ? <p>{item.text}</p> : null}
              </div>
            ),
          )}
        </div>
      </div>
    </Section>
  )
}
