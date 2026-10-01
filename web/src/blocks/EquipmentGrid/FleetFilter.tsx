'use client'

import React, { useEffect, useState } from 'react'

/** Category chips that show/hide fleet cards rendered on the server (no refetch). */
export const FleetFilter: React.FC<{
  categories: { label: string; value: string }[]
  listId: string
}> = ({ categories, listId }) => {
  const [active, setActive] = useState('')

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(`#${listId} [data-cat]`).forEach((el) => {
      el.hidden = Boolean(active) && el.dataset.cat !== active
    })
  }, [active, listId])

  return (
    <div aria-label="Filter equipment" className="chips fleet-filter" role="group">
      {[{ label: 'All equipment', value: '' }, ...categories].map((c) => (
        <button
          aria-controls={listId}
          aria-pressed={active === c.value}
          className="chip"
          key={c.value || 'all'}
          onClick={() => setActive(c.value)}
          type="button"
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
