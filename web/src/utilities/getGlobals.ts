import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

type Global = keyof Config['globals']

/**
 * Read a global once per request (deduplicated with React cache).
 * Rendered pages are cached by Next.js and refreshed when content changes
 * (see hooks/revalidateSite.ts), so there is no extra data cache layer here.
 */
export const getGlobal = cache(
  async <T extends Global>(slug: T, depth = 1): Promise<DataFromGlobalSlug<T>> => {
    const payload = await getPayload({ config: configPromise })
    // The theme has drafts: in preview mode show the draft being edited (Live Preview).
    const draft = slug === 'theme' && (await draftMode()).isEnabled
    return payload.findGlobal({ slug, depth, draft })
  },
)

/** @deprecated kept for template components — use getGlobal */
export const getCachedGlobal =
  <T extends Global>(slug: T, depth = 0) =>
  () =>
    getGlobal(slug, depth)
