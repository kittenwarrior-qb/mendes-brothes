'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { type TextAction, textActions } from '@/ai/providerInfo'

import { Icon } from '../icons'
import { AiChat } from './AiChat'
import { runAi, useAiStatus } from './useAi'

type TextTarget = { kind: 'field'; el: HTMLInputElement | HTMLTextAreaElement }
type RichTarget = { kind: 'rich'; editor: HTMLElement; range: Range }
type Target = TextTarget | RichTarget

type Result =
  | { state: 'idle' }
  | { state: 'busy' }
  | { state: 'done'; text: string }
  | { state: 'error'; message: string }

const MIN_CHARS = 3

/** Text and textarea fields of a document form — not search boxes, slugs, colours or passwords. */
const editableField = (node: EventTarget | null): HTMLInputElement | HTMLTextAreaElement | null => {
  if (!(node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement)) return null
  if (node instanceof HTMLInputElement && node.type !== 'text') return null
  if (node.readOnly || node.disabled) return null
  if (!node.closest('.field-type.text, .field-type.textarea')) return null
  if (node.closest('.mb-ai, .search-filter, .slug-field-component, .collection-list')) return null
  if (/^#[0-9a-f]{3,8}$/i.test(node.value.trim())) return null
  return node
}

const labelOf = (el: HTMLElement) =>
  el
    .closest('.field-type')
    ?.querySelector('label, .field-label')
    ?.textContent?.replace(/\*$/, '')
    .trim() ?? ''

/** React only notices a change made through the element's own value setter. */
const setFieldValue = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

/**
 * A small "AI" button that follows the text field being edited (or the text selected in a
 * rich-text editor) and offers to fix, clarify, shorten or translate it. The suggestion is
 * shown first; nothing changes until the person presses "Use this".
 *
 * It works on every text field of every form without each field having to opt in.
 */
const AiFieldAssist: React.FC = () => {
  const status = useAiStatus()
  const [target, setTarget] = useState<Target | null>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<Result>({ state: 'idle' })
  const [lastAction, setLastAction] = useState<TextAction>('fix')
  const box = useRef<HTMLDivElement>(null)
  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  }, [open])

  const close = useCallback(() => {
    setOpen(false)
    setResult({ state: 'idle' })
  }, [])

  const measure = useCallback((t: Target | null) => {
    if (!t) return setRect(null)
    setRect(t.kind === 'field' ? t.el.getBoundingClientRect() : t.range.getBoundingClientRect())
  }, [])

  // follow focus and selection
  useEffect(() => {
    if (!status?.enabled) return
    const onFocusIn = (e: FocusEvent) => {
      if (box.current?.contains(e.target as Node)) return
      const el = editableField(e.target)
      if (el) {
        close()
        setTarget({ kind: 'field', el })
        measure({ kind: 'field', el })
      } else if (!openRef.current && !(e.target as HTMLElement)?.closest?.('.rich-text-lexical')) {
        setTarget(null)
      }
    }
    const onSelection = () => {
      if (openRef.current) return
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setTarget((t) => (t?.kind === 'rich' ? null : t))
        return
      }
      const node =
        sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement
      const editor = node?.closest<HTMLElement>('.rich-text-lexical [contenteditable="true"]')
      if (!editor || sel.toString().trim().length < MIN_CHARS) return
      const next: RichTarget = { kind: 'rich', editor, range: sel.getRangeAt(0).cloneRange() }
      setTarget(next)
      measure(next)
    }
    const onMove = () => setTarget((t) => (measure(t), t))
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('selectionchange', onSelection)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('selectionchange', onSelection)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [status?.enabled, close, measure])

  // click outside closes the panel
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, close])

  if (!status?.enabled || !target || !rect || !isConnected(target)) return null

  const currentText = () => (target.kind === 'field' ? target.el.value : target.range.toString())

  const run = async (action: TextAction) => {
    const text = currentText().trim()
    setLastAction(action)
    if (text.length < MIN_CHARS) {
      setResult({ state: 'error', message: 'Type some text first, then ask the AI to improve it.' })
      return
    }
    setResult({ state: 'busy' })
    try {
      const out = await runAi<{ text: string }>({
        task: 'text',
        action,
        text,
        label: target.kind === 'field' ? labelOf(target.el) : 'Text',
        multiline: target.kind === 'rich' || target.el instanceof HTMLTextAreaElement,
      })
      setResult({ state: 'done', text: out.text })
    } catch (err) {
      setResult({ state: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }

  const apply = (text: string) => {
    if (target.kind === 'field') {
      setFieldValue(target.el, text)
      target.el.focus()
    } else {
      // put the selection back, then type over it — the editor treats it like normal typing
      target.editor.focus()
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(target.range)
      document.execCommand('insertText', false, text)
    }
    close()
    setTarget(null)
  }

  // the button sits on the label line, right-aligned with the field; the panel opens under the field
  const top = Math.max(8, rect.top - 30)
  const right = Math.max(8, window.innerWidth - rect.right)
  // below the text, so the original stays readable next to the suggestion; above it when there is no room
  const panelTop =
    rect.bottom + 8 > window.innerHeight - 300 ? Math.max(8, rect.top - 300) : rect.bottom + 8

  return createPortal(
    <div className="mb-ai" ref={box}>
      {!open ? (
        <button
          aria-label="AI: improve this text"
          className="mb-ai__chip"
          // keep the field focused and the selection alive
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen(true)}
          style={{ top, right }}
          type="button"
        >
          <Icon name="ai" size={15} /> AI
        </button>
      ) : (
        <div
          aria-label="AI assistant"
          className="mb-ai__panel"
          role="dialog"
          style={{ top: panelTop, right }}
        >
          {result.state === 'idle' || result.state === 'error' ? (
            <>
              <div className="mb-ai__title">
                <Icon name="ai" size={16} /> What should the AI do with this text?
              </div>
              {result.state === 'error' ? <p className="mb-ai__error">{result.message}</p> : null}
              <div className="mb-ai__actions">
                {textActions.map((a) => (
                  <button
                    key={a.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => run(a.id)}
                    type="button"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </>
          ) : result.state === 'busy' ? (
            <p aria-live="polite" className="mb-ai__busy">
              <span className="mb-ai__spinner" /> Working on it…
            </p>
          ) : (
            <>
              <div className="mb-ai__title">
                <Icon name="ai" size={16} /> Suggestion — edit it if you like
              </div>
              <textarea
                aria-label="AI suggestion"
                className="mb-ai__suggestion"
                onChange={(e) => setResult({ state: 'done', text: e.target.value })}
                rows={Math.min(10, Math.max(2, Math.ceil(result.text.length / 48)))}
                value={result.text}
              />
              <div className="mb-ai__foot">
                <button className="mb-ai__primary" onClick={() => apply(result.text)} type="button">
                  Use this
                </button>
                <button onClick={() => run(lastAction)} type="button">
                  Try again
                </button>
                <button onClick={close} type="button">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>,
    document.body,
  )
}

const isConnected = (t: Target) => (t.kind === 'field' ? t.el.isConnected : t.editor.isConnected)

/**
 * Registered in payload.config.ts → admin.components.providers, so the field button and the
 * chat assistant are present on every admin screen.
 */
export const AiFieldAssistProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    {children}
    <AiFieldAssist />
    <AiChat />
  </>
)
