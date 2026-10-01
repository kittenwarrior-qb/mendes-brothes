import type { FontKey } from './presets'

/*
 * All selectable fonts are self-hosted (public/fonts + src/theme/fonts.css). Only the
 * @font-face rules ship with every page; the browser downloads a file only when the
 * active theme uses it, and the layout preloads exactly the two active fonts.
 */

const fallbacks = {
  display: "'Arial Black', Impact, system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
}

export const fontStack: Record<FontKey, string> = {
  russo: `'Russo One', ${fallbacks.display}`,
  montserrat: `'Montserrat Variable', ${fallbacks.sans}`,
  inter: `'Inter Variable', ${fallbacks.sans}`,
  oswald: `'Oswald Variable', ${fallbacks.display}`,
  barlowCondensed: `'Barlow Condensed', ${fallbacks.display}`,
  barlow: `'Barlow', ${fallbacks.sans}`,
  archivo: `'Archivo Variable', ${fallbacks.sans}`,
  playfair: `'Playfair Display Variable', ${fallbacks.serif}`,
  dmSans: `'DM Sans Variable', ${fallbacks.sans}`,
}

/** Heading weight per display font (single-weight fonts must stay at 400). */
export const displayWeight: Record<FontKey, number> = {
  russo: 400,
  montserrat: 800,
  inter: 800,
  oswald: 600,
  barlowCondensed: 700,
  barlow: 700,
  archivo: 800,
  playfair: 600,
  dmSans: 700,
}

/** woff2 file to preload for each font (the weight used first on screen). */
export const preloadFile: Record<FontKey, { display: string; body: string }> = {
  russo: { display: 'russo-one-latin-400-normal.woff2', body: 'russo-one-latin-400-normal.woff2' },
  montserrat: {
    display: 'montserrat-latin-wght-normal.woff2',
    body: 'montserrat-latin-wght-normal.woff2',
  },
  inter: { display: 'inter-latin-wght-normal.woff2', body: 'inter-latin-wght-normal.woff2' },
  oswald: { display: 'oswald-latin-wght-normal.woff2', body: 'oswald-latin-wght-normal.woff2' },
  barlowCondensed: {
    display: 'barlow-condensed-latin-700-normal.woff2',
    body: 'barlow-condensed-latin-500-normal.woff2',
  },
  barlow: { display: 'barlow-latin-700-normal.woff2', body: 'barlow-latin-400-normal.woff2' },
  archivo: { display: 'archivo-latin-wght-normal.woff2', body: 'archivo-latin-wght-normal.woff2' },
  playfair: {
    display: 'playfair-display-latin-wght-normal.woff2',
    body: 'playfair-display-latin-wght-normal.woff2',
  },
  dmSans: { display: 'dm-sans-latin-wght-normal.woff2', body: 'dm-sans-latin-wght-normal.woff2' },
}
