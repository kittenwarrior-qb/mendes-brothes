import type { ServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { isAdminUser } from '@/access/roles'

/** Sidebar link to the Backups screen (admins only). */
export const BackupNavLink: React.FC<ServerProps> = ({ user }) =>
  isAdminUser(user) ? (
    <Link
      href="/admin/backups"
      style={{ display: 'block', padding: '6px 0', textDecoration: 'none', fontWeight: 600 }}
    >
      Backups
    </Link>
  ) : null
