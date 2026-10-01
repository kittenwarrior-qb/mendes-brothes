import React from 'react'

import type { StepsBlock as Props } from '@/payload-types'

import { Section, SectionHead } from '@/components/site/Section'

export const StepsBlock: React.FC<Props & { id?: string }> = ({
  heading,
  lede,
  steps,
  settings,
  id,
}) => {
  const titleId = `steps-${id ?? 'x'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead heading={heading} id={titleId} lede={lede} />
        <ol className="steps" style={{ ['--n' as string]: Math.min(steps?.length || 4, 4) }}>
          {steps?.map((s) => (
            <li className="reveal" key={s.id ?? s.title}>
              <h3>{s.title}</h3>
              {s.text ? <p>{s.text}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
