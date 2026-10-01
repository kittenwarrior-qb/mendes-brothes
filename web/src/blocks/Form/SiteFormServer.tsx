import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import React from 'react'

import RichText from '@/components/RichText'

import { SiteForm } from './SiteForm'

/** Server wrapper: renders the form's rich text here so it never ships as client JS. */
export const SiteFormServer: React.FC<{ form: FormType; footnote?: string | null }> = ({
  form,
  footnote,
}) => {
  const messages: Record<number, React.ReactNode> = {}
  ;(form.fields ?? []).forEach((f, i) => {
    if (f.blockType === 'message' && 'message' in f && f.message) {
      messages[i] = <RichText data={f.message as never} enableGutter={false} enableProse={false} />
    }
  })
  return (
    <SiteForm
      confirmation={
        form.confirmationMessage ? (
          <RichText data={form.confirmationMessage} enableGutter={false} enableProse={false} />
        ) : undefined
      }
      footnote={footnote}
      form={form}
      messages={messages}
    />
  )
}
