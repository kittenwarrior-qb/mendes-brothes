'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { type HelpImageId, helpImages, helpImageUrl } from '@/ai/helpImages'

/** Small screenshots in a chat answer. Clicking one opens the viewer. */
export const Thumbs: React.FC<{
  ids: HelpImageId[]
  onOpen: (ids: HelpImageId[], i: number) => void
}> = ({ ids, onOpen }) =>
  ids.length ? (
    <div className="mb-chat__thumbs">
      {ids.map((id, i) => (
        <button
          aria-label={`Enlarge screenshot: ${helpImages[id]}`}
          key={id}
          onClick={() => onOpen(ids, i)}
          type="button"
        >
          <img alt="" loading="lazy" src={helpImageUrl(id)} />
          <span>{helpImages[id]}</span>
        </button>
      ))}
    </div>
  ) : null

export type ViewerItem = { src: string; caption: string }

/** Guide screenshots as viewer items. */
export const helpItems = (ids: HelpImageId[]): ViewerItem[] =>
  ids.map((id) => ({ src: helpImageUrl(id), caption: helpImages[id] }))

/** Full-screen view of a picture; arrows or ← → move between the pictures of that answer. */
export const ImageViewer: React.FC<{
  items: ViewerItem[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}> = ({ items, index, onIndex, onClose }) => {
  const item = items[index]
  const many = items.length > 1
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (many && e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (many && e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, items.length, many, onClose, onIndex])

  return createPortal(
    <div
      aria-label={item.caption}
      aria-modal="true"
      className="mb-viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
    >
      <figure>
        <img alt={item.caption} onClick={onClose} src={item.src} />
        <figcaption>
          {item.caption}
          {many ? <span>{` · ${index + 1} / ${items.length}`}</span> : null}
        </figcaption>
      </figure>
      {many ? (
        <>
          <button
            aria-label="Previous picture"
            className="mb-viewer__nav mb-viewer__prev"
            onClick={() => onIndex((index - 1 + items.length) % items.length)}
            type="button"
          >
            ‹
          </button>
          <button
            aria-label="Next picture"
            className="mb-viewer__nav mb-viewer__next"
            onClick={() => onIndex((index + 1) % items.length)}
            type="button"
          >
            ›
          </button>
        </>
      ) : null}
      <button aria-label="Close" className="mb-viewer__close" onClick={onClose} type="button">
        ✕
      </button>
    </div>,
    document.body,
  )
}
