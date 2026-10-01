import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { iconField } from '../fields/common'
import { siteRevalidationHooks } from '../hooks/revalidateSite'

export const equipmentCategories = [
  { label: 'Excavators', value: 'excavator' },
  { label: 'Forestry mulchers', value: 'mulcher' },
  { label: 'Track & skid steer loaders', value: 'loader' },
  { label: 'Dozers', value: 'dozer' },
  { label: 'Wheel loaders', value: 'wheel-loader' },
  { label: 'Trucks & trailers', value: 'truck' },
  { label: 'Compaction & tools', value: 'tools' },
  { label: 'Other', value: 'other' },
]

export const Equipment: CollectionConfig<'equipment'> = {
  slug: 'equipment',
  labels: { singular: 'Equipment', plural: 'Equipment' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: { name: true, category: true },
  defaultSort: 'order',
  admin: {
    group: 'Company',
    hideAPIURL: true,
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'quantity', 'order'],
    description: 'Machines in your fleet, shown on the Capabilities page.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'category',
          type: 'select',
          options: equipmentCategories,
          required: true,
          admin: { width: '25%' },
        },
        iconField(['fleet'], { admin: { width: '25%' }, defaultValue: 'fleetExcavator' }),
      ],
    },
    {
      name: 'spec',
      label: 'Headline spec',
      type: 'text',
      admin: { placeholder: 'e.g. Mini to mid-size, 3–25 ton class' },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'image',
      label: 'Photo (optional)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'If set, the photo replaces the drawn icon.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'brand', type: 'text', admin: { width: '33%' } },
        { name: 'model', type: 'text', admin: { width: '33%' } },
        { name: 'quantity', type: 'number', min: 0, admin: { width: '33%' } },
      ],
    },
    {
      name: 'specs',
      label: 'Specifications',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers are shown first.' },
    },
  ],
  hooks: siteRevalidationHooks,
}
