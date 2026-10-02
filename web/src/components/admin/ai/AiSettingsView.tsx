import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { isManagerUser } from '@/access/roles'
import { getAiConfig, toStatus } from '@/ai/settings'

import { AiSettingsClient } from './AiSettingsClient'

/** /admin/ai — connect the AI assistant with your own key. */
export const AiSettingsView: React.FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const manager = isManagerUser(req.user)
  const status = toStatus(manager ? await getAiConfig(req.payload) : null, manager)
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
            <h1>AI assistant</h1>
            <p className="mb-muted">
              Fixes spelling, rewrites text, writes project descriptions and Google titles,
              describes photos and checks a page before you publish it.
            </p>
          </div>
        </div>
        {manager ? (
          <AiSettingsClient initial={status} />
        ) : (
          <p>Only managers can set up the AI assistant.</p>
        )}
      </Gutter>
    </DefaultTemplate>
  )
}
