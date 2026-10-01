import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: { singular: 'Services grid', plural: 'Services grids' },
  fields: [
    ...sectionHeaderFields({ button: true }),
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'bento',
      options: [
        { label: 'Bento: photo tiles + small tiles', value: 'bento' },
        { label: 'Cards with icon', value: 'cards' },
        { label: 'Compact list (2 columns)', value: 'list' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All services (in their order)', value: 'all' },
        { label: 'Pick services', value: 'manual' },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'photoTiles',
      label: 'Services shown as large photo tiles (bento)',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      maxRows: 3,
      admin: {
        condition: (_, s) => s?.variant === 'bento',
        description: 'These use the service photo. Up to 3.',
      },
    },
    {
      name: 'linkTo',
      label: 'Tiles link to',
      type: 'select',
      defaultValue: 'service',
      options: [
        { label: 'Service page', value: 'service' },
        { label: 'Projects filtered by that service', value: 'projects' },
      ],
    },
    blockSettings,
  ],
}
