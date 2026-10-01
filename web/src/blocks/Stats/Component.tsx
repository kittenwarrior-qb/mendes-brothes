import React from 'react'

import type { StatsBlock as Props } from '@/payload-types'

import { Section, SectionHead } from '@/components/site/Section'

export const StatsBlockComponent: React.FC<Props & { id?: string }> = ({
  eyebrow,
  heading,
  lede,
  items,
  settings,
  id,
}) => {
  const titleId = `stats-${id ?? 'x'}`
  return (
    <Section
      defaultBackground="dark"
      labelledBy={heading ? titleId : undefined}
      settings={settings}
    >
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} heading={heading} id={titleId} lede={lede} />
        <div className="stats">
          {items?.map((s) => (
            <div className="reveal" key={s.id ?? s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
