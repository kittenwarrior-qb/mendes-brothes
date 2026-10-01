import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

import { isManagerUser } from '@/access/roles'
import { listBackups } from '@/backup'

type Tile = { href: string; icon: string; title: string; text: string }

const everyday: Tile[] = [
  {
    href: '/admin/collections/projects/create',
    icon: '🏗️',
    title: 'Add a finished project',
    text: 'Photos, town, lot size — it appears on the Projects page.',
  },
  {
    href: '/admin/collections/pages',
    icon: '📝',
    title: 'Edit a page',
    text: 'Change the text and photos of Home, About, Contact…',
  },
  {
    href: '/admin/collections/media',
    icon: '🖼️',
    title: 'Photos & files',
    text: 'Upload or replace photos.',
  },
  {
    href: '/admin/collections/testimonials/create',
    icon: '⭐',
    title: 'Add a review',
    text: 'Show what a customer said.',
  },
  {
    href: '/admin/collections/posts/create',
    icon: '📰',
    title: 'Write a news post',
    text: 'Share an update or a tip.',
  },
  {
    href: '/admin/collections/services',
    icon: '🧰',
    title: 'Services & equipment',
    text: 'Update what you offer and your machines.',
  },
]

const owner: Tile[] = [
  {
    href: '/admin/globals/site-settings',
    icon: '🏢',
    title: 'Company info & logo',
    text: 'Phone, address, hours, logo, social links.',
  },
  {
    href: '/admin/globals/theme',
    icon: '🎨',
    title: 'Colours & fonts',
    text: 'Pick a colour palette and preview it.',
  },
  {
    href: '/admin/globals/header',
    icon: '🧭',
    title: 'Menu',
    text: 'The links at the top of the site.',
  },
  {
    href: '/admin/backups',
    icon: '💾',
    title: 'Backups',
    text: 'Download a copy of the whole site, or restore one.',
  },
  { href: '/admin/collections/users', icon: '👥', title: 'Users', text: 'Who can log in here.' },
]

const card: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'flex-start',
  padding: '18px 18px',
  borderRadius: 10,
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  textDecoration: 'none',
  color: 'inherit',
  height: '100%',
}
const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 12,
}
const h2: React.CSSProperties = { fontSize: 18, margin: '34px 0 12px' }
const cell: React.CSSProperties = {
  padding: '11px 10px',
  borderBottom: '1px solid var(--theme-elevation-100)',
  textAlign: 'left',
}
const statusColor: Record<string, string> = {
  new: '#D96F25',
  contacted: '#2563eb',
  quoted: '#7c3aed',
  won: '#15803d',
  lost: '#6b7280',
}

const Tiles: React.FC<{ tiles: Tile[] }> = ({ tiles }) => (
  <div style={grid}>
    {tiles.map((t) => (
      <Link href={t.href} key={t.href} style={card}>
        <span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1 }}>
          {t.icon}
        </span>
        <span>
          <strong style={{ display: 'block', fontSize: 15 }}>{t.title}</strong>
          <span style={{ color: 'var(--theme-elevation-600)', fontSize: 13 }}>{t.text}</span>
        </span>
      </Link>
    ))}
  </div>
)

/** Home screen of the admin: tasks first, in plain language. Replaces the default card wall. */
export const Dashboard: React.FC<AdminViewServerProps> = async ({ initPageResult }) => {
  const { req } = initPageResult
  const { payload, user } = req
  const manager = isManagerUser(user)

  const [newLeads, latest] = await Promise.all([
    payload.count({ collection: 'form-submissions', where: { status: { equals: 'new' } } }),
    payload.find({ collection: 'form-submissions', sort: '-createdAt', limit: 5, depth: 0 }),
  ])
  const lastBackup = manager ? (await listBackups().catch(() => []))[0] : undefined
  const emailReady = Boolean(process.env.SMTP_HOST)
  const name = user && 'name' in user && user.name ? `, ${user.name}` : ''

  return (
    <Gutter>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Hello{name}</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--theme-elevation-600)' }}>
            What would you like to do today?
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/admin/help"
            style={{ ...card, padding: '10px 16px', height: 'auto', fontWeight: 600 }}
          >
            ❓ How do I…?
          </Link>
          <a
            href="/"
            rel="noreferrer"
            style={{ ...card, padding: '10px 16px', height: 'auto', fontWeight: 600 }}
            target="_blank"
          >
            View website ↗
          </a>
        </div>
      </div>

      <Link
        href="/admin/collections/form-submissions"
        style={{
          ...card,
          marginTop: 24,
          alignItems: 'center',
          borderColor: newLeads.totalDocs ? '#D96F25' : 'var(--theme-elevation-150)',
          background: newLeads.totalDocs ? 'rgba(217,111,37,.08)' : 'var(--theme-elevation-0)',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 30 }}>
          📞
        </span>
        <span>
          <strong style={{ display: 'block', fontSize: 17 }}>
            {newLeads.totalDocs
              ? `${newLeads.totalDocs} new quote request${newLeads.totalDocs === 1 ? '' : 's'}`
              : 'No new quote requests'}
          </strong>
          <span style={{ color: 'var(--theme-elevation-600)', fontSize: 13 }}>
            People who sent the estimate form. Click to see them all.
          </span>
        </span>
      </Link>

      {latest.docs.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
          <tbody>
            {latest.docs.map((d) => (
              <tr key={d.id}>
                <td style={cell}>
                  <Link
                    href={`/admin/collections/form-submissions/${d.id}`}
                    style={{ fontWeight: 600 }}
                  >
                    {d.contactName || 'Unnamed'}
                  </Link>
                </td>
                <td style={cell}>
                  {d.contactPhone ? <a href={`tel:${d.contactPhone}`}>{d.contactPhone}</a> : '—'}
                </td>
                <td style={cell}>{d.serviceWanted || '—'}</td>
                <td style={{ ...cell, color: 'var(--theme-elevation-600)' }}>
                  {new Date(d.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td style={{ ...cell, textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '2px 10px',
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#fff',
                      background: statusColor[d.status ?? 'new'] ?? '#6b7280',
                      textTransform: 'capitalize',
                    }}
                  >
                    {d.status ?? 'new'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <h2 style={h2}>Everyday tasks</h2>
      <Tiles tiles={everyday} />

      {manager ? (
        <>
          <h2 style={h2}>Your business &amp; the look of the site</h2>
          <Tiles tiles={owner} />
          <p style={{ marginTop: 22, color: 'var(--theme-elevation-600)', fontSize: 13 }}>
            {lastBackup
              ? `Last backup: ${new Date(lastBackup.createdAt).toLocaleString('en-US')}.`
              : 'No backup yet — open Backups and press "Back up now".'}{' '}
            {emailReady
              ? 'Email alerts for new quote requests are on.'
              : 'Email alerts for new quote requests are off (ask your developer to set up email).'}
          </p>
        </>
      ) : null}
    </Gutter>
  )
}
