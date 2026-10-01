import React from 'react'

import type { HeroHomeBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Highlight } from '@/components/site/Highlight'
import { Icon } from '@/components/site/Icon'
import { Img } from '@/components/site/Img'
import { Section } from '@/components/site/Section'
import { resolveTheme } from '@/theme/resolve'
import { getGlobal } from '@/utilities/getGlobals'
import { telHref } from '@/utilities/site'

export const HeroHomeBlock: React.FC<Props & { isFirst?: boolean }> = async (props) => {
  const {
    variant,
    showLogo,
    heading,
    lede,
    links,
    trust,
    image,
    thumbs,
    showBadge,
    showCallCard,
    callCardText,
    settings,
    isFirst,
  } = props
  const [site, themeGlobal] = await Promise.all([
    getGlobal('site-settings', 1),
    getGlobal('theme', 0),
  ])
  const full = variant === 'fullImage'
  const darkBg = full || resolveTheme(themeGlobal).colorScheme === 'dark'
  const logo = darkBg ? site.logoOnDark || site.logo : site.logo

  const text = (
    <div>
      {showLogo && logo ? <Img className="heroC-word" media={logo} priority sizes="360px" /> : null}
      {isFirst ? (
        <h1>
          <Highlight text={heading} />
        </h1>
      ) : (
        <h2 className="h1">
          <Highlight text={heading} />
        </h2>
      )}
      {lede ? <p className="lede">{lede}</p> : null}
      {links?.length ? (
        <div className="hero-actions">
          {links.map(({ link }, i) => (
            <CMSLink key={i} {...link} />
          ))}
        </div>
      ) : null}
      {trust?.length ? (
        <div className="trust">
          {trust.map((t) => (
            <div key={t.id ?? t.title}>
              <b>{t.title}</b>
              {t.text ? <span>{t.text}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  if (full) {
    return (
      <Section className="heroF" settings={{ ...settings, spacing: settings?.spacing ?? 'lg' }}>
        <div className="bgimg">
          <Img fill media={image} priority={isFirst} sizes="100vw" />
        </div>
        <div className="wrap">{text}</div>
      </Section>
    )
  }

  const thumbList = Array.isArray(thumbs) ? thumbs.slice(0, 2) : []
  return (
    <Section className="heroC" settings={{ ...settings, spacing: 'none' }}>
      <div className="wrap heroC-grid">
        {text}
        <div className="heroC-media">
          <Img
            className="main"
            media={image}
            priority={isFirst}
            sizes="(max-width: 980px) 92vw, 560px"
          />
          {showBadge && site.logoMark ? (
            <Img className="heroC-badge" media={site.logoMark} sizes="128px" />
          ) : null}
          {showCallCard && site.phone ? (
            <div className="heroC-card">
              <span className="ico">
                <Icon name="phone" />
              </span>
              <div>
                <b>{callCardText}</b>
                <a href={telHref(site.phone)}>{site.phone}</a>
              </div>
            </div>
          ) : null}
          {thumbList.length ? (
            <div aria-hidden="true" className="heroC-thumbs">
              {thumbList.map((t, i) => (
                <Img key={i} media={t} sizes="110px" />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
