import type { ServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { isManagerUser } from '@/access/roles'

const link: React.CSSProperties = {
  display: 'block',
  padding: '5px 0',
  textDecoration: 'none',
}

/** Extra sidebar links under the menu: backups (managers), help and the public site. */
export const BackupNavLink: React.FC<ServerProps> = ({ user }) => (
  <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--theme-elevation-100)' }}>
    {isManagerUser(user) ? (
      <Link href="/admin/backups" style={link}>
        Backups
      </Link>
    ) : null}
    <Link href="/admin/help" style={link}>
      How do I…? (help)
    </Link>
    <a href="/" rel="noreferrer" style={link} target="_blank">
      View website ↗
    </a>
  </div>
)
