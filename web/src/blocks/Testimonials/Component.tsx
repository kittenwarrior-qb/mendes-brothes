import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Testimonial, TestimonialsBlock as Props } from '@/payload-types'

import { Section, SectionHead } from '@/components/site/Section'
import { asDocs } from '@/utilities/site'

export const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  const r = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <div aria-label={`${r} out of 5 stars`} className="stars" role="img">
      {'★'.repeat(r)}
      {'☆'.repeat(5 - r)}
    </div>
  )
}

export const ReviewCard: React.FC<{ t: Testimonial }> = ({ t }) => (
  <figure className="review reveal">
    <Stars rating={t.rating} />
    <blockquote>
      <p>{t.quote}</p>
    </blockquote>
    <figcaption>
      <span aria-hidden="true" className="av">
        {t.author.trim().charAt(0).toUpperCase()}
      </span>
      <span>
        {t.author}
        {t.location ? <small>{t.location}</small> : null}
      </span>
    </figcaption>
  </figure>
)

export const TestimonialsBlockComponent: React.FC<Props & { id?: string }> = async (props) => {
  const { eyebrow, heading, lede, source, limit, showRating, settings, id } = props
  const payload = await getPayload({ config: configPromise })

  const items =
    source === 'manual'
      ? asDocs<Testimonial>(props.items)
      : (
          await payload.find({
            collection: 'testimonials',
            sort: '-date',
            limit: limit || 3,
            depth: 0,
          })
        ).docs
  if (!items.length) return null

  let summary: React.ReactNode = null
  if (showRating) {
    const all = await payload.find({
      collection: 'testimonials',
      limit: 500,
      depth: 0,
      pagination: false,
      select: { rating: true },
    })
    const avg = all.docs.reduce((s, d) => s + (d.rating || 0), 0) / (all.docs.length || 1)
    summary = (
      <p className="rating-sum">
        ★ {avg.toFixed(1)} average from {all.docs.length} review{all.docs.length === 1 ? '' : 's'}
      </p>
    )
  }

  const titleId = `reviews-${id ?? 'x'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} heading={heading} id={titleId} lede={lede}>
          {summary}
        </SectionHead>
        <div className="reviews">
          {items.map((t) => (
            <ReviewCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </Section>
  )
}
