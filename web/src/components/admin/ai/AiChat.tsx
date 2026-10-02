'use client'

/* eslint-disable @next/next/no-img-element */
import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { type HelpImageId, isHelpImage } from '@/ai/helpImages'
import { type HelpTopic, helpTopics, matchTopic } from '@/ai/helpKnowledge'

import { Icon } from '../icons'
import { ImageViewer, Thumbs } from './ImageViewer'
import { runAi, useAiStatus } from './useAi'

type Message =
  | { from: 'user'; text: string }
  | { from: 'bot'; text: string; topic?: HelpTopic; note?: string; suggest?: 'starters' | 'all' }

const STORE = 'mb-assistant'
const starters = ['project', 'page', 'colours', 'company', 'leads']
const AVATAR = '/brand/logo-badge.webp'

const greeting = (ai: boolean): Message => ({
  from: 'bot',
  text: ai
    ? 'Hi! Ask me anything about this admin or your website — how to do something, or what colours, fonts, wording or layout would work best.'
    : 'Hi! Ask me how to do something in this admin, or pick a question below.',
  suggest: 'starters',
})

const restore = (): { open: boolean; messages: Message[] } => {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(STORE) ?? 'null')
    if (Array.isArray(saved?.messages))
      return { open: Boolean(saved.open), messages: saved.messages }
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

/**
 * The assistant: a round button in the corner of every admin screen that opens a chat.
 * Without an AI key it answers from the built-in guide; with one, the AI answers any
 * question about the admin and gives advice on colours, fonts, logo, layout and wording.
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
  const [viewer, setViewer] = useState<{ ids: HelpImageId[]; index: number } | null>(null)
  const list = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)

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

  const shown = messages.length ? messages : [greeting(status.enabled)]

  const ask = async (question: string) => {
    const text = question.trim()
    if (!text || busy) return
    setDraft('')
    const history = [...messages, { from: 'user', text } as Message]
    setMessages(history)
    if (!status.enabled) {
      setMessages([...history, builtIn(text, status.canManage)])
      return
    }
    setBusy(true)
    try {
      const { answer } = await runAi<{ answer: string }>({
        task: 'chat',
        path: pathname,
        messages: history.map((m) => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          text: m.text,
        })),
      })
      setMessages([...history, { from: 'bot', text: answer }])
    } catch (err) {
      // the AI could not answer: fall back to the built-in guide, and say why
      const fallback = builtIn(text, status.canManage)
      setMessages([
        ...history,
        { ...fallback, note: err instanceof Error ? err.message : String(err) } as Message,
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-chat">
      {open ? (
        <section aria-label="Assistant" className="mb-chat__panel">
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
            {shown.map((m, i) =>
              m.from === 'user' ? (
                <div className="mb-chat__msg mb-chat__msg--user" key={i}>
                  <p>{m.text}</p>
                </div>
              ) : (
                <div className="mb-chat__msg" key={i}>
                  <img alt="" className="mb-chat__avatar" src={AVATAR} />
                  <div className="mb-chat__bubble">
                    <p>{withLinks(splitImages(m.text).text)}</p>
                    <Thumbs
                      ids={splitImages(m.text).images}
                      onOpen={(ids, index) => setViewer({ ids, index })}
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
                          onOpen={(ids, index) => setViewer({ ids, index })}
                        />
                        {m.topic.link ? (
                          <Link className="mb-chat__go" href={m.topic.link.href}>
                            {m.topic.link.label} <Icon name="external" size={15} />
                          </Link>
                        ) : null}
                      </>
                    ) : null}
                    {m.suggest ? (
                      <div className="mb-chat__chips">
                        {helpTopics
                          .filter((t) => m.suggest === 'all' || starters.includes(t.id))
                          .filter((t) => status.canManage || !t.managerOnly)
                          .map((t) => (
                            <button key={t.id} onClick={() => void ask(t.q)} type="button">
                              {t.q}
                            </button>
                          ))}
                      </div>
                    ) : null}
                    {m.note ? <p className="mb-chat__note">{withLinks(m.note)}</p> : null}
                  </div>
                </div>
              ),
            )}
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

          <form
            className="mb-chat__form"
            onSubmit={(e) => {
              e.preventDefault()
              void ask(draft)
            }}
          >
            <textarea
              aria-label="Your question"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void ask(draft)
                }
              }}
              placeholder={status.enabled ? 'Ask anything…' : 'How do I…?'}
              ref={input}
              rows={1}
              value={draft}
            />
            <button aria-label="Send" disabled={busy || !draft.trim()} type="submit">
              <Icon name="send" size={18} />
            </button>
          </form>
        </section>
      ) : null}

      {viewer ? (
        <ImageViewer
          ids={viewer.ids}
          index={viewer.index}
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
