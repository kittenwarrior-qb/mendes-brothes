import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { hiddenUnlessManager, managerOnly } from '@/access/roles'
import { revalidateGlobal } from '@/hooks/revalidateSite'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Menu',
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
      name: 'navItems',
      label: 'Menu',
      type: 'array',
      fields: [
        link({ appearances: false }),
        {
          name: 'children',
          label: 'Dropdown items (optional)',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [link({ appearances: false })],
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showPhone',
          label: 'Show phone button',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '33%' },
        },
        {
          name: 'ctaLabel',
          label: 'Extra button label',
          type: 'text',
          admin: { width: '33%', description: 'Optional, e.g. "Free estimate".' },
        },
        { name: 'ctaUrl', label: 'Extra button link', type: 'text', admin: { width: '33%' } },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
