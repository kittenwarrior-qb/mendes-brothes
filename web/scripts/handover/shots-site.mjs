/*
 * Screenshots of the public site for the handover document (desktop + mobile).
 *   node scripts/handover/shots-site.mjs            (site must be running; BASE defaults to :3000)
 * Output: ../docs/handover/shots/site-<page>-desktop.jpg | -desktop-full.jpg | -mobile.jpg
 */
import { chromium } from '@playwright/test'
import path from 'node:path'
import sharp from 'sharp'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = path.resolve(process.cwd(), '../docs/handover/shots')

const pages = [
  { name: 'home', url: '/', full: true },
  { name: 'about', url: '/about' },
  { name: 'services', url: '/services' },
  { name: 'service-detail', url: '/services/excavation' },
  { name: 'projects', url: '/projects', full: true },
  { name: 'project-detail', url: '/projects/wooded-homesite-clearing', full: true },
  { name: 'capabilities', url: '/capabilities' },
  { name: 'contact', url: '/contact' },
  { name: 'news', url: '/posts' },
  { name: 'news-post', url: '/posts/forestry-mulching-vs-traditional-land-clearing' },
  { name: 'area', url: '/areas/lewes' },
]

// everything visible, nothing floating over the long screenshot
const CSS = `.reveal{opacity:1!important;transform:none!important}.to-top{display:none!important}
.hero-bg img{animation:none!important}`

const settle = async (page) => {
  await page.addStyleTag({ content: CSS })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
}

/** Cut a very tall screenshot into columns placed side by side, so it fits a document page. */
const strip = async (buf, file, { colWidth, maxCols, minColHeight, bg = '#ffffff' }) => {
  const scaled = await sharp(buf).resize(colWidth).png().toBuffer()
  const h = (await sharp(scaled).metadata()).height
  const cols = Math.min(maxCols, Math.max(1, Math.ceil(h / minColHeight)))
  const colH = Math.ceil(h / cols)
  const gap = 24
  const parts = []
  for (let i = 0; i < cols; i++) {
    const top = i * colH
    const height = Math.min(colH, h - top)
    if (height <= 0) break
    parts.push({
      input: await sharp(scaled).extract({ left: 0, top, width: colWidth, height }).toBuffer(),
      left: gap + i * (colWidth + gap),
      top: gap,
    })
  }
  await sharp({
    create: {
      width: gap + parts.length * (colWidth + gap),
      height: colH + gap * 2,
      channels: 3,
      background: bg,
    },
  })
    .composite(parts)
    .jpeg({ quality: 84 })
    .toFile(file)
}

const browser = await chromium.launch()

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})

for (const p of pages) {
  const d = await desktop.newPage()
  const res = await d.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 120_000 })
  if (!res || res.status() >= 400) {
    console.log('SKIP', p.name, res?.status())
    await d.close()
    continue
  }
  await settle(d)
  await sharp(await d.screenshot())
    .jpeg({ quality: 86 })
    .toFile(path.join(OUT, `site-${p.name}-desktop.jpg`))
  if (p.full) {
    await strip(
      await d.screenshot({ fullPage: true }),
      path.join(OUT, `site-${p.name}-desktop-full.jpg`),
      {
        colWidth: 620,
        maxCols: 3,
        minColHeight: 1100,
        bg: '#e9e9e9',
      },
    )
  }
  await d.close()

  const m = await mobile.newPage()
  await m.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 120_000 })
  await settle(m)
  await strip(await m.screenshot({ fullPage: true }), path.join(OUT, `site-${p.name}-mobile.jpg`), {
    colWidth: 390,
    maxCols: 5,
    minColHeight: 900,
    bg: '#e9e9e9',
  })
  await m.close()
  console.log('ok', p.name)
}

// mobile menu, opened
const m = await mobile.newPage()
await m.goto(BASE + '/', { waitUntil: 'networkidle' })
await m.getByRole('button', { name: 'Open menu' }).click()
await m.waitForTimeout(400)
await sharp(await m.screenshot())
  .resize(390)
  .jpeg({ quality: 86 })
  .toFile(path.join(OUT, 'site-menu-mobile.jpg'))
console.log('ok menu')

await browser.close()
