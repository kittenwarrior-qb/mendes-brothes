import type { Block } from 'payload'

import { blockSettings, sectionHeaderFields } from '@/fields/common'

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      label: 'Questions',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { description: 'Leave empty to show all FAQs.' },
    },
    blockSettings,
  ],
}
