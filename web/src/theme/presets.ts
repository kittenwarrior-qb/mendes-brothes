/**
 * Theme palettes & token model. Pure data + colour maths — imported by the
 * Payload config (options / defaults), the admin palette picker and the
 * frontend (CSS variable generation). No React, no Node APIs.
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

/* ───────────────────────── colour maths ───────────────────────── */

export const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

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

/** WCAG relative luminance contrast ratio between two hex colours. */
export const contrastRatio = (a: string, b: string): number => {
  const lum = (hex: string) => {
    const [r, g, bl] = toRgb(hex).map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

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

export const hexToHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = toRgb(hex).map((v) => v / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h =
    max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s * 100, l * 100]
}

export const hslToHex = (h: number, s: number, l: number) => {
  const sat = s / 100
  const lig = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sat * Math.min(lig, 1 - lig)
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return toHex([f(0) * 255, f(8) * 255, f(4) * 255])
}

/* ───────────────────── palette from one brand colour ───────────────────── */

export type NeutralTone = 'warm' | 'neutral' | 'cool'
export type ColorMode = 'light' | 'dark'

/**
 * Builds a complete, harmonious palette from a single brand colour:
 * tinted neutrals (60%), a deep ink for dark bands (30%) and the brand colour
 * as the accent (10%). Used by the "Custom" palette in the admin.
 */
export const generatePalette = (
  brand: string,
  tone: NeutralTone = 'warm',
  mode: ColorMode = 'light',
): ThemeColors => {
  const primary = HEX_RE.test(brand) ? brand.toUpperCase() : '#D96F25'
  const [brandHue] = hexToHsl(primary)
  // neutrals borrow a hint of colour: the brand hue (warm), slate blue (cool) or none
  const hue =
    tone === 'cool' ? 215 : tone === 'warm' ? (brandHue < 70 || brandHue > 330 ? brandHue : 32) : 0
  const sat = tone === 'neutral' ? 0 : tone === 'cool' ? 14 : 16
  const n = (l: number, s = sat) => hslToHex(hue, s, l)

  const shared = {
    primary,
    primaryHover: mixHex(primary, '#000000', 0.12),
    primaryDeep: mixHex(primary, '#000000', 0.34),
    accent: mixHex(primary, '#FFFFFF', 0.14),
  }

  if (mode === 'dark') {
    const background = n(7.5, sat * 0.6)
    return {
      ...shared,
      primary: ensureContrast(primary, background, 4.5),
      accent: mixHex(primary, '#FFFFFF', 0.3),
      heading: n(95, sat * 0.9),
      text: n(83, sat * 0.6),
      muted: n(62, sat * 0.5),
      background,
      alt: n(10.5, sat * 0.6),
      tint: mixHex(primary, background, 0.86),
      surface: n(13, sat * 0.6),
      line: n(20, sat * 0.6),
      dark: n(4.5, sat * 0.6),
      onDark: '#FFFFFF',
    }
  }

  return {
    ...shared,
    heading: n(13),
    text: n(21, sat * 0.8),
    muted: n(40, sat * 0.6),
    background: tone === 'neutral' ? '#FFFFFF' : n(97.5, sat * 1.4),
    alt: n(94.5, sat * 1.2),
    tint: mixHex(primary, '#FFFFFF', 0.88),
    surface: '#FFFFFF',
    line: n(88, sat * 1.1),
    dark: n(10),
    onDark: '#FFFFFF',
  }
}

/* ───────────────────────── curated palettes ───────────────────────── */

/** Style shared by every palette: the "Studio" layout (see site.css). */
const baseStyle = {
  fontDisplay: 'archivo',
  fontBody: 'inter',
  headingCase: 'none',
  radius: 'sharp',
  buttonShape: 'pill',
  container: 'wide',
  cardStyle: 'flat',
  headerStyle: 'light',
  footerStyle: 'dark',
  colorScheme: 'light',
} as const satisfies Omit<ThemeTokens, 'colors'>

type Palette = { label: string; description: string; tokens: ThemeTokens }

export const presets = {
  studio: {
    label: 'Studio Paper',
    description:
      'Recommended. Warm paper white, near-black type and one construction-orange accent.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#FF5A1F',
        primaryHover: '#F04A10',
        primaryDeep: '#B5380A',
        accent: '#FF5A1F',
        heading: '#181818',
        text: '#2B2B29',
        muted: '#6B6A65',
        background: '#F3F2EE',
        alt: '#EAE8E2',
        tint: '#F9E4D9',
        surface: '#FBFAF7',
        line: '#D8D7D2',
        dark: '#161615',
        onDark: '#FFFFFF',
      },
    },
  },
  classic: {
    label: 'Classic Orange',
    description: 'Logo orange on pure white with charcoal. The look of the first approved demo.',
    tokens: {
      ...baseStyle,
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
    },
  },
  limestone: {
    label: 'Sunset Limestone',
    description: 'Orange on warm sand with espresso-brown bands. Softer and warmer than Classic.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#CF6420',
        primaryHover: '#B75619',
        primaryDeep: '#8A3C0E',
        accent: '#F28C28',
        heading: '#2A1F17',
        text: '#40342B',
        muted: '#74685C',
        background: '#F7F1E7',
        alt: '#EDE3D3',
        tint: '#F8E4D0',
        surface: '#FFFDF9',
        line: '#DDD0BC',
        dark: '#2B1E15',
        onDark: '#FFFFFF',
      },
    },
  },
  graphite: {
    label: 'Graphite & Ember',
    description: 'Dark site with glowing orange. Makes photos stand out.',
    tokens: {
      ...baseStyle,
      headerStyle: 'dark',
      cardStyle: 'flat',
      colorScheme: 'dark',
      colors: {
        primary: '#F07A22',
        primaryHover: '#FF8E3A',
        primaryDeep: '#B4530F',
        accent: '#FFB067',
        heading: '#F5F0E8',
        text: '#D6CFC4',
        muted: '#A1988C',
        background: '#141312',
        alt: '#1B1917',
        tint: '#2A2018',
        surface: '#201D1A',
        line: '#332E29',
        dark: '#0C0B0A',
        onDark: '#FFFFFF',
      },
    },
  },
  steel: {
    label: 'Steel Blue',
    description: 'Blue and navy on clean white. Reads as dependable and professional.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#1D5FA8',
        primaryHover: '#174E8C',
        primaryDeep: '#103A69',
        accent: '#3D8BE0',
        heading: '#0F2238',
        text: '#24364A',
        muted: '#5A6B7D',
        background: '#FFFFFF',
        alt: '#F1F5F9',
        tint: '#E6EFF9',
        surface: '#FFFFFF',
        line: '#D9E2EC',
        dark: '#0D1B2C',
        onDark: '#FFFFFF',
      },
    },
  },
  forest: {
    label: 'Forest Green',
    description: 'Deep green on soft cream. Suits land clearing and landscaping.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#2E7D4F',
        primaryHover: '#256941',
        primaryDeep: '#174A2C',
        accent: '#4FA56F',
        heading: '#17251C',
        text: '#2C3A30',
        muted: '#5D6B60',
        background: '#FAFAF5',
        alt: '#EEF2E8',
        tint: '#E3F0E6',
        surface: '#FFFFFF',
        line: '#DAE2D5',
        dark: '#132119',
        onDark: '#FFFFFF',
      },
    },
  },
  amber: {
    label: 'Hi-Vis Amber',
    description: 'Machine yellow with black, like the equipment itself. Bold and loud.',
    tokens: {
      ...baseStyle,
      headerStyle: 'dark',
      colors: {
        primary: '#E8A013',
        primaryHover: '#D18D0A',
        primaryDeep: '#8A5A00',
        accent: '#FFC53D',
        heading: '#171717',
        text: '#2A2A2A',
        muted: '#636363',
        background: '#FFFFFF',
        alt: '#F4F4F2',
        tint: '#FDF5E1',
        surface: '#FFFFFF',
        line: '#E5E3DD',
        dark: '#151515',
        onDark: '#FFFFFF',
      },
    },
  },
  midnight: {
    label: 'Midnight Blue',
    description: 'Dark navy site with bright sky blue. Modern and calm.',
    tokens: {
      ...baseStyle,
      headerStyle: 'dark',
      cardStyle: 'flat',
      colorScheme: 'dark',
      colors: {
        primary: '#4DA3FF',
        primaryHover: '#74B8FF',
        primaryDeep: '#1F6FCC',
        accent: '#9CCBFF',
        heading: '#EEF3FA',
        text: '#C9D3E0',
        muted: '#93A1B3',
        background: '#0D1420',
        alt: '#121B2A',
        tint: '#16263D',
        surface: '#172131',
        line: '#26334A',
        dark: '#080D16',
        onDark: '#FFFFFF',
      },
    },
  },
  olive: {
    label: 'Olive & Sand',
    description: 'Olive green with sandy neutrals. Earthy and outdoorsy.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#6F7D2B',
        primaryHover: '#5D6923',
        primaryDeep: '#3F4816',
        accent: '#A3B14A',
        heading: '#23261A',
        text: '#36392B',
        muted: '#666A57',
        background: '#F8F6EE',
        alt: '#EFECDF',
        tint: '#EDF0D8',
        surface: '#FFFFFF',
        line: '#DFDBC8',
        dark: '#1D2014',
        onDark: '#FFFFFF',
      },
    },
  },
  teal: {
    label: 'Deep Teal',
    description: 'Teal with cool greys. Fresh, a little different from other contractors.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#0F766E',
        primaryHover: '#0B5F59',
        primaryDeep: '#084540',
        accent: '#2BB3A6',
        heading: '#0F2A2E',
        text: '#25393C',
        muted: '#586C6F',
        background: '#FBFCFC',
        alt: '#EEF4F4',
        tint: '#DFF2EF',
        surface: '#FFFFFF',
        line: '#D5E1E1',
        dark: '#0B2226',
        onDark: '#FFFFFF',
      },
    },
  },
  brick: {
    label: 'Brick Red',
    description: 'Strong red with black and white. Confident and hard to miss.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#B8322A',
        primaryHover: '#9E2820',
        primaryDeep: '#6F1A14',
        accent: '#E4572E',
        heading: '#1E1A19',
        text: '#33302E',
        muted: '#68625F',
        background: '#FFFFFF',
        alt: '#F5F3F1',
        tint: '#FBEAE8',
        surface: '#FFFFFF',
        line: '#E6E1DD',
        dark: '#1B1716',
        onDark: '#FFFFFF',
      },
    },
  },
  lime: {
    label: 'Carbon & Lime',
    description: 'Black site with safety-vest lime. The most eye-catching option.',
    tokens: {
      ...baseStyle,
      headerStyle: 'dark',
      cardStyle: 'flat',
      colorScheme: 'dark',
      colors: {
        primary: '#B6E034',
        primaryHover: '#C8EE55',
        primaryDeep: '#7FA013',
        accent: '#D9F77A',
        heading: '#F4F6EF',
        text: '#D0D4C8',
        muted: '#9A9F92',
        background: '#121411',
        alt: '#181B16',
        tint: '#232A14',
        surface: '#1D201A',
        line: '#2F3329',
        dark: '#0A0B09',
        onDark: '#FFFFFF',
      },
    },
  },
  mono: {
    label: 'Black & White',
    description: 'Only black, white and grey. Lets the photos carry the colour.',
    tokens: {
      ...baseStyle,
      colors: {
        primary: '#141414',
        primaryHover: '#000000',
        primaryDeep: '#000000',
        accent: '#6B6B6B',
        heading: '#111111',
        text: '#2B2B2B',
        muted: '#6A6A6A',
        background: '#FFFFFF',
        alt: '#F4F4F4',
        tint: '#EDEDED',
        surface: '#FFFFFF',
        line: '#E2E2E2',
        dark: '#111111',
        onDark: '#FFFFFF',
      },
    },
  },
} satisfies Record<string, Palette>

export type PresetKey = keyof typeof presets

/** Palette built on the fly from Theme → brand colour (see generatePalette). */
export const AUTO_PALETTE = 'auto'

export const presetOptions = [
  ...(Object.keys(presets) as PresetKey[]).map((value) => ({ label: presets[value].label, value })),
  { label: 'Custom — from your brand colour', value: AUTO_PALETTE },
]

export const defaultStyle = baseStyle
