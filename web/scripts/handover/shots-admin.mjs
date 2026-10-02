/*
 * Annotated screenshots of the admin for the user guide (desktop only).
 *   ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/handover/shots-admin.mjs [name-filter]
 * Numbered red boxes are drawn on the page before each screenshot; the numbers match the
 * steps in the document. Nothing is saved or published by this script, except one demo
 * quote request that it creates and removes again.
 * Output: ../docs/handover/shots/adm-<name>.jpg
 */
import { chromium } from '@playwright/test'
import path from 'node:path'
import sharp from 'sharp'

const BASE = process.env.BASE || 'http://localhost:3000'
const EMAIL = process.env.ADMIN_EMAIL
const PASSWORD = process.env.ADMIN_PASSWORD
const OUT = path.resolve(process.cwd(), '../docs/handover/shots')
const only = process.argv[2]
if (!EMAIL || !PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD')

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})
const page = await ctx.newPage()

const api = async (url, init = {}) =>
  (await ctx.request.fetch(BASE + url, { ...init, failOnStatusCode: false })).json()

/** Draw numbered boxes around elements. `items`: [locator, number, { pad, side }] */
const mark = async (items) => {
  const boxes = []
  for (const [loc, n, opt = {}] of items) {
    const el = loc.first()
    try {
      await el.waitFor({ state: 'visible', timeout: 6000 })
      const b = await el.boundingBox()
      if (b) boxes.push({ ...b, n, pad: opt.pad ?? 5, side: opt.side ?? 'left' })
    } catch {
      console.log('   ! not found: mark', n)
    }
  }
  await page.evaluate((list) => {
    document.getElementById('__marks')?.remove()
    const root = document.createElement('div')
    root.id = '__marks'
    root.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none'
    for (const b of list) {
      const box = document.createElement('div')
      box.style.cssText = `position:absolute;left:${b.x - b.pad}px;top:${b.y - b.pad}px;width:${b.width + b.pad * 2}px;height:${b.height + b.pad * 2}px;border:3px solid #e11d48;border-radius:9px;box-shadow:0 0 0 3px rgba(255,255,255,.75)`
      const dot = document.createElement('div')
      dot.textContent = String(b.n)
      const x = b.side === 'right' ? b.x + b.width + b.pad + 4 : b.x - b.pad - 34
      dot.style.cssText = `position:absolute;left:${Math.min(window.innerWidth - 32, Math.max(2, x))}px;top:${Math.max(2, b.y - b.pad - 4)}px;width:30px;height:30px;border-radius:50%;background:#e11d48;color:#fff;font:700 16px/30px Arial,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff`
      root.append(box, dot)
    }
    document.body.append(root)
  }, boxes)
}
const unmark = () => page.evaluate(() => document.getElementById('__marks')?.remove())

const snap = async (name, clip) => {
  await sharp(await page.screenshot(clip ? { clip } : undefined))
    .jpeg({ quality: 88 })
    .toFile(path.join(OUT, `adm-${name}.jpg`))
  await unmark()
  console.log('ok', name)
}

const go = async (url) => {
  await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 120_000 })
  await page.waitForTimeout(900)
}

/** A field wrapper, found by the start of its label. */
const field = (label) =>
  page
    .locator('.field-type')
    .filter({ has: page.locator('label, .field-label').filter({ hasText: label }) })
    .last()
const tab = (name) => page.locator('.tabs-field__tab-button').filter({ hasText: name })
const navItem = (name) => page.locator('.mb-nav__item').filter({ hasText: name })
const publishBtn = () => page.locator('#action-save')
const createNew = () => page.locator('.list-create-new-doc__create-new-button')

const shots = {
  // ───────── getting in
  async login() {
    await go('/admin/login')
    await page.fill('#field-email', 'you@yourcompany.com')
    await mark([
      [page.locator('#field-email'), 1],
      [page.locator('#field-password'), 2],
      [page.locator('button[type=submit]'), 3],
      [page.getByRole('link', { name: /forgot/i }), 4],
    ])
    await snap('login', { x: 300, y: 80, width: 840, height: 700 })
    await page.fill('#field-email', EMAIL)
    await page.fill('#field-password', PASSWORD)
    await page.click('button[type=submit]')
    await page.waitForURL(/\/admin$/, { timeout: 120_000 })
  },
  async home() {
    await go('/admin')
    await mark([
      [page.locator('.mb-nav__group').nth(0), 1],
      [page.locator('.mb-nav__group').nth(1), 2],
      [page.locator('.mb-nav__foot'), 3],
      [page.locator('.mb-leads'), 4, { side: 'right' }],
      [page.locator('.mb-tiles'), 5, { side: 'right' }],
      [page.locator('.app-header a[href$="/account"], a.account').first(), 6, { side: 'right' }],
    ])
    await snap('home')
  },

  // ───────── projects
  async projectsList() {
    await go('/admin/collections/projects')
    await mark([
      [navItem('Projects'), 1],
      [createNew(), 2, { side: 'right' }],
      [page.locator('.search-filter, .list-controls').first(), 3],
      [page.locator('table tbody tr').first(), 4],
    ])
    await snap('projects-list')
  },
  async projectForm() {
    const { docs } = await api('/api/projects?limit=1&sort=-completedAt&depth=0')
    await page.setViewportSize({ width: 1440, height: 1250 })
    await go(`/admin/collections/projects/${docs[0].id}`)
    // the admin remembers the last open tab
    await tab('Overview').click()
    await page.waitForTimeout(600)
    await mark([
      [page.locator('#field-title'), 1],
      [field(/^Summary/), 2],
      [field(/^Cover photo/), 3],
      [field(/^Services/), 4],
      [field(/^Town/), 5],
      [field(/^Lot \/ work area size/), 6],
      [field(/^Completed/), 7],
      [publishBtn(), 8, { side: 'right' }],
    ])
    await snap('project-form')
    await tab('Photos').click()
    await page.waitForTimeout(700)
    await mark([
      [tab('Photos'), 1],
      [page.locator('.array-field__row, .array-field .collapsible').first(), 2],
      [
        page
          .locator('.array-field__add-row, .array-field button')
          .filter({ hasText: /Add/ })
          .last(),
        3,
      ],
    ])
    await snap('project-photos')
    await page.setViewportSize({ width: 1440, height: 900 })
  },
  async publishBar() {
    const { docs } = await api('/api/projects?limit=1&sort=-completedAt&depth=0')
    await go(`/admin/collections/projects/${docs[0].id}`)
    // change a field so the buttons become active
    await page.locator('#field-title').fill(docs[0].title + ' ')
    await page.waitForTimeout(600)
    await mark([
      [page.locator('.doc-controls__status, .status').first(), 1],
      [page.locator('button.live-preview-toggler, #live-preview-toggler').first(), 2],
      [publishBtn(), 3],
      [page.getByRole('link', { name: /Versions/ }), 4, { side: 'right' }],
    ])
    await snap('publish-bar', { x: 290, y: 0, width: 1150, height: 260 })
    await page.locator('#field-title').fill(docs[0].title)
    await page.waitForTimeout(1500)
    // leave the project exactly as it was: published, no pending draft
    await api(`/api/projects/${docs[0].id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: { title: docs[0].title, _status: 'published' },
    })
  },

  // ───────── news
  async post() {
    await go('/admin/collections/posts')
    await mark([
      [navItem('News'), 1],
      [createNew(), 2, { side: 'right' }],
    ])
    await snap('posts-list', { x: 0, y: 0, width: 1440, height: 520 })
    const { docs } = await api('/api/posts?limit=1&depth=0')
    await go(`/admin/collections/posts/${docs[0].id}`)
    await mark([
      [page.locator('#field-title'), 1],
      [field(/^Hero Image/), 2],
      [
        page.locator('.fixed-toolbar, .toolbar-popup__dropdown, [class*="fixed-toolbar"]').first(),
        3,
      ],
      [page.locator('.ContentEditable__root, [contenteditable=true]').first(), 4],
      [publishBtn(), 5, { side: 'right' }],
    ])
    await snap('post-form')
  },

  // ───────── pages
  async pages() {
    await go('/admin/collections/pages')
    await mark([
      [navItem('Pages'), 1],
      [page.locator('table tbody tr').filter({ hasText: 'Home' }).locator('a').first(), 2],
    ])
    await snap('pages-list', { x: 0, y: 0, width: 1440, height: 620 })

    const { docs } = await api('/api/pages?where[slug][equals]=home&depth=0')
    await page.setViewportSize({ width: 1440, height: 1050 })
    await go(`/admin/collections/pages/${docs[0].id}`)
    const rows = page.locator('.blocks-field__row')
    await mark([
      [rows.nth(0), 1],
      [rows.nth(2).locator('.collapsible__drag'), 2],
      [rows.nth(3).locator('.array-actions, .collapsible__actions').first(), 3, { side: 'right' }],
      [page.locator('.blocks-field__drawer-toggler'), 4],
      [page.locator('button.live-preview-toggler, #live-preview-toggler').first(), 5],
      [publishBtn(), 6, { side: 'right' }],
    ])
    await snap('page-sections')

    // open the first section
    await page.setViewportSize({ width: 1440, height: 1650 })
    await rows.nth(0).locator('.collapsible__toggle').first().click()
    await page.waitForTimeout(900)
    await mark([
      [field(/^Heading/), 1],
      [field(/^Intro text/), 2],
      [rows.nth(0).locator('.field-type.upload').first(), 3],
      [rows.nth(0).locator('.field-type.collapsible-field').last(), 4],
    ])
    await snap('page-section-open', { x: 290, y: 420, width: 1150, height: 1230 })
    await rows.nth(0).locator('.collapsible__toggle').first().click()

    // section picker
    await page.locator('.blocks-field__drawer-toggler').click()
    await page.waitForTimeout(1500)
    await snap('page-add-section')
    await page.keyboard.press('Escape')
    await page.setViewportSize({ width: 1440, height: 900 })
  },
  async preview() {
    const { docs } = await api('/api/pages?where[slug][equals]=home&depth=0')
    await go(`/admin/collections/pages/${docs[0].id}`)
    const toggler = page.locator('button.live-preview-toggler, #live-preview-toggler').first()
    await toggler.click()
    await page.waitForTimeout(6000)
    await mark([
      [toggler, 1],
      [page.locator('.live-preview-window, .live-preview').first(), 2],
    ])
    await snap('page-preview')
    await toggler.click()
  },
  async versions() {
    const { docs } = await api('/api/pages?where[slug][equals]=home&depth=0')
    await go(`/admin/collections/pages/${docs[0].id}/versions`)
    await mark([
      [page.getByRole('link', { name: /Versions/ }), 1, { side: 'right' }],
      [page.locator('table tbody tr').first(), 2],
    ])
    await snap('versions', { x: 0, y: 0, width: 1440, height: 620 })
  },

  // ───────── photos
  async photos() {
    await go('/admin/collections/media')
    await mark([
      [navItem('Photos'), 1],
      [createNew(), 2],
      [page.getByRole('button', { name: /Bulk Upload/ }), 3, { side: 'right' }],
      [page.locator('table tbody tr').nth(4), 4],
    ])
    await snap('photos-list')
    await go('/admin/collections/media/create')
    await mark([
      [page.locator('.file-field, .dropzone').first(), 1],
      [field(/^Alt text/), 2],
      [publishBtn(), 3, { side: 'right' }],
    ])
    await snap('photo-upload', { x: 0, y: 0, width: 1440, height: 720 })
  },

  // ───────── settings
  async settings() {
    await page.setViewportSize({ width: 1440, height: 1100 })
    await go('/admin/settings')
    const tile = (t) => page.locator('.mb-tile').filter({ hasText: t })
    await mark([
      [navItem('Settings'), 1],
      [tile('Company info & logo'), 2],
      [tile('Colours & fonts'), 3],
      [tile('Users'), 4],
      [tile('Backups').first(), 5],
    ])
    await snap('settings')
    await page.setViewportSize({ width: 1440, height: 900 })
  },
  async company() {
    await page.setViewportSize({ width: 1440, height: 1100 })
    await go('/admin/globals/site-settings')
    await tab('Company').click()
    await page.waitForTimeout(700)
    await mark([
      [tab('Company'), 1],
      [field(/^Phone/), 2],
      [field(/^Email/), 3],
      [publishBtn(), 4, { side: 'right' }],
    ])
    await snap('company')
    await tab('Logos').click()
    await page.waitForTimeout(900)
    await mark([
      [tab('Logos'), 1],
      [page.locator('.field-type.upload').nth(0), 2],
      [page.locator('.field-type.upload').nth(1), 3],
      [page.locator('.field-type.upload').nth(3), 4],
      [publishBtn(), 5, { side: 'right' }],
    ])
    await snap('logos')
    await page.setViewportSize({ width: 1440, height: 900 })
  },
  async theme() {
    await go('/admin/globals/theme')
    const toggler = page.locator('button.live-preview-toggler, #live-preview-toggler').first()
    await page.waitForTimeout(5000)
    await mark([
      [page.getByRole('radio', { name: /Studio Paper/ }), 1],
      [page.locator('.live-preview-window, .live-preview').first(), 2],
      [toggler, 3],
      [publishBtn(), 4],
    ])
    await snap('theme')
    // close the preview to show the whole list of palettes
    await toggler.click()
    await page.setViewportSize({ width: 1440, height: 1500 })
    await page.waitForTimeout(1200)
    await snap('theme-palettes')
    // "Custom": one brand colour in, a whole palette out. Selecting it only touches the draft;
    // the original palette is selected again straight after.
    const current = page.locator('[role=radio][aria-checked=true]').first()
    await page.getByRole('radio', { name: /Custom/ }).click()
    await page.waitForTimeout(1200)
    await mark([
      [page.getByRole('radio', { name: /Custom/ }), 1],
      [field(/^Brand colour/), 2],
      [field(/^Neutral|^Grey|^Tone/), 3],
    ])
    await snap('theme-custom', { x: 290, y: 780, width: 1150, height: 560 })
    await current.click()
    await page.waitForTimeout(1200)
    await page.setViewportSize({ width: 1440, height: 900 })
    await toggler.click()
  },
  async menu() {
    await go('/admin/globals/header')
    await mark([
      [page.locator('.array-field__row, .array-field .collapsible').first(), 1],
      [
        page
          .locator('.array-field__add-row, .array-field button')
          .filter({ hasText: /Add/ })
          .last(),
        2,
      ],
      [publishBtn(), 3, { side: 'right' }],
    ])
    await snap('menu')
  },

  // ───────── quote requests
  async leads() {
    const { docs: forms } = await api('/api/forms?limit=1&depth=0')
    const created = await api('/api/form-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        form: forms[0].id,
        submissionData: [
          { field: 'name', value: 'Maria Lopez (example)' },
          { field: 'phone', value: '302-555-0142' },
          { field: 'email', value: 'maria@example.com' },
          { field: 'service', value: 'excavation' },
          { field: 'address', value: 'Milton, DE' },
          { field: 'message', value: 'We need a building pad for a 30 x 40 garage.' },
        ],
      },
    })
    const id = created.doc?.id
    try {
      await go('/admin')
      await mark([[page.locator('.mb-leads'), 1]])
      await snap('leads-home', { x: 290, y: 0, width: 1150, height: 420 })
      await go('/admin/collections/form-submissions')
      await mark([
        [navItem('Quote requests'), 1],
        [page.locator('table tbody tr').first(), 2],
        [page.locator('a.mb-btn'), 3],
      ])
      await snap('leads-list', { x: 0, y: 0, width: 1440, height: 560 })
      await go(`/admin/collections/form-submissions/${id}`)
      await mark([
        [field(/^Status/), 1],
        [field(/^Your notes/), 2],
        [publishBtn(), 3],
      ])
      await snap('lead-detail')
    } finally {
      if (id) await api(`/api/form-submissions/${id}`, { method: 'DELETE' })
    }
  },

  // ───────── people
  async users() {
    await go('/admin/collections/users')
    await mark([
      [createNew(), 1, { side: 'right' }],
      [page.locator('table tbody tr').first(), 2],
    ])
    await snap('users-list', { x: 0, y: 0, width: 1440, height: 520 })
    await go('/admin/collections/users/create')
    await mark([
      [page.locator('#field-email'), 1],
      [page.locator('#field-password'), 2],
      [page.locator('#field-confirm-password'), 3],
      [page.locator('#field-name'), 4],
      [field(/^Role/), 5],
      [publishBtn(), 6, { side: 'right' }],
    ])
    await snap('user-create', { x: 0, y: 0, width: 1440, height: 780 })
    await go('/admin/account')
    await mark([
      [page.locator('.app-header a[href$="/account"], a.account').first(), 1, { side: 'right' }],
      [page.getByRole('button', { name: 'Change Password' }), 2],
      [page.locator('.payload-settings .field-type, .payload-settings__language').first(), 3],
    ])
    await snap('account')
    await page.getByRole('button', { name: 'Change Password' }).click()
    await page.waitForTimeout(600)
    await mark([
      [page.locator('#field-password'), 1],
      [page.locator('#field-confirm-password'), 2],
      [publishBtn(), 3, { side: 'right' }],
    ])
    await snap('password', { x: 0, y: 0, width: 1440, height: 640 })
  },

  // ───────── safety
  async backups() {
    await go('/admin/backups')
    await mark([
      [page.getByRole('button', { name: 'Back up now' }), 1],
      [
        page
          .getByRole('link', { name: /Download/ })
          .or(page.getByRole('button', { name: /Download/ })),
        2,
      ],
      [page.getByRole('button', { name: /^Restore/ }), 3],
      [page.getByRole('button', { name: /Upload a backup file/ }), 4],
    ])
    await snap('backups')
  },
  async help() {
    await go('/admin/help')
    await mark([[navItem('Help'), 1]])
    await snap('help')
  },

  // ───────── statistics
  async stats() {
    await page.setViewportSize({ width: 1440, height: 1500 })
    await go('/admin/statistics?days=7')
    await mark([
      [navItem('Statistics'), 1],
      [page.locator('.mb-range'), 2, { side: 'right' }],
      [page.locator('.mb-stats__tiles'), 3, { side: 'right' }],
      [page.locator('.mb-chart'), 4, { side: 'right' }],
      [page.locator('.mb-stats__grid'), 5, { side: 'right' }],
    ])
    await snap('stats')
    await page.setViewportSize({ width: 1440, height: 900 })
  },

  // ───────── AI assistant
  // Needs an AI key to show the connected screens: AI_KEY=… (with the test stub:
  // AI_KEY=test-key-good-1234 and the site started with AI_BASE_URL). The key is removed
  // again at the end, and nothing is saved to any document.
  async ai() {
    const key = process.env.AI_KEY
    page.on('dialog', (d) => void d.accept().catch(() => undefined))
    await api('/api/ai/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { remove: true },
    })
    await go('/admin/ai')
    await mark([
      [page.getByRole('radio', { name: /Google Gemini/ }), 1],
      [page.getByRole('link', { name: /to get a key/ }), 2],
      [page.getByLabel('API key'), 3],
      [page.getByRole('button', { name: 'Test & save' }), 4, { side: 'right' }],
    ])
    await snap('ai-setup', { x: 0, y: 0, width: 1440, height: 800 })

    // the assistant without a key: built-in answers
    await go('/admin')
    await page.evaluate(() => sessionStorage.removeItem('mb-assistant'))
    await page.getByRole('button', { name: 'Open the assistant' }).click()
    const chat = page.getByRole('region', { name: 'Assistant' })
    await chat.getByLabel('Your question').fill('How do I change the logo?')
    await chat.getByLabel('Your question').press('Enter')
    await page.waitForTimeout(500)
    await mark([
      [page.locator('.mb-chat__fab'), 1],
      [chat.getByLabel('Your question'), 2],
      [chat.locator('.mb-chat__bubble').last(), 3],
    ])
    await snap('ai-chat', { x: 640, y: 150, width: 800, height: 750 })
    await chat.getByRole('button', { name: 'New chat' }).click()

    // quick commands: the / menu, then a /logo preview card (cancelled, nothing changes)
    const box = chat.getByLabel('Your question')
    await box.fill('/')
    await page.waitForTimeout(300)
    await mark([
      [box, 1],
      [chat.locator('.mb-chat__menu li').first(), 2],
    ])
    await snap('ai-commands', { x: 640, y: 150, width: 800, height: 750 })
    await chat.locator('input[type=file]').setInputFiles('public/brand/logo-word.webp')
    await box.fill('/logo')
    await box.press('Enter')
    const card = chat.locator('.mb-card').last()
    await card.waitFor()
    await page.waitForTimeout(400)
    await mark([
      [chat.locator('.mb-chat__msg--user').last(), 1],
      [card.locator('.mb-card__change'), 2],
      [card.getByRole('button', { name: 'Apply' }), 3],
    ])
    await snap('ai-command-card', { x: 640, y: 150, width: 800, height: 750 })
    await card.getByRole('button', { name: 'Cancel' }).click()
    await chat.getByRole('button', { name: 'New chat' }).click()
    await chat.getByRole('button', { name: 'Close the assistant' }).click()
    if (!key) return console.log('   (set AI_KEY for the connected AI screenshots)')

    await go('/admin/ai')
    await page.getByLabel('API key').fill(key)
    await page.getByRole('button', { name: 'Test & save' }).click()
    await page.getByText(/Connected to/).waitFor()
    await snap('ai-connected', { x: 0, y: 0, width: 1440, height: 760 })

    const { docs } = await api('/api/projects?limit=1&sort=-completedAt&depth=0')
    await go(`/admin/collections/projects/${docs[0].id}`)
    await tab('Overview').click()
    const summary = page.locator('#field-summary')
    const original = await summary.inputValue()
    await summary.fill('We recieve teh lot and clear it for the builder.')
    await page.waitForTimeout(400)
    await mark([
      [summary, 1],
      [page.getByRole('button', { name: 'AI: improve this text' }), 2, { side: 'right' }],
    ])
    await snap('ai-field', { x: 290, y: 240, width: 1150, height: 400 })
    await page.getByRole('button', { name: 'AI: improve this text' }).click()
    await page.getByRole('button', { name: 'Fix spelling & grammar' }).click()
    await page.getByLabel('AI suggestion').waitFor()
    await mark([
      [page.getByLabel('AI suggestion'), 3],
      [page.getByRole('button', { name: 'Use this' }), 4],
    ])
    await snap('ai-suggestion', { x: 290, y: 240, width: 1150, height: 520 })
    await page.getByRole('button', { name: 'Cancel' }).click()
    await summary.fill(original)

    await page.getByRole('button', { name: 'AI', exact: true }).click()
    await page.waitForTimeout(300)
    await mark([
      [page.getByRole('button', { name: 'AI', exact: true }), 1],
      [page.locator('.mb-ai__menu'), 2],
    ])
    await snap('ai-doc-menu', { x: 290, y: 0, width: 1150, height: 520 })
    await page.getByRole('menuitem', { name: /Check before publishing/ }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).waitFor()
    await snap('ai-check', { x: 290, y: 150, width: 1150, height: 600 })
    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click()

    // leave the project exactly as it was, and take the key out again
    await api(`/api/projects/${docs[0].id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: { summary: original, _status: 'published' },
    })
    await api('/api/ai/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { remove: true },
    })
  },
}

for (const [name, fn] of Object.entries(shots)) {
  if (only && name !== 'login' && !name.toLowerCase().includes(only.toLowerCase())) continue
  try {
    await fn()
  } catch (e) {
    console.log('FAIL', name, String(e.message).split('\n')[0])
    await unmark().catch(() => {})
  }
}
await browser.close()
