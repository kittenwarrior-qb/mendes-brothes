import Link from 'next/link'
import React from 'react'

import { Icon, type IconName } from './icons'

export type Tile = { href: string; icon: IconName; title: string; text: string }

/** Grid of large, clickable cards — the main way to move around the admin. */
export const Tiles: React.FC<{ tiles: Tile[] }> = ({ tiles }) => (
  <div className="mb-tiles">
    {tiles.map((t) => (
      <Link className="mb-tile" href={t.href} key={t.href}>
        <span className="mb-tile__icon">
          <Icon name={t.icon} size={26} />
        </span>
        <span>
          <strong className="mb-tile__title">{t.title}</strong>
          <span className="mb-tile__text">{t.text}</span>
        </span>
      </Link>
    ))}
  </div>
)
