import type { Block } from 'payload'

import { blockSettings, eyebrowField, headingField, ledeField } from '@/fields/common'
import { linkGroup } from '@/fields/linkGroup'

export const Split: Block = {
  slug: 'split',
  interfaceName: 'SplitBlock',
  labels: { singular: 'Text + image', plural: 'Text + image' },
  fields: [
    eyebrowField(),
    headingField(),
    ledeField(),
    { name: 'body', type: 'richText' },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Image right', value: 'right' },
        { label: 'Image left', value: 'left' },
      ],
    },
    {
      name: 'stamp',
      label: 'Highlight sticker on the photo',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', admin: { width: '40%' } },
            { name: 'text', type: 'text', admin: { width: '60%' } },
          ],
        },
      ],
    },
    blockSettings,
  ],
}
