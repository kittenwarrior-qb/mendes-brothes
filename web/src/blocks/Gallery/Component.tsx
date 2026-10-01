import React from 'react'

import type { GalleryBlock as Props } from '@/payload-types'

import { Lightbox, type LightboxImage } from '@/components/site/Lightbox'
import { Section, SectionHead } from '@/components/site/Section'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia } from '@/utilities/site'

export const toLightboxImages = (
  items: { media: unknown; caption?: string | null }[],
): LightboxImage[] =>
  items
    .map(({ media, caption }) => {
      const m = asMedia(media)
      if (!m?.url) return null
      return {
        src: getMediaUrl(m.url, m.updatedAt),
        width: m.width ?? 1600,
        height: m.height ?? 1000,
        alt: m.alt ?? '',
        caption: caption ?? undefined,
      }
    })
    .filter(Boolean) as LightboxImage[]

export const GalleryBlockComponent: React.FC<Props & { id?: string }> = ({
  eyebrow,
  heading,
  lede,
  images,
  columns,
  settings,
  id,
}) => {
  const list = toLightboxImages((Array.isArray(images) ? images : []).map((media) => ({ media })))
  if (!list.length) return null
  const titleId = `gallery-${id ?? 'x'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} heading={heading} id={titleId} lede={lede} />
        <Lightbox columns={Number(columns) || 3} images={list} />
      </div>
    </Section>
  )
}
