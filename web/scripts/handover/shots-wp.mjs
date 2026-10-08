// Annotated screenshots of the WordPress admin for the handover guide (wp-*.jpg).
// Needs a local WordPress with the theme and the demo content, an admin 'tester' / 'tester-pass-123'
// and one quote request, at W below. Run from web/:  node scripts/handover/shots-wp.mjs [name-filter]
import { createRequire } from 'node:module'
import path from 'node:path'
const require = createRequire(process.cwd() + '/package.json')
const { chromium } = require('@playwright/test')
const sharp = require('sharp')
const W = 'http://localhost:8089'
const OUT = 'D:/Desktop/mendes-brothes/docs/handover/shots'
const only = process.argv[2]
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const mark = async (items) => {
  const boxes = []
  for (const [loc, n, opt = {}] of items) {
    try {
      const el = loc.first()
      await el.waitFor({ state: 'visible', timeout: 4000 })
      const bb = await el.boundingBox()
      if (bb) boxes.push({ ...bb, n, pad: opt.pad ?? 5, side: opt.side ?? 'left' })
    } catch { console.log('   ! not found: mark', n) }
  }
  await page.evaluate((list) => {
    document.getElementById('__marks')?.remove()
    const root = document.createElement('div')
    root.id = '__marks'
    root.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:0;z-index:2147483647;pointer-events:none'
    for (const bx of list) {
      const x0 = bx.x + window.scrollX, y0 = bx.y + window.scrollY
      const box = document.createElement('div')
      box.style.cssText = `position:absolute;left:${x0 - bx.pad}px;top:${y0 - bx.pad}px;width:${bx.width + bx.pad * 2}px;height:${bx.height + bx.pad * 2}px;border:3px solid #e11d48;border-radius:9px;box-shadow:0 0 0 3px rgba(255,255,255,.75)`
      const dot = document.createElement('div')
      dot.textContent = String(bx.n)
      const x = bx.side === 'right' ? x0 + bx.width + bx.pad + 4 : x0 - bx.pad - 34
      dot.style.cssText = `position:absolute;left:${Math.max(2, x)}px;top:${Math.max(2, y0 - bx.pad - 4)}px;width:30px;height:30px;border-radius:50%;background:#e11d48;color:#fff;font:700 16px/30px Arial,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff`
      root.append(box, dot)
    }
    document.body.append(root)
  }, boxes)
}
const snap = async (name, clip, full) => {
  const buf = await page.screenshot(clip ? { clip, fullPage: true } : { fullPage: !!full })
  await sharp(buf).jpeg({ quality: 86 }).toFile(path.join(OUT, `wp-${name}.jpg`))
  await page.evaluate(() => document.getElementById('__marks')?.remove())
  console.log('ok', name)
}
const go = async (u) => { await page.goto(W + '/wp-admin/' + u, { waitUntil: 'networkidle', timeout: 120000 }); await page.waitForTimeout(700) }
const t = (s, o) => page.getByText(s, o)
const link = (s, o) => page.getByRole('link', { name: s, ...o })
const menu = (s) => page.locator('#adminmenu').getByText(s, { exact: true }).first()
const box = (title) => page.locator('.postbox').filter({ has: page.locator('h2', { hasText: title }) })

const shots = {
  async login() {
    await page.context().clearCookies()
    await page.goto(W + '/wp-login.php')
    await page.fill('#user_login', 'owner@mendezbrother.com')
    await page.click('body', { position: { x: 5, y: 5 } })
    await mark([[page.locator('#user_login'), 1], [page.locator('#user_pass'), 2], [page.locator('#wp-submit'), 3], [page.locator('#nav a').first(), 4]])
    await snap('login', { x: 420, y: 40, width: 600, height: 560 })
    await page.goto(W + '/wp-login.php')
    await page.fill('#user_login', 'tester'); await page.fill('#user_pass', 'tester-pass-123'); await page.click('#wp-submit'); await page.waitForLoadState()
  },
  async home() {
    await go('admin.php?page=mb-home')
    await mark([[page.locator('#adminmenu'), 1], [page.locator('.mb-panel').first(), 2, { side: 'right', pad: 4 }], [page.locator('.mb-panel').nth(1), 3, { side: 'right', pad: 4 }], [page.locator('.mb-panel').nth(2), 4, { side: 'right', pad: 4 }]])
    await snap('home')
  },
  async projects() {
    await go('edit.php?post_type=project')
    await mark([[menu('Projects'), 1, { side: 'right' }], [page.locator('.page-title-action'), 2, { side: 'right' }], [page.locator('#post-search-input'), 3], [page.locator('.row-title').first(), 4, { side: 'right' }]])
    await snap('projects')
  },
  async 'project-top'() {
    await go('edit.php?post_type=project')
    await link('Wooded homesite clearing').first().click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(700)
    await mark([[page.locator('#title'), 1, { side: 'right' }], [page.locator('.postbox').filter({ has: page.locator('h2', { hasText: 'Cover photo' }) }).first(), 2, { side: 'left' }], [page.locator('#wp-content-editor-container'), 3, { side: 'right' }], [page.locator('#publish'), 4]])
    await snap('project-top', { x: 160, y: 100, width: 1280, height: 780 })
  },
  async 'project-details'() {
    const d = page.locator('.postbox').filter({ has: page.locator('h2', { hasText: 'Project details' }) })
    const lab = (s) => d.locator('label, .mbf-label').filter({ hasText: new RegExp('^' + s) }).first()
    await mark([[lab('Short scope'), 1, { side: 'right' }], [lab('Services'), 2, { side: 'right' }], [lab('Town'), 3, { side: 'right' }], [lab('Lot / work'), 4, { side: 'right' }], [lab('Completed'), 5, { side: 'right' }], [d.locator('text=Photos').first(), 6, { side: 'right' }], [lab('Before photo'), 7, { side: 'right' }], [lab('Review from'), 8, { side: 'right' }]])
    const bb = await d.boundingBox()
    await snap('project-details', { x: 160, y: bb.y - 10, width: 1000, height: Math.min(bb.height + 20, 1500) })
  },
  async 'publish-box'() {
    await go('edit.php?post_type=project')
    await link('Wooded homesite clearing').first().click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500)
    await mark([[page.locator('#publish'), 1, { side: 'left' }], [page.locator('#post-preview'), 2], [page.locator('#misc-publishing-actions .misc-pub-post-status'), 3]])
    const bb = await page.locator('#submitdiv').boundingBox()
    await snap('publish-box', { x: bb.x - 50, y: bb.y - 10, width: bb.width + 70, height: bb.height + 20 })
  },
  async posts() {
    await go('edit.php')
    await mark([[menu('News'), 1, { side: 'right' }], [page.locator('.page-title-action'), 2, { side: 'right' }], [page.locator('.row-title').first(), 3, { side: 'right' }]])
    await snap('posts')
  },
  async 'post-new'() {
    await go('post-new.php')
    const x = page.getByRole('button', { name: 'Close' }).first()
    if (await x.isVisible().catch(() => false)) await x.click()
    const ed = page.frameLocator('iframe[name="editor-canvas"]')
    await ed.locator('.editor-post-title__input, h1[aria-label="Add title"], [aria-label="Add title"]').first().click()
    await page.keyboard.type('Spring is the best time to clear your lot')
    await page.getByRole('button', { name: 'Categories' }).first().click({ timeout: 4000 }).catch(() => {})
    const st = page.getByRole('button', { name: 'Settings', exact: true })
    if ((await st.getAttribute('aria-pressed')) !== 'true') await st.click()
    await page.waitForTimeout(700)
    await mark([[ed.locator('[aria-label="Add title"]').first(), 1, { side: 'right' }], [page.getByRole('button', { name: 'Block Inserter' }).or(page.getByLabel('Block Inserter')).first(), 2, { side: 'right' }], [page.getByRole('button', { name: 'Set featured image' }), 3], [page.getByRole('button', { name: 'Categories' }).first(), 4], [page.locator('.editor-post-publish-panel__toggle, .editor-post-publish-button__button').first(), 5]])
    await snap('post-new')
  },
  async pages() {
    await go('edit.php?post_type=page')
    await mark([[menu('Pages'), 1, { side: 'right' }], [link('Home').first(), 2, { side: 'right' }], [page.locator('.page-title-action'), 3, { side: 'right' }]])
    await snap('pages')
  },
  async 'page-sections'() {
    await go('post.php?post=105&action=edit')
    const box = page.locator('.postbox').filter({ has: page.locator('h2', { hasText: 'Page sections' }) })
    await mark([[box.locator('.mbf-block > .mbf-row-head').nth(1), 1, { side: 'right' }], [box.locator('.mbf-block > .mbf-row-head .mbf-up').nth(1), 2], [box.locator('.mbf-block > .mbf-row-head .mbf-down').nth(1), 3], [box.locator('.mbf-block > .mbf-row-head .mbf-dup').nth(1), 4], [box.locator('.mbf-block > .mbf-row-head .mbf-remove').nth(1), 5], [box.locator('.mbf-add-block'), 6, { side: 'right' }], [page.locator('#publish'), 7]])
    const bb = await box.boundingBox()
    await snap('page-sections', { x: 160, y: 100, width: 1280, height: bb.y + bb.height - 60 })
  },
  async 'section-open'() {
    const box = page.locator('.postbox').filter({ has: page.locator('h2', { hasText: 'Page sections' }) })
    await box.locator('.mbf-block > .mbf-row-head').first().click(); await page.waitForTimeout(500)
    const row = box.locator('.mbf-block').first()
    const bb = await row.boundingBox()
    await mark([[row.locator('.mbf-row-head').first(), 1, { side: 'right' }], [row.locator('.mbf-row-body').first(), 2, { side: 'right', pad: 3 }]])
    await snap('section-open', { x: 160, y: bb.y - 30, width: 1000, height: Math.min(bb.height + 60, 900) })
    await box.locator('.mbf-block > .mbf-row-head').first().click()
  },
  async 'section-picker'() {
    await page.locator('.mbf-add-block').click(); await page.waitForTimeout(700)
    await mark([[page.locator('.mbf-picker-search'), 1], [page.locator('.mbf-picker-grid > *').first(), 2, { side: 'right' }], [page.locator('.mbf-picker-close'), 3, { side: 'right' }]])
    await snap('section-picker')
    await page.locator('.mbf-picker-close').click()
  },
  async 'page-preview'() {
    await mark([[page.locator('#post-preview, a.preview'), 1], [page.locator('#publish'), 2]])
    await snap('page-preview', { x: 1100, y: 100, width: 340, height: 360 })
  },
  async media() {
    await go('media-new.php')
    await mark([[page.locator('#drag-drop-area, .upload-ui').first(), 1, { side: 'right' }], [page.locator('#plupload-browse-button, .browser').first(), 2, { side: 'right' }]])
    await snap('media-upload', { x: 160, y: 60, width: 1280, height: 520 })
    await go('upload.php')
    await mark([[menu('Photos'), 1, { side: 'right' }], [page.locator('.page-title-action'), 2, { side: 'right' }], [page.locator('.attachment').first(), 3, { side: 'right' }]])
    await snap('media-library')
  },
  async 'media-detail'() {
    await page.locator('.attachment').first().click(); await page.waitForTimeout(1000)
    await mark([[page.locator('#attachment-details-two-column-alt-text, #attachment-details-alt-text').first(), 1, { side: 'right' }], [page.locator('#attachment-details-two-column-caption, #attachment-details-caption').first(), 2, { side: 'right' }]])
    await snap('media-detail')
  },
  async services() {
    await go('edit.php?post_type=service')
    await mark([[menu('Services'), 1, { side: 'right' }], [page.locator('.page-title-action'), 2, { side: 'right' }], [page.locator('.row-title').first(), 3, { side: 'right' }]])
    await snap('services')
  },
  async leads() {
    await go('edit.php?post_type=lead')
    await mark([[menu('Quote requests'), 1, { side: 'right' }], [page.locator('.row-title').first(), 2, { side: 'right' }]])
    await snap('leads')
    await page.locator('.row-title').first().click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(700)
    await snap('lead-detail')
  },
  async settings() {
    for (const [tab, key] of [['Company', 'company'], ['Logos', 'logos'], ['Colours & fonts', 'colours'], ['Estimate form', 'form'], ['SEO & tracking', 'seo'], ['Menu & footer', 'footer'], ['List pages', 'lists']]) {
      await go('admin.php?page=mb-settings')
      await page.locator('a, button, [role=tab]').filter({ hasText: new RegExp('^' + tab.replace('&', '\\&') + '$') }).first().click()
      await page.waitForTimeout(500)
      await snap('settings-' + key)
    }
  },
  async menus() {
    await go('nav-menus.php')
    await page.selectOption('#select-menu-to-edit', { label: 'Main menu (Main menu)' }).catch(async () => { await page.selectOption('#select-menu-to-edit', { index: 0 }) })
    await page.click('#nav-menu-meta .submit-btn, .manage-menus input[type=submit]').catch(() => {})
    await page.waitForLoadState('networkidle')
    await mark([[page.locator('#select-menu-to-edit'), 1, { side: 'right' }], [page.locator('#side-sortables .submit-add-to-menu').first(), 2, { side: 'right' }], [page.locator('#menu-to-edit .menu-item').first(), 3, { side: 'right' }], [page.locator('#save_menu_footer'), 4, { side: 'right' }], [page.getByRole('link', { name: 'Manage Locations' }), 5, { side: 'right' }]])
    await snap('menus')
  },
  async users() {
    await go('profile.php')
    const row = (l) => page.locator('tr').filter({ hasText: l }).first()
    await mark([[page.locator('#locale'), 1, { side: 'right' }], [page.locator('#display_name'), 2, { side: 'right' }], [page.locator('#email'), 3, { side: 'right' }]])
    let y = (await row('Language').boundingBox()).y
    await snap('profile-a', { x: 160, y: y - 20, width: 1000, height: 560 })
    await mark([[page.locator('.wp-generate-pw'), 4, { side: 'right' }], [page.locator('#submit'), 5, { side: 'right' }]])
    y = (await page.locator('h2', { hasText: 'Account Management' }).boundingBox()).y
    await snap('profile-b', { x: 160, y: y - 20, width: 1000, height: 560 })
    await go('user-new.php')
    await mark([[page.locator('#user_login'), 1, { side: 'right' }], [page.locator('#email'), 2, { side: 'right' }], [page.locator('#role'), 3, { side: 'right' }], [page.locator('#createusersub'), 4, { side: 'right' }]])
    await snap('user-new', { x: 160, y: 80, width: 1000, height: 820 })
    await go('users.php')
    await mark([[page.locator('.page-title-action'), 1, { side: 'right' }]])
    await snap('users')
  },
  async 'theme-replace'() {
    await go('theme-install.php')
    await page.locator('.upload-view-toggle').click()
    await page.waitForTimeout(500)
    await mark([[page.locator('.upload-view-toggle'), 1, { side: 'right' }], [page.locator('#themezip'), 2, { side: 'right' }], [page.locator('#install-theme-submit'), 3, { side: 'right' }]])
    await snap('theme-upload-form', { x: 160, y: 80, width: 1000, height: 380 })
    await page.setInputFiles('#themezip', (process.env.THEME_ZIP || 'D:/Desktop/mendes-brothes/mendez.zip'))
    await page.click('#install-theme-submit')
    await page.waitForLoadState('networkidle')
    await mark([[page.locator('a.button.button-primary, .update-from-upload-actions a').first(), 1, { side: 'right' }]])
    await snap('theme-replace')
  },
  async misc() {
    for (const [k, u] of [['stats', 'admin.php?page=mb-stats'], ['help', 'admin.php?page=mb-help'], ['ai', 'admin.php?page=mb-ai'], ['backups', 'admin.php?page=mb-backup'], ['demo', 'admin.php?page=mb-demo'], ['permalinks', 'options-permalink.php'], ['theme-upload', 'theme-install.php'], ['general', 'options-general.php'], ['reviews', 'edit.php?post_type=testimonial'], ['equipment', 'edit.php?post_type=equipment'], ['areas', 'edit.php?post_type=area'], ['faqs', 'edit.php?post_type=faq'], ['themes', 'themes.php']]) {
      await go(u)
      await snap(k)
    }
  },
}
for (const [k, fn] of Object.entries(shots)) {
  if (k !== 'login' && only && !k.includes(only)) continue
  if (k === 'login' && only && only !== 'login' && only !== 'all') { /* still need the session */ }
  await fn()
}
await b.close()
