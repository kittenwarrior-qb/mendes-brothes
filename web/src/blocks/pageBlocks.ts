import type { Block } from 'payload'

import { Archive } from './ArchiveBlock/config'
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

/** Every section an editor can add to a Page, in the order shown in the block picker. */
export const pageBlocks: Block[] = [
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
