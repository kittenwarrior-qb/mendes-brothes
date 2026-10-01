import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import React from 'react'

import type { ContactSectionBlock as Props } from '@/payload-types'

import { SiteFormServer } from '@/blocks/Form/SiteFormServer'
import { Highlight } from '@/components/site/Highlight'
import { Img } from '@/components/site/Img'
import { Section } from '@/components/site/Section'
import { getGlobal } from '@/utilities/getGlobals'
import { fullAddress, mapLink, telHref } from '@/utilities/site'
import { cn } from '@/utilities/ui'

import { MapEmbed } from './MapEmbed'

export const ContactSectionBlock: React.FC<Props> = async ({
  heading,
  lede,
  form,
  showInfoCard,
  showMap,
  footnote,
  settings,
}) => {
  const site = await getGlobal('site-settings', 1)
  if (!form || typeof form !== 'object') return null
  const a = site.address
  const map = mapLink(site)

  return (
    <Section settings={settings}>
      <div className="wrap">
        {heading || lede ? (
          <div className="sec-head">
            <div>
              {heading ? (
                <h2>
                  <Highlight text={heading} />
                </h2>
              ) : null}
              {lede ? <p className="lede">{lede}</p> : null}
            </div>
          </div>
        ) : null}
        <div className={cn('contact-grid', !showInfoCard && 'single')}>
          {showInfoCard ? (
            <aside className="info-card">
              {site.logoOnDark ? <Img media={site.logoOnDark} sizes="160px" /> : null}
              {site.phone ? (
                <>
                  <p className="ic-label">Call or text</p>
                  <a className="big" href={telHref(site.phone)}>
                    {site.phone}
                  </a>
                </>
              ) : null}
              {a?.street ? (
                <div className="info-row">
                  <small>Office &amp; yard</small>
                  {a.street}
                  <br />
                  {[a.city, [a.state, a.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                  {map ? (
                    <>
                      <br />
                      <a href={map} rel="noopener noreferrer" target="_blank">
                        Open in Google Maps
                      </a>
                    </>
                  ) : null}
                </div>
              ) : null}
              {site.email ? (
                <div className="info-row">
                  <small>Email</small>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </div>
              ) : null}
              {site.hours ? (
                <div className="info-row">
                  <small>Hours</small>
                  {site.hours}
                </div>
              ) : null}
              {site.serviceAreaText ? (
                <div className="info-row">
                  <small>Service area</small>
                  {site.serviceAreaText}
                </div>
              ) : null}
            </aside>
          ) : null}
          <div className="form">
            <SiteFormServer footnote={footnote} form={form as unknown as FormType} />
          </div>
        </div>
        {showMap && fullAddress(site) ? <MapEmbed address={fullAddress(site)} /> : null}
      </div>
    </Section>
  )
}
