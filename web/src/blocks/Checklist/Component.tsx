import React from 'react'

import type { ChecklistBlock as Props } from '@/payload-types'

import { Icon } from '@/components/site/Icon'
import { Section, SectionHead } from '@/components/site/Section'

export const ChecklistBlock: React.FC<Props & { id?: string }> = ({
  heading,
  lede,
  items,
  settings,
  id,
}) => {
  const titleId = `checks-${id ?? 'x'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead heading={heading} id={titleId} lede={lede} />
        <ul className="checks">
          {items?.map((it) => (
            <li key={it.id ?? it.text}>
              <Icon name="check" strokeWidth={2.6} />
              <span>{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
