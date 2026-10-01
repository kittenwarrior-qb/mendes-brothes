import React from 'react'

import { getGlobal } from '@/utilities/getGlobals'
import { telHref } from '@/utilities/site'

import { Highlight } from './Highlight'
import { Arrow, Eyebrow } from './Section'
import { SmartLink } from './SmartLink'

/** Generic CTA card used by the site-wide band (Site settings) and the CTA block. */
export const CtaCard: React.FC<{
  eyebrow?: string | null
  heading?: string | null
  lede?: string | null
  phone?: string | null
  buttonLabel?: string | null
  buttonUrl?: string | null
  style?: 'gradient' | 'dark' | 'image' | null
  background?: React.ReactNode
}> = ({
  eyebrow,
  heading,
  lede,
  phone,
  buttonLabel,
  buttonUrl,
  style = 'gradient',
  background,
}) => (
  <div className="wrap">
    <div className={`cta-inner ${style || 'gradient'}`}>
      {background ? <div className="cta-bg">{background}</div> : null}
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>
          <Highlight text={heading} />
        </h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      <div className="cta-side">
        {phone ? (
          <a className="cta-phone" href={telHref(phone)}>
            {phone}
          </a>
        ) : null}
        {buttonLabel && buttonUrl ? (
          <SmartLink
            className={style === 'dark' || style === 'image' ? 'btn btn-white' : 'btn btn-primary'}
            href={buttonUrl}
          >
            {buttonLabel}
            <Arrow />
          </SmartLink>
        ) : null}
      </div>
    </div>
  </div>
)

/** The band shown above the footer (configured in Site settings → Site-wide). */
export async function SiteCtaBand() {
  const settings = await getGlobal('site-settings', 1)
  const band = settings.ctaBand
  if (!band?.enabled || !band.heading) return null
  return (
    <section aria-label="Request an estimate" className="sec pad-md">
      <CtaCard
        buttonLabel={band.buttonLabel}
        buttonUrl={band.buttonUrl}
        heading={band.heading}
        phone={band.showPhone ? settings.phone : null}
      />
    </section>
  )
}
