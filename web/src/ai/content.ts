/*
 * Turning a document from the admin form into text an AI can read, and AI text back
 * into the editor's rich-text format.
 */
import { blockMeta } from '../blocks/blockMeta'

type Json = Record<string, unknown>

const isRichText = (v: unknown): v is { root: { children: unknown[] } } =>
  Boolean(v && typeof v === 'object' && 'root' in (v as Json))

/** Plain text of a rich-text value, one line per paragraph. */
export const richTextToPlain = (value: unknown): string => {
  if (!isRichText(value)) return ''
  const walk = (node: Json): string => {
    if (typeof node.text === 'string') return node.text
    const children = Array.isArray(node.children) ? (node.children as Json[]) : []
    const inner = children.map(walk).join('')
    return ['paragraph', 'heading', 'listitem', 'quote'].includes(String(node.type))
      ? `${inner}\n`
      : inner
  }
  return walk(value.root as unknown as Json).trim()
}

/** Paragraphs → the editor's rich-text value. A paragraph starting with "## " becomes a heading. */
export const plainToRichText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const heading = p.startsWith('## ')
        return {
          type: heading ? 'heading' : 'paragraph',
          ...(heading ? { tag: 'h2' } : { textFormat: 0, textStyle: '' }),
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              text: heading ? p.slice(3) : p,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
        }
      }),
  },
})

const humanize = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())

// keys that hold settings or system values, never words a visitor reads
const SKIP = new Set([
  'id', 'slug', 'blockType', 'blockName', 'settings', 'meta', 'url', 'icon', 'variant',
  'createdAt', 'updatedAt', 'publishedAt', 'completedAt', '_status', 'slugLock', 'anchor',
]) // prettier-ignore
// short single words are usually option values — except in these fields
const ALWAYS_TEXT = new Set([
  'title',
  'heading',
  'name',
  'label',
  'eyebrow',
  'question',
  'value',
  'author',
])

export type TextPart = { where: string; text: string }

/** Every piece of visitor-facing text in a document, with a readable label of where it is. */
export const collectText = (data: unknown, topLevel = 'layout'): TextPart[] => {
  const parts: TextPart[] = []
  const walk = (value: unknown, where: string, key: string) => {
    if (typeof value === 'string') {
      const text = value.trim()
      const looksLikeText = text.includes(' ') || ALWAYS_TEXT.has(key)
      if (text.length > 1 && looksLikeText && !/^(https?:|\/|#[0-9a-f]{3,8}$)/i.test(text))
        parts.push({ where, text })
      return
    }
    if (isRichText(value)) {
      const text = richTextToPlain(value)
      if (text) parts.push({ where, text })
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        const block = item && typeof item === 'object' ? (item as Json).blockType : undefined
        const label =
          key === topLevel && typeof block === 'string'
            ? `Section ${i + 1} (${blockMeta[block]?.label ?? block})`
            : `${where} ${i + 1}`
        walk(item, label, key)
      })
      return
    }
    if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Json)) {
        if (SKIP.has(k)) continue
        walk(v, where ? `${where} › ${humanize(k)}` : humanize(k), k)
      }
    }
  }
  walk(data, '', '')
  return parts
}

/** Numeric ids stored under photo-like fields (cover, image, before, after…). */
export const collectPhotoIds = (data: unknown): number[] => {
  const ids = new Set<number>()
  const walk = (value: unknown, key: string) => {
    if (Array.isArray(value)) return value.forEach((v) => walk(v, key))
    if (value && typeof value === 'object') {
      const obj = value as Json
      if (/image|cover|photo|before|after|thumbs/i.test(key) && typeof obj.id === 'number')
        ids.add(obj.id)
      if (!isRichText(value)) for (const [k, v] of Object.entries(obj)) walk(v, k)
      return
    }
    if (typeof value === 'number' && /image|cover|photo|before|after|thumbs/i.test(key))
      ids.add(value)
  }
  walk(data, '')
  return [...ids]
}

/** The first JSON object in a model's answer (some models wrap it in a code fence or a sentence). */
export const parseJsonAnswer = <T>(answer: string): T => {
  const start = answer.indexOf('{')
  const end = answer.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('The AI answer could not be read. Try again.')
  try {
    return JSON.parse(answer.slice(start, end + 1)) as T
  } catch {
    throw new Error('The AI answer could not be read. Try again.')
  }
}

/** Models like to wrap a rewritten sentence in quotes or a code fence. */
export const cleanTextAnswer = (answer: string) =>
  answer
    .trim()
    .replace(/^```[a-z]*\n?|\n?```$/g, '')
    .replace(/^"""\n?|\n?"""$/g, '')
    .replace(/^"([^"]*)"$/s, '$1')
    .trim()
