import type { Metadata } from 'next'

import React from 'react'

import { plainText } from '@/components/site/Highlight'
import { generateMeta } from '@/utilities/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'

import { PostsListing } from './PostsListing'

export default function Page() {
  return <PostsListing page={1} />
}

export async function generateMetadata(): Promise<Metadata> {
  const listing = await getGlobal('listing-pages', 1)
  return generateMeta({
    doc: null,
    title: plainText(listing.posts?.heading) || 'News',
    description: listing.posts?.lede,
    fallbackImage: listing.posts?.image,
    path: '/posts',
  })
}
