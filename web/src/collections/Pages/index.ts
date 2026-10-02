import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { pageBlocks } from '../../blocks/pageBlocks'
import { seoTab } from '../../fields/seo'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { siteRevalidationHooks } from '../../hooks/revalidateSite'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    components: {
      edit: { beforeDocumentControls: ['@/components/admin/ai/AiDocTools#AiDocTools'] },
    },
    group: 'Website',
    hideAPIURL: true,
    defaultColumns: ['title', '_status', 'updatedAt'],
    description: 'Your pages. Open one to change its text and photos.',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              label: 'Sections of this page',
              labels: { singular: 'section', plural: 'sections' },
              type: 'blocks',
              blocks: pageBlocks,
              required: true,
              admin: {
                initCollapsed: true,
                description:
                  'Each row is one section of the page, from top to bottom. Click a row to edit it, drag ⠿ to reorder, and use the eye icon (top right) to see the page while you edit.',
              },
            },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'hideCtaBand',
      label: 'Hide the site-wide call-to-action band',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
    slugField(),
  ],
  hooks: {
    ...siteRevalidationHooks,
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
