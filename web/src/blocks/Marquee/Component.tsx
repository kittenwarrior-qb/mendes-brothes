import React from 'react'

import type { MarqueeBlock as Props } from '@/payload-types'

import { getAllServices } from '@/blocks/ServicesGrid/Component'
import { Section } from '@/components/site/Section'
import { cn } from '@/utilities/ui'

/**
 * Infinite scrolling text strip (CSS animation only). Decorative: the same
 * words exist elsewhere on the page, so it is hidden from screen readers.
 */
export const MarqueeBlock: React.FC<Props> = async ({ source, items, style, speed, settings }) => {
  const words =
    source === 'custom'
      ? (items ?? []).filter(Boolean)
      : (await getAllServices()).map((s) => s.title)
  if (!words.length) return null

  const run = (hidden?: boolean) => (
    <div aria-hidden={hidden} className="marquee-run">
      {words.map((w, i) => (
        <span key={i}>{w}</span>
      ))}
    </div>
  )

  return (
    <Section
      as="div"
      className={cn('marquee', `marquee-${style || 'brand'}`, `marquee-${speed || 'normal'}`)}
      settings={{ ...settings, spacing: 'none' }}
    >
      <div aria-hidden="true" className="marquee-track">
        {run()}
        {run(true)}
      </div>
    </Section>
  )
}
