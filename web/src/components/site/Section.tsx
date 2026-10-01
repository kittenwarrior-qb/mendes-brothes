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

/** "Heading + intro" row with an optional button on the right (Mẫu 1 `.sec-head`). */
export const SectionHead: React.FC<{
  id?: string
  heading?: string | null
  lede?: string | null
  link?: { label?: string | null; url?: string | null } | null
  children?: React.ReactNode
}> = ({ id, heading, lede, link, children }) => {
  if (!heading && !lede && !link?.label && !children) return null
  return (
    <div className="sec-head">
      <div>
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
        </SmartLink>
      ) : null}
      {children}
    </div>
  )
}
