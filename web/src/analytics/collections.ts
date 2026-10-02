import type { CollectionConfig } from 'payload'

/*
 * Storage for the built-in visitor statistics. Two small tables, written with plain SQL
 * (see track.ts) and read by the Statistics screen. They have no screens of their own
 * and are closed to the public API.
 */
const closed = {
  create: () => false,
  delete: () => false,
  read: () => false,
  update: () => false,
}

/** One row per day, kind of thing counted, and key: e.g. 2026-10-02 · view · /projects → 14. */
export const AnalyticsDaily: CollectionConfig = {
  slug: 'analytics-daily',
  access: closed,
  admin: { hidden: true },
  timestamps: false,
  indexes: [{ fields: ['day', 'kind', 'key'], unique: true }],
  fields: [
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'kind', type: 'text', required: true },
    { name: 'key', type: 'text', required: true },
    { name: 'count', type: 'number', required: true, defaultValue: 0 },
  ],
}

/**
 * Who was already counted today: a one-way hash of address + browser + the date, so the
 * same person is one "visitor" per day. Rows are deleted after two days and cannot be
 * turned back into an address.
 */
export const AnalyticsVisitors: CollectionConfig = {
  slug: 'analytics-visitors',
  access: closed,
  admin: { hidden: true },
  timestamps: false,
  indexes: [{ fields: ['day', 'hash'], unique: true }],
  fields: [
    { name: 'day', type: 'text', required: true },
    { name: 'hash', type: 'text', required: true },
  ],
}
