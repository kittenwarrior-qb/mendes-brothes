import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { seoTab } from '../fields/seo'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { siteRevalidationHooks } from '../hooks/revalidateSite'
import { generatePreviewPath } from '../utilities/generatePreviewPath'

export const SQFT_PER_ACRE = 43560

export const clientTypeOptions = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Municipal / public', value: 'municipal' },
  { label: 'Agricultural', value: 'agricultural' },
]

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    cover: true,
    services: true,
    area: true,
    acres: true,
    lotSize: true,
    lotUnit: true,
    year: true,
    summary: true,
  },
  defaultSort: '-completedAt',
  admin: {
    group: 'Website',
    hideAPIURL: true,
    useAsTitle: 'title',
    defaultColumns: ['cover', 'title', 'area', 'completedAt', '_status'],
    description:
      'Your finished jobs. They appear on the Projects page of the website, where visitors can filter them by service, lot size, town and year.',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({ slug: data?.slug, collection: 'projects', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'projects', req }),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Short scope of work — shown on the card and at the top of the project page.',
              },
            },
            {
              name: 'cover',
              label: 'Cover photo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'services',
              type: 'relationship',
              relationTo: 'services',
              hasMany: true,
              required: true,
              admin: { description: 'The first service is used as the card badge.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'area',
                  label: 'Town / service area',
                  type: 'relationship',
                  relationTo: 'service-areas',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'clientType',
                  type: 'select',
                  options: clientTypeOptions,
                  defaultValue: 'residential',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'lotSize',
                  label: 'Lot / work area size',
                  type: 'number',
                  min: 0,
                  required: true,
                  admin: { width: '33%', step: 0.1 },
                },
                {
                  name: 'lotUnit',
                  label: 'Unit',
                  type: 'select',
                  defaultValue: 'acres',
                  required: true,
                  admin: { width: '33%' },
                  options: [
                    { label: 'Acres', value: 'acres' },
                    { label: 'Square feet', value: 'sqft' },
                  ],
                },
                {
                  name: 'acres',
                  label: 'Size in acres (auto)',
                  type: 'number',
                  index: true,
                  admin: {
                    width: '33%',
                    readOnly: true,
                    description: 'Calculated on save — used by the lot-size filter.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'completedAt',
                  label: 'Completed',
                  type: 'date',
                  required: true,
                  index: true,
                  admin: {
                    width: '33%',
                    date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
                  },
                },
                {
                  name: 'year',
                  type: 'number',
                  index: true,
                  admin: {
                    width: '33%',
                    readOnly: true,
                    description: 'Auto, from completion date.',
                  },
                },
                {
                  name: 'duration',
                  type: 'text',
                  admin: { width: '33%', placeholder: 'e.g. 6 days' },
                },
              ],
            },
            {
              name: 'featured',
              type: 'checkbox',
              admin: { description: 'Show in "Featured projects" sections set to featured mode.' },
            },
          ],
        },
        {
          label: 'Photos',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Photo', plural: 'Photos' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'beforeAfter',
              label: 'Before / after slider',
              type: 'group',
              admin: { description: 'Optional. Use two photos taken from the same spot.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'before',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { width: '50%' },
                    },
                    { name: 'after', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            { name: 'body', label: 'Full write-up', type: 'richText' },
            {
              name: 'equipment',
              label: 'Equipment used',
              type: 'relationship',
              relationTo: 'equipment',
              hasMany: true,
            },
            {
              name: 'extraEquipment',
              label: 'Other equipment / crews',
              type: 'text',
              hasMany: true,
              admin: { description: 'Free-text tags, e.g. "Roofing crew".' },
            },
            {
              name: 'testimonial',
              type: 'relationship',
              relationTo: 'testimonials',
            },
            {
              name: 'locationNote',
              label: 'Location detail',
              type: 'text',
              admin: { description: 'Optional, e.g. "Off Route 9". Avoid exact client addresses.' },
            },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', hidden: true },
    },
    slugField(),
  ],
  hooks: {
    ...siteRevalidationHooks,
    beforeChange: [
      populatePublishedAt,
      ({ data }) => {
        const size = Number(data.lotSize)
        if (Number.isFinite(size)) {
          const acres = data.lotUnit === 'sqft' ? size / SQFT_PER_ACRE : size
          data.acres = Math.round(acres * 1000) / 1000
        }
        // Month-only dates can be stored as the first of the month in the editor's
        // timezone; shifting by 15 days keeps the year correct in any timezone.
        if (data.completedAt) {
          data.year = new Date(new Date(data.completedAt).getTime() + 15 * 864e5).getUTCFullYear()
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
}
