import type { GlobalConfig } from 'payload'

import { hiddenUnlessManager, managerOnly } from '../access/roles'

export const BackupSettings: GlobalConfig = {
  slug: 'backup-settings',
  label: 'Backup schedule',
  access: {
    read: managerOnly,
    update: managerOnly,
  },
  admin: {
    group: 'Settings',
    hidden: hiddenUnlessManager,
    hideAPIURL: true,
    description:
      'Automatic backups are stored on the server. Create, download and restore backups on the Backups screen.',
  },
  fields: [
    {
      name: 'autoEnabled',
      label: 'Back up automatically',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'frequency',
          type: 'select',
          defaultValue: 'daily',
          options: [
            { label: 'Every day', value: 'daily' },
            { label: 'Every week', value: 'weekly' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'keep',
          label: 'Automatic backups to keep',
          type: 'number',
          defaultValue: 7,
          min: 1,
          max: 60,
          admin: {
            width: '50%',
            description:
              'Older automatic backups are deleted. Manual backups are kept until you delete them.',
          },
        },
      ],
    },
  ],
}
