import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const base = getServerSideURL()
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next/', '/search'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
