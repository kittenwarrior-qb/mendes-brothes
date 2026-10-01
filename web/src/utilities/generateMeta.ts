import type { Metadata } from 'next'

import { getMediaUrl } from './getMediaUrl'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getGlobal } from './getGlobals'
import { asMedia } from './site'

type MetaDoc = {
  title?: string | null
  name?: string | null
  meta?: { title?: string | null; description?: string | null; image?: unknown } | null
  summary?: string | null
  shortDescription?: string | null
}

/**
 * Page <title>/description/OG tags. The layout adds the site-wide title suffix
 * through `title.template`, so titles here are the bare page title.
 */
export const generateMeta = async (args: {
  doc: MetaDoc | null
  path?: string
  fallbackImage?: unknown
  title?: string
  description?: string | null
}): Promise<Metadata> => {
  const { doc, path, fallbackImage } = args

  const title = args.title || doc?.meta?.title || doc?.title || doc?.name || undefined
  const site = await getGlobal('site-settings', 1)
  const description =
    doc?.meta?.description ||
    args.description ||
    doc?.summary ||
    doc?.shortDescription ||
    site.description ||
    undefined
  const image = asMedia(doc?.meta?.image) || asMedia(fallbackImage) || asMedia(site.defaultOgImage)
  const ogUrl = image ? getMediaUrl(image.sizes?.og?.url || image.url) : undefined

  return {
    title,
    description,
    alternates: path ? { canonical: path } : undefined,
    openGraph: mergeOpenGraph({
      title,
      description: description || undefined,
      url: path,
      ...(ogUrl ? { images: [{ url: ogUrl }] } : {}),
    }),
  }
}
