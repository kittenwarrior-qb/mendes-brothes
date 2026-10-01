import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { seoTab } from '../fields/seo'
import { siteRevalidationHooks } from '../hooks/revalidateSite'

export const ServiceAreas: CollectionConfig<'service-areas'> = {
  slug: 'service-areas',
  labels: { singular: 'Town', plural: 'Towns we serve' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: { name: true, slug: true, state: true },
  defaultSort: 'order',
  admin: {
    group: 'Company',
    hideAPIURL: true,
    useAsTitle: 'name',
    defaultColumns: ['name', 'county', 'state', 'order'],
    description:
      'Towns you work in. Used by the project filter and local landing pages (/areas/<slug>).',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Town', type: 'text', required: true, admin: { width: '40%' } },
        { name: 'county', type: 'text', admin: { width: '40%' } },
        { name: 'state', type: 'text', defaultValue: 'DE', admin: { width: '20%' } },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Shown on the town page. A few sentences about the work you do there.',
              },
            },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
    {
      name: 'hasPage',
      label: 'Publish a page for this town',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    slugField({ useAsSlug: 'name' }),
  ],
  hooks: siteRevalidationHooks,
}
