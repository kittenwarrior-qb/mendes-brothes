import NextImage from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia } from '@/utilities/site'

type Props = {
  media: unknown
  alt?: string
  className?: string
  /** `sizes` attribute — describe the rendered width so the browser picks the right file. */
  sizes?: string
  priority?: boolean
  /** Fill the parent box (parent must be positioned and sized). */
  fill?: boolean
  style?: React.CSSProperties
}

const svgOrGif = (m: Media) =>
  /\.(svg|gif)$/i.test(m.filename || '') || m.mimeType === 'image/svg+xml'

/** next/image for Payload media: responsive srcset, lazy loading, focal-point aware cropping. */
export const Img: React.FC<Props> = ({
  media,
  alt,
  className,
  sizes = '100vw',
  priority,
  fill,
  style,
}) => {
  const m = asMedia(media)
  if (!m?.url) return null

  const src = getMediaUrl(m.url, m.updatedAt)
  const objectPosition =
    typeof m.focalX === 'number' && typeof m.focalY === 'number'
      ? `${m.focalX}% ${m.focalY}%`
      : undefined

  return (
    <NextImage
      alt={alt ?? m.alt ?? ''}
      className={className}
      src={src}
      sizes={sizes}
      priority={priority}
      unoptimized={svgOrGif(m)}
      {...(fill ? { fill: true } : { width: m.width ?? 1200, height: m.height ?? 800 })}
      style={{ objectPosition, ...style }}
    />
  )
}
