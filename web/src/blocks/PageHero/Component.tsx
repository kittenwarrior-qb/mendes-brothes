import React from 'react'

import type { PageHeroBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Breadcrumbs, type Crumb } from '@/components/site/Breadcrumbs'
import { Highlight } from '@/components/site/Highlight'
import { Img } from '@/components/site/Img'
import { Section } from '@/components/site/Section'
import { cn } from '@/utilities/ui'

/** Inner page hero. Also used directly by automatic pages (projects, services…). */
export const PageHeroView: React.FC<{
  variant?: 'split' | 'simple' | 'image' | null
  heading?: string | null
  lede?: string | null
  image?: unknown
  crumbs?: Crumb[]
  actions?: React.ReactNode
  settings?: Props['settings']
  isFirst?: boolean
}> = ({ variant, heading, lede, image, crumbs, actions, settings, isFirst = true }) => {
  const v = !image && variant !== 'simple' ? 'simple' : variant || 'split'
  const Title = isFirst ? 'h1' : 'h2'
  return (
    <Section className={cn('phero', `phero-${v}`)} settings={{ ...settings, spacing: 'none' }}>
      {v === 'image' ? (
        <div className="phero-bg">
          <Img fill media={image} priority={isFirst} sizes="100vw" />
        </div>
      ) : null}
      <div className="wrap phero-grid">
        <div>
          {crumbs ? <Breadcrumbs items={crumbs} /> : null}
          <Title className={isFirst ? undefined : 'h1'}>
            <Highlight text={heading} />
          </Title>
          {lede ? <p className="lede">{lede}</p> : null}
          {actions ? <div className="hero-actions">{actions}</div> : null}
        </div>
        {v === 'split' ? (
          <div className="phero-img">
            <Img media={image} priority={isFirst} sizes="(max-width: 820px) 92vw, 460px" />
          </div>
        ) : null}
      </div>
    </Section>
  )
}

export const PageHeroBlock: React.FC<Props & { isFirst?: boolean; crumbs?: Crumb[] }> = ({
  variant,
  showBreadcrumbs,
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
    heading={heading}
    image={image}
    isFirst={isFirst}
    lede={lede}
    settings={settings}
    variant={variant}
  />
)
