import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminOnly, adminOnlyField, adminOrSelf } from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      saveToJWT: true,
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
      admin: {
        position: 'sidebar',
        description:
          'Admin: everything, including theme, site settings and users. Editor: pages, projects, posts and media.',
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      // The very first account created on a fresh install is always an admin.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  timestamps: true,
}
