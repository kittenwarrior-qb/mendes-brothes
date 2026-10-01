'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type LightboxImage = {
  src: string
  width: number
  height: number
  alt: string
  caption?: string
}

/** Thumbnail grid + accessible <dialog> viewer with keyboard and swipe navigation. */
export const Lightbox: React.FC<{ images: LightboxImage[]; columns?: number }> = ({
  images,
  columns = 3,
}) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }
  const go = useCallback(
    (d: number) => setIndex((i) => (i + d + images.length) % images.length),
    [images.length],
  )

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [go])

  const current = images[index]

  return (
    <>
      <div className="gallery" style={{ ['--cols' as string]: columns }}>
        {images.map((img, i) => (
          <button
            aria-label={`Open photo ${i + 1}${img.alt ? `: ${img.alt}` : ''}`}
            key={img.src}
            onClick={() => open(i)}
            type="button"
          >
            <Image
              alt={img.alt}
              height={img.height}
              sizes="(max-width: 700px) 50vw, 400px"
              src={img.src}
              width={img.width}
            />
          </button>
        ))}
      </div>
      <dialog
        aria-label="Photo viewer"
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'FIGURE')
            dialog.current?.close()
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX
        }}
        ref={dialog}
      >
        {current ? (
          <figure>
            <Image
              alt={current.alt}
              height={current.height}
              sizes="100vw"
              src={current.src}
              width={current.width}
            />
            <figcaption>
              {current.caption || current.alt} · {index + 1} / {images.length}
            </figcaption>
          </figure>
        ) : null}
        <button
          aria-label="Close"
          className="lb-btn lb-close"
          onClick={() => dialog.current?.close()}
          type="button"
        >
          ✕
        </button>
        {images.length > 1 ? (
          <>
            <button
              aria-label="Previous photo"
              className="lb-btn lb-prev"
              onClick={() => go(-1)}
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Next photo"
              className="lb-btn lb-next"
              onClick={() => go(1)}
              type="button"
            >
              ›
            </button>
          </>
        ) : null}
      </dialog>
    </>
  )
}
