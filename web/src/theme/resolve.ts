import type { Theme } from '@/payload-types'

import { displayTracking, displayWeight, fontStack } from './fonts'
import {
  AUTO_PALETTE,
  type ColorMode,
  contrastRatio,
  defaultStyle,
  ensureContrast,
  generatePalette,
  HEX_RE,
  mixHex,
  type NeutralTone,
  presets,
  type PresetKey,
  type ThemeColors,
  type ThemeTokens,
} from './presets'

export type ResolvedTheme = ThemeTokens & {
  preset: PresetKey | typeof AUTO_PALETTE
  stickyHeader: boolean
  animations: boolean
  baseFontSize: number
  customCss: string
  contrastMode: 'deepen' | 'vivid' | 'off'
}

const pick = <T extends string>(value: string | null | undefined, fallback: T): T =>
  value && value !== 'preset' ? (value as T) : fallback

/** Colours + style of the selected palette, before any per-colour overrides. */
export const paletteTokens = (theme?: Partial<Theme> | null): ThemeTokens => {
  if (theme?.preset === AUTO_PALETTE) {
    const mode = (theme.autoMode as ColorMode) || 'light'
    return {
      ...defaultStyle,
      colorScheme: mode,
      headerStyle: mode === 'dark' ? 'dark' : 'light',
      footerStyle: 'dark',
      cardStyle: 'flat',
      colors: generatePalette(
        theme.brandColor || '#D96F25',
        (theme.neutralTone as NeutralTone) || 'warm',
        mode,
      ),
    }
  }
  const key: PresetKey =
    theme?.preset && theme.preset in presets ? (theme.preset as PresetKey) : 'studio'
  return presets[key].tokens
}

/** Merge the Theme global (overrides) on top of its palette. */
export const resolveTheme = (theme?: Partial<Theme> | null): ResolvedTheme => {
  const presetKey =
    theme?.preset === AUTO_PALETTE
      ? AUTO_PALETTE
      : theme?.preset && theme.preset in presets
        ? (theme.preset as PresetKey)
        : 'studio'
  const base = paletteTokens(theme)

  const colors = { ...base.colors }
  const overrides = (theme?.colors ?? {}) as Partial<Record<keyof ThemeColors, string | null>>
  for (const key of Object.keys(colors) as (keyof ThemeColors)[]) {
    const v = overrides[key]
    if (v && HEX_RE.test(v)) colors[key] = v
  }

  return {
    preset: presetKey,
    colors,
    fontDisplay: pick(theme?.fontDisplay, base.fontDisplay),
    fontBody: pick(theme?.fontBody, base.fontBody),
    headingCase: pick(theme?.headingCase, base.headingCase),
    radius: pick(theme?.radius, base.radius),
    buttonShape: pick(theme?.buttonShape, base.buttonShape),
    container: pick(theme?.container, base.container),
    cardStyle: pick(theme?.cardStyle, base.cardStyle),
    headerStyle: pick(theme?.headerStyle, base.headerStyle),
    footerStyle: pick(theme?.footerStyle, base.footerStyle),
    colorScheme: base.colorScheme,
    stickyHeader: theme?.stickyHeader ?? true,
    animations: theme?.animations ?? true,
    baseFontSize: theme?.baseFontSize ?? 16.5,
    customCss: theme?.customCss ?? '',
    contrastMode: (theme?.contrastMode as ResolvedTheme['contrastMode']) || 'deepen',
  }
}

const radii = {
  sharp: { r: '2px', lg: '4px' },
  soft: { r: '6px', lg: '10px' },
  rounded: { r: '10px', lg: '18px' },
}
const buttonRadius = { square: '2px', rounded: '8px', pill: '999px' }
const containers = { narrow: '1120px', default: '1280px', wide: '1440px' }
const cards = {
  bordered: {
    border: '1px solid var(--c-line)',
    shadow: 'none',
    hover: '0 14px 34px rgb(0 0 0 / .10)',
  },
  shadow: {
    border: '1px solid transparent',
    shadow: '0 8px 28px rgb(0 0 0 / .08)',
    hover: '0 18px 44px rgb(0 0 0 / .14)',
  },
  flat: { border: '1px solid transparent', shadow: 'none', hover: 'none' },
}

/** CSS custom properties consumed by site.css. Rendered server-side in <head>. */
export const themeToCss = (t: ResolvedTheme): string => {
  const c = t.colors
  const card = cards[t.cardStyle]
  // WCAG AA: brand-coloured text on the page background, and white text on buttons.
  const strict = t.contrastMode !== 'off'
  // checked against the lightest-contrast section background it may sit on
  const primaryText = strict
    ? [c.background, c.alt, c.tint].reduce((col, bg) => ensureContrast(col, bg, 4.6), c.primary)
    : c.primary
  // Buttons. "vivid": keep the brand colour and use dark text whenever that is readable.
  // "deepen": darken the colour just enough for white text — except for very bright
  // colours (yellow, amber, neon orange) where white could never work.
  const darkText = '#111111'
  const darkPasses = contrastRatio(c.primary, darkText) >= 4.5
  const useDarkText =
    strict && darkPasses && (t.contrastMode === 'vivid' || contrastRatio(c.primary, '#FFFFFF') < 3)
  const onBtn = useDarkText ? darkText : '#FFFFFF'
  const btn = strict && !useDarkText ? ensureContrast(c.primary, '#FFFFFF', 4.6) : c.primary
  const btnHover =
    strict && !useDarkText ? ensureContrast(c.primaryHover, '#FFFFFF') : c.primaryHover
  const onWhite = strict ? ensureContrast(c.primary, '#FFFFFF', 4.6) : c.primary
  const deepOnTint = strict ? ensureContrast(c.primaryDeep, c.tint) : c.primaryDeep
  const muted = strict ? ensureContrast(c.muted, c.alt) : c.muted
  const vars: Record<string, string> = {
    '--c-primary': c.primary,
    '--c-primary-hover': c.primaryHover,
    '--c-primary-deep': c.primaryDeep,
    '--c-accent': c.accent,
    '--c-heading': c.heading,
    '--c-text': c.text,
    '--c-muted': muted,
    '--c-primary-text': primaryText,
    '--c-btn': btn,
    '--c-btn-hover': btnHover === btn ? mixHex(btn, '#000000', 0.1) : btnHover,
    '--c-deep-on-tint': deepOnTint,
    '--c-on-btn': onBtn,
    '--c-on-white': onWhite,
    // brand colour for text/icons on dark bands (lightened if the brand colour is too dark)
    '--c-primary-on-dark': strict ? ensureContrast(c.primary, c.dark, 4.6) : c.primary,
    '--c-bg': c.background,
    '--c-alt': c.alt,
    '--c-tint': c.tint,
    '--c-surface': c.surface,
    '--c-line': c.line,
    '--c-dark': c.dark,
    '--c-on-dark': c.onDark,
    // white text sits on the gradient, so it starts from the accessible button colour
    '--grad': strict
      ? `linear-gradient(150deg, ${onWhite} 0%, ${mixHex(onWhite, c.primaryDeep, 0.5)} 50%, ${c.primaryDeep} 100%)`
      : `linear-gradient(150deg, color-mix(in srgb, ${c.primary} 88%, #fff) 0%, ${c.primary} 42%, ${c.primaryDeep} 100%)`,
    '--f-display': fontStack[t.fontDisplay],
    '--f-body': fontStack[t.fontBody],
    '--w-display': String(displayWeight[t.fontDisplay]),
    '--h-track': displayTracking[t.fontDisplay],
    '--h-case': t.headingCase,
    '--fs-base': `${t.baseFontSize}px`,
    '--r': radii[t.radius].r,
    '--r-lg': radii[t.radius].lg,
    '--r-btn': buttonRadius[t.buttonShape],
    '--wrap': containers[t.container],
    '--card-border': card.border,
    '--card-shadow': card.shadow,
    '--card-shadow-hover': card.hover,
    'color-scheme': t.colorScheme,
  }
  const body = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  // Custom CSS comes from admins only; still make sure it cannot close the <style> tag.
  const custom = t.customCss.replace(/<\/style/gi, '')
  return `:root{${body}}${custom}`
}
