import type { ServerProps } from 'payload'

import React from 'react'

import { isManagerUser } from '@/access/roles'

import { NavClient, type NavItem } from './NavClient'

const main: NavItem[] = [
  { href: '/admin', icon: 'home', label: 'Home', exact: true },
  { href: '/admin/collections/form-submissions', icon: 'leads', label: 'Quote requests' },
  { href: '/admin/collections/pages', icon: 'pages', label: 'Pages' },
  { href: '/admin/collections/projects', icon: 'projects', label: 'Projects' },
  { href: '/admin/collections/posts', icon: 'news', label: 'News' },
  { href: '/admin/collections/media', icon: 'photos', label: 'Photos' },
  { href: '/admin/statistics', icon: 'stats', label: 'Statistics' },
]

const company: NavItem[] = [
  { href: '/admin/collections/services', icon: 'services', label: 'Services' },
  { href: '/admin/collections/equipment', icon: 'equipment', label: 'Equipment' },
  { href: '/admin/collections/testimonials', icon: 'reviews', label: 'Reviews' },
]

/** Everything reached through the Settings screen lights up the "Settings" item. */
const settingsPaths = [
  '/admin/settings',
  '/admin/globals/',
  '/admin/backups',
  '/admin/ai',
  '/admin/account',
  '/admin/collections/users',
  '/admin/collections/service-areas',
  '/admin/collections/faqs',
  '/admin/collections/categories',
  '/admin/collections/redirects',
  '/admin/collections/forms',
  '/admin/collections/search',
]

/**
 * Sidebar of the admin. Replaces Payload's default list of every collection with a short,
 * fixed menu: the things people edit every week, then one "Settings" entry for the rest.
 */
export const Nav: React.FC<ServerProps> = async ({ payload, user }) => {
  const { totalDocs: newLeads } = await payload
    .count({ collection: 'form-submissions', where: { status: { equals: 'new' } } })
    .catch(() => ({ totalDocs: 0 }))

  return (
    <NavClient
      groups={[
        { items: main.map((i) => (i.icon === 'leads' ? { ...i, badge: newLeads } : i)) },
        { label: 'Your company', items: company },
      ]}
      foot={[
        {
          href: '/admin/settings',
          icon: 'settings',
          label: isManagerUser(user) ? 'Settings' : 'More',
          match: settingsPaths,
        },
        { href: '/admin/help', icon: 'help', label: 'Help' },
        { href: '/', icon: 'external', label: 'View website', newTab: true },
        { href: '/admin/logout', icon: 'logout', label: 'Log out' },
      ]}
    />
  )
}
