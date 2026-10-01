import React from 'react'

import type { PageHeroBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Breadcrumbs, type Crumb } from '@/components/site/Breadcrumbs'
import { Highlight } from '@/components/site/Highlight'
import { Img } from '@/components/site/Img'
import { Eyebrow, Section } from '@/components/site/Section'
import { cn } from '@/utilities/ui'

/**
 * Inner page hero: an oversized title on the page background ("simple"), the same with a
 * framed photo beside it ("split"), or a photo filling the band with the text on it ("image").
 * Also used directly by automatic pages (projects, services, news…).
 */
export const PageHeroView: React.FC<{
  variant?: 'split' | 'simple' | 'image' | null
  eyebrow?: string | null
  heading?: string | null
  lede?: string | null
  image?: unknown
  crumbs?: Crumb[]
  actions?: React.ReactNode
  settings?: Props['settings']
  isFirst?: boolean
}> = ({ variant, eyebrow, heading, lede, image, crumbs, actions, settings, isFirst = true }) => {
  const v = !image
    ? 'simple'
    : variant === 'image'
      ? 'image'
      : variant === 'simple'
        ? 'simple'
        : 'split'
  const Title = isFirst ? 'h1' : 'h2'
  return (
    <Section
      className={cn('phero', `phero-${v}`, v === 'image' && 'hero-dark')}
      settings={{ ...settings, spacing: 'none' }}
    >
      {v === 'image' ? (
        <div className="phero-bg">
          <Img fill media={image} priority={isFirst} sizes="100vw" />
        </div>
      ) : null}
      <div className="wrap phero-inner">
        <div>
          {crumbs ? <Breadcrumbs items={crumbs} /> : null}
          <Eyebrow>{eyebrow}</Eyebrow>
          <Title>
            <Highlight text={heading} />
          </Title>
          {lede ? <p className="lede">{lede}</p> : null}
          {actions ? <div className="hero-actions">{actions}</div> : null}
        </div>
        {v === 'split' ? (
          <div className="phero-media">
            <Img fill media={image} priority={isFirst} sizes="(max-width: 860px) 92vw, 560px" />
          </div>
        ) : null}
      </div>
    </Section>
  )
}

export const PageHeroBlock: React.FC<Props & { isFirst?: boolean; crumbs?: Crumb[] }> = ({
  variant,
  showBreadcrumbs,
  eyebrow,
  heading,
  lede,
  links,
  image,
  settings,
  isFirst,
  crumbs,
}) => (
  <PageHeroView
    actions={links?.length ? links.map(({ link }, i) => <CMSLink key={i} {...link} />) : undefined}
    crumbs={showBreadcrumbs !== false ? crumbs : undefined}
    eyebrow={eyebrow}
    heading={heading}
    image={image}
    isFirst={isFirst}
    lede={lede}
    settings={settings}
    variant={variant}
  />
)
