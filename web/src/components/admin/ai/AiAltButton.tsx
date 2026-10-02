'use client'

import { useDocumentInfo, useField } from '@payloadcms/ui'
import React, { useState } from 'react'

import { Icon } from '../icons'
import { runAi, useAiStatus } from './useAi'

/** Under the "Alt text" field of a photo: let the AI look at the photo and describe it. */
export const AiAltButton: React.FC = () => {
  const status = useAiStatus()
  const { id } = useDocumentInfo()
  const { setValue } = useField<string>({ path: 'alt' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!status?.enabled || !status.vision) return null
  if (!id) {
    return status.autoAlt ? (
      <p className="mb-ai__note">
        <Icon name="ai" size={15} /> Leave “Alt text” empty and the AI writes it when you save.
      </p>
    ) : null
  }

  const describe = async () => {
    setBusy(true)
    setError('')
    try {
      const { alt } = await runAi<{ alt: string }>({ task: 'alt', mediaId: id })
      setValue(alt)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-ai__inline">
      <button className="mb-ai__doc-btn" disabled={busy} onClick={describe} type="button">
        {busy ? <span className="mb-ai__spinner" /> : <Icon name="ai" size={16} />}
        {busy ? 'Looking at the photo…' : 'Describe this photo'}
      </button>
      {error ? <p className="mb-ai__error">{error}</p> : null}
    </div>
  )
}
