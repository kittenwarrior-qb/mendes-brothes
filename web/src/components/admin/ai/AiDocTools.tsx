'use client'

import { useDocumentInfo, useForm } from '@payloadcms/ui'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CheckIssue } from '@/ai/providerInfo'

import { Icon } from '../icons'
import { runAi, useAiStatus } from './useAi'

type Seo = { title: string; description: string }
type ProjectDraft = { summary: string; paragraphs: string[]; body: unknown }
type Check = { summary: string; issues: CheckIssue[] }

type View =
  | { kind: 'busy'; label: string }
  | { kind: 'error'; message: string }
  | { kind: 'seo'; data: Seo }
  | { kind: 'project'; data: ProjectDraft }
  | { kind: 'check'; data: Check }

const Count: React.FC<{ value: string; max: number }> = ({ value, max }) => (
  <span className={`mb-ai__count${value.length > max ? ' mb-ai__count--over' : ''}`}>
    {value.length} / {max}
  </span>
)

/**
 * "AI" menu next to the Publish button of pages, projects, news posts and services:
 * write the project description, write the Google title and description, or check the
 * document before publishing. Results are shown first and applied only on "Use this".
 */
export const AiDocTools: React.FC = () => {
  const status = useAiStatus()
  const { collectionSlug } = useDocumentInfo()
  const { dispatchFields, getData, getDataByPath, setModified } = useForm()
  const [menu, setMenu] = useState(false)
  const [view, setView] = useState<View | null>(null)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) return
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setMenu(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menu])

  if (!status) return null
  // not connected yet: managers get a quiet pointer to the setup screen, staff see nothing
  if (!status.enabled) {
    return status.canManage ? (
      <Link className="mb-ai__doc-btn mb-ai__doc-btn--setup" href="/admin/ai">
        <Icon name="ai" size={16} /> Set up AI
      </Link>
    ) : null
  }

  const start = async (task: 'seo' | 'project' | 'check', label: string) => {
    setMenu(false)
    setView({ kind: 'busy', label })
    try {
      const data = await runAi({ task, collection: collectionSlug, data: getData() })
      setView({ kind: task, data } as View)
    } catch (err) {
      setView({ kind: 'error', message: err instanceof Error ? err.message : String(err) })
    }
  }

  const set = (path: string, value: unknown, alsoInitial = false) => {
    const before = JSON.stringify(getDataByPath(path) ?? null)
    const write = () =>
      dispatchFields({
        type: 'UPDATE',
        path,
        value,
        // the rich-text editor only redraws when its initial value changes too
        ...(alsoInitial ? { initialValue: value } : {}),
      })
    write()
    // An autosave that was already on its way can answer with the old value and put it
    // back. If that happens (the field is exactly what it was before), write it again.
    for (const ms of [700, 2000])
      setTimeout(() => {
        if (
          JSON.stringify(getDataByPath(path) ?? null) === before &&
          before !== JSON.stringify(value)
        ) {
          write()
          setModified(true)
        }
      }, ms)
  }

  const applySeo = (seo: Seo) => {
    set('meta.title', seo.title)
    set('meta.description', seo.description)
    setModified(true)
    setView(null)
  }
  const applyProject = (draft: ProjectDraft) => {
    set('summary', draft.summary)
    set('body', draft.body, true)
    setModified(true)
    setView(null)
  }

  return (
    <div className="mb-ai__doc" ref={wrap}>
      <button
        aria-expanded={menu}
        aria-haspopup="menu"
        className="mb-ai__doc-btn"
        onClick={() => setMenu((m) => !m)}
        type="button"
      >
        <Icon name="ai" size={16} /> AI
      </button>
      {menu ? (
        <div className="mb-ai__menu" role="menu">
          {collectionSlug === 'projects' ? (
            <button
              onClick={() => start('project', 'Writing the description…')}
              role="menuitem"
              type="button"
            >
              <strong>Write the description</strong>
              <span>From the title, services, town and size you filled in.</span>
            </button>
          ) : null}
          <button
            onClick={() => start('seo', 'Writing the Google title & description…')}
            role="menuitem"
            type="button"
          >
            <strong>Write Google title &amp; description</strong>
            <span>What people see in search results.</span>
          </button>
          <button
            onClick={() => start('check', 'Checking the text…')}
            role="menuitem"
            type="button"
          >
            <strong>Check before publishing</strong>
            <span>Spelling, unclear sentences, missing photo descriptions.</span>
          </button>
        </div>
      ) : null}

      {view
        ? createPortal(
            <div
              className="mb-ai mb-ai__overlay"
              onMouseDown={(e) =>
                e.target === e.currentTarget && view.kind !== 'busy' && setView(null)
              }
            >
              <div aria-modal="true" className="mb-ai__modal" role="dialog">
                {view.kind === 'busy' ? (
                  <p aria-live="polite" className="mb-ai__busy">
                    <span className="mb-ai__spinner" /> {view.label}
                  </p>
                ) : view.kind === 'error' ? (
                  <>
                    <h2>That did not work</h2>
                    <p className="mb-ai__error">{view.message}</p>
                    <div className="mb-ai__foot">
                      <button onClick={() => setView(null)} type="button">
                        Close
                      </button>
                    </div>
                  </>
                ) : view.kind === 'seo' ? (
                  <>
                    <h2>Google title &amp; description</h2>
                    <p className="mb-ai__hint">
                      Edit them if you like, then press “Use this”. You still need to publish.
                    </p>
                    <label>
                      Title <Count max={60} value={view.data.title} />
                      <input
                        onChange={(e) =>
                          setView({ kind: 'seo', data: { ...view.data, title: e.target.value } })
                        }
                        type="text"
                        value={view.data.title}
                      />
                    </label>
                    <label>
                      Description <Count max={160} value={view.data.description} />
                      <textarea
                        onChange={(e) =>
                          setView({
                            kind: 'seo',
                            data: { ...view.data, description: e.target.value },
                          })
                        }
                        rows={3}
                        value={view.data.description}
                      />
                    </label>
                    <div className="mb-ai__foot">
                      <button
                        className="mb-ai__primary"
                        onClick={() => applySeo(view.data)}
                        type="button"
                      >
                        Use this
                      </button>
                      <button onClick={() => start('seo', 'Writing again…')} type="button">
                        Try again
                      </button>
                      <button onClick={() => setView(null)} type="button">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : view.kind === 'project' ? (
                  <>
                    <h2>Project description</h2>
                    <p className="mb-ai__hint">
                      Written only from the details you entered. Read it through: “Use this”
                      replaces the Summary and the full write-up.
                    </p>
                    <label>
                      Summary
                      <textarea
                        onChange={(e) =>
                          setView({
                            kind: 'project',
                            data: { ...view.data, summary: e.target.value },
                          })
                        }
                        rows={3}
                        value={view.data.summary}
                      />
                    </label>
                    <div className="mb-ai__preview">
                      {view.data.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <div className="mb-ai__foot">
                      <button
                        className="mb-ai__primary"
                        onClick={() => applyProject(view.data)}
                        type="button"
                      >
                        Use this
                      </button>
                      <button onClick={() => start('project', 'Writing again…')} type="button">
                        Try again
                      </button>
                      <button onClick={() => setView(null)} type="button">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>
                      {view.data.issues.length
                        ? `${view.data.issues.length} thing${view.data.issues.length === 1 ? '' : 's'} to look at`
                        : 'Looks good'}
                    </h2>
                    {view.data.summary ? <p className="mb-ai__hint">{view.data.summary}</p> : null}
                    {view.data.issues.length ? (
                      <ol className="mb-ai__issues">
                        {view.data.issues.map((issue, i) => (
                          <li key={i}>
                            {issue.where ? (
                              <span className="mb-ai__where">{issue.where}</span>
                            ) : null}
                            <strong>{issue.problem}</strong>
                            {issue.fix ? <span>{issue.fix}</span> : null}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>
                        No spelling mistakes, unclear sentences or missing descriptions were found.
                      </p>
                    )}
                    <div className="mb-ai__foot">
                      <button
                        className="mb-ai__primary"
                        onClick={() => setView(null)}
                        type="button"
                      >
                        Close
                      </button>
                      <button onClick={() => start('check', 'Checking again…')} type="button">
                        Check again
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
