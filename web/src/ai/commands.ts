/*
 * Quick commands for the assistant chat: "/logo" with a photo dropped in, "/phone 302-…",
 * "/color #1D5FA8"… Plain rules, no AI: what you type is exactly what happens, and every
 * command shows a preview card that must be confirmed before anything changes.
 * Pure functions — used by the chat, the server endpoint and the unit tests.
 */
import { AUTO_PALETTE, HEX_RE, presets } from '../theme/presets'

/** The site-settings fields a command may change (and undo). */
export const imageFields = ['logo', 'logoOnDark', 'logoMark', 'favicon'] as const
export const textFields = ['phone', 'email', 'hours', 'tagline'] as const
/** biggest photo the chat accepts (the server checks links against the same limit) */
export const MAX_PHOTO_MB = 10

export type ImageField = (typeof imageFields)[number]
export type TextField = (typeof textFields)[number]
export type Address = { street: string; city: string; state: string; zip: string }

export type CommandName =
  | 'logo'
  | 'logo-dark'
  | 'badge'
  | 'favicon'
  | 'photos'
  | 'project'
  | 'phone'
  | 'email'
  | 'hours'
  | 'address'
  | 'tagline'
  | 'color'
  | 'palette'
  | 'help'

export type CommandInfo = {
  name: CommandName
  /** what to type after the command, shown in the menu */
  arg?: string
  description: string
  example: string
  /** needs a photo: dropped, pasted, chosen, or a link after the command */
  image?: 'one' | 'many'
  /** a site-settings field changed by this command */
  field?: ImageField | TextField | 'address'
  managerOnly?: boolean
}

export const commands: CommandInfo[] = [
  {
    name: 'logo',
    description: 'Use a photo as the logo (light backgrounds)',
    example: '/logo  + drop the logo file',
    image: 'one',
    field: 'logo',
    managerOnly: true,
  },
  {
    name: 'logo-dark',
    description: 'Logo for dark or coloured backgrounds',
    example: '/logo-dark  + drop a white logo',
    image: 'one',
    field: 'logoOnDark',
    managerOnly: true,
  },
  {
    name: 'badge',
    description: 'Round badge logo (home page, app icon)',
    example: '/badge  + drop a round logo',
    image: 'one',
    field: 'logoMark',
    managerOnly: true,
  },
  {
    name: 'favicon',
    description: 'Little icon in the browser tab',
    example: '/favicon  + drop a square image',
    image: 'one',
    field: 'favicon',
    managerOnly: true,
  },
  {
    name: 'photos',
    description: 'Add photos to the photo library',
    example: '/photos  + drop one or more photos',
    image: 'many',
  },
  {
    name: 'project',
    arg: 'title',
    description: 'New draft project from photos (first photo = cover)',
    example: '/project Pool dig in Lewes  + drop photos',
    image: 'many',
  },
  {
    name: 'phone',
    arg: 'number',
    description: 'Change the phone number',
    example: '/phone 302-555-0100',
    field: 'phone',
    managerOnly: true,
  },
  {
    name: 'email',
    arg: 'address',
    description: 'Change the email address',
    example: '/email office@mendezbrothes.com',
    field: 'email',
    managerOnly: true,
  },
  {
    name: 'hours',
    arg: 'opening hours',
    description: 'Change the opening hours',
    example: '/hours Monday to Saturday, 7 am to 6 pm',
    field: 'hours',
    managerOnly: true,
  },
  {
    name: 'address',
    arg: 'street, town, state zip',
    description: 'Change the address',
    example: '/address 12 Main St, Lewes, DE 19958',
    field: 'address',
    managerOnly: true,
  },
  {
    name: 'tagline',
    arg: 'text',
    description: 'Change the tagline under the company name',
    example: '/tagline Excavation and site work since 2009',
    field: 'tagline',
    managerOnly: true,
  },
  {
    name: 'color',
    arg: '#hex',
    description: 'Build the colours from your brand colour (draft)',
    example: '/color #1D5FA8',
    managerOnly: true,
  },
  {
    name: 'palette',
    arg: 'name',
    description: 'Switch to a ready-made palette (draft)',
    example: '/palette Studio',
    managerOnly: true,
  },
  { name: 'help', description: 'Show these commands', example: '/help' },
]

export const commandByName = (name: string) => commands.find((c) => c.name === name)

/** Commands this person may use (managers see all of them). */
export const commandsFor = (manager: boolean) => commands.filter((c) => manager || !c.managerOnly)

/** Menu while typing "/lo…": commands whose name starts with what was typed. */
export const matchCommands = (text: string, manager: boolean): CommandInfo[] => {
  // "/phone " (with the space) means the command is chosen: no menu any more
  const m = /^\/([\w-]*)$/.exec(text.trimStart())
  if (!m) return []
  const typed = m[1].toLowerCase()
  return commandsFor(manager).filter((c) => c.name.startsWith(typed))
}

/** "/phone 302-555" → { name: 'phone', arg: '302-555' }. Null when it is not a command. */
export const parseCommand = (text: string): { name: string; arg: string } | null => {
  const m = /^\/([a-z][\w-]*)(?:\s+([\s\S]*))?$/i.exec(text.trim())
  if (!m) return null
  return { name: m[1].toLowerCase(), arg: (m[2] ?? '').trim() }
}

export const isHttpUrl = (text: string) => /^https?:\/\/\S+$/i.test(text.trim())

// ── checks shared by the chat (early, friendly message) and the server (the real check) ──

const PHONE_RE = /^\+?[\d\s().-]{7,24}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Returns an error message, or null when the value is fine. Empty = clear the field. */
export const checkText = (field: TextField, value: string): string | null => {
  if (!value) return null
  if (value.length > 160) return 'That is too long (160 characters at most).'
  if (field === 'phone' && (!PHONE_RE.test(value) || (value.match(/\d/g) ?? []).length < 7))
    return 'That does not look like a phone number. Example: /phone 302-555-0100'
  if (field === 'email' && !EMAIL_RE.test(value))
    return 'That does not look like an email address. Example: /email office@example.com'
  return null
}

/** "12 Main St, Lewes, DE 19958" → its parts. Null when it cannot be split. */
export const parseAddress = (text: string): Address | null => {
  const parts = text
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length < 3) return null
  const last = /^([A-Za-z]{2})\.?\s*(\d{5}(?:-\d{4})?)?$/.exec(parts[parts.length - 1])
  if (!last) return null
  const address = {
    street: parts.slice(0, -2).join(', '),
    city: parts[parts.length - 2],
    state: last[1].toUpperCase(),
    zip: last[2] ?? '',
  }
  if (Object.values(address).some((v) => v.length > 80)) return null
  return address
}

export const formatAddress = (a?: Partial<Address> | null) =>
  a
    ? [a.street, a.city, [a.state, a.zip].filter(Boolean).join(' ')]
        .filter((p) => p && p.trim())
        .join(', ')
    : ''

/** "#1d5fa8" or "1D5FA8" → "#1D5FA8". Null when it is not a colour. */
export const normalizeHex = (text: string): string | null => {
  const value = text.trim().startsWith('#') ? text.trim() : `#${text.trim()}`
  return HEX_RE.test(value) ? value.toUpperCase() : null
}

export type PaletteKey = keyof typeof presets

export const palettes = (Object.keys(presets) as PaletteKey[]).map((key) => ({
  key,
  label: presets[key].label,
  primary: presets[key].tokens.colors.primary,
  background: presets[key].tokens.colors.background,
}))

const plain = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

/** "/palette slate" → the palette whose key or name matches best. */
export const findPalette = (text: string) => {
  const want = plain(text)
  if (!want) return undefined
  return (
    palettes.find((p) => plain(p.key) === want || plain(p.label) === want) ??
    palettes.find((p) => plain(p.label).startsWith(want) || plain(p.key).startsWith(want)) ??
    palettes.find((p) => plain(p.label).includes(want))
  )
}

export const isPaletteKey = (key: string): key is PaletteKey => key in presets

export const paletteLabel = (key?: string | null) =>
  key === AUTO_PALETTE
    ? 'Custom (from your brand colour)'
    : key && isPaletteKey(key)
      ? presets[key].label
      : key || '—'

/** For the AI and the Help screen: one line per command. */
export const commandsAsText = () =>
  commands
    .map(
      (c) => `- /${c.name}${c.arg ? ` <${c.arg}>` : ''}: ${c.description}. Example: ${c.example}`,
    )
    .join('\n')
