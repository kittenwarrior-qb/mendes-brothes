import React from 'react'

import type { Page } from '@/payload-types'
import type { Crumb } from '@/components/site/Breadcrumbs'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CardsBlock } from '@/blocks/Cards/Component'
import { ChecklistBlock } from '@/blocks/Checklist/Component'
import { ContactSectionBlock } from '@/blocks/ContactSection/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaBandBlockComponent } from '@/blocks/CtaBand/Component'
import { EquipmentGridBlock } from '@/blocks/EquipmentGrid/Component'
import { FAQBlockComponent } from '@/blocks/FAQ/Component'
import { FeaturedProjectsBlock } from '@/blocks/FeaturedProjects/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GalleryBlockComponent } from '@/blocks/Gallery/Component'
import { HeroHomeBlock } from '@/blocks/HeroHome/Component'
import { MarqueeBlock } from '@/blocks/Marquee/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PageHeroBlock } from '@/blocks/PageHero/Component'
import { ServiceAreasBlockComponent } from '@/blocks/ServiceAreasBlock/Component'
import { ServicesGridBlock } from '@/blocks/ServicesGrid/Component'
import { SplitBlock } from '@/blocks/Split/Component'
import { StatsBlockComponent } from '@/blocks/Stats/Component'
import { StepsBlock } from '@/blocks/Steps/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'

type AnyBlock = Page['layout'][number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<AnyBlock['blockType'], React.FC<any>> = {
  heroHome: HeroHomeBlock,
  pageHero: PageHeroBlock,
  servicesGrid: ServicesGridBlock,
  featuredProjects: FeaturedProjectsBlock,
  split: SplitBlock,
  cards: CardsBlock,
  steps: StepsBlock,
  stats: StatsBlockComponent,
  marquee: MarqueeBlock,
  equipmentGrid: EquipmentGridBlock,
  checklist: ChecklistBlock,
  testimonials: TestimonialsBlockComponent,
  faq: FAQBlockComponent,
  serviceAreas: ServiceAreasBlockComponent,
  gallery: GalleryBlockComponent,
  contactSection: ContactSectionBlock,
  ctaBand: CtaBandBlockComponent,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  formBlock: FormBlock,
  archive: ArchiveBlock,
}

export const RenderBlocks: React.FC<{ blocks?: AnyBlock[] | null; crumbs?: Crumb[] }> = ({
  blocks,
  crumbs,
}) => {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, index) => {
        const Block = blockComponents[block.blockType]
        if (!Block) return null
        // Only the first section renders the page <h1>.
        return <Block key={block.id ?? index} {...block} crumbs={crumbs} isFirst={index === 0} />
      })}
    </>
  )
}
