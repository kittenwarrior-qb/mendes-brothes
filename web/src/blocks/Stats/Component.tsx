import React from 'react'

import type { StatsBlock as Props } from '@/payload-types'

import { Highlight } from '@/components/site/Highlight'
import { Eyebrow, Section } from '@/components/site/Section'

export const StatsBlockComponent: React.FC<Props & { id?: string }> = ({
  eyebrow,
  heading,
  lede,
  items,
  settings,
  id,
}) => {
  const titleId = `stats-${id ?? 'x'}`
  const numbers = (
    <div className="stats">
      {items?.map((s) => (
        <div className="reveal" key={s.id ?? s.label}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  )
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        {heading ? (
          // a big sentence on the left, the numbers stacked on the right
          <div className="statement">
            <div className="reveal">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 id={titleId}>
                <Highlight text={heading} />
              </h2>
              {lede ? <p className="lede">{lede}</p> : null}
            </div>
            {numbers}
          </div>
        ) : (
          numbers
        )}
      </div>
    </Section>
  )
}
