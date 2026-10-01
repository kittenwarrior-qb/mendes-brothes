import type { Block } from 'payload'

import { blockSettings, iconField, sectionHeaderFields } from '@/fields/common'

export const Cards: Block = {
  slug: 'cards',
  interfaceName: 'CardsBlock',
  labels: { singular: 'Feature cards', plural: 'Feature cards' },
  fields: [
    ...sectionHeaderFields({ button: true }),
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'value',
          admin: { width: '50%' },
          options: [
            { label: 'Values (top accent border)', value: 'value' },
            { label: 'Icon cards', value: 'icon' },
            { label: 'Icon + text rows (technology)', value: 'row' },
          ],
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          admin: { width: '50%' },
          options: [
            { label: '2 columns', value: '2' },
            { label: '3 columns', value: '3' },
            { label: '4 columns', value: '4' },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
            iconField(['line', 'badge'], { admin: { width: '40%' } }),
          ],
        },
        { name: 'text', type: 'textarea' },
      ],
    },
    blockSettings,
  ],
}
