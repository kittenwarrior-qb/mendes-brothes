import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Faq, FAQBlock as Props } from '@/payload-types'

import { JsonLd } from '@/components/site/JsonLd'
import { Section, SectionHead } from '@/components/site/Section'
import { asDocs } from '@/utilities/site'

export const FaqList: React.FC<{ items: Faq[] }> = ({ items }) => (
  <div className="faq">
    {items.map((f) => (
      <details key={f.id}>
        <summary>{f.question}</summary>
        <p>{f.answer}</p>
      </details>
    ))}
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }}
    />
  </div>
)

export const FAQBlockComponent: React.FC<Props & { id?: string }> = async (props) => {
  const { eyebrow, heading, lede, settings, id } = props
  let items = asDocs<Faq>(props.items)
  if (!items.length) {
    const payload = await getPayload({ config: configPromise })
    items = (
      await payload.find({
        collection: 'faqs',
        sort: 'order',
        limit: 50,
        depth: 0,
        pagination: false,
      })
    ).docs
  }
  if (!items.length) return null
  const titleId = `faq-${id ?? 'x'}`
  return (
    <Section labelledBy={heading ? titleId : undefined} settings={settings}>
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} heading={heading} id={titleId} lede={lede} />
        <FaqList items={items} />
      </div>
    </Section>
  )
}
