import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Img } from './Img'

export type PostCardData = Pick<
  Post,
  'slug' | 'title' | 'meta' | 'heroImage' | 'publishedAt' | 'categories'
>

/** Card for news posts and search results (re-uses the project card styling). */
export const PostCard: React.FC<{ doc: Partial<PostCardData>; href?: string; badge?: string }> = ({
  doc,
  href,
  badge,
}) => {
  const image = doc.meta?.image || doc.heroImage
  const category = Array.isArray(doc.categories)
    ? doc.categories.find((c) => typeof c === 'object' && c && 'title' in c)
    : undefined
  const badgeText = badge || (category && typeof category === 'object' ? category.title : undefined)
  return (
    <Link className="pcard reveal" href={href || `/posts/${doc.slug}`}>
      <div className="pthumb">
        {image ? <Img fill media={image} sizes="(max-width: 640px) 100vw, 400px" /> : null}
        {badgeText ? <span className="pbadge">{badgeText}</span> : null}
      </div>
      <div className="pbody">
        <h3>{doc.title}</h3>
        {doc.publishedAt ? (
          <div className="pmeta">
            <span>
              {new Date(doc.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        ) : null}
        {doc.meta?.description ? (
          <p style={{ margin: 0, color: 'var(--c-muted)', fontSize: '.92rem' }}>
            {doc.meta.description}
          </p>
        ) : null}
      </div>
    </Link>
  )
}
