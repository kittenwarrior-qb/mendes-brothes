import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import { revalidatePath } from 'next/cache'

/**
 * The site is small (tens of pages), so any content change simply refreshes
 * every cached page. This keeps listings, footers, related items and menus
 * consistent without tracking which page uses which document.
 *
 * Outside a running Next.js server (e.g. CLI seed) revalidation is not
 * available — that's fine, there is no cache to clear.
 */
export const revalidateEverything = (reason: string, logger?: { info: (m: string) => void }) => {
  try {
    revalidatePath('/', 'layout')
    logger?.info(`Revalidated site (${reason})`)
  } catch {
    // not running inside Next.js
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, collection, req }) => {
  if (!req.context.disableRevalidate) revalidateEverything(collection.slug, req.payload.logger)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, collection, req }) => {
  if (!req.context.disableRevalidate) revalidateEverything(collection.slug, req.payload.logger)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, global, req }) => {
  if (!req.context.disableRevalidate)
    revalidateEverything(`global ${global.slug}`, req.payload.logger)
  return doc
}

export const siteRevalidationHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
