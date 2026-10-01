/** Public URL path for a document of a given collection. Single source of truth for routing. */
export const collectionPrefix: Record<string, string> = {
  pages: '',
  posts: '/posts',
  projects: '/projects',
  services: '/services',
  'service-areas': '/areas',
}

export const docPath = (collection?: string | null, slug?: string | null): string => {
  if (!slug) return '/'
  if (collection === 'pages' && slug === 'home') return '/'
  const prefix = collection ? (collectionPrefix[collection] ?? '') : ''
  return `${prefix}/${slug}`
}
