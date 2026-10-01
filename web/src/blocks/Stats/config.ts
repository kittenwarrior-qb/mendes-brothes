import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Numbers / stats', plural: 'Numbers / stats' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '40%', placeholder: '500+' },
            },
            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    blockSettings,
  ],
}
