import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

import { isManagerUser } from '@/access/roles'
import { listBackups } from '@/backup'

import { Icon } from './icons'
import { type Tile, Tiles } from './Tiles'

const everyday: Tile[] = [
  {
    href: '/admin/collections/projects/create',
    icon: 'projects',
    title: 'Add a finished project',
    text: 'Photos, town and lot size. It shows up on the Projects page.',
  },
  {
    href: '/admin/collections/pages',
    icon: 'pages',
    title: 'Edit a page',
    text: 'Change the text and photos of Home, About, Contact…',
  },
  {
    href: '/admin/collections/media',
    icon: 'photos',
    title: 'Upload photos',
    text: 'Add new photos or replace old ones.',
  },
  {
    href: '/admin/collections/testimonials/create',
    icon: 'reviews',
    title: 'Add a review',
    text: 'Show what a customer said about you.',
  },
  {
    href: '/admin/collections/posts/create',
    icon: 'news',
    title: 'Write a news post',
    text: 'Share an update or a tip.',
  },
  {
    href: '/admin/collections/services',
    icon: 'services',
    title: 'Update services',
    text: 'Change what you offer and how it is described.',
  },
]

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
  const count = newLeads.totalDocs

  return (
    <Gutter className="mb-dash">
      <div className="mb-dash__head">
        <div>
          <h1>Hello{name}</h1>
          <p className="mb-muted">What would you like to do today?</p>
        </div>
        <a className="mb-btn" href="/" rel="noreferrer" target="_blank">
          View website <Icon name="external" size={18} />
        </a>
      </div>

      <section className={`mb-leads${count ? ' mb-leads--new' : ''}`}>
        <Link className="mb-leads__head" href="/admin/collections/form-submissions">
          <span className="mb-tile__icon">
            <Icon name="leads" size={26} />
          </span>
          <span>
            <strong className="mb-tile__title">
              {count
                ? `${count} new quote request${count === 1 ? '' : 's'}`
                : 'No new quote requests'}
            </strong>
            <span className="mb-tile__text">
              People who filled in the estimate form on the website. Click to see them all.
            </span>
          </span>
        </Link>
        {latest.docs.length ? (
          <ul className="mb-leads__list">
            {latest.docs.map((d) => (
              <li key={d.id}>
                <Link
                  className="mb-leads__name"
                  href={`/admin/collections/form-submissions/${d.id}`}
                >
                  {d.contactName || 'Unnamed'}
                </Link>
                <span>
                  {d.contactPhone ? (
                    <a className="mb-leads__phone" href={`tel:${d.contactPhone}`}>
                      <Icon name="phone" size={16} /> {d.contactPhone}
                    </a>
                  ) : (
                    '—'
                  )}
                </span>
                <span>{d.serviceWanted || '—'}</span>
                <span className="mb-muted">
                  {new Date(d.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className={`mb-status mb-status--${d.status ?? 'new'}`}>
                  {d.status ?? 'new'}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <h2 className="mb-h2">Everyday tasks</h2>
      <Tiles tiles={everyday} />

      {manager ? (
        <p className="mb-dash__status mb-muted">
          {lastBackup
            ? `Last backup: ${new Date(lastBackup.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}.`
            : 'No backup yet. Open Settings, then Backups, and press "Back up now".'}{' '}
          {emailReady
            ? 'Email alerts for new quote requests are on.'
            : 'Email alerts for new quote requests are off (ask your developer to set up email).'}
        </p>
      ) : null}
    </Gutter>
  )
}
