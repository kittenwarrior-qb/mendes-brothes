import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { APIError, Plugin } from 'payload'
import { revalidateEverything } from '@/hooks/revalidateSite'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { getServerSideURL } from '@/utilities/getURL'
import { docPath } from '@/utilities/docPath'

type SeoDoc = { title?: string | null; name?: string | null; slug?: string | null }

// The site-wide suffix (Site settings → SEO) is appended by the layout's title template.
const generateTitle: GenerateTitle<SeoDoc> = ({ doc }) => doc?.title || doc?.name || ''

const generateURL: GenerateURL<SeoDoc> = ({ doc, collectionSlug }) =>
  `${getServerSideURL()}${docPath(collectionSlug, doc?.slug)}`

/** Hidden field rendered by the site's form component; bots tend to fill it. */
export const HONEYPOT_FIELD = 'company_website'

const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const submissionsByIp = new Map<string, number[]>()

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'projects', 'services'],
    overrides: {
      admin: { group: 'Settings' },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'Old path, e.g. /old-page. Visitors are sent to the new destination.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [() => revalidateEverything('redirects')],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: { group: 'Leads' },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      labels: { singular: 'Lead', plural: 'Leads' },
      admin: {
        group: 'Leads',
        defaultColumns: ['form', 'status', 'createdAt'],
        description: 'Every estimate request and contact form submission.',
      },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          index: true,
          admin: { position: 'sidebar' },
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Quoted', value: 'quoted' },
            { label: 'Won', value: 'won' },
            { label: 'Lost', value: 'lost' },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: { position: 'sidebar' },
        },
        {
          name: 'sourcePage',
          type: 'text',
          admin: { position: 'sidebar', readOnly: true },
        },
      ],
      hooks: {
        beforeChange: [
          ({ data, operation, req }) => {
            if (operation !== 'create' || req.user) return data

            const values = (data.submissionData ?? []) as { field: string; value: unknown }[]
            const trap = values.find((v) => v.field === HONEYPOT_FIELD)
            if (trap && String(trap.value ?? '').trim() !== '') {
              throw new APIError('Submission rejected.', 400)
            }
            data.submissionData = values.filter((v) => v.field !== HONEYPOT_FIELD)

            const ip =
              req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
              req.headers.get('x-real-ip') ||
              'unknown'
            const now = Date.now()
            const recent = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
            if (recent.length >= RATE_MAX) {
              throw new APIError('Too many submissions. Please call us instead.', 429)
            }
            recent.push(now)
            submissionsByIp.set(ip, recent)
            return data
          },
        ],
      },
    },
  }),
  searchPlugin({
    collections: ['posts', 'projects', 'services', 'pages'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: { group: 'Settings' },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
