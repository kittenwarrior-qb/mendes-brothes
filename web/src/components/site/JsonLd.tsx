import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { asMedia } from '@/utilities/site'

/** Safe JSON-LD <script>: escapes "<" so content can never break out of the tag. */
export const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => (
  <script
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    type="application/ld+json"
  />
)

export const absoluteUrl = (path?: string | null) => {
  if (!path) return undefined
  return /^https?:\/\//.test(path)
    ? path
    : `${getServerSideURL()}${path.startsWith('/') ? '' : '/'}${path}`
}

export const businessSchema = (s: SiteSetting, areas: string[] = []) => {
  const logo = asMedia(s.logoMark) || asMedia(s.logo)
  const a = s.address
  return {
    '@context': 'https://schema.org',
    '@type': s.businessType || 'GeneralContractor',
    '@id': `${getServerSideURL()}/#business`,
    name: s.companyName,
    description: s.description || undefined,
    url: getServerSideURL(),
    telephone: s.phone || undefined,
    email: s.email || undefined,
    logo: logo?.url ? absoluteUrl(getMediaUrl(logo.url)) : undefined,
    image: logo?.url ? absoluteUrl(getMediaUrl(logo.url)) : undefined,
    address: a?.street
      ? {
          '@type': 'PostalAddress',
          streetAddress: a.street,
          addressLocality: a.city || undefined,
          addressRegion: a.state || undefined,
          postalCode: a.zip || undefined,
          addressCountry: 'US',
        }
      : undefined,
    areaServed: areas.length ? areas.map((name) => ({ '@type': 'City', name })) : undefined,
    sameAs: s.socials?.map((x) => x.url).filter(Boolean),
  }
}

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
})
