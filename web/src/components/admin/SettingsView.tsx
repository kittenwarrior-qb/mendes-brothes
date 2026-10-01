import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { isAdminUser, isManagerUser } from '@/access/roles'

import { type Tile, Tiles } from './Tiles'

type Section = { title: string; text?: string; for: 'all' | 'manager' | 'admin'; tiles: Tile[] }

const sections: Section[] = [
  {
    title: 'Your business',
    for: 'manager',
    tiles: [
      {
        href: '/admin/globals/site-settings',
        icon: 'company',
        title: 'Company info & logo',
        text: 'Phone, address, opening hours, logo and social links.',
      },
      {
        href: '/admin/globals/theme',
        icon: 'palette',
        title: 'Colours & fonts',
        text: 'Pick a colour palette and preview it before it goes live.',
      },
      {
        href: '/admin/globals/header',
        icon: 'menu',
        title: 'Menu',
        text: 'The links at the top of the website.',
      },
      {
        href: '/admin/globals/footer',
        icon: 'footer',
        title: 'Footer',
        text: 'The links and text at the bottom of every page.',
      },
    ],
  },
  {
    title: 'More content',
    for: 'all',
    tiles: [
      {
        href: '/admin/collections/service-areas',
        icon: 'towns',
        title: 'Towns we serve',
        text: 'The towns shown on the website and in the project filter.',
      },
      {
        href: '/admin/collections/faqs',
        icon: 'faqs',
        title: 'FAQs',
        text: 'Common questions and your answers.',
      },
      {
        href: '/admin/account',
        icon: 'account',
        title: 'My account',
        text: 'Change your name, email or password.',
      },
    ],
  },
  {
    title: 'People & safety',
    for: 'manager',
    tiles: [
      {
        href: '/admin/collections/users',
        icon: 'users',
        title: 'Users',
        text: 'Who can log in here, and what they may change.',
      },
      {
        href: '/admin/backups',
        icon: 'backup',
        title: 'Backups',
        text: 'Download a copy of the whole website, or restore one.',
      },
      {
        href: '/admin/globals/backup-settings',
        icon: 'schedule',
        title: 'Backup schedule',
        text: 'How often a backup is made automatically.',
      },
    ],
  },
  {
    title: 'Advanced',
    text: 'Technical settings. Only developers see this part.',
    for: 'admin',
    tiles: [
      {
        href: '/admin/collections/categories',
        icon: 'categories',
        title: 'News categories',
        text: 'Topics used to group news posts.',
      },
      {
        href: '/admin/globals/listing-pages',
        icon: 'listings',
        title: 'List pages & filters',
        text: 'Headings and filter options of Projects, Services and News.',
      },
      {
        href: '/admin/collections/forms',
        icon: 'forms',
        title: 'Forms',
        text: 'Fields and emails of the estimate form.',
      },
      {
        href: '/admin/collections/redirects',
        icon: 'redirects',
        title: 'Redirects',
        text: 'Send an old web address to a new one.',
      },
      {
        href: '/admin/collections/search',
        icon: 'search',
        title: 'Search index',
        text: 'What the website search can find.',
      },
    ],
  },
]

/** /admin/settings — everything that is not day-to-day content, as one screen of large cards. */
export const SettingsView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const manager = isManagerUser(req.user)
  const admin = isAdminUser(req.user)
  const visible = sections.filter(
    (s) => s.for === 'all' || (s.for === 'manager' && manager) || (s.for === 'admin' && admin),
  )
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter className="mb-dash">
        <div className="mb-dash__head">
          <div>
            <h1>{manager ? 'Settings' : 'More'}</h1>
            <p className="mb-muted">
              {manager
                ? 'Things you set up once and change rarely.'
                : 'Less common content, and your own account.'}
            </p>
          </div>
        </div>
        {visible.map((s) => (
          <section key={s.title}>
            <h2 className="mb-h2">{s.title}</h2>
            {s.text ? <p className="mb-muted mb-h2__sub">{s.text}</p> : null}
            <Tiles tiles={s.tiles} />
          </section>
        ))}
      </Gutter>
    </DefaultTemplate>
  )
}
