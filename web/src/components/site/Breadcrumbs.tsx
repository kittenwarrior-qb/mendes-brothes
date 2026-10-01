import Link from 'next/link'
import React from 'react'

import { breadcrumbSchema, JsonLd } from './JsonLd'

export type Crumb = { name: string; path: string }

/** Visible breadcrumb trail + matching BreadcrumbList structured data. */
export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  if (items.length < 2) return null
  return (
    <nav aria-label="Breadcrumb" className="crumb">
      <ol>
        {items.map((c, i) => (
          <li key={c.path}>
            {i < items.length - 1 ? (
              <Link href={c.path}>{c.name}</Link>
            ) : (
              <span aria-current="page">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbSchema(items)} />
    </nav>
  )
}
