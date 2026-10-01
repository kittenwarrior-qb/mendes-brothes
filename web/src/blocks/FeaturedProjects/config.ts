import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  interfaceName: 'FeaturedProjectsBlock',
  labels: { singular: 'Projects showcase', plural: 'Projects showcases' },
  fields: [
    ...sectionHeaderFields({ button: true }),
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'latest',
          admin: { width: '50%' },
          options: [
            { label: 'Latest finished', value: 'latest' },
            { label: 'Marked as featured', value: 'featured' },
            { label: 'Pick projects', value: 'manual' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'feature',
      options: [
        { label: 'First project large, others beside it', value: 'feature' },
        { label: 'Even grid', value: 'grid' },
      ],
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: { condition: (_, s) => s?.source === 'manual' },
    },
    {
      name: 'filterService',
      label: 'Only projects with this service',
      type: 'relationship',
      relationTo: 'services',
      admin: { condition: (_, s) => s?.source !== 'manual' },
    },
    blockSettings,
  ],
}
