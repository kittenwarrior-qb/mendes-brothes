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

/** Full-screen view of a screenshot; arrows or ← → move between the pictures of that answer. */
export const ImageViewer: React.FC<{
  ids: HelpImageId[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}> = ({ ids, index, onIndex, onClose }) => {
  const id = ids[index]
  const many = ids.length > 1
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (many && e.key === 'ArrowRight') onIndex((index + 1) % ids.length)
      if (many && e.key === 'ArrowLeft') onIndex((index - 1 + ids.length) % ids.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, ids.length, many, onClose, onIndex])

  return createPortal(
    <div
      aria-label={helpImages[id]}
      aria-modal="true"
      className="mb-viewer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
    >
      <figure>
        <img alt={helpImages[id]} onClick={onClose} src={helpImageUrl(id)} />
        <figcaption>
          {helpImages[id]}
          {many ? <span>{` · ${index + 1} / ${ids.length}`}</span> : null}
        </figcaption>
      </figure>
      {many ? (
        <>
          <button
            aria-label="Previous screenshot"
            className="mb-viewer__nav mb-viewer__prev"
            onClick={() => onIndex((index - 1 + ids.length) % ids.length)}
            type="button"
          >
            ‹
          </button>
          <button
            aria-label="Next screenshot"
            className="mb-viewer__nav mb-viewer__next"
            onClick={() => onIndex((index + 1) % ids.length)}
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
