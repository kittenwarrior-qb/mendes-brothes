import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

import { getReport, type Row, type Totals } from '@/analytics/report'

import { TrendChart } from './TrendChart'

const RANGES = [7, 30, 90]
const fmt = (n: number) => n.toLocaleString('en-US')

/** One headline number with how it changed against the period before. */
const Tile: React.FC<{
  label: string
  value: number
  before: number
  days: number
  note?: string
}> = ({ label, value, before, days, note }) => {
  const diff = value - before
  const pct = before > 0 ? Math.round((diff / before) * 100) : null
  return (
    <div className="mb-stat">
      <span className="mb-stat__label">{label}</span>
      <strong className="mb-stat__value">{fmt(value)}</strong>
      <span className={`mb-stat__delta${diff > 0 ? ' is-up' : diff < 0 ? ' is-down' : ''}`}>
        {before === 0 && value === 0
          ? 'Nothing yet'
          : pct === null
            ? `New — none in the ${days} days before`
            : `${diff > 0 ? '▲' : diff < 0 ? '▼' : '•'} ${Math.abs(pct)}% vs the ${days} days before`}
      </span>
      {note ? <span className="mb-stat__note">{note}</span> : null}
    </div>
  )
}

/** A ranked list: label, a thin bar showing its share of the largest row, and the number. */
const Ranked: React.FC<{
  title: string
  hint: string
  rows: Row[]
  empty: string
  unit: string
}> = ({ title, hint, rows, empty, unit }) => {
  const max = Math.max(...rows.map((r) => r.count), 1)
  return (
    <section className="mb-rank">
      <h2 className="mb-h2">{title}</h2>
      <p className="mb-muted mb-h2__sub">{hint}</p>
      {rows.length ? (
        <table>
          <thead className="mb-sr">
            <tr>
              <th>{title}</th>
              <th>{unit}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>
                  <span className="mb-rank__label" title={r.label}>
                    {r.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mb-rank__bar"
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </td>
                <td>{fmt(r.count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mb-rank__empty">{empty}</p>
      )}
    </section>
  )
}

/** /admin/statistics — visitors, page views, clicks, sources and redirects, counted by the site itself. */
export const StatsView: React.FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const asked = Number((searchParams as Record<string, string> | undefined)?.days)
  const days = RANGES.includes(asked) ? asked : 30
  const report = await getReport(req.payload, days)
  const t: Totals = report.totals
  const rate = t.visitors > 0 ? ((t.leads / t.visitors) * 100).toFixed(1) : null

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
      <Gutter className="mb-dash mb-stats">
        <div className="mb-dash__head">
          <div>
            <h1>Statistics</h1>
            <p className="mb-muted">
              How many people visit the website, what they look at and what they click.
            </p>
          </div>
          <nav aria-label="Period" className="mb-range">
            {RANGES.map((r) => (
              <Link
                aria-current={r === days ? 'true' : undefined}
                href={`/admin/statistics?days=${r}`}
                key={r}
              >
                Last {r} days
              </Link>
            ))}
          </nav>
        </div>

        {!report.hasData ? (
          <p className="mb-stats__empty">
            No visits have been counted yet. Numbers appear here as soon as people open the website.
            Your own visits while you are logged in here are not counted.
          </p>
        ) : null}

        <div className="mb-stats__tiles">
          <Tile before={report.previous.visitors} days={days} label="Visitors" value={t.visitors} />
          <Tile before={report.previous.views} days={days} label="Pages viewed" value={t.views} />
          <Tile
            before={report.previous.calls}
            days={days}
            label="Phone number clicked"
            value={t.calls}
          />
          <Tile
            before={report.previous.leads}
            days={days}
            label="Quote requests"
            note={rate ? `${rate} of every 100 visitors asked for a quote` : undefined}
            value={t.leads}
          />
        </div>

        <section>
          <h2 className="mb-h2">Visitors per day</h2>
          <p className="mb-muted mb-h2__sub">Point at a day to see its numbers.</p>
          <TrendChart data={report.daily} />
          <details className="mb-stats__table">
            <summary>Show the numbers as a table</summary>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Visitors</th>
                  <th>Pages viewed</th>
                </tr>
              </thead>
              <tbody>
                {[...report.daily].reverse().map((d) => (
                  <tr key={d.day}>
                    <td>{d.day}</td>
                    <td>{fmt(d.visitors)}</td>
                    <td>{fmt(d.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>

        <div className="mb-stats__grid">
          <Ranked
            empty="No pages viewed in this period."
            hint="Which pages people open most."
            rows={report.pages}
            title="Most viewed pages"
            unit="Views"
          />
          <Ranked
            empty="No visits in this period."
            hint="How people found the website."
            rows={report.sources}
            title="Where visitors came from"
            unit="Visits"
          />
          <Ranked
            empty="No clicks counted in this period."
            hint="The actions that lead to a job."
            rows={report.clicks}
            title="What people clicked"
            unit="Clicks"
          />
          <Ranked
            empty="No visits in this period."
            hint="What people use to look at the website."
            rows={report.devices}
            title="Phone or computer"
            unit="Visitors"
          />
          <Ranked
            empty="No redirect was used in this period."
            hint="Old addresses that sent people on to a new page."
            rows={report.redirects}
            title="Redirects used"
            unit="Times"
          />
          <Ranked
            empty="Nobody hit a missing page in this period."
            hint="Addresses people tried that do not exist. Worth a redirect if one keeps coming back."
            rows={report.notFound}
            title="Pages not found"
            unit="Times"
          />
        </div>

        <p className="mb-muted mb-dash__status">
          Counted by this website itself: no cookies, no outside service, and nothing that
          identifies a person. A visitor is one browser on one day. Robots and your own visits while
          logged in are left out. Numbers are kept for 13 months.
        </p>
      </Gutter>
    </DefaultTemplate>
  )
}
