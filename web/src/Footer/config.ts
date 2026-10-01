import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { hiddenUnlessManager, managerOnly } from '@/access/roles'
import { revalidateGlobal } from '@/hooks/revalidateSite'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
    update: managerOnly,
  },
  admin: {
    group: 'Settings',
    hidden: hiddenUnlessManager,
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'columns',
      label: 'Link columns',
      type: 'array',
      maxRows: 3,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'navItems',
          label: 'Links',
          type: 'array',
          fields: [link({ appearances: false })],
          admin: {
            initCollapsed: true,
            components: { RowLabel: '@/Footer/RowLabel#RowLabel' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showServices',
          label: 'Show services column',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%' },
        },
        {
          name: 'servicesTitle',
          type: 'text',
          defaultValue: 'Services',
          admin: { width: '33%' },
        },
        {
          name: 'showContact',
          label: 'Show contact column',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'bottomText',
      label: 'Bottom-right text',
      type: 'text',
      admin: {
        description: 'e.g. "Lewes, Delaware". The copyright line is generated automatically.',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [link({ appearances: false })],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
