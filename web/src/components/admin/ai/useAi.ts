'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { AiStatus } from '@/ai/providerInfo'

const OFF: AiStatus = { enabled: false, vision: false, canManage: false, autoAlt: true }

// one request per page load, shared by every AI button on the screen
let cached: Promise<AiStatus> | null = null
const listeners = new Set<(s: AiStatus) => void>()

const load = () =>
  fetch('/api/ai/status', { credentials: 'include' })
    .then((r) => (r.ok ? (r.json() as Promise<AiStatus>) : { ...OFF, anonymous: r.status === 401 }))
    .catch(() => OFF)

/** Call after the settings screen changes the connection, so open buttons update. */
export const setAiStatus = (status: AiStatus) => {
  cached = Promise.resolve(status)
  listeners.forEach((l) => l(status))
}

export const useAiStatus = (): AiStatus | null => {
  const [status, setStatus] = useState<AiStatus | null>(null)
  const pathname = usePathname()
  // asked again on navigation only while logged out, so the buttons appear right after login
  const recheck = status?.anonymous ? pathname : ''
  useEffect(() => {
    let alive = true
    cached ??= load()
    void cached.then((s) => {
      if (s.anonymous) cached = null
      if (alive) setStatus(s)
    })
    listeners.add(setStatus)
    return () => {
      alive = false
      listeners.delete(setStatus)
    }
  }, [recheck])
  return status
}

/** Runs one AI task on the server. Throws an Error whose message can be shown as is. */
export const runAi = async <T>(payload: Record<string, unknown>): Promise<T> => {
  let res: Response
  try {
    res = await fetch('/api/ai/run', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Could not reach the website server. Check the connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || 'Something went wrong. Try again.')
  return data as T
}
