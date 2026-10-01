import type { Block } from 'payload'

import { Archive } from './ArchiveBlock/config'
import { blockMeta } from './blockMeta'
import { Cards } from './Cards/config'
import { Checklist } from './Checklist/config'
import { ContactSection } from './ContactSection/config'
import { Content } from './Content/config'
import { CtaBand } from './CtaBand/config'
import { EquipmentGrid } from './EquipmentGrid/config'
import { FAQBlock } from './FAQ/config'
import { FeaturedProjects } from './FeaturedProjects/config'
import { FormBlock } from './Form/config'
import { Gallery } from './Gallery/config'
import { HeroHome } from './HeroHome/config'
import { Marquee } from './Marquee/config'
import { MediaBlock } from './MediaBlock/config'
import { PageHero } from './PageHero/config'
import { ServiceAreasBlock } from './ServiceAreasBlock/config'
import { ServicesGrid } from './ServicesGrid/config'
import { Split } from './Split/config'
import { Stats } from './Stats/config'
import { Steps } from './Steps/config'
import { TestimonialsBlock } from './Testimonials/config'

const rawBlocks: Block[] = [
  HeroHome,
  PageHero,
  ServicesGrid,
  FeaturedProjects,
  Split,
  Cards,
  Steps,
  Stats,
  Marquee,
  EquipmentGrid,
  Checklist,
  TestimonialsBlock,
  FAQBlock,
  ServiceAreasBlock,
  Gallery,
  ContactSection,
  CtaBand,
  Content,
  MediaBlock,
  FormBlock,
  Archive,
]

/**
 * Every section an editor can add to a Page. Each one gets a plain-language
 * name, a group and a thumbnail for the "Add section" picker, and a header
 * that shows its heading instead of "Untitled".
 */
export const pageBlocks: Block[] = rawBlocks.map((block) => {
  const meta = blockMeta[block.slug]
  if (!meta) return block
  return {
    ...block,
    labels: { singular: meta.label, plural: meta.label },
    imageURL: `/admin-blocks/${block.slug}.jpg`,
    imageAltText: meta.hint,
    admin: {
      ...block.admin,
      group: meta.group,
      disableBlockName: true,
      components: {
        ...block.admin?.components,
        Label: '@/components/admin/BlockRowLabel#BlockRowLabel',
      },
    },
  }
})
