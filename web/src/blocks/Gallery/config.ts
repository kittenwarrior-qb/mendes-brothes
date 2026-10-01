import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Photo gallery', plural: 'Photo galleries' },
  fields: [
    ...sectionHeaderFields(),
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    blockSettings,
  ],
}
