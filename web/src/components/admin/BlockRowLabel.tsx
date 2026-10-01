'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { blockMeta, blockTitleOf } from '@/blocks/blockMeta'

/**
 * Header of a section in the page editor: its plain-language type plus the
 * heading the editor typed — instead of the default "Untitled".
 */
export const BlockRowLabel: React.FC = () => {
  const { data } = useRowLabel<{ blockType?: string } & Record<string, unknown>>()
  const type = data?.blockType ? (blockMeta[data.blockType]?.label ?? data.blockType) : 'Section'
  const title = blockTitleOf(data)
  return (
    <span style={{ display: 'inline-flex', gap: 10, alignItems: 'baseline', minWidth: 0 }}>
      <strong>{type}</strong>
      {title ? (
        <span
          style={{
            color: 'var(--theme-elevation-600)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      ) : null}
    </span>
  )
}
