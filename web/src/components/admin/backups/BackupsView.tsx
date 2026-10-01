import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { isAdminUser } from '@/access/roles'

import { BackupsClient } from './BackupsClient'

/** /admin/backups — create, download, restore and delete full-site backups. */
export const BackupsView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
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
      <Gutter>
        <h1 style={{ margin: '0 0 6px' }}>Backups</h1>
        <p style={{ margin: '0 0 24px', color: 'var(--theme-elevation-600)', maxWidth: 760 }}>
          A backup is one file containing the whole site: every page, project, lead and setting,
          plus all uploaded photos. Download a copy to keep it somewhere safe — it can be restored
          here, or on a new server.
        </p>
        {isAdminUser(req.user) ? <BackupsClient /> : <p>Only administrators can manage backups.</p>}
      </Gutter>
    </DefaultTemplate>
  )
}
