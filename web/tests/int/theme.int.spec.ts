import { describe, expect, it } from 'vitest'

import { contrastRatio, ensureContrast, presets } from '@/theme/presets'
import { resolveTheme, themeToCss } from '@/theme/resolve'

const cssVar = (css: string, name: string) => css.match(new RegExp(`${name}:([^;]+)`))?.[1]

describe('contrast helpers', () => {
  it('computes WCAG contrast ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5)
  })

  it('deepens a colour just enough to reach AA', () => {
    const fixed = ensureContrast('#D96F25', '#FFFFFF', 4.5)
    expect(contrastRatio(fixed, '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(fixed).not.toBe('#000000')
  })

  it('leaves passing colours untouched', () => {
    expect(ensureContrast('#222222', '#FFFFFF')).toBe('#222222')
  })
})

describe('resolveTheme', () => {
  it('falls back to the recommended palette', () => {
    const t = resolveTheme(null)
    expect(t.preset).toBe('studio')
    expect(t.colors.primary).toBe(presets.studio.tokens.colors.primary)
  })

  it('applies valid overrides and ignores invalid ones', () => {
    const t = resolveTheme({
      preset: 'classic',
      colors: { primary: '#123456', background: 'not-a-colour' },
      fontDisplay: 'inter',
      radius: 'preset',
    } as never)
    expect(t.colors.primary).toBe('#123456')
    expect(t.colors.background).toBe(presets.classic.tokens.colors.background)
    expect(t.fontDisplay).toBe('inter')
    expect(t.radius).toBe(presets.classic.tokens.radius)
  })
})

describe('themeToCss', () => {
  const modes = ['deepen', 'vivid'] as const
  const cases = (Object.keys(presets) as (keyof typeof presets)[]).flatMap((key) =>
    modes.map((mode) => [key, mode] as const),
  )
  for (const [key, mode] of cases) {
    it(`${key} / ${mode}: button and brand text meet WCAG AA`, () => {
      const t = resolveTheme({ preset: key, contrastMode: mode } as never)
      const css = themeToCss(t)
      const btn = cssVar(css, '--c-btn')!
      const onBtn = cssVar(css, '--c-on-btn')!
      const text = cssVar(css, '--c-primary-text')!
      expect(contrastRatio(btn, onBtn)).toBeGreaterThanOrEqual(4.5)
      for (const bg of [t.colors.background, t.colors.alt, t.colors.tint]) {
        expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(4.5)
      }
    })
  }

  it('cannot be broken out of the <style> tag by custom CSS', () => {
    const css = themeToCss(
      resolveTheme({ customCss: 'a{}</style><script>alert(1)</script>' } as never),
    )
    expect(css.toLowerCase()).not.toContain('</style')
  })
})

describe('generated palettes', () => {
  const brands = ['#D96F25', '#1F6FEB', '#2E7D32', '#F2C200', '#7A1FA2', '#111111']
  for (const brand of brands) {
    for (const mode of ['light', 'dark'] as const) {
      it(`${brand} / ${mode}: readable text, buttons and brand links`, () => {
        const t = resolveTheme({ preset: 'auto', brandColor: brand, autoMode: mode } as never)
        const css = themeToCss(t)
        expect(contrastRatio(t.colors.text, t.colors.background)).toBeGreaterThanOrEqual(7)
        expect(contrastRatio(t.colors.heading, t.colors.background)).toBeGreaterThanOrEqual(7)
        expect(contrastRatio(cssVar(css, '--c-muted')!, t.colors.alt)).toBeGreaterThanOrEqual(4.5)
        expect(
          contrastRatio(cssVar(css, '--c-btn')!, cssVar(css, '--c-on-btn')!),
        ).toBeGreaterThanOrEqual(4.5)
        expect(
          contrastRatio(cssVar(css, '--c-primary-text')!, t.colors.background),
        ).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('falls back to the logo orange for an invalid brand colour', () => {
    expect(resolveTheme({ preset: 'auto', brandColor: 'nope' } as never).colors.primary).toBe(
      '#D96F25',
    )
  })
})
