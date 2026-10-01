import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { APIError, type CollectionBeforeChangeHook, type Config, type Field, Plugin } from 'payload'
import { authenticated } from '@/access/authenticated'
import { hiddenUnlessAdmin } from '@/access/roles'
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

type Answer = { field: string; value: unknown }

/** Copies the key answers (name, phone, email, service, message) into top-level fields. */
const summariseSubmission: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const answers = (data.submissionData ?? []) as Answer[]
  const pick = (re: RegExp) => {
    const hit = answers.find((a) => re.test(a.field) && String(a.value ?? '').trim() !== '')
    return hit ? String(hit.value).trim() : undefined
  }
  data.contactName = pick(/name/i)
  data.contactPhone = pick(/phone|tel|mobile/i)
  data.contactEmail = pick(/mail/i)
  data.details = pick(/message|detail|comment|note/i)

  // show the option's label ("Driveways / Parking Areas"), not its stored value
  const service = answers.find((a) => /service/i.test(a.field))
  if (service?.value) {
    let label = String(service.value)
    try {
      const formId = typeof data.form === 'object' ? data.form?.id : data.form
      const form = await req.payload.findByID({ collection: 'forms', id: formId, depth: 0, req })
      for (const f of form.fields ?? []) {
        if (f.blockType === 'select' && f.name === service.field) {
          label = f.options?.find((o) => o.value === service.value)?.label ?? label
        }
      }
    } catch {
      // keep the raw value
    }
    data.serviceWanted = label
  }
  return data
}

/** Hidden field rendered by the site's form component; bots tend to fill it. */
export const HONEYPOT_FIELD = 'company_website'

const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const submissionsByIp = new Map<string, number[]>()

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'projects', 'services'],
    overrides: {
      admin: { group: 'Advanced', hidden: hiddenUnlessAdmin, hideAPIURL: true },
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
      admin: { group: 'Advanced', hidden: hiddenUnlessAdmin, hideAPIURL: true },
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
      labels: { singular: 'Quote request', plural: 'Quote requests' },
      // The plugin locks submissions after they are sent. Staff must be able to set the
      // status and add notes, so updates are allowed — the customer's answers stay read-only.
      access: { update: authenticated },
      admin: {
        group: 'Customers',
        useAsTitle: 'contactName',
        defaultColumns: ['contactName', 'contactPhone', 'serviceWanted', 'status', 'createdAt'],
        listSearchableFields: ['contactName', 'contactPhone', 'contactEmail', 'serviceWanted'],
        hideAPIURL: true,
        description:
          'Everyone who sent the estimate form. Open one to see the details, then set its status as you follow up.',
        components: {
          beforeListTable: ['@/components/admin/LeadsExport#LeadsExport'],
        },
      },
      fields: ({ defaultFields }) => [
        // Summary filled in automatically from the answers, so the list is readable at a glance.
        {
          type: 'row',
          fields: [
            {
              name: 'contactName',
              label: 'Name',
              type: 'text',
              admin: { readOnly: true, width: '34%' },
            },
            {
              name: 'contactPhone',
              label: 'Phone',
              type: 'text',
              admin: { readOnly: true, width: '33%' },
            },
            {
              name: 'contactEmail',
              label: 'Email',
              type: 'text',
              admin: { readOnly: true, width: '33%' },
            },
          ],
        },
        { name: 'serviceWanted', label: 'Service wanted', type: 'text', admin: { readOnly: true } },
        { name: 'details', label: 'Message', type: 'textarea', admin: { readOnly: true } },
        ...defaultFields.map(
          (field) =>
            ({
              ...field,
              ...('name' in field && field.name === 'submissionData'
                ? { label: 'All answers' }
                : {}),
              admin: { ...field.admin, readOnly: true },
            }) as Field,
        ),
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          index: true,
          admin: { position: 'sidebar', description: 'Update this as you follow up.' },
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
          label: 'Your notes',
          type: 'textarea',
          admin: { position: 'sidebar' },
        },
        {
          name: 'sourcePage',
          label: 'Sent from page',
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
          summariseSubmission,
        ],
      },
    },
  }),
  searchPlugin({
    collections: ['posts', 'projects', 'services', 'pages'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: { group: 'Advanced', hidden: hiddenUnlessAdmin, hideAPIURL: true },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Sidebar order follows this list: what people use daily comes first.
  (config: Config): Config => {
    const order = [
      'form-submissions',
      'pages',
      'projects',
      'posts',
      'media',
      'services',
      'equipment',
      'service-areas',
      'testimonials',
      'faqs',
      'users',
    ]
    const rank = (slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length)
    return {
      ...config,
      collections: [...(config.collections ?? [])].sort((a, b) => rank(a.slug) - rank(b.slug)),
    }
  },
]
