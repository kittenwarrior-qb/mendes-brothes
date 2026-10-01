import React from 'react'

import { PostCard, type PostCardData } from '@/components/site/PostCard'

export const CollectionArchive: React.FC<{ posts: Partial<PostCardData>[] }> = ({ posts }) => (
  <div className="proj-grid">
    {posts?.map((post, i) =>
      post && typeof post === 'object' ? <PostCard doc={post} key={post.slug ?? i} /> : null,
    )}
  </div>
)
