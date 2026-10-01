import type { Block } from 'payload'

import { blockSettings } from '@/fields/common'

export const Marquee: Block = {
  slug: 'marquee',
  interfaceName: 'MarqueeBlock',
  labels: { singular: 'Scrolling text strip', plural: 'Scrolling text strips' },
  fields: [
    {
      name: 'source',
      type: 'select',
      defaultValue: 'services',
      options: [
        { label: 'Service names (automatic)', value: 'services' },
        { label: 'Custom words', value: 'custom' },
      ],
    },
    {
      name: 'items',
      type: 'text',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'custom' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'brand',
          admin: { width: '50%' },
          options: [
            { label: 'Brand colour band', value: 'brand' },
            { label: 'Dark band', value: 'dark' },
            { label: 'Outline text on page background', value: 'outline' },
          ],
        },
        {
          name: 'speed',
          type: 'select',
          defaultValue: 'normal',
          admin: { width: '50%' },
          options: [
            { label: 'Slow', value: 'slow' },
            { label: 'Normal', value: 'normal' },
            { label: 'Fast', value: 'fast' },
          ],
        },
      ],
    },
    blockSettings,
  ],
}
