import React from 'react'

import type { SplitBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Highlight } from '@/components/site/Highlight'
import { Img } from '@/components/site/Img'
import { Eyebrow, Section } from '@/components/site/Section'
import { cn } from '@/utilities/ui'

export const SplitBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  lede,
  body,
  links,
  image,
  imagePosition,
  stamp,
  settings,
}) => (
  <Section settings={settings}>
    <div className={cn('wrap split', imagePosition === 'left' && 'img-left')}>
      <div className="reveal">
        <Eyebrow>{eyebrow}</Eyebrow>
        {heading ? (
          <h2>
            <Highlight text={heading} />
          </h2>
        ) : null}
        {lede ? <p className="lede">{lede}</p> : null}
        {body ? (
          <RichText className="rich" data={body} enableGutter={false} enableProse={false} />
        ) : null}
        {links?.length ? (
          <div className="hero-actions">
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="split-img reveal">
        <Img media={image} sizes="(max-width: 900px) 92vw, 560px" />
        {stamp?.title || stamp?.text ? (
          <div className="stamp">
            {stamp.title ? <b>{stamp.title}</b> : null}
            {stamp.text}
          </div>
        ) : null}
      </div>
    </div>
  </Section>
)
