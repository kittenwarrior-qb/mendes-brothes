'use client'

import type { TextFieldClientComponent } from 'payload'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import React from 'react'

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

const expand = (hex: string) =>
  hex.length === 4
    ? '#' +
      hex
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
    : hex

/** Text field with a native colour picker + swatch. Empty value = inherit from preset. */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })
  const valid = !!value && HEX_RE.test(value)

  return (
    <div className="field-type text" style={{ marginBottom: 'var(--base)' }}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          aria-label={`Pick ${typeof field.label === 'string' ? field.label : 'colour'}`}
          type="color"
          value={valid ? expand(value) : '#ffffff'}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          style={{
            width: 40,
            height: 40,
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            background: 'none',
            cursor: 'pointer',
            opacity: valid ? 1 : 0.35,
          }}
        />
        <input
          className={showError ? 'error' : undefined}
          type="text"
          value={value || ''}
          placeholder={field.admin?.placeholder as string | undefined}
          onChange={(e) => setValue(e.target.value.trim())}
          style={{ flex: 1, minWidth: 0 }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => setValue('')}
            title="Reset to preset"
            style={{
              border: 0,
              background: 'none',
              cursor: 'pointer',
              color: 'var(--theme-elevation-500)',
              fontSize: 18,
            }}
          >
            ×
          </button>
        ) : null}
      </div>
      <FieldError path={path} showError={showError} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
