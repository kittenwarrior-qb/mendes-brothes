'use client'

import type { SelectFieldClientComponent } from 'payload'

import { FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import React from 'react'

import {
  AUTO_PALETTE,
  type ColorMode,
  generatePalette,
  type NeutralTone,
  presets,
  type ThemeColors,
} from '@/theme/presets'

/** Tiny mock of the site drawn with a palette, so the choice is visual, not a list of names. */
const MiniSite: React.FC<{ c: ThemeColors; darkHeader?: boolean }> = ({ c, darkHeader }) => (
  <div
    aria-hidden="true"
    style={{
      background: c.background,
      borderRadius: 6,
      overflow: 'hidden',
      border: `1px solid ${c.line}`,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 8px',
        background: darkHeader ? c.dark : c.background,
        borderBottom: `1px solid ${c.line}`,
      }}
    >
      <span style={{ width: 26, height: 6, borderRadius: 2, background: c.primary }} />
      <span style={{ width: 22, height: 8, borderRadius: 99, background: c.primary }} />
    </div>
    <div style={{ display: 'flex', gap: 8, padding: '10px 8px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 6, width: '80%', borderRadius: 2, background: c.heading }} />
        <div
          style={{ height: 6, width: '50%', borderRadius: 2, background: c.primary, marginTop: 3 }}
        />
        <div
          style={{
            height: 3,
            width: '90%',
            borderRadius: 2,
            background: c.muted,
            marginTop: 6,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            height: 3,
            width: '70%',
            borderRadius: 2,
            background: c.muted,
            marginTop: 3,
            opacity: 0.6,
          }}
        />
        <div
          style={{ height: 9, width: 34, borderRadius: 99, background: c.primary, marginTop: 7 }}
        />
      </div>
      <div style={{ width: '38%', borderRadius: 5, background: c.tint, minHeight: 44 }} />
    </div>
    <div style={{ display: 'flex', gap: 4, padding: '0 8px 8px' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 16,
            borderRadius: 3,
            background: i === 1 ? c.alt : c.surface,
            border: `1px solid ${c.line}`,
          }}
        />
      ))}
    </div>
    <div style={{ height: 12, background: c.dark }} />
  </div>
)

const Swatches: React.FC<{ c: ThemeColors }> = ({ c }) => (
  <div style={{ display: 'flex', marginTop: 8, borderRadius: 4, overflow: 'hidden', height: 10 }}>
    {[c.primary, c.primaryDeep, c.heading, c.dark, c.alt, c.tint].map((col, i) => (
      <span key={i} style={{ flex: 1, background: col }} title={col} />
    ))}
  </div>
)

/** Visual palette gallery for Theme → Colour palette (replaces the plain select). */
export const PalettePicker: SelectFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const brand = useFormFields(([fields]) => fields.brandColor?.value as string | undefined)
  const tone = useFormFields(([fields]) => fields.neutralTone?.value as NeutralTone | undefined)
  const mode = useFormFields(([fields]) => fields.autoMode?.value as ColorMode | undefined)

  const cards = [
    ...(Object.keys(presets) as (keyof typeof presets)[]).map((key) => ({
      key: key as string,
      label: presets[key].label,
      description: presets[key].description,
      colors: presets[key].tokens.colors as ThemeColors,
      darkHeader: presets[key].tokens.headerStyle === 'dark',
    })),
    {
      key: AUTO_PALETTE,
      label: 'Custom',
      description: 'Pick one brand colour — the full palette is generated for you.',
      colors: generatePalette(brand || '#D96F25', tone || 'warm', mode || 'light'),
      darkHeader: mode === 'dark',
    },
  ]

  return (
    <div className="field-type" style={{ marginBottom: 'calc(var(--base) * 1.2)' }}>
      <FieldLabel label={field.label} path={path} />
      <div
        role="radiogroup"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 12,
        }}
      >
        {cards.map((card) => {
          const selected = value === card.key
          return (
            <button
              aria-checked={selected}
              key={card.key}
              onClick={() => setValue(card.key)}
              role="radio"
              style={{
                textAlign: 'left',
                padding: 10,
                borderRadius: 10,
                cursor: 'pointer',
                background: 'var(--theme-elevation-50)',
                color: 'inherit',
                border: selected
                  ? '2px solid var(--theme-success-500)'
                  : '2px solid var(--theme-elevation-150)',
                boxShadow: selected ? '0 0 0 3px var(--theme-success-100)' : 'none',
              }}
              type="button"
            >
              <MiniSite c={card.colors} darkHeader={card.darkHeader} />
              <Swatches c={card.colors} />
              <div
                style={{
                  fontWeight: 700,
                  marginTop: 8,
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                }}
              >
                {card.label}
                {selected ? <span style={{ color: 'var(--theme-success-500)' }}>✓</span> : null}
              </div>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: 'var(--theme-elevation-600)',
                  marginTop: 2,
                }}
              >
                {card.description}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
