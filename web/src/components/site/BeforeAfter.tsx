'use client'

import Image from 'next/image'
import React, { useState } from 'react'

type Pic = { src: string; width: number; height: number; alt: string }

/** Drag (or use arrow keys on) the handle to compare two photos. */
export const BeforeAfter: React.FC<{ before: Pic; after: Pic }> = ({ before, after }) => {
  const [pos, setPos] = useState(50)
  return (
    <div className="ba" style={{ ['--pos' as string]: `${pos}%` }}>
      <Image
        alt={before.alt || 'Before'}
        fill
        sizes="(max-width: 960px) 100vw, 860px"
        src={before.src}
      />
      <Image
        alt={after.alt || 'After'}
        className="ba-after"
        fill
        sizes="(max-width: 960px) 100vw, 860px"
        src={after.src}
      />
      <span className="ba-label l">Before</span>
      <span className="ba-label r">After</span>
      <span aria-hidden="true" className="ba-line" />
      <input
        aria-label="Compare before and after"
        max={100}
        min={0}
        onChange={(e) => setPos(Number(e.target.value))}
        type="range"
        value={pos}
      />
    </div>
  )
}
