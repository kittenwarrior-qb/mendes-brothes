import type { CollectionConfig } from 'payload'

import path from 'path'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/**
 * Uploads are stored on disk in MEDIA_DIR (a Docker volume in production).
 * Resolved from the process working directory so it works in `next dev`,
 * `next start` and the standalone server alike.
 */
export const MEDIA_DIR = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')

const altFromFilename = (filename?: string | null) =>
  (filename || '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo', plural: 'Photos' },
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Website',
    hideAPIURL: true,
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description:
      'Every photo used on the website. Upload straight from your phone or computer — photos are resized automatically.',
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      admin: {
        description:
          'Describe the photo for screen readers and Google (e.g. "Excavator digging a pool in Lewes"). Filled from the file name if left empty.',
      },
    },
    {
      name: 'aiAlt',
      type: 'ui',
      admin: { components: { Field: '@/components/admin/ai/AiAltButton#AiAltButton' } },
    },
  ],
  hooks: {
    beforeChange: [
      // With the AI assistant connected, a new photo gets a real description written for it.
      // Any failure (no key, free limit reached, slow answer) falls back to the file name below.
      async ({ data, operation, req }) => {
        const file = req.file
        if (
          operation !== 'create' ||
          data.alt ||
          !file?.data ||
          !file.mimetype?.startsWith('image/')
        )
          return data
        if (file.mimetype === 'image/svg+xml') return data
        try {
          const { getAiConfig } = await import('../ai/settings')
          const { canSee } = await import('../ai/providers')
          const config = await getAiConfig(req.payload)
          if (!config?.autoAlt || !canSee(config)) return data
          const { describeImage } = await import('../ai/tasks')
          data.alt = await Promise.race([
            describeImage(req.payload, config, file.data),
            new Promise<undefined>((resolve) => setTimeout(resolve, 15_000)),
          ])
        } catch {
          /* keep the upload working without AI */
        }
        return data
      },
      ({ data }) => {
        if (!data.alt && data.filename) data.alt = altFromFilename(data.filename)
        return data
      },
    ],
  },
  upload: {
    staticDir: MEDIA_DIR,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    // Keep originals reasonable: phones shoot 4000px+ photos.
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      { name: 'medium', width: 1000, formatOptions: { format: 'webp', options: { quality: 78 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'jpeg', options: { quality: 80 } },
      },
    ],
  },
}
