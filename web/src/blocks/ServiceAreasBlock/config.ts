import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const ServiceAreasBlock: Block = {
  slug: 'serviceAreas',
  interfaceName: 'ServiceAreasBlock',
  labels: { singular: 'Service area list', plural: 'Service area lists' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'linkToPages',
      label: 'Link each town to its page',
      type: 'checkbox',
      defaultValue: true,
    },
    blockSettings,
  ],
}
