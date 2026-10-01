'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'

// keep in sync with HONEYPOT_FIELD in src/plugins/index.ts
const HONEYPOT = 'company_website'

type Field = NonNullable<FormType['fields']>[number] & {
  name?: string
  label?: string | null
  required?: boolean | null
  width?: number | null
  defaultValue?: unknown
  options?: { label: string; value: string }[]
  message?: unknown
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Renders a Form Builder form with the site's styling. Validation runs in the
 * browser for fast feedback and again on the server (Payload + plugin hooks).
 */
/**
 * `confirmation` and `messages` (rich text) are rendered on the server and passed in,
 * keeping the rich-text renderer out of the browser bundle. Use <SiteFormServer>.
 */
export const SiteForm: React.FC<{
  form: FormType
  footnote?: string | null
  confirmation?: React.ReactNode
  messages?: Record<number, React.ReactNode>
}> = ({ form, footnote, confirmation, messages }) => {
  const uid = useId()
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const fields = (form.fields ?? []) as Field[]
  const formRef = useRef<HTMLFormElement>(null)

  // Prefill selects from the URL, e.g. /contact?service=excavation (links on service & project pages).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    formRef.current?.querySelectorAll('select').forEach((el) => {
      const v = params.get(el.name)
      if (v && Array.from(el.options).some((o) => o.value === v)) el.value = v
    })
  }, [])

  const validate = (data: FormData) => {
    const errs: Record<string, string> = {}
    for (const f of fields) {
      if (!f.name) continue
      const raw = data.get(f.name)
      const value = typeof raw === 'string' ? raw.trim() : raw
      if (f.blockType === 'checkbox') {
        if (f.required && !value) errs[f.name] = 'Please tick this box.'
        continue
      }
      if (f.required && !value)
        errs[f.name] = `Please fill in ${f.label?.toLowerCase() || 'this field'}.`
      else if (f.blockType === 'email' && value && !EMAIL_RE.test(String(value)))
        errs[f.name] = 'Check the email format.'
    }
    return errs
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const el = e.currentTarget
    const data = new FormData(el)
    const errs = validate(data)
    setErrors(errs)
    if (Object.keys(errs).length) {
      el.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }

    setStatus('sending')
    setServerError('')
    const submissionData = fields
      .filter((f) => f.name)
      .map((f) => ({
        field: f.name as string,
        value:
          f.blockType === 'checkbox'
            ? data.get(f.name!)
              ? 'Yes'
              : 'No'
            : String(data.get(f.name!) ?? ''),
      }))
    submissionData.push({ field: HONEYPOT, value: String(data.get(HONEYPOT) ?? '') })

    try {
      const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.id,
          submissionData,
          sourcePage: window.location.pathname,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.errors?.[0]?.message || 'The form could not be sent.')
      }
      setStatus('done')
      if (form.confirmationType === 'redirect' && form.redirect?.url) router.push(form.redirect.url)
    } catch (err) {
      setStatus('error')
      setServerError(err instanceof Error ? err.message : 'The form could not be sent.')
    }
  }

  if (status === 'done' && form.confirmationType !== 'redirect') {
    return (
      <div className="done" role="status">
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
          viewBox="0 0 56 56"
        >
          <circle cx="28" cy="28" r="24" />
          <path d="M17 29l7 7 15-16" />
        </svg>
        {confirmation ? confirmation : <h3>Thanks — we got your request.</h3>}
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} ref={formRef}>
      {status === 'error' ? (
        <div className="form-error" role="alert">
          {serverError} You can also call or text us.
        </div>
      ) : null}
      <div className="form-grid">
        {fields.map((f, i) => {
          if (f.blockType === 'message') {
            return messages?.[i] ? (
              <div className="full" key={i}>
                {messages[i]}
              </div>
            ) : null
          }
          if (!f.name) return null
          const id = `${uid}-${f.name}`
          const err = errors[f.name]
          const full = f.blockType === 'textarea' || (f.width ?? 100) > 50
          const common = {
            id,
            name: f.name,
            'aria-invalid': err ? true : undefined,
            'aria-describedby': err ? `${id}-err` : undefined,
            required: Boolean(f.required),
            onChange: () => err && setErrors((x) => ({ ...x, [f.name!]: '' })),
          }
          const label = (
            <label htmlFor={id}>
              {f.label}
              {f.required ? <span className="req"> *</span> : null}
            </label>
          )
          let control: React.ReactNode
          switch (f.blockType) {
            case 'textarea':
              control = <textarea {...common} defaultValue={(f.defaultValue as string) ?? ''} />
              break
            case 'select':
              control = (
                <select {...common} defaultValue={(f.defaultValue as string) ?? ''}>
                  <option value="">Choose…</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )
              break
            case 'checkbox':
              return (
                <div className={cn('field full', err && 'invalid')} key={i}>
                  <div className="field-check">
                    <input
                      {...common}
                      defaultChecked={Boolean(f.defaultValue)}
                      type="checkbox"
                      value="yes"
                    />
                    {label}
                  </div>
                  {err ? (
                    <div className="err" id={`${id}-err`}>
                      {err}
                    </div>
                  ) : null}
                </div>
              )
            default:
              control = (
                <input
                  {...common}
                  autoComplete={
                    f.blockType === 'email'
                      ? 'email'
                      : /phone|tel/i.test(f.name)
                        ? 'tel'
                        : /name/i.test(f.name)
                          ? 'name'
                          : /address/i.test(f.name)
                            ? 'street-address'
                            : undefined
                  }
                  defaultValue={(f.defaultValue as string) ?? ''}
                  inputMode={
                    (f.blockType as string) === 'number'
                      ? 'decimal'
                      : /phone|tel/i.test(f.name)
                        ? 'tel'
                        : undefined
                  }
                  type={
                    f.blockType === 'email'
                      ? 'email'
                      : /phone|tel/i.test(f.name)
                        ? 'tel'
                        : (f.blockType as string) === 'number'
                          ? 'number'
                          : 'text'
                  }
                />
              )
          }
          return (
            <div className={cn('field', full && 'full', err && 'invalid')} key={i}>
              {label}
              {control}
              {err ? (
                <div className="err" id={`${id}-err`}>
                  {err}
                </div>
              ) : null}
            </div>
          )
        })}
        <div aria-hidden="true" className="hp">
          <label htmlFor={`${uid}-hp`}>Leave this field empty</label>
          <input autoComplete="off" id={`${uid}-hp`} name={HONEYPOT} tabIndex={-1} type="text" />
        </div>
      </div>
      <div className="form-foot">
        {footnote ? <small>{footnote}</small> : <span />}
        <button className="btn btn-primary" disabled={status === 'sending'} type="submit">
          {status === 'sending' ? 'Sending…' : form.submitButtonLabel || 'Send'}
        </button>
      </div>
    </form>
  )
}
