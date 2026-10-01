import type { Block } from 'payload'

import { blockSettings, eyebrowField, headingField, ledeField } from '@/fields/common'

export const CtaBand: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlock',
  labels: { singular: 'Call-to-action band', plural: 'Call-to-action bands' },
  fields: [
    eyebrowField(),
    headingField({ required: true }),
    ledeField(),
    {
      type: 'row',
      fields: [
        { name: 'showPhone', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
        { name: 'buttonLabel', type: 'text', admin: { width: '33%' } },
        { name: 'buttonUrl', type: 'text', admin: { width: '33%' } },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        { label: 'Brand gradient card', value: 'gradient' },
        { label: 'Dark band', value: 'dark' },
        { label: 'Photo background', value: 'image' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, s) => s?.style === 'image' },
    },
    blockSettings,
  ],
}
