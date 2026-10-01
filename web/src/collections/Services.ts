import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { iconField } from '../fields/common'
import { seoTab } from '../fields/seo'
import { siteRevalidationHooks } from '../hooks/revalidateSite'
import { generatePreviewPath } from '../utilities/generatePreviewPath'

export const Services: CollectionConfig<'services'> = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    icon: true,
    shortDescription: true,
    image: true,
  },
  defaultSort: 'order',
  admin: {
    group: 'Company',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'showInFooter', 'updatedAt'],
    description: 'The services you offer. Each one gets its own page at /services/<slug>.',
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'services', req }),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '60%' } },
        iconField(['line'], { admin: { width: '40%' }, defaultValue: 'excav' }),
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              admin: {
                description: 'One or two sentences, shown on cards and in the services grid.',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Used as the large photo tile and as the service page hero.' },
            },
            {
              name: 'body',
              label: 'Page content',
              type: 'richText',
            },
            {
              name: 'highlights',
              label: "What's included",
              type: 'array',
              labels: { singular: 'Item', plural: 'Items' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              name: 'faqs',
              label: 'FAQs for this service',
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
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
      admin: { position: 'sidebar', description: 'Lower numbers are shown first.' },
    },
    {
      name: 'showInFooter',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: siteRevalidationHooks,
}
