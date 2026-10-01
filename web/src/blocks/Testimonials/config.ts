import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    ...sectionHeaderFields(),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'latest',
          admin: { width: '50%' },
          options: [
            { label: 'Latest', value: 'latest' },
            { label: 'Pick reviews', value: 'manual' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    { name: 'showRating', label: 'Show average rating', type: 'checkbox', defaultValue: true },
    blockSettings,
  ],
}
