'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState, useTransition } from 'react'

import { cn } from '@/utilities/ui'

type Option = { value: string; label: string }

export type FilterOptions = {
  services: Option[]
  areas: Option[]
  sizes: Option[]
  years: Option[]
  types: Option[]
  sorts: Option[]
  visible: string[]
}

type Values = Record<'q' | 'service' | 'area' | 'size' | 'year' | 'type' | 'sort', string>

/**
 * Filter bar for /projects. State lives in the URL (shareable, crawlable);
 * results are rendered on the server and streamed back on each change.
 */
export const ProjectFilters: React.FC<{
  options: FilterOptions
  values: Values
  children: React.ReactNode
}> = ({ options, values, children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [q, setQ] = useState(values.q)
  const latest = useRef(values)
  latest.current = values

  const push = (next: Partial<Values>) => {
    const merged = { ...latest.current, ...next }
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(merged))
      if (v && !(k === 'sort' && v === 'new')) sp.set(k, v)
    const qs = sp.toString()
    startTransition(() => router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false }))
  }

  // debounce keyword search
  useEffect(() => {
    if (q === values.q) return
    const t = setTimeout(() => push({ q: q.trim() }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  // keep the input in sync when the URL changes (back/forward, clear)
  useEffect(() => setQ(values.q), [values.q])

  const show = (key: string) => options.visible.includes(key)
  const hasFilters = Object.entries(values).some(([k, v]) => v && !(k === 'sort' && v === 'new'))

  const select = (key: keyof Values, label: string, opts: Option[], all: string) =>
    show(key) && opts.length ? (
      <div className="field">
        <label htmlFor={`f-${key}`}>{label}</label>
        <select
          id={`f-${key}`}
          onChange={(e) => push({ [key]: e.target.value })}
          value={values[key]}
        >
          {all ? <option value="">{all}</option> : null}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    ) : null

  return (
    <div className={cn(pending && 'is-loading')} aria-busy={pending}>
      <div className="filters">
        <div className="wrap">
          {show('service') && options.services.length ? (
            <div aria-label="Service" className="chips" role="group">
              {[{ value: '', label: 'All work' }, ...options.services].map((s) => (
                <button
                  aria-pressed={values.service === s.value}
                  className="chip"
                  key={s.value || 'all'}
                  onClick={() => push({ service: s.value })}
                  type="button"
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : null}
          <form className="frow" onSubmit={(e) => e.preventDefault()} role="search">
            {select('area', 'Town', options.areas, 'All towns')}
            {select('size', 'Lot size', options.sizes, 'Any size')}
            {select('year', 'Year', options.years, 'Any year')}
            {select('type', 'Client', options.types, 'All clients')}
            {select('sort', 'Sort by', options.sorts, '')}
            {show('q') ? (
              <div className="field grow">
                <label htmlFor="f-q">Search</label>
                <input
                  id="f-q"
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Project name or detail"
                  type="search"
                  value={q}
                />
              </div>
            ) : null}
            {hasFilters ? (
              <button
                className="linkbtn"
                onClick={() => {
                  setQ('')
                  push({ q: '', service: '', area: '', size: '', year: '', type: '', sort: '' })
                }}
                type="button"
              >
                Clear filters
              </button>
            ) : null}
          </form>
        </div>
      </div>
      {children}
    </div>
  )
}
