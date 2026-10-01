'use client'

import type { TextFieldClientComponent } from 'payload'

import { FieldDescription, FieldError, FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import React from 'react'

import { contrastRatio, HEX_RE, type ThemeColors } from '@/theme/presets'
import { paletteTokens } from '@/theme/resolve'

const expand = (hex: string) =>
  hex.length === 4
    ? '#' +
      hex
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
    : hex

/**
 * Hex text field with a native colour picker. For the per-colour overrides
 * (`colors.*`) an empty value means "from the palette" and the swatch shows the
 * colour currently in use, so admins always see what they are changing.
 */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })

  // separate primitive selectors: each only re-renders this field when its value changes
  const preset = useFormFields(([f]) => f.preset?.value as string | undefined)
  const brandColor = useFormFields(([f]) => f.brandColor?.value as string | undefined)
  const neutralTone = useFormFields(([f]) => f.neutralTone?.value as string | undefined)
  const autoMode = useFormFields(([f]) => f.autoMode?.value as string | undefined)
  const paletteState = { preset, brandColor, neutralTone, autoMode }

  const key = path.startsWith('colors.') ? (path.slice(7) as keyof ThemeColors) : null
  const palette = paletteTokens(paletteState as never).colors
  const inherited = key ? palette[key] : undefined

  const valid = !!value && HEX_RE.test(value)
  const shown = valid ? expand(value) : inherited || '#ffffff'

  // quick readability hint for text colours against the page background
  const isTextColor = key === 'heading' || key === 'text' || key === 'muted'
  const ratio = isTextColor ? contrastRatio(shown, palette.background) : null

  return (
    <div className="field-type text" style={{ marginBottom: 'var(--base)' }}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          aria-label={`Pick ${typeof field.label === 'string' ? field.label : 'colour'}`}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          style={{
            width: 40,
            height: 40,
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            background: 'none',
            cursor: 'pointer',
            flex: 'none',
          }}
          type="color"
          value={shown}
        />
        <input
          className={showError ? 'error' : undefined}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder={inherited ? `${inherited} (palette)` : (field.admin?.placeholder as string)}
          style={{ flex: 1, minWidth: 0 }}
          type="text"
          value={value || ''}
        />
        {value && key ? (
          <button
            onClick={() => setValue('')}
            style={{
              border: 0,
              background: 'none',
              cursor: 'pointer',
              color: 'var(--theme-elevation-500)',
              fontSize: 18,
            }}
            title="Back to the palette colour"
            type="button"
          >
            ×
          </button>
        ) : null}
      </div>
      {ratio !== null && ratio < 4.5 ? (
        <div style={{ color: 'var(--theme-warning-600, #b45309)', fontSize: 12, marginTop: 4 }}>
          Low contrast on the page background ({ratio.toFixed(1)}:1 — aim for 4.5:1)
        </div>
      ) : null}
      <FieldError path={path} showError={showError} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
