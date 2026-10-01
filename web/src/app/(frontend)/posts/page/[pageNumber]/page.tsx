import type { Metadata } from 'next'

import { notFound, redirect } from 'next/navigation'
import React from 'react'

import { PostsListing } from '../../PostsListing'

type Args = { params: Promise<{ pageNumber: string }> }

export default async function Page({ params }: Args) {
  const { pageNumber } = await params
  const n = Number(pageNumber)
  if (!Number.isInteger(n) || n < 1) notFound()
  if (n === 1) redirect('/posts')
  return <PostsListing page={n} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { pageNumber } = await params
  return {
    title: `News – page ${pageNumber}`,
    alternates: { canonical: `/posts/page/${pageNumber}` },
  }
}
