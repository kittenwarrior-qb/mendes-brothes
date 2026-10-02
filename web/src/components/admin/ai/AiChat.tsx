'use client'

/* eslint-disable @next/next/no-img-element */
import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import {
  commandByName,
  commandsFor,
  isHttpUrl,
  matchCommands,
  MAX_PHOTO_MB,
  parseCommand,
} from '@/ai/commands'
import { type HelpImageId, isHelpImage } from '@/ai/helpImages'
import { type HelpTopic, helpTopics, matchTopic } from '@/ai/helpKnowledge'

import { Icon } from '../icons'
import { CommandCard } from './CommandCard'
import {
  apply,
  type Attachment,
  attachFile,
  attachUrl,
  type Card,
  photoChoices,
  prepare,
  send,
} from './commandFlow'
import { helpItems, ImageViewer, Thumbs, type ViewerItem } from './ImageViewer'
import { runAi, useAiStatus } from './useAi'

type Chip = { label: string; fill: string; send?: boolean }

type Message =
  | { from: 'user'; text: string; photos?: string[] }
  | {
      from: 'bot'
      text: string
      topic?: HelpTopic
      note?: string
      suggest?: 'starters' | 'all'
      chips?: Chip[]
      /** photos the chips act on (sent without a command) */
      attachments?: Attachment[]
    }
  | { from: 'card'; card: Card }

const STORE = 'mb-assistant'
const starters = ['project', 'page', 'colours', 'company', 'leads']
const AVATAR = '/brand/logo-badge.webp'

const greeting = (ai: boolean): Message => ({
  from: 'bot',
  text: ai
    ? 'Hi! Ask me anything about this admin or your website — how to do something, or what colours, fonts, wording or layout would work best.\nType / for quick commands, or drop a photo here.'
    : 'Hi! Ask me how to do something in this admin, or pick a question below.\nType / for quick commands, or drop a photo here.',
  suggest: 'starters',
})

const restore = (): { open: boolean; messages: Message[] } => {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(STORE) ?? 'null')
    if (Array.isArray(saved?.messages)) {
      // dropped files do not survive a reload: their previews are gone, a card in the middle
      // of applying goes back to waiting
      const messages = (saved.messages as Message[]).map((m) => {
        if (m.from === 'user' && m.photos)
          return { ...m, photos: m.photos.map((p) => (p.startsWith('blob:') ? '' : p)) }
        if (m.from !== 'card') return m
        const fix = (s: string) => (s.startsWith('blob:') ? '' : s)
        const card: Card = {
          ...m.card,
          state: m.card.state === 'working' ? 'pending' : m.card.state,
          attachments: m.card.attachments.map((a) => ({ ...a, preview: fix(a.preview) })),
          rows: m.card.rows.map((r) => ({ ...r, afterImages: r.afterImages?.map(fix) })),
        }
        return { from: 'card', card } as Message
      })
      return { open: Boolean(saved.open), messages }
    }
  } catch {
    /* on the server, or storage blocked: start fresh */
  }
  return { open: false, messages: [] }
}

/** "[image: adm-logos]" lines in an AI answer become pictures; unknown ids are dropped. */
const splitImages = (text: string): { text: string; images: HelpImageId[] } => {
  const images: HelpImageId[] = []
  const rest = text.replace(/\[image:\s*([\w-]+)\s*\]/gi, (_, id: string) => {
    if (isHelpImage(id) && !images.includes(id)) images.push(id)
    return ''
  })
  return { text: rest.replace(/\n{3,}/g, '\n\n').trim(), images }
}

/** Admin paths in an answer ("/admin/globals/theme") become links. */
const withLinks = (text: string) =>
  text.split(/(\/admin(?:\/[\w\-[\]]+)*)/g).map((part, i) =>
    part.startsWith('/admin') ? (
      <Link href={part} key={i}>
        {part}
      </Link>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  )

/** The built-in answer when no AI key is connected (or the AI could not be reached). */
const builtIn = (question: string, manager: boolean): Message => {
  const topic = matchTopic(question)
  if (!topic) {
    return {
      from: 'bot',
      text: 'I do not have a ready answer for that one. These are the things I can explain:',
      suggest: 'all',
      note: manager
        ? 'Connect a free AI key and I can answer any question: /admin/ai'
        : 'With an AI key connected (a manager can add one) I can answer any question.',
    }
  }
  if (topic.managerOnly && !manager) {
    return {
      from: 'bot',
      text: `“${topic.q}” is done by a manager — ask the owner of the account. This is what they do:`,
      topic: { ...topic, link: undefined },
    }
  }
  return { from: 'bot', text: `${topic.q}:`, topic }
}

const commandList = (manager: boolean): Message => ({
  from: 'bot',
  text: 'Quick commands — type one, or press it below. Each one shows a preview first; nothing changes until you press Apply.',
  chips: commandsFor(manager)
    .filter((c) => c.name !== 'help')
    .map((c) => ({ label: `/${c.name}`, fill: `/${c.name} ` })),
  note: commandsFor(manager)
    .filter((c) => c.name !== 'help')
    .map((c) => `/${c.name} — ${c.description}`)
    .join('\n'),
})

/**
 * The assistant: a round button in the corner of every admin screen that opens a chat.
 * Without an AI key it answers from the built-in guide; with one, the AI answers any
 * question about the admin and gives advice on colours, fonts, logo, layout and wording.
 * Typing "/" gives quick commands (logo, phone, colours, photos…) that act on the site
 * after a preview and a press on Apply.
 */
export const AiChat: React.FC = () => {
  const status = useAiStatus()
  const pathname = usePathname()
  // the conversation survives a page reload, until the tab is closed
  const [saved] = useState(restore)
  const [open, setOpen] = useState(saved.open)
  const [messages, setMessages] = useState<Message[]>(saved.messages)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [viewer, setViewer] = useState<{ items: ViewerItem[]; index: number } | null>(null)
  const [tray, setTray] = useState<Attachment[]>([])
  const [trayError, setTrayError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [menuIndex, setMenuIndex] = useState(0)
  const [menuClosed, setMenuClosed] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const picker = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ open, messages: messages.slice(-40) }))
    } catch {
      /* storage full or blocked: the chat still works */
    }
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [messages, open, busy])
  useEffect(() => {
    if (open) input.current?.focus()
  }, [open])

  // nothing to show before login
  if (!status || status.anonymous) return null
  const manager = status.canManage

  const shown = messages.length ? messages : [greeting(status.enabled)]
  const menu = menuClosed ? [] : matchCommands(draft, manager)

  const say = (...add: Message[]) => setMessages((ms) => [...ms, ...add])

  const updateCard = (id: string, patch: Partial<Card>) =>
    setMessages((ms) =>
      ms.map((m) =>
        m.from === 'card' && m.card.id === id ? { ...m, card: { ...m.card, ...patch } } : m,
      ),
    )

  const ask = async (question: string) => {
    const text = question.trim()
    if (!text || busy) return
    setDraft('')
    const history = [...messages, { from: 'user', text } as Message]
    setMessages(history)
    if (!status.enabled) {
      setMessages([...history, builtIn(text, manager)])
      return
    }
    setBusy(true)
    try {
      const { answer } = await runAi<{ answer: string }>({
        task: 'chat',
        path: pathname,
        messages: history
          .filter((m) => m.from !== 'card' && m.text)
          .map((m) => ({
            role: m.from === 'user' ? 'user' : 'assistant',
            text: (m as { text: string }).text,
          })),
      })
      setMessages([...history, { from: 'bot', text: answer }])
    } catch (err) {
      // the AI could not answer: fall back to the built-in guide, and say why
      const fallback = builtIn(text, manager)
      setMessages([
        ...history,
        { ...fallback, note: err instanceof Error ? err.message : String(err) } as Message,
      ])
    } finally {
      setBusy(false)
    }
  }

  /** Everything typed or pressed goes through here: commands, photos, or a question. */
  const submit = async (raw: string, given?: Attachment[]) => {
    const text = raw.trim()
    const photos = given ?? tray
    if ((!text && !photos.length) || busy) return
    const parsed = parseCommand(text)
    if (!parsed && !photos.length) return ask(text)

    setDraft('')
    setMenuClosed(false)
    setTrayError('')
    if (!given) setTray([])
    const userMsg: Message = {
      from: 'user',
      text,
      photos: given ? undefined : photos.map((p) => p.preview),
    }

    // photos with no command: ask what to do with them
    if (!parsed) {
      say(userMsg, {
        from: 'bot',
        text: `What should I do with ${photos.length > 1 ? `these ${photos.length} photos` : 'this photo'}?`,
        chips: photoChoices(manager, text),
        attachments: photos,
      })
      return
    }

    const info = commandByName(parsed.name)
    if (!info) {
      say(userMsg, {
        ...commandList(manager),
        text: `I do not know /${parsed.name}. These are the quick commands:`,
      } as Message)
      if (!given) setTray(photos)
      return
    }
    if (info.name === 'help') {
      say(userMsg, commandList(manager))
      if (!given) setTray(photos)
      return
    }

    say(userMsg)
    setBusy(true)
    try {
      const outcome = await prepare(info, parsed.arg, photos, manager)
      if (outcome.kind === 'card') say({ from: 'card', card: outcome.card })
      else {
        say({ from: 'bot', text: outcome.text, chips: outcome.chips })
        // the photos were not used: keep them ready for the next command
        if (!given && photos.length) setTray(photos)
      }
    } finally {
      setBusy(false)
    }
  }

  const applyCard = async (card: Card) => {
    updateCard(card.id, { state: 'working', error: undefined })
    try {
      const result = await apply(card)
      updateCard(card.id, { state: 'done', result })
    } catch (err) {
      updateCard(card.id, {
        state: 'failed',
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const undoCard = async (card: Card) => {
    if (!card.result?.undo) return
    try {
      await send(card.result.undo)
      updateCard(card.id, { state: 'undone' })
    } catch (err) {
      updateCard(card.id, { error: err instanceof Error ? err.message : String(err) })
    }
  }

  const addFiles = (incoming: File[]) => {
    const ok: Attachment[] = []
    const problems: string[] = []
    for (const file of incoming) {
      if (!file.type.startsWith('image/')) problems.push(`${file.name} is not a photo`)
      else if (file.size > MAX_PHOTO_MB * 1024 * 1024)
        problems.push(`${file.name} is bigger than ${MAX_PHOTO_MB} MB`)
      else ok.push(attachFile(file))
    }
    setTray((t) => [...t, ...ok].slice(0, 20))
    setTrayError(problems.join(' · '))
    input.current?.focus()
  }

  const chip = (c: Chip, attachments?: Attachment[]) => {
    if (c.send) void submit(c.fill, attachments ?? [])
    else {
      setDraft(c.fill)
      setMenuClosed(true)
      input.current?.focus()
    }
  }

  const pick = (name: string) => {
    setDraft(`/${name} `)
    setMenuClosed(true)
    setMenuIndex(0)
    input.current?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (menu.length) {
      const exact = menu.some((c) => `/${c.name}` === draft.trim())
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const step = e.key === 'ArrowDown' ? 1 : -1
        setMenuIndex((i) => (i + step + menu.length) % menu.length)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenuClosed(true)
        return
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey && !exact)) {
        e.preventDefault()
        pick(menu[Math.min(menuIndex, menu.length - 1)].name)
        return
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submit(draft)
    }
  }

  const openPhoto = (src: string) => setViewer({ items: [{ src, caption: 'Photo' }], index: 0 })

  return (
    <div className="mb-chat">
      {open ? (
        <section
          aria-label="Assistant"
          className={`mb-chat__panel${dragging ? ' is-dragging' : ''}`}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
          }}
          onDragOver={(e) => {
            if (
              e.dataTransfer.types.includes('Files') ||
              e.dataTransfer.types.includes('text/uri-list')
            ) {
              e.preventDefault()
              setDragging(true)
            }
          }}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const dropped = Array.from(e.dataTransfer.files)
            if (dropped.length) return addFiles(dropped)
            const link = e.dataTransfer.getData('text/uri-list').split('\n')[0]?.trim()
            if (link && isHttpUrl(link)) setTray((t) => [...t, attachUrl(link)])
          }}
        >
          <header className="mb-chat__head">
            <img alt="" className="mb-chat__avatar" src={AVATAR} />
            <div>
              <strong>Assistant</strong>
              <span>
                {status.enabled ? 'AI answers · ask anything' : 'Quick answers about this admin'}
              </span>
            </div>
            {messages.length ? (
              <button
                onClick={() => setMessages([])}
                title="Start a new conversation"
                type="button"
              >
                New chat
              </button>
            ) : null}
            <button aria-label="Close the assistant" onClick={() => setOpen(false)} type="button">
              ✕
            </button>
          </header>

          <div aria-live="polite" className="mb-chat__list" ref={list}>
            {shown.map((m, i) => {
              if (m.from === 'card')
                return (
                  <div className="mb-chat__msg" key={m.card.id}>
                    <img alt="" className="mb-chat__avatar" src={AVATAR} />
                    <CommandCard
                      card={m.card}
                      onApply={() => void applyCard(m.card)}
                      onCancel={() => updateCard(m.card.id, { state: 'cancelled' })}
                      onOpen={openPhoto}
                      onUndo={() => void undoCard(m.card)}
                    />
                  </div>
                )
              if (m.from === 'user')
                return (
                  <div className="mb-chat__msg mb-chat__msg--user" key={i}>
                    <div>
                      {m.photos?.length ? (
                        <span className="mb-chat__sent">
                          {m.photos.map((p, j) =>
                            p ? <img alt="" key={j} src={p} /> : <span key={j}>photo</span>,
                          )}
                        </span>
                      ) : null}
                      {m.text ? <p>{m.text}</p> : null}
                    </div>
                  </div>
                )
              const parts = splitImages(m.text)
              return (
                <div className="mb-chat__msg" key={i}>
                  <img alt="" className="mb-chat__avatar" src={AVATAR} />
                  <div className="mb-chat__bubble">
                    <p>{withLinks(parts.text)}</p>
                    <Thumbs
                      ids={parts.images}
                      onOpen={(ids, index) => setViewer({ items: helpItems(ids), index })}
                    />
                    {m.topic ? (
                      <>
                        <ol>
                          {m.topic.steps.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                        <Thumbs
                          ids={m.topic.images ?? []}
                          onOpen={(ids, index) => setViewer({ items: helpItems(ids), index })}
                        />
                        {m.topic.link ? (
                          <Link className="mb-chat__go" href={m.topic.link.href}>
                            {m.topic.link.label} <Icon name="external" size={15} />
                          </Link>
                        ) : null}
                      </>
                    ) : null}
                    {m.chips?.length ? (
                      <div className="mb-chat__chips">
                        {m.chips.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => chip(c, m.attachments)}
                            type="button"
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {m.suggest ? (
                      <div className="mb-chat__chips">
                        {helpTopics
                          .filter((t) => m.suggest === 'all' || starters.includes(t.id))
                          .filter((t) => manager || !t.managerOnly)
                          .map((t) => (
                            <button key={t.id} onClick={() => void ask(t.q)} type="button">
                              {t.q}
                            </button>
                          ))}
                        <button
                          className="mb-chat__chip-cmd"
                          onClick={() => void submit('/help')}
                          type="button"
                        >
                          <Icon name="commands" size={15} /> Quick commands
                        </button>
                      </div>
                    ) : null}
                    {m.note ? <p className="mb-chat__note">{withLinks(m.note)}</p> : null}
                  </div>
                </div>
              )
            })}
            {busy ? (
              <div className="mb-chat__msg">
                <img alt="" className="mb-chat__avatar" src={AVATAR} />
                <div
                  className="mb-chat__bubble mb-chat__typing"
                  aria-label="The assistant is writing"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
          </div>

          {dragging ? (
            <div aria-hidden="true" className="mb-chat__drop">
              Drop photos here
            </div>
          ) : null}

          {menu.length ? (
            <ul aria-label="Quick commands" className="mb-chat__menu" role="listbox">
              {menu.map((c, i) => (
                <li
                  aria-selected={i === Math.min(menuIndex, menu.length - 1)}
                  key={c.name}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pick(c.name)
                  }}
                  onMouseEnter={() => setMenuIndex(i)}
                  role="option"
                >
                  <code>
                    /{c.name}
                    {c.arg ? <em> {c.arg}</em> : null}
                  </code>
                  <span>{c.description}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {tray.length || trayError ? (
            <div className="mb-chat__tray">
              {tray.map((a) => (
                <span className="mb-chat__tray-item" key={a.key} title={a.name}>
                  <img alt={a.name} src={a.preview} />
                  <button
                    aria-label={`Remove ${a.name}`}
                    onClick={() => setTray((t) => t.filter((x) => x.key !== a.key))}
                    type="button"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {tray.length ? (
                <span className="mb-chat__tray-hint">
                  Now type a command, like /logo or /photos — or just press send.
                </span>
              ) : null}
              {trayError ? (
                <span className="mb-chat__tray-error" role="alert">
                  {trayError}
                </span>
              ) : null}
            </div>
          ) : null}

          <form
            className="mb-chat__form"
            onSubmit={(e) => {
              e.preventDefault()
              void submit(draft)
            }}
          >
            <input
              accept="image/*"
              hidden
              multiple
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []))
                e.target.value = ''
              }}
              ref={picker}
              type="file"
            />
            <button
              aria-label="Add photos"
              className="mb-chat__attach"
              onClick={() => picker.current?.click()}
              title="Add photos (or drag them in, or paste)"
              type="button"
            >
              <Icon name="attach" size={18} />
            </button>
            <textarea
              aria-label="Your question"
              onChange={(e) => {
                setDraft(e.target.value)
                setMenuClosed(false)
                setMenuIndex(0)
              }}
              onKeyDown={onKeyDown}
              onPaste={(e) => {
                const pasted = Array.from(e.clipboardData.files).filter((f) =>
                  f.type.startsWith('image/'),
                )
                if (pasted.length) {
                  e.preventDefault()
                  addFiles(pasted)
                }
              }}
              placeholder={
                tray.length
                  ? 'Type a command, like /logo…'
                  : status.enabled
                    ? 'Ask anything, or type / for commands…'
                    : 'How do I…?  or type /'
              }
              ref={input}
              rows={1}
              value={draft}
            />
            <button
              aria-label="Send"
              className="mb-chat__send"
              disabled={busy || (!draft.trim() && !tray.length)}
              type="submit"
            >
              <Icon name="send" size={18} />
            </button>
          </form>
        </section>
      ) : null}

      {viewer ? (
        <ImageViewer
          index={viewer.index}
          items={viewer.items}
          onClose={() => setViewer(null)}
          onIndex={(index) => setViewer({ ...viewer, index })}
        />
      ) : null}

      <button
        aria-expanded={open}
        aria-label={open ? 'Close the assistant' : 'Open the assistant'}
        className="mb-chat__fab"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <img alt="" src={AVATAR} />
      </button>
    </div>
  )
}
