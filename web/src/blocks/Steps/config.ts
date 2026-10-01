import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const Steps: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  labels: { singular: 'Process steps', plural: 'Process steps' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
      ],
    },
    blockSettings,
  ],
}
