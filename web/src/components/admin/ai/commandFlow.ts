/*
 * Client side of the assistant's quick commands: turns "/phone 302-…" (plus any photos
 * dropped into the chat) into a preview card, and carries out the card when the person
 * presses Apply. Nothing changes before that press.
 */
import {
  type CommandInfo,
  type CommandName,
  checkText,
  commandByName,
  findPalette,
  formatAddress,
  isHttpUrl,
  normalizeHex,
  paletteLabel,
  palettes,
  parseAddress,
  type TextField,
} from '@/ai/commands'
import { AUTO_PALETTE } from '@/theme/presets'

/** A photo waiting in the chat: a dropped/pasted file (kept in memory) or a link. */
export type Attachment = { key: string; name: string; preview: string; url?: string }

const files = new Map<string, File>()
let counter = 0

export const attachFile = (file: File): Attachment => {
  const key = `f${Date.now()}-${counter++}`
  files.set(key, file)
  return { key, name: file.name, preview: URL.createObjectURL(file) }
}

export const attachUrl = (url: string): Attachment => ({
  key: `u${Date.now()}-${counter++}`,
  name: decodeURIComponent(new URL(url).pathname.split('/').pop() || 'photo from link'),
  preview: url,
  url,
})

/** After a page reload the dropped files are gone (links still work). */
export const isAvailable = (a: Attachment) => Boolean(a.url) || files.has(a.key)

export type CardRow = {
  label: string
  before?: string
  after?: string
  beforeImage?: string
  afterImages?: string[]
  beforeSwatch?: string
  afterSwatch?: string
}

export type ApplyRequest = Record<string, unknown> & { action: 'settings' | 'theme' | 'project' }

export type Card = {
  id: string
  command: CommandName
  title: string
  rows: CardRow[]
  note?: string
  attachments: Attachment[]
  /** what is sent to the server; photo fields are filled in after uploading */
  request?: ApplyRequest
  /** settings field that receives the uploaded photo */
  imageField?: string
  state: 'pending' | 'working' | 'done' | 'cancelled' | 'failed' | 'undone'
  error?: string
  result?: {
    message: string
    link?: { label: string; href: string }
    undo?: ApplyRequest
    photos?: { id: number; url?: string }[]
  }
}

/** What the chat should show for a command: a card to confirm, or just a reply. */
export type Outcome =
  | { kind: 'card'; card: Card }
  | { kind: 'reply'; text: string; chips?: { label: string; fill: string; send?: boolean }[] }

type Settings = Record<string, unknown> & {
  address?: Record<string, string>
}

const getJson = async <T>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url, { credentials: 'same-origin' })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

const imageUrl = (value: unknown) =>
  value && typeof value === 'object' && 'url' in value && typeof value.url === 'string'
    ? value.url
    : undefined

const newCard = (info: CommandInfo, title: string, rest: Partial<Card>): Card => ({
  id: `c${Date.now()}-${counter++}`,
  command: info.name,
  title,
  rows: [],
  attachments: [],
  state: 'pending',
  ...rest,
})

const usage = (info: CommandInfo) => `Example: ${info.example}`

/**
 * Builds the preview for a command. `attachments` are the photos in the chat tray;
 * links typed after the command count as photos too.
 */
export const prepare = async (
  info: CommandInfo,
  arg: string,
  tray: Attachment[],
  manager: boolean,
): Promise<Outcome> => {
  if (info.managerOnly && !manager)
    return {
      kind: 'reply',
      text: `Only a manager can use /${info.name} (${info.description.toLowerCase()}). Ask the owner of the account.`,
    }

  if (info.image) {
    const words = arg.split(/\s+/).filter(Boolean)
    const links = words.filter(isHttpUrl).map(attachUrl)
    const text = words.filter((w) => !isHttpUrl(w)).join(' ')
    let photos = [...tray, ...links]
    if (!photos.length)
      return {
        kind: 'reply',
        text: `Drop the photo into this chat (or paste it, or press the paperclip), then send /${info.name} again. You can also put a link after the command.\n${usage(info)}`,
      }
    let note: string | undefined
    if (info.image === 'one' && photos.length > 1) {
      note = 'Only the first photo is used.'
      photos = photos.slice(0, 1)
    }

    if (info.name === 'photos')
      return {
        kind: 'card',
        card: newCard(
          info,
          `Add ${photos.length} photo${photos.length > 1 ? 's' : ''} to the library`,
          {
            attachments: photos,
            rows: [{ label: 'Photos', afterImages: photos.map((p) => p.preview) }],
            note: 'They are only added to Photos — nothing on the website changes.',
          },
        ),
      }

    if (info.name === 'project') {
      if (!text)
        return {
          kind: 'reply',
          text: `Type the project title after the command.\n${usage(info)}`,
        }
      return {
        kind: 'card',
        card: newCard(info, 'Create a draft project', {
          attachments: photos,
          rows: [
            { label: 'Title', after: text },
            { label: 'Cover', afterImages: [photos[0].preview] },
            ...(photos.length > 1
              ? [{ label: 'Gallery', afterImages: photos.slice(1).map((p) => p.preview) }]
              : []),
          ],
          request: { action: 'project', title: text },
          note: 'Saved as a draft — it is not on the website until you finish it and press Publish.',
        }),
      }
    }

    // logo, logo on dark, badge, favicon
    const current = await getJson<Settings>('/api/globals/site-settings?depth=1')
    const field = info.field as string
    return {
      kind: 'card',
      card: newCard(info, info.description, {
        attachments: photos,
        imageField: field,
        rows: [
          {
            label: info.description
              .replace(/^Use a photo as the /, '')
              .replace(/^\w/, (c) => c.toUpperCase()),
            beforeImage: imageUrl(current?.[field]),
            before: imageUrl(current?.[field]) ? undefined : '(none)',
            afterImages: [photos[0].preview],
          },
        ],
        note: [note, 'It is on the website as soon as you apply. Undo puts the old one back.']
          .filter(Boolean)
          .join(' '),
      }),
    }
  }

  if (info.name === 'color') {
    const hex = normalizeHex(arg)
    if (!hex)
      return { kind: 'reply', text: `Type a colour code after the command.\n${usage(info)}` }
    const theme = await getJson<{ preset?: string; brandColor?: string }>(
      '/api/globals/theme?draft=true&depth=0',
    )
    return {
      kind: 'card',
      card: newCard(info, 'Build the colours from your brand colour', {
        rows: [
          {
            label: 'Palette',
            before: paletteLabel(theme?.preset),
            beforeSwatch: swatchOf(theme),
            after: `Custom from ${hex}`,
            afterSwatch: hex,
          },
        ],
        request: { action: 'theme', preset: AUTO_PALETTE, brandColor: hex },
        note: 'Saved as a draft: you preview it, then press Publish on the Colours & fonts screen.',
      }),
    }
  }

  if (info.name === 'palette') {
    const found = findPalette(arg)
    if (!found)
      return {
        kind: 'reply',
        text: arg ? `There is no palette called “${arg}”. Pick one:` : 'Pick a palette:',
        chips: palettes.map((p) => ({ label: p.label, fill: `/palette ${p.key}`, send: true })),
      }
    const theme = await getJson<{ preset?: string; brandColor?: string }>(
      '/api/globals/theme?draft=true&depth=0',
    )
    return {
      kind: 'card',
      card: newCard(info, 'Switch the colour palette', {
        rows: [
          {
            label: 'Palette',
            before: paletteLabel(theme?.preset),
            beforeSwatch: swatchOf(theme),
            after: found.label,
            afterSwatch: found.primary,
          },
        ],
        request: { action: 'theme', preset: found.key },
        note: 'Saved as a draft: you preview it, then press Publish on the Colours & fonts screen.',
      }),
    }
  }

  // phone, email, hours, tagline, address
  if (!arg) return { kind: 'reply', text: `Type the new value after the command.\n${usage(info)}` }
  const current = await getJson<Settings>('/api/globals/site-settings?depth=0')
  if (info.name === 'address') {
    const address = parseAddress(arg)
    if (!address)
      return {
        kind: 'reply',
        text: `Write it as street, town, state and zip, with commas.\n${usage(info)}`,
      }
    return {
      kind: 'card',
      card: newCard(info, info.description, {
        rows: [
          {
            label: 'Address',
            before: formatAddress(current?.address) || '(empty)',
            after: formatAddress(address),
          },
        ],
        request: { action: 'settings', fields: { address } },
        note: 'Shown in the footer, on the contact page and to Google.',
      }),
    }
  }
  const field = info.field as TextField
  const problem = checkText(field, arg)
  if (problem) return { kind: 'reply', text: problem }
  return {
    kind: 'card',
    card: newCard(info, info.description, {
      rows: [
        {
          label: info.name.replace(/^\w/, (c) => c.toUpperCase()),
          before: String(current?.[field] ?? '') || '(empty)',
          after: arg,
        },
      ],
      request: { action: 'settings', fields: { [field]: arg } },
      note: 'It is on the website as soon as you apply. Undo puts the old value back.',
    }),
  }
}

const swatchOf = (theme: { preset?: string; brandColor?: string } | null) =>
  theme?.preset === AUTO_PALETTE
    ? theme.brandColor
    : palettes.find((p) => p.key === theme?.preset)?.primary

// ── carrying out a card ──

const errorOf = async (res: Response) => {
  const data = (await res.json().catch(() => ({}))) as {
    error?: string
    errors?: { message?: string }[]
  }
  return data.error ?? data.errors?.[0]?.message ?? `The server answered ${res.status}.`
}

/** Puts one photo in the library (a file through the normal upload, a link through the server). */
const upload = async (a: Attachment): Promise<{ id: number; url?: string }> => {
  if (a.url) {
    const res = await fetch('/api/assistant/image-url', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: a.url }),
    })
    if (!res.ok) throw new Error(await errorOf(res))
    return ((await res.json()) as { doc: { id: number; url?: string } }).doc
  }
  const file = files.get(a.key)
  if (!file) throw new Error('The photo is no longer here (the page was reloaded). Drop it again.')
  const form = new FormData()
  form.append('file', file)
  form.append('_payload', JSON.stringify({}))
  const res = await fetch('/api/media', { method: 'POST', credentials: 'same-origin', body: form })
  if (!res.ok) throw new Error(await errorOf(res))
  return ((await res.json()) as { doc: { id: number; url?: string } }).doc
}

export const send = async (request: ApplyRequest): Promise<NonNullable<Card['result']>> => {
  const res = await fetch('/api/assistant/apply', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(await errorOf(res))
  return (await res.json()) as NonNullable<Card['result']>
}

export const apply = async (card: Card): Promise<NonNullable<Card['result']>> => {
  const photos: { id: number; url?: string }[] = []
  for (const a of card.attachments) photos.push(await upload(a))
  // the photos are in the library now; free the memory
  for (const a of card.attachments) files.delete(a.key)

  if (card.command === 'photos')
    return {
      message: `${photos.length} photo${photos.length > 1 ? 's' : ''} added to Photos.`,
      link: { label: 'Open Photos', href: '/admin/collections/media' },
      photos,
    }
  if (card.command === 'project')
    return send({ ...card.request!, mediaIds: photos.map((p) => p.id) } as ApplyRequest)
  if (card.imageField)
    return send({ action: 'settings', fields: { [card.imageField]: photos[0].id } })
  return send(card.request!)
}

/** Buttons offered when photos are sent without a command. */
export const photoChoices = (manager: boolean, text: string) =>
  [
    { name: 'logo', label: 'Use as logo' },
    { name: 'logo-dark', label: 'Logo on dark' },
    { name: 'badge', label: 'Badge logo' },
    { name: 'favicon', label: 'Favicon' },
    { name: 'photos', label: 'Add to Photos' },
    { name: 'project', label: 'New draft project' },
  ]
    .filter((c) => manager || !commandByName(c.name)?.managerOnly)
    .map((c) => ({
      label: c.label,
      fill: c.name === 'project' ? `/project ${text || 'New project'}` : `/${c.name}`,
      send: true,
    }))
