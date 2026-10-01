import React from 'react'

import { icons, type IconName } from '@/icons/registry'

const viewBoxes = { line: '0 0 24 24', fleet: '0 0 96 56', badge: '0 0 56 56' }
const strokes = { line: 1.8, fleet: 3, badge: 3.2 }

export const Icon: React.FC<{
  name?: string | null
  className?: string
  strokeWidth?: number
}> = ({ name, className, strokeWidth }) => {
  const def = name && name in icons ? icons[name as IconName] : null
  if (!def) return null
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth ?? strokes[def.kind]}
      viewBox={viewBoxes[def.kind]}
      // Paths come from our own static registry, never from user input.
      dangerouslySetInnerHTML={{ __html: def.body }}
    />
  )
}
