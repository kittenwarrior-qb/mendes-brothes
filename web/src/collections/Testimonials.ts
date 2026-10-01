import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { siteRevalidationHooks } from '../hooks/revalidateSite'

export const Testimonials: CollectionConfig<'testimonials'> = {
  slug: 'testimonials',
  labels: { singular: 'Review', plural: 'Reviews' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: '-date',
  admin: {
    group: 'Company',
    hideAPIURL: true,
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'location', 'source', 'date'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true, admin: { width: '40%' } },
        { name: 'location', type: 'text', admin: { width: '30%', placeholder: 'e.g. Lewes, DE' } },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
          required: true,
          admin: { width: '30%' },
        },
      ],
    },
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'direct',
          admin: { width: '50%' },
          options: [
            { label: 'Direct', value: 'direct' },
            { label: 'Google', value: 'google' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Angi / HomeAdvisor', value: 'angi' },
            { label: 'Yelp', value: 'yelp' },
          ],
        },
        { name: 'date', type: 'date', admin: { width: '50%' } },
      ],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: { description: 'Optional — links the review to a finished job.' },
    },
  ],
  hooks: siteRevalidationHooks,
}
