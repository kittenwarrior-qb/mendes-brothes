import type { Block } from 'payload'

import { blockSettings, headingField, ledeField } from '@/fields/common'
import { linkGroup } from '@/fields/linkGroup'

export const HeroHome: Block = {
  slug: 'heroHome',
  interfaceName: 'HeroHomeBlock',
  labels: { singular: 'Hero (home)', plural: 'Heroes (home)' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Split: text left, photo collage right', value: 'split' },
        { label: 'Full-width photo background', value: 'fullImage' },
      ],
    },
    {
      name: 'showLogo',
      label: 'Show the wordmark logo above the heading',
      type: 'checkbox',
      defaultValue: true,
    },
    headingField({ required: true }),
    ledeField(),
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
    {
      name: 'trust',
      label: 'Trust items',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'text', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    { name: 'image', label: 'Main photo', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'thumbs',
      label: 'Small photos (split layout)',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 2,
      admin: { condition: (_, s) => s?.variant !== 'fullImage' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showBadge',
          label: 'Show round badge logo',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'showCallCard',
          label: 'Show "call us" card',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'callCardText', type: 'text', defaultValue: 'Call or text for a site visit' },
    blockSettings,
  ],
}
