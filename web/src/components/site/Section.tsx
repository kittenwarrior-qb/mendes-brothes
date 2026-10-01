import React from 'react'

import { cn } from '@/utilities/ui'

import { Highlight } from './Highlight'
import { SmartLink } from './SmartLink'

export type SectionSettings = {
  background?: 'default' | 'alt' | 'tint' | 'dark' | null
  spacing?: 'none' | 'sm' | 'md' | 'lg' | null
  hideOn?: 'none' | 'mobile' | 'desktop' | 'all' | null
  anchor?: string | null
}

/** Wrapper applying the shared "Section settings" of every block. */
export const Section: React.FC<{
  settings?: SectionSettings | null
  className?: string
  children: React.ReactNode
  as?: 'section' | 'div'
  labelledBy?: string
  defaultBackground?: SectionSettings['background']
}> = ({ settings, className, children, as: Tag = 'section', labelledBy, defaultBackground }) => {
  if (settings?.hideOn === 'all') return null
  const bg =
    settings?.background && settings.background !== 'default'
      ? settings.background
      : defaultBackground
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={cn(
        'sec',
        bg && bg !== 'default' && `bg-${bg}`,
        `pad-${settings?.spacing || 'md'}`,
        settings?.hideOn === 'mobile' && 'hide-mobile',
        settings?.hideOn === 'desktop' && 'hide-desktop',
        className,
      )}
      id={settings?.anchor || undefined}
    >
      {children}
    </Tag>
  )
}

export const Arrow: React.FC = () => (
  <svg
    aria-hidden="true"
    className="arrow"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

/** Small uppercase label above a heading. */
export const Eyebrow: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
  children ? <p className="eyebrow">{children}</p> : null

/** Label + heading + intro, with an optional link on the right. */
export const SectionHead: React.FC<{
  id?: string
  eyebrow?: string | null
  heading?: string | null
  lede?: string | null
  link?: { label?: string | null; url?: string | null } | null
  children?: React.ReactNode
}> = ({ id, eyebrow, heading, lede, link, children }) => {
  if (!eyebrow && !heading && !lede && !link?.label && !children) return null
  return (
    <div className="sec-head">
      <div className="sec-head-main">
        <Eyebrow>{eyebrow}</Eyebrow>
        {heading ? (
          <h2 id={id}>
            <Highlight text={heading} />
          </h2>
        ) : null}
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {link?.label && link.url ? (
        <SmartLink className="btn btn-outline" href={link.url}>
          {link.label}
          <Arrow />
        </SmartLink>
      ) : null}
      {children}
    </div>
  )
}
