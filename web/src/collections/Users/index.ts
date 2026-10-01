import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import {
  hiddenUnlessManager,
  isAdminUser,
  managerOnly,
  managerOnlyField,
  managerOrSelf,
} from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'User', plural: 'Users' },
  access: {
    admin: authenticated,
    create: managerOnly,
    delete: managerOnly,
    read: managerOrSelf,
    update: managerOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
    useAsTitle: 'name',
    hidden: hiddenUnlessManager,
    hideAPIURL: true,
    description: 'People who can log in here. Give staff the "Editor" role.',
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
        create: managerOnlyField,
        update: managerOnlyField,
      },
      admin: {
        position: 'sidebar',
        description:
          'Editor: pages, projects, news, photos and quote requests. Manager: also company info, colours, menu, users and backups. Admin: everything, including technical settings.',
      },
      options: [
        { label: 'Editor (staff)', value: 'editor' },
        { label: 'Manager (owner)', value: 'manager' },
        { label: 'Admin (developer)', value: 'admin' },
      ],
      // only a developer can hand out or take away the developer role
      validate: ((
        value: unknown,
        { req, previousValue }: { req: { user: unknown }; previousValue?: unknown },
      ) => {
        const { user } = req
        const before = previousValue
        if (!user || isAdminUser(user)) return true
        if (value === 'admin' && before !== 'admin')
          return 'Only an admin can create another admin.'
        if (before === 'admin' && value !== 'admin') return 'Only an admin can change an admin.'
        return true
      }) as never,
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
