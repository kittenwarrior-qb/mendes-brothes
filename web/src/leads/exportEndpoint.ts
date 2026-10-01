import type { Endpoint } from 'payload'

/** Quote a CSV cell; neutralise values a spreadsheet would run as a formula. */
const cell = (value: unknown) => {
  let s = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

/** GET /api/leads-export — every quote request as a CSV file (logged-in users only). */
export const leadsExportEndpoint: Endpoint = {
  path: '/leads-export',
  method: 'get',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Please log in.' }, { status: 401 })

    const { docs } = await req.payload.find({
      collection: 'form-submissions',
      limit: 10000,
      pagination: false,
      sort: '-createdAt',
      depth: 0,
      req,
      overrideAccess: false,
    })

    const header = [
      'Date',
      'Name',
      'Phone',
      'Email',
      'Service',
      'Message',
      'Status',
      'Notes',
      'Page',
    ]
    const rows = docs.map((d) =>
      [
        new Date(d.createdAt).toLocaleString('en-US'),
        d.contactName,
        d.contactPhone,
        d.contactEmail,
        d.serviceWanted,
        d.details,
        d.status,
        d.notes,
        d.sourcePage,
      ]
        .map(cell)
        .join(','),
    )
    // BOM so Excel opens UTF-8 correctly
    const csv = '﻿' + [header.map(cell).join(','), ...rows].join('\r\n')
    const date = new Date().toISOString().slice(0, 10)

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="quote-requests-${date}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  },
}
