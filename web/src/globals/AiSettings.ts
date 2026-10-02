import type { GlobalConfig } from 'payload'

import { providers } from '../ai/providerInfo'

/**
 * Where the AI key lives. It has no screen of its own and cannot be read or written
 * through the public API: the settings screen (/admin/ai) goes through /api/ai/settings,
 * which tests a key before saving it encrypted. See src/ai/settings.ts.
 */
export const AiSettings: GlobalConfig = {
  slug: 'ai-settings',
  access: {
    read: () => false,
    update: () => false,
  },
  admin: { hidden: true },
  fields: [
    {
      name: 'provider',
      type: 'select',
      options: providers.map((p) => ({ label: p.name, value: p.id })),
    },
    // encrypted with PAYLOAD_SECRET — a database dump or backup never holds the plain key
    { name: 'apiKey', type: 'text' },
    { name: 'keyHint', type: 'text' },
    { name: 'model', type: 'text' },
    { name: 'visionModel', type: 'text' },
    { name: 'autoAlt', type: 'checkbox', defaultValue: true },
  ],
}
