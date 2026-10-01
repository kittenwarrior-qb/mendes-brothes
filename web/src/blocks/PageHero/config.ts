import type { Block } from 'payload'

import { blockSettings, eyebrowField, headingField, ledeField } from '@/fields/common'
import { linkGroup } from '@/fields/linkGroup'

export const PageHero: Block = {
  slug: 'pageHero',
  interfaceName: 'PageHeroBlock',
  labels: { singular: 'Hero (inner page)', plural: 'Heroes (inner page)' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Text + photo', value: 'split' },
        { label: 'Text only', value: 'simple' },
        { label: 'Photo background', value: 'image' },
      ],
    },
    { name: 'showBreadcrumbs', type: 'checkbox', defaultValue: true },
    eyebrowField(),
    headingField({ required: true }),
    ledeField(),
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, s) => s?.variant !== 'simple' },
    },
    blockSettings,
  ],
}
