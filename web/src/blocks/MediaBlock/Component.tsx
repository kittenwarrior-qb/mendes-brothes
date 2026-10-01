import type { StaticImageData } from 'next/image'

import React from 'react'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Img } from '@/components/site/Img'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia } from '@/utilities/site'
import { cn } from '@/utilities/ui'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

/** Single image or video. Used as a page section and inside rich text. */
export const MediaBlock: React.FC<Props> = ({ media, caption, className, enableGutter = true }) => {
  const m = asMedia(media)
  if (!m?.url) return null
  const isVideo = m.mimeType?.startsWith('video/')
  return (
    <figure className={cn(enableGutter && 'wrap', className)} style={{ margin: '32px auto' }}>
      {isVideo ? (
        <video
          controls
          preload="metadata"
          src={getMediaUrl(m.url)}
          style={{ width: '100%', borderRadius: 'var(--r-lg)' }}
        />
      ) : (
        <Img
          media={m}
          sizes="(max-width: 1240px) 100vw, 1200px"
          style={{ borderRadius: 'var(--r-lg)', width: '100%', height: 'auto' }}
        />
      )}
      {caption ? (
        <figcaption style={{ marginTop: 10, color: 'var(--c-muted)', fontSize: '.9rem' }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
