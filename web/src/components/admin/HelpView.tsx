import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

import { isManagerUser } from '@/access/roles'
import { helpTopics } from '@/ai/helpKnowledge'

/** /admin/help — short how-to guides in plain language (the same answers the chat assistant gives). */
export const HelpView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const manager = isManagerUser(req.user)
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
            <h1>How do I…?</h1>
            <p className="mb-muted">
              Short step-by-step guides. Nothing here can break the website — every change can be
              undone. You can also ask the assistant (round button, bottom right).
            </p>
          </div>
        </div>
        <div className="mb-help">
          {helpTopics
            .filter((t) => manager || !t.managerOnly)
            .map((t, i) => (
              <details key={t.id} open={i === 0}>
                <summary>{t.q}</summary>
                <ol>
                  {t.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                {t.link ? (
                  <p className="mb-help__link">
                    <Link className="mb-btn" href={t.link.href}>
                      {t.link.label}
                    </Link>
                  </p>
                ) : null}
              </details>
            ))}
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
