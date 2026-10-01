import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const Checklist: Block = {
  slug: 'checklist',
  interfaceName: 'ChecklistBlock',
  labels: { singular: 'Checklist', plural: 'Checklists' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    blockSettings,
  ],
}
