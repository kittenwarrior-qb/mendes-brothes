import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

import { isManagerUser } from '@/access/roles'

type Guide = { q: string; steps: React.ReactNode[]; managerOnly?: boolean }

const guides: Guide[] = [
  {
    q: 'Add a finished project',
    steps: [
      <>
        Open <Link href="/admin/collections/projects/create">Projects → Create new</Link>.
      </>,
      'Type a title and a short description, and choose the cover photo (drag a photo in from your computer).',
      'Pick the services, the town, the lot size and the month it was finished.',
      <>
        Optional: open the <b>Photos</b> tab to add more photos or a before/after pair.
      </>,
      <>
        Press <b>Publish changes</b> (top right). It is on the website straight away.
      </>,
    ],
  },
  {
    q: 'Change text or a photo on a page',
    steps: [
      <>
        Open <Link href="/admin/collections/pages">Pages</Link> and click the page (Home, About…).
      </>,
      'Each row is one section of the page, from top to bottom. Click a row to open it.',
      'Change the text, or click a photo to replace it.',
      <>Tip: wrap words in *stars* to colour them, for example: We move dirt. *We build ground.*</>,
      <>
        Click the eye icon (top right) to see the page while you edit, then press{' '}
        <b>Publish changes</b>.
      </>,
    ],
  },
  {
    q: 'Add, move or remove a section',
    steps: [
      'Open the page. At the bottom of the list press “Add section” and pick one by its picture.',
      'Drag the ⠿ handle on the left of a row to move it up or down.',
      'Use the ⋯ menu on a row to duplicate or remove it.',
    ],
  },
  {
    q: 'Answer a quote request',
    steps: [
      <>
        Open <Link href="/admin/collections/form-submissions">Quote requests</Link>. New ones are
        also on the home screen.
      </>,
      'Click a name to see the phone number, the service and the message.',
      'After you call them, change Status (right side) to Contacted, Quoted, Won or Lost and add a note.',
      'Use “Download all as a spreadsheet” to open the list in Excel.',
    ],
  },
  {
    q: 'Change the phone number, address, hours or logo',
    managerOnly: true,
    steps: [
      <>
        Open <Link href="/admin/globals/site-settings">Company info &amp; logo</Link>.
      </>,
      'Edit the field and press Save. The whole website updates (header, footer, contact page).',
    ],
  },
  {
    q: 'Change the colours',
    managerOnly: true,
    steps: [
      <>
        Open <Link href="/admin/globals/theme">Colours &amp; fonts</Link>.
      </>,
      'Click a palette card. Or choose “Custom” and pick your one brand colour — the rest is worked out for you.',
      'Click the eye icon (top right) to preview on the real website.',
      <>
        Happy? Press <b>Publish changes</b>. Visitors see nothing until you do.
      </>,
    ],
  },
  {
    q: 'Back up the website',
    managerOnly: true,
    steps: [
      <>
        Open <Link href="/admin/backups">Backups</Link> and press <b>Back up now</b>.
      </>,
      'Press Download to keep a copy on your computer.',
      'A backup is also made automatically every day.',
      'To go back to an older version press Restore — the current state is saved first, so it can be undone.',
    ],
  },
  {
    q: 'Undo a mistake',
    steps: [
      'Open the page or project, then the Versions tab (top right).',
      'Pick an earlier version and press Restore this version.',
    ],
  },
]

/** /admin/help — short how-to guides in plain language. */
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
      <Gutter>
        <h1 style={{ margin: '0 0 6px' }}>How do I…?</h1>
        <p style={{ margin: '0 0 22px', color: 'var(--theme-elevation-600)' }}>
          Short step-by-step guides. Nothing here can break the website — every change can be
          undone.
        </p>
        <div style={{ maxWidth: 820 }}>
          {guides
            .filter((g) => manager || !g.managerOnly)
            .map((g, i) => (
              <details
                key={g.q}
                open={i === 0}
                style={{
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: 10,
                  marginBottom: 10,
                  background: 'var(--theme-elevation-0)',
                }}
              >
                <summary
                  style={{ cursor: 'pointer', padding: '16px 18px', fontWeight: 700, fontSize: 16 }}
                >
                  {g.q}
                </summary>
                <ol style={{ margin: 0, padding: '0 22px 18px 40px', lineHeight: 1.7 }}>
                  {g.steps.map((s, n) => (
                    <li key={n}>{s}</li>
                  ))}
                </ol>
              </details>
            ))}
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
