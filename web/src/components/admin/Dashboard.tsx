import type { ServerProps } from 'payload'

import React from 'react'

const tiles = [
  {
    href: '/admin/collections/form-submissions?where[status][equals]=new',
    title: 'New leads',
    key: 'leads',
  },
  { href: '/admin/collections/projects/create', title: 'Add a finished project', key: 'project' },
  { href: '/admin/collections/pages', title: 'Edit pages & sections', key: 'pages' },
  { href: '/admin/collections/media', title: 'Photo library', key: 'media' },
  { href: '/admin/globals/site-settings', title: 'Company info & logos', key: 'settings' },
  { href: '/admin/globals/theme', title: 'Colours, fonts & layout', key: 'theme' },
]

export const DashboardIntro: React.FC<ServerProps> = async ({ payload, user }) => {
  const newLeads = await payload.count({
    collection: 'form-submissions',
    where: { status: { equals: 'new' } },
    overrideAccess: false,
    user,
  })

  return (
    <div style={{ marginBottom: 'calc(var(--base) * 2)' }}>
      <h2 style={{ margin: '0 0 6px' }}>
        Welcome back{user && 'name' in user && user.name ? `, ${user.name}` : ''}
      </h2>
      <p style={{ margin: '0 0 18px', color: 'var(--theme-elevation-600)' }}>
        Changes are live as soon as you press <b>Publish</b> or <b>Save</b>.{' '}
        <a href="/" target="_blank" rel="noreferrer">
          Open the website ↗
        </a>
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 12,
        }}
      >
        {tiles.map((t) => (
          <a
            key={t.key}
            href={t.href}
            style={{
              display: 'block',
              padding: '16px 18px',
              borderRadius: 8,
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            {t.title}
            {t.key === 'leads' ? (
              <span
                style={{
                  marginLeft: 8,
                  padding: '1px 8px',
                  borderRadius: 99,
                  background: newLeads.totalDocs ? '#D96F25' : 'var(--theme-elevation-150)',
                  color: newLeads.totalDocs ? '#fff' : 'inherit',
                  fontSize: 12,
                }}
              >
                {newLeads.totalDocs}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  )
}
