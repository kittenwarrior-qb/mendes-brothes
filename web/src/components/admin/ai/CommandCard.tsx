'use client'

/* eslint-disable @next/next/no-img-element */
import { Link } from '@payloadcms/ui'
import React from 'react'

import { Icon } from '../icons'
import type { Card, CardRow } from './commandFlow'

const Swatch: React.FC<{ color?: string }> = ({ color }) =>
  color ? (
    <span aria-hidden="true" className="mb-card__swatch" style={{ background: color }} />
  ) : null

const Pics: React.FC<{ srcs: string[]; onOpen: (src: string) => void }> = ({ srcs, onOpen }) => (
  <span className="mb-card__pics">
    {srcs.map((src, i) =>
      src ? (
        <button aria-label="Enlarge photo" key={i} onClick={() => onOpen(src)} type="button">
          <img alt="" src={src} />
        </button>
      ) : (
        <span className="mb-card__gone" key={i}>
          photo
        </span>
      ),
    )}
  </span>
)

const Row: React.FC<{ row: CardRow; onOpen: (src: string) => void }> = ({ row, onOpen }) => {
  const hasBefore = row.before !== undefined || row.beforeImage
  return (
    <div className="mb-card__row">
      <span className="mb-card__label">{row.label}</span>
      <div className="mb-card__change">
        {hasBefore ? (
          <>
            <span className="mb-card__before">
              <Swatch color={row.beforeSwatch} />
              {row.beforeImage ? <Pics onOpen={onOpen} srcs={[row.beforeImage]} /> : row.before}
            </span>
            <span aria-label="becomes" className="mb-card__arrow">
              →
            </span>
          </>
        ) : null}
        <span className="mb-card__after">
          <Swatch color={row.afterSwatch} />
          {row.afterImages ? <Pics onOpen={onOpen} srcs={row.afterImages} /> : row.after}
        </span>
      </div>
    </div>
  )
}

/** The preview of a command: what changes, then Apply / Cancel, and Undo afterwards. */
export const CommandCard: React.FC<{
  card: Card
  onApply: () => void
  onCancel: () => void
  onUndo: () => void
  onOpen: (src: string) => void
}> = ({ card, onApply, onCancel, onUndo, onOpen }) => (
  <div aria-label={card.title} className={`mb-card mb-card--${card.state}`} role="group">
    <strong className="mb-card__title">
      <Icon name="commands" size={16} /> {card.title}
    </strong>
    {card.rows.map((row, i) => (
      <Row key={i} onOpen={onOpen} row={row} />
    ))}
    {card.note && (card.state === 'pending' || card.state === 'working') ? (
      <p className="mb-card__note">{card.note}</p>
    ) : null}

    {card.state === 'pending' || card.state === 'working' || card.state === 'failed' ? (
      <>
        {card.error ? (
          <p className="mb-card__error" role="alert">
            {card.error}
          </p>
        ) : null}
        <div className="mb-card__actions">
          <button
            className="mb-card__apply"
            disabled={card.state === 'working'}
            onClick={onApply}
            type="button"
          >
            {card.state === 'working'
              ? 'Applying…'
              : card.state === 'failed'
                ? 'Try again'
                : 'Apply'}
          </button>
          <button disabled={card.state === 'working'} onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </>
    ) : null}

    {card.state === 'cancelled' ? (
      <p className="mb-card__status">Cancelled — nothing changed.</p>
    ) : null}

    {card.state === 'done' && card.result ? (
      <div className="mb-card__done" role="status">
        <p>{card.result.message}</p>
        <div className="mb-card__actions">
          {card.result.link ? (
            <Link className="mb-chat__go" href={card.result.link.href}>
              {card.result.link.label} <Icon name="external" size={15} />
            </Link>
          ) : null}
          {card.result.undo ? (
            <button onClick={onUndo} type="button">
              <Icon name="undo" size={15} /> Undo
            </button>
          ) : null}
        </div>
      </div>
    ) : null}

    {card.state === 'undone' ? (
      <p className="mb-card__status">Undone — the previous value is back.</p>
    ) : null}
  </div>
)
