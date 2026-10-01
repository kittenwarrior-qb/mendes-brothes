/**
 * Theme presets & token model. Pure data — imported by both the Payload config
 * (select options / defaults) and the frontend (CSS variable generation).
 */

export const fontOptions = [
  { label: 'Russo One (bold display)', value: 'russo' },
  { label: 'Montserrat', value: 'montserrat' },
  { label: 'Inter', value: 'inter' },
  { label: 'Oswald (condensed)', value: 'oswald' },
  { label: 'Barlow Condensed', value: 'barlowCondensed' },
  { label: 'Barlow', value: 'barlow' },
  { label: 'Archivo', value: 'archivo' },
  { label: 'Playfair Display (serif)', value: 'playfair' },
  { label: 'DM Sans', value: 'dmSans' },
] as const

export type FontKey = (typeof fontOptions)[number]['value']

export type ThemeColors = {
  primary: string
  primaryHover: string
  primaryDeep: string
  accent: string
  heading: string
  text: string
  muted: string
  background: string
  alt: string
  tint: string
  surface: string
  line: string
  dark: string
  onDark: string
}

export type ThemeTokens = {
  colors: ThemeColors
  fontDisplay: FontKey
  fontBody: FontKey
  headingCase: 'uppercase' | 'none'
  radius: 'sharp' | 'soft' | 'rounded'
  buttonShape: 'square' | 'rounded' | 'pill'
  container: 'narrow' | 'default' | 'wide'
  cardStyle: 'bordered' | 'shadow' | 'flat'
  headerStyle: 'light' | 'dark' | 'brand'
  footerStyle: 'light' | 'dark'
  colorScheme: 'light' | 'dark'
}

export const colorFieldLabels: Record<keyof ThemeColors, { label: string; description: string }> = {
  primary: { label: 'Primary', description: 'Buttons, links, highlights.' },
  primaryHover: { label: 'Primary (hover)', description: 'Buttons when hovered.' },
  primaryDeep: { label: 'Primary (deep)', description: 'End of the brand gradient, tag text.' },
  accent: { label: 'Accent', description: 'Bright highlight (focus rings, small accents).' },
  heading: { label: 'Headings', description: 'Titles on light backgrounds.' },
  text: { label: 'Body text', description: '' },
  muted: { label: 'Muted text', description: 'Intros, captions, meta.' },
  background: { label: 'Page background', description: '' },
  alt: { label: 'Alternate section', description: 'Light grey sections, inner page heroes.' },
  tint: { label: 'Brand tint', description: 'Soft brand-coloured sections and tags.' },
  surface: { label: 'Cards', description: 'Card and form background.' },
  line: { label: 'Borders', description: '' },
  dark: { label: 'Dark sections', description: 'Background of dark bands and dark footer.' },
  onDark: { label: 'Text on dark', description: '' },
}

export const presets = {
  classic: {
    label: 'Classic Orange (Mẫu 1)',
    tokens: {
      colors: {
        primary: '#D96F25',
        primaryHover: '#C35E1B',
        primaryDeep: '#A0410B',
        accent: '#F57F03',
        heading: '#383838',
        text: '#2B2B2B',
        muted: '#666666',
        background: '#FFFFFF',
        alt: '#F5F5F4',
        tint: '#FDF2EA',
        surface: '#FFFFFF',
        line: '#E8E4E0',
        dark: '#1E2023',
        onDark: '#FFFFFF',
      },
      fontDisplay: 'russo',
      fontBody: 'montserrat',
      headingCase: 'uppercase',
      radius: 'rounded',
      buttonShape: 'pill',
      container: 'default',
      cardStyle: 'bordered',
      headerStyle: 'light',
      footerStyle: 'light',
      colorScheme: 'light',
    },
  },
  heavyIron: {
    label: 'Heavy Iron (dark industrial)',
    tokens: {
      colors: {
        primary: '#F57F03',
        primaryHover: '#FF9426',
        primaryDeep: '#B85A00',
        accent: '#FFB347',
        heading: '#F4F1EC',
        text: '#D9D5CF',
        muted: '#9C968E',
        background: '#121315',
        alt: '#1A1C1F',
        tint: '#24201B',
        surface: '#1C1E21',
        line: '#2E3135',
        dark: '#0B0C0D',
        onDark: '#FFFFFF',
      },
      fontDisplay: 'barlowCondensed',
      fontBody: 'barlow',
      headingCase: 'uppercase',
      radius: 'sharp',
      buttonShape: 'square',
      container: 'wide',
      cardStyle: 'flat',
      headerStyle: 'dark',
      footerStyle: 'dark',
      colorScheme: 'dark',
    },
  },
  earthStone: {
    label: 'Earth & Stone (premium editorial)',
    tokens: {
      colors: {
        primary: '#4E6B3A',
        primaryHover: '#3F5A2E',
        primaryDeep: '#2F4322',
        accent: '#C8783A',
        heading: '#2A2620',
        text: '#3B362E',
        muted: '#7A7266',
        background: '#FAF7F1',
        alt: '#F1ECE2',
        tint: '#ECEFE4',
        surface: '#FFFFFF',
        line: '#E3DCCF',
        dark: '#23261F',
        onDark: '#F6F3EC',
      },
      fontDisplay: 'playfair',
      fontBody: 'dmSans',
      headingCase: 'none',
      radius: 'soft',
      buttonShape: 'rounded',
      container: 'default',
      cardStyle: 'shadow',
      headerStyle: 'light',
      footerStyle: 'dark',
      colorScheme: 'light',
    },
  },
} satisfies Record<string, { label: string; tokens: ThemeTokens }>

export type PresetKey = keyof typeof presets

export const presetOptions = (Object.keys(presets) as PresetKey[]).map((value) => ({
  label: presets[value].label,
  value,
}))

export const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

/** WCAG relative luminance contrast ratio between two hex colours. */
export const contrastRatio = (a: string, b: string): number => {
  const lum = (hex: string) => {
    let h = hex.replace('#', '')
    if (h.length === 3)
      h = h
        .split('')
        .map((c) => c + c)
        .join('')
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

const toRgb = (hex: string) => {
  let h = hex.replace('#', '')
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const toHex = (rgb: number[]) =>
  '#' +
  rgb
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
    .toUpperCase()

/** Mix `hex` toward `target` by t (0..1). */
export const mixHex = (hex: string, target: string, t: number) => {
  const a = toRgb(hex)
  const b = toRgb(target)
  return toHex(a.map((v, i) => v + (b[i] - v) * t))
}

/**
 * Smallest shift of `color` toward black (or white) that reaches `ratio`
 * contrast against `against`. Keeps the brand hue while meeting WCAG AA.
 */
export const ensureContrast = (color: string, against: string, ratio = 4.5) => {
  if (contrastRatio(color, against) >= ratio) return color
  const towards =
    contrastRatio('#000000', against) >= contrastRatio('#FFFFFF', against) ? '#000000' : '#FFFFFF'
  for (let t = 0.04; t <= 1; t += 0.04) {
    const c = mixHex(color, towards, t)
    if (contrastRatio(c, against) >= ratio) return c
  }
  return towards
}
