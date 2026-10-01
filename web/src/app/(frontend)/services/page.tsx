import type { Metadata } from 'next'

import React from 'react'

import { PageHeroView } from '@/blocks/PageHero/Component'
import { ServicesGridBlock } from '@/blocks/ServicesGrid/Component'
import { plainText } from '@/components/site/Highlight'
import { SiteCtaBand } from '@/components/site/SiteCtaBand'
import { generateMeta } from '@/utilities/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'

export default async function ServicesPage() {
  const listing = await getGlobal('listing-pages', 1)
  const cfg = listing.services
  return (
    <>
      <PageHeroView
        eyebrow={cfg?.eyebrow}
        crumbs={[
          { name: 'Home', path: '/' },
          { name: plainText(cfg?.heading) || 'Services', path: '/services' },
        ]}
        heading={cfg?.heading || 'Our *services*'}
        image={cfg?.image}
        lede={cfg?.lede}
      />
      <ServicesGridBlock blockType="servicesGrid" linkTo="service" source="all" variant="list" />
      <SiteCtaBand />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const listing = await getGlobal('listing-pages', 1)
  return generateMeta({
    doc: null,
    title: plainText(listing.services?.heading) || 'Services',
    description: listing.services?.lede,
    fallbackImage: listing.services?.image,
    path: '/services',
  })
}
