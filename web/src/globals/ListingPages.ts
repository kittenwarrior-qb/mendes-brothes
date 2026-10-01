import type { Field, GlobalConfig } from 'payload'

import { HIGHLIGHT_HINT } from '../fields/common'
import { revalidateGlobal } from '../hooks/revalidateSite'

const heroFields = (defaults: { heading: string; lede: string }): Field[] => [
  {
    name: 'heading',
    type: 'text',
    defaultValue: defaults.heading,
    admin: { description: HIGHLIGHT_HINT },
  },
  { name: 'lede', label: 'Intro text', type: 'textarea', defaultValue: defaults.lede },
  { name: 'image', type: 'upload', relationTo: 'media' },
]

export const ListingPages: GlobalConfig = {
  slug: 'listing-pages',
  label: 'Listing pages',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
    description: 'Headings and options for the automatic pages: /projects, /services and /posts.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'projects',
          label: 'Projects page',
          fields: [
            ...heroFields({
              heading: 'Finished *projects*',
              lede: 'Find work similar to yours. Filter by service, lot size or town.',
            }),
            {
              name: 'perPage',
              label: 'Projects per page',
              type: 'number',
              defaultValue: 12,
              min: 3,
              max: 48,
            },
            {
              name: 'filters',
              label: 'Visible filters',
              type: 'select',
              hasMany: true,
              defaultValue: ['q', 'service', 'area', 'size', 'year', 'type', 'sort'],
              options: [
                { label: 'Keyword search', value: 'q' },
                { label: 'Service', value: 'service' },
                { label: 'Town', value: 'area' },
                { label: 'Lot size', value: 'size' },
                { label: 'Year', value: 'year' },
                { label: 'Client type', value: 'type' },
                { label: 'Sort', value: 'sort' },
              ],
            },
            {
              name: 'sizeBuckets',
              label: 'Lot size filter ranges (acres)',
              type: 'array',
              admin: {
                description:
                  'Leave "max" empty for the last open-ended range. 1 acre = 43,560 sq ft.',
              },
              defaultValue: [
                { label: 'Under ½ acre', min: 0, max: 0.5 },
                { label: '½ to 2 acres', min: 0.5, max: 2 },
                { label: '2 to 5 acres', min: 2, max: 5 },
                { label: 'Over 5 acres', min: 5 },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'min',
                      type: 'number',
                      min: 0,
                      defaultValue: 0,
                      admin: { width: '25%' },
                    },
                    { name: 'max', type: 'number', min: 0, admin: { width: '25%' } },
                  ],
                },
              ],
            },
            {
              name: 'detailCtaLabel',
              label: 'Project page button',
              type: 'text',
              defaultValue: 'Get an estimate for a similar job',
            },
          ],
        },
        {
          name: 'services',
          label: 'Services page',
          fields: heroFields({
            heading: 'Our *services*',
            lede: 'Hire us for one service or the whole job, from raw land to finished site.',
          }),
        },
        {
          name: 'posts',
          label: 'News page',
          fields: heroFields({
            heading: 'News & *tips*',
            lede: 'Project updates and practical advice for property owners.',
          }),
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal],
  },
}
