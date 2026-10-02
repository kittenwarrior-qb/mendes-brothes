'use client'

import React, { useState } from 'react'

import { type AiStatus, type ProviderId, providerById, providers } from '@/ai/providerInfo'

import { Icon } from '../icons'
import { setAiStatus } from './useAi'

const post = async (payload: Record<string, unknown>): Promise<AiStatus> => {
  const res = await fetch('/api/ai/settings', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || 'Something went wrong. Try again.')
  return data as AiStatus
}

const whereToFindIt = [
  [
    'Next to any text box',
    'Click into a text box and press the small “AI” button above it: fix spelling, make it clearer, shorter, or translate to English.',
  ],
  [
    'Next to the Publish button',
    'On a page, project, news post or service, the “AI” button writes the Google title and description, writes a project description, or checks the page.',
  ],
  [
    'On photos',
    'New photos get a description written for them. For an older photo, open it and press “Describe this photo”.',
  ],
]

export const AiSettingsClient: React.FC<{ initial: AiStatus }> = ({ initial }) => {
  const [status, setStatus] = useState(initial)
  const [provider, setProvider] = useState<ProviderId>(initial.provider ?? 'gemini')
  const [apiKey, setApiKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [changing, setChanging] = useState(!initial.enabled)

  const info = providerById(provider)!
  const connected = status.enabled ? providerById(status.provider) : undefined

  const send = async (payload: Record<string, unknown>, after?: () => void) => {
    setBusy(true)
    setError('')
    try {
      const next = await post(payload)
      setStatus(next)
      setAiStatus(next)
      after?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-ai-setup">
      {status.enabled && connected ? (
        <section className="mb-ai-setup__status">
          <span className="mb-tile__icon">
            <Icon name="ai" size={26} />
          </span>
          <div>
            <strong className="mb-tile__title">Connected to {connected.name}</strong>
            <span className="mb-tile__text">
              Key ending in {status.keyHint?.replace('…', '')} · model {status.model}
              {status.vision ? '' : ' · this service cannot describe photos'}
            </span>
          </div>
          <div className="mb-ai-setup__status-actions">
            <button
              className="mb-btn"
              disabled={busy}
              onClick={() => setChanging((c) => !c)}
              type="button"
            >
              {changing ? 'Cancel' : 'Change key'}
            </button>
            <button
              className="mb-btn"
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    'Remove the key? The AI buttons disappear until a new key is added.',
                  )
                )
                  void send({ remove: true }, () => setChanging(true))
              }}
              type="button"
            >
              Remove
            </button>
          </div>
        </section>
      ) : null}

      {changing ? (
        <>
          <h2 className="mb-h2">1. Choose a service</h2>
          <div className="mb-ai-setup__providers" role="radiogroup">
            {providers.map((p) => (
              <button
                aria-checked={provider === p.id}
                className={`mb-ai-setup__provider${provider === p.id ? ' is-selected' : ''}`}
                key={p.id}
                onClick={() => {
                  setProvider(p.id)
                  setError('')
                }}
                role="radio"
                type="button"
              >
                <span className={`mb-ai-setup__badge${p.free ? ' is-free' : ''}`}>
                  {p.free ? 'Free' : 'Paid'}
                </span>
                <strong>{p.name}</strong>
                <span>{p.blurb}</span>
              </button>
            ))}
          </div>

          <h2 className="mb-h2">2. Get your key from {info.company}</h2>
          <ol className="mb-ai-setup__steps">
            {info.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <a className="mb-btn" href={info.keyUrl} rel="noreferrer" target="_blank">
            Open {info.company} to get a key <Icon name="external" size={18} />
          </a>

          <h2 className="mb-h2">3. Paste the key</h2>
          <form
            className="mb-ai-setup__form"
            onSubmit={(e) => {
              e.preventDefault()
              void send({ provider, apiKey }, () => {
                setApiKey('')
                setChanging(false)
              })
            }}
          >
            <input
              aria-label="API key"
              autoComplete="off"
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={info.keyExample}
              spellCheck={false}
              type="password"
              value={apiKey}
            />
            <button
              className="mb-btn mb-btn--primary"
              disabled={busy || apiKey.trim().length < 10}
              type="submit"
            >
              {busy ? 'Testing the key…' : 'Test & save'}
            </button>
          </form>
          <p className="mb-muted mb-ai-setup__small">
            The key is tested before it is saved, stored encrypted on this server, and never shown
            again. Text you ask the AI to work on is sent to {info.company}.
          </p>
        </>
      ) : null}

      {error ? (
        <p className="mb-ai__error" role="alert">
          {error}
        </p>
      ) : null}

      {status.enabled ? (
        <>
          <label className="mb-ai-setup__toggle">
            <input
              checked={status.autoAlt}
              disabled={busy || !status.vision}
              onChange={(e) => void send({ autoAlt: e.target.checked })}
              type="checkbox"
            />
            Describe new photos automatically when they are uploaded
          </label>

          <h2 className="mb-h2">Where to find it</h2>
          <ul className="mb-ai-setup__where">
            {whereToFindIt.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <p className="mb-muted mb-ai-setup__small">
            The AI only suggests. Nothing changes on the website until you press “Use this” and then
            publish.
          </p>
        </>
      ) : null}
    </div>
  )
}
