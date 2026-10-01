import React from 'react'

import type { HeroHomeBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Highlight } from '@/components/site/Highlight'
import { Icon } from '@/components/site/Icon'
import { Img } from '@/components/site/Img'
import { Eyebrow, Section } from '@/components/site/Section'
import { resolveTheme } from '@/theme/resolve'
import { getGlobal } from '@/utilities/getGlobals'
import { telHref } from '@/utilities/site'

export const HeroHomeBlock: React.FC<Props & { isFirst?: boolean }> = async (props) => {
  const {
    variant,
    showLogo,
    eyebrow,
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
  const split = variant === 'split'
  const darkBg = !split || resolveTheme(themeGlobal).colorScheme === 'dark'
  const logo = darkBg ? site.logoOnDark || site.logo : site.logo
  const Title = isFirst ? 'h1' : 'h2'

  const copy = (
    <div className="hero-copy">
      {showLogo && logo ? (
        <Img className="hero-logo" media={logo} priority={isFirst} sizes="280px" />
      ) : null}
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title className="hero-title">
        <Highlight text={heading} />
      </Title>
      {lede ? <p className="lede">{lede}</p> : null}
      {links?.length ? (
        <div className="hero-actions">
          {links.map(({ link }, i) => (
            <CMSLink key={i} {...link} />
          ))}
        </div>
      ) : null}
    </div>
  )

  const callCard =
    showCallCard && site.phone ? (
      <a className="call-card" href={telHref(site.phone)}>
        <span className="ico">
          <Icon name="phone" />
        </span>
        <span>
          <small>{callCardText}</small>
          <b>{site.phone}</b>
        </span>
      </a>
    ) : null

  const trustRow = trust?.length ? (
    <ul className="hero-trust">
      {trust.map((t) => (
        <li key={t.id ?? t.title}>
          <b>{t.title}</b>
          {t.text ? <span>{t.text}</span> : null}
        </li>
      ))}
    </ul>
  ) : null

  if (split) {
    const thumbList = Array.isArray(thumbs) ? thumbs.slice(0, 2) : []
    return (
      <Section className="hero-split" settings={{ ...settings, spacing: 'none' }}>
        <div className="wrap hero-split-grid">
          <div>
            {copy}
            {trustRow}
          </div>
          <div className="hero-split-media">
            <Img
              className="main"
              media={image}
              priority={isFirst}
              sizes="(max-width: 980px) 92vw, 600px"
            />
            {showBadge && site.logoMark ? (
              <Img className="hero-badge" media={site.logoMark} sizes="120px" />
            ) : null}
            {callCard}
            {thumbList.length ? (
              <div aria-hidden="true" className="hero-thumbs">
                {thumbList.map((t, i) => (
                  <Img key={i} media={t} sizes="120px" />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Section>
    )
  }

  // Cinematic: full-bleed photo, giant headline, trust strip pinned to the bottom edge.
  return (
    <Section className="hero hero-dark" settings={{ ...settings, spacing: 'none' }}>
      <div className="hero-bg">
        <Img fill media={image} priority={isFirst} sizes="100vw" />
      </div>
      <div className="wrap hero-inner">
        {copy}
        <div className="hero-side">
          {showBadge && site.logoMark ? (
            <Img className="hero-badge" media={site.logoMark} sizes="120px" />
          ) : null}
          {callCard}
        </div>
      </div>
      {trustRow ? <div className="wrap">{trustRow}</div> : null}
    </Section>
  )
}
