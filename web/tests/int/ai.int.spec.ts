import { describe, expect, it } from 'vitest'

import {
  cleanTextAnswer,
  collectPhotoIds,
  collectText,
  parseJsonAnswer,
  plainToRichText,
  richTextToPlain,
} from '@/ai/content'
import { helpAsText, helpTopics, matchTopic } from '@/ai/helpKnowledge'

describe('reading AI answers', () => {
  it('finds the JSON object inside a code fence or a sentence', () => {
    expect(parseJsonAnswer('Sure!\n```json\n{"title": "A"}\n```')).toEqual({ title: 'A' })
    expect(parseJsonAnswer('{"a": {"b": 1}}')).toEqual({ a: { b: 1 } })
  })

  it('fails with a readable message when there is no JSON', () => {
    expect(() => parseJsonAnswer('I cannot do that.')).toThrow(/could not be read/)
    expect(() => parseJsonAnswer('{"a": ')).toThrow(/could not be read/)
  })

  it('strips quotes and code fences around rewritten text', () => {
    expect(cleanTextAnswer('"We grade lots."')).toBe('We grade lots.')
    expect(cleanTextAnswer('```\nWe grade lots.\n```')).toBe('We grade lots.')
    expect(cleanTextAnswer('"""\nWe grade lots.\n"""')).toBe('We grade lots.')
    // quotes that belong to the sentence stay
    expect(cleanTextAnswer('He said "yes" and "no"')).toBe('He said "yes" and "no"')
  })
})

describe('rich text', () => {
  it('round-trips paragraphs and headings', () => {
    const value = plainToRichText(['## The job', 'We cleared the lot.', '  ', 'Then we graded it.'])
    expect(value.root.children).toHaveLength(3)
    expect(value.root.children[0]).toMatchObject({ type: 'heading', tag: 'h2' })
    expect(richTextToPlain(value)).toBe('The job\nWe cleared the lot.\nThen we graded it.')
  })

  it('returns nothing for values that are not rich text', () => {
    expect(richTextToPlain(null)).toBe('')
    expect(richTextToPlain('text')).toBe('')
  })
})

describe('collecting the text of a document', () => {
  const page = {
    id: 3,
    title: 'Home',
    slug: 'home',
    meta: { title: 'Old SEO title' },
    layout: [
      {
        blockType: 'heroHome',
        variant: 'fullImage',
        heading: 'We move dirt. *We build ground.*',
        image: 12,
        links: [{ link: { label: 'Free estimate', url: '/contact' } }],
        settings: { background: 'dark' },
      },
      {
        blockType: 'split',
        body: plainToRichText(['Run by the Mendez brothers.']),
        image: { id: 15 },
      },
    ],
  }

  it('labels text by section and skips settings, slugs, URLs and SEO fields', () => {
    const parts = collectText(page)
    expect(parts).toContainEqual({ where: 'Title', text: 'Home' })
    expect(parts).toContainEqual({
      where: 'Section 1 (Big photo header) › Heading',
      text: 'We move dirt. *We build ground.*',
    })
    expect(parts.find((p) => p.text === 'Run by the Mendez brothers.')?.where).toBe(
      'Section 2 (Text + photo) › Body',
    )
    const all = parts.map((p) => p.text).join('|')
    expect(all).toContain('Free estimate')
    for (const hidden of ['fullImage', 'dark', '/contact', 'home', 'Old SEO title'])
      expect(parts.map((p) => p.text)).not.toContain(hidden)
  })

  it('finds photo ids whether stored as a number or a populated object', () => {
    expect(collectPhotoIds(page).sort()).toEqual([12, 15])
    expect(
      collectPhotoIds({ cover: 4, gallery: [{ image: 5 }, { image: { id: 6 } }], area: 9 }),
    ).toEqual([4, 5, 6])
  })
})

describe('built-in answers of the chat assistant', () => {
  it.each([
    ['How do I change the logo?', 'company'],
    ['where can I add a new project', 'project'],
    ['I forgot my password', 'password'],
    ['change the colours of the site', 'colours'],
    ['how to download a backup', 'backup'],
    ['someone sent a quote request, what now?', 'leads'],
    ['làm sao đổi mã màu', 'colours'],
    ['đổi mật khẩu ở đâu', 'password'],
    ['thêm công trình mới', 'project'],
    ['sao lưu website', 'backup'],
  ])('%s → %s', (question, id) => {
    expect(matchTopic(question)?.id).toBe(id)
  })

  it('has no answer for unrelated questions', () => {
    expect(matchTopic('what is the weather tomorrow')).toBeNull()
    expect(matchTopic('')).toBeNull()
  })

  it('every topic has steps, and the guide text names every screen', () => {
    for (const t of helpTopics) expect(t.steps.length).toBeGreaterThan(1)
    const text = helpAsText()
    expect(text).toContain('/admin/globals/theme')
    expect(text).toContain('(managers only)')
  })
})
