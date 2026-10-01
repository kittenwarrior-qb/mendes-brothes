'use client'

import { toast } from '@payloadcms/ui'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Backup = { name: string; size: number; createdAt: string; type: string }

const typeLabel: Record<string, string> = {
  manual: 'Manual',
  auto: 'Automatic',
  'pre-restore': 'Before restore',
  uploaded: 'Uploaded',
}

const formatSize = (bytes: number) =>
  bytes > 1024 ** 3
    ? `${(bytes / 1024 ** 3).toFixed(2)} GB`
    : bytes > 1024 ** 2
      ? `${(bytes / 1024 ** 2).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`

const btn: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid var(--theme-elevation-200)',
  background: 'var(--theme-elevation-50)',
  color: 'inherit',
  cursor: 'pointer',
  fontWeight: 600,
}
const primaryBtn: React.CSSProperties = {
  ...btn,
  background: 'var(--theme-success-500)',
  borderColor: 'var(--theme-success-500)',
  color: '#fff',
}
const cell: React.CSSProperties = {
  padding: '12px 10px',
  borderBottom: '1px solid var(--theme-elevation-100)',
  textAlign: 'left',
}

export const BackupsClient: React.FC = () => {
  const [backups, setBackups] = useState<Backup[] | null>(null)
  const [working, setWorking] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/backups', { credentials: 'include' })
    if (res.ok) setBackups((await res.json()).backups)
    else toast.error('Could not load backups.')
  }, [])

  // initial load (state is set from the promise callback, not synchronously in the effect)
  useEffect(() => {
    let alive = true
    fetch('/api/backups', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((body) => alive && setBackups(body.backups))
      .catch(() => toast.error('Could not load backups.'))
    return () => {
      alive = false
    }
  }, [])

  const call = async (label: string, input: string, init: RequestInit, done: string) => {
    setWorking(label)
    try {
      const res = await fetch(input, { credentials: 'include', ...init })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
      toast.success(done)
      await load()
      return body
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setWorking(null)
    }
  }

  const restore = async (b: Backup) => {
    const typed = window.prompt(
      `This replaces ALL current content and photos with the backup from ${new Date(b.createdAt).toLocaleString()}.\n\nThe current state is backed up first, so you can undo it.\n\nType RESTORE to continue.`,
    )
    if (typed !== 'RESTORE') return
    const result = await call(
      'Restoring…',
      `/api/backups/${b.name}/restore`,
      { method: 'POST' },
      'Site restored. Reloading…',
    )
    if (result) setTimeout(() => window.location.reload(), 1500)
  }

  const upload = async (file: File) => {
    await call(
      'Uploading…',
      '/api/backups/upload',
      { method: 'POST', body: file, headers: { 'Content-Type': 'application/x-tar' } },
      'Backup uploaded. You can restore it from the list.',
    )
    if (fileInput.current) fileInput.current.value = ''
  }

  const total = backups?.reduce((n, b) => n + b.size, 0) ?? 0

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <button
          disabled={!!working}
          onClick={() =>
            call('Creating backup…', '/api/backups', { method: 'POST' }, 'Backup created.')
          }
          style={{ ...primaryBtn, opacity: working ? 0.6 : 1 }}
          type="button"
        >
          {working === 'Creating backup…' ? working : 'Back up now'}
        </button>
        <button
          disabled={!!working}
          onClick={() => fileInput.current?.click()}
          style={btn}
          type="button"
        >
          Upload a backup file…
        </button>
        <input
          accept=".tar"
          hidden
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          ref={fileInput}
          type="file"
        />
        <Link href="/admin/globals/backup-settings" style={{ marginLeft: 'auto' }}>
          Automatic backup schedule →
        </Link>
      </div>

      {working ? (
        <div
          role="status"
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            background: 'var(--theme-elevation-100)',
            marginBottom: 14,
          }}
        >
          {working} This can take a minute — please keep this page open.
        </div>
      ) : null}

      {backups === null ? (
        <p>Loading…</p>
      ) : backups.length === 0 ? (
        <p>No backups yet. Press “Back up now” to create the first one.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={cell}>Date</th>
                <th style={cell}>Type</th>
                <th style={cell}>Size</th>
                <th style={{ ...cell, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.name}>
                  <td style={cell}>
                    <strong>{new Date(b.createdAt).toLocaleString()}</strong>
                    <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>
                      {b.name}
                    </div>
                  </td>
                  <td style={cell}>{typeLabel[b.type] ?? b.type}</td>
                  <td style={cell}>{formatSize(b.size)}</td>
                  <td style={{ ...cell, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <a
                      download
                      href={`/api/backups/${b.name}/download`}
                      style={{ ...btn, display: 'inline-block', textDecoration: 'none' }}
                    >
                      Download
                    </a>{' '}
                    <button
                      disabled={!!working}
                      onClick={() => restore(b)}
                      style={btn}
                      type="button"
                    >
                      Restore
                    </button>{' '}
                    <button
                      disabled={!!working}
                      onClick={() =>
                        window.confirm('Delete this backup file from the server?') &&
                        call(
                          'Deleting…',
                          `/api/backups/${b.name}`,
                          { method: 'DELETE' },
                          'Backup deleted.',
                        )
                      }
                      style={{ ...btn, color: 'var(--theme-error-500)' }}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 14, color: 'var(--theme-elevation-500)', fontSize: 13 }}>
            {backups.length} backup{backups.length === 1 ? '' : 's'} · {formatSize(total)} on the
            server
          </p>
        </>
      )}
    </div>
  )
}
