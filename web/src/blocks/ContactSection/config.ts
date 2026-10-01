import type { Block } from 'payload'

import { blockSettings, headingField, ledeField } from '@/fields/common'

export const ContactSection: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  labels: { singular: 'Contact + form', plural: 'Contact + form' },
  fields: [
    headingField(),
    ledeField(),
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: { description: 'Build or edit forms under Forms in the sidebar.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showInfoCard',
          label: 'Show contact card (from Site settings)',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'showMap',
          label: 'Show map below',
          type: 'checkbox',
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'footnote', type: 'text', defaultValue: 'We reply within one business day.' },
    blockSettings,
  ],
}
