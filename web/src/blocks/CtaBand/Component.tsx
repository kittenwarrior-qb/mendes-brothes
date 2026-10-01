import React from 'react'

import type { CtaBandBlock as Props } from '@/payload-types'

import { Img } from '@/components/site/Img'
import { Section } from '@/components/site/Section'
import { CtaCard } from '@/components/site/SiteCtaBand'
import { getGlobal } from '@/utilities/getGlobals'

export const CtaBandBlockComponent: React.FC<Props> = async ({
  eyebrow,
  heading,
  lede,
  showPhone,
  buttonLabel,
  buttonUrl,
  style,
  image,
  settings,
}) => {
  const site = showPhone ? await getGlobal('site-settings', 1) : null
  return (
    <Section settings={settings}>
      <CtaCard
        background={
          style === 'image' && image ? <Img fill media={image} sizes="100vw" /> : undefined
        }
        buttonLabel={buttonLabel}
        buttonUrl={buttonUrl}
        eyebrow={eyebrow}
        heading={heading}
        lede={lede}
        phone={site?.phone}
        style={style}
      />
    </Section>
  )
}
