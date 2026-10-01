import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { siteRevalidationHooks } from '../hooks/revalidateSite'

export const FAQs: CollectionConfig<'faqs'> = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'order',
  admin: {
    group: 'Company',
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: siteRevalidationHooks,
}
