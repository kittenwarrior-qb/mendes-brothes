import { expect, test, type Locator, type Page } from '@playwright/test'
import sharp from 'sharp'

import { login } from '../helpers/login'

/*
 * Quick commands in the assistant (no AI key needed). This spec CHANGES the site settings
 * and the colour draft, and puts every value back with Undo — run it against a test site:
 *   E2E_WRITE=1 E2E_BASE_URL=… SEED_ADMIN_EMAIL=… SEED_ADMIN_PASSWORD=… pnpm test:e2e commands
 */
const user = {
  email: process.env.SEED_ADMIN_EMAIL || '',
  password: process.env.SEED_ADMIN_PASSWORD || '',
}

type Settings = { phone?: string; logo?: number | { id: number } | null }
const idOf = (v: Settings['logo']) => (v && typeof v === 'object' ? v.id : (v ?? null))

const png = (color: string) =>
  sharp({ create: { width: 120, height: 60, channels: 4, background: color } })
    .png()
    .toBuffer()

test.describe.serial('Assistant quick commands', () => {
  test.skip(!process.env.E2E_WRITE || !user.email, 'changes settings: needs E2E_WRITE=1')
  let page: Page
  let chat: Locator
  let box: Locator
  const uploaded: number[] = []

  const settings = async () =>
    (await (await page.request.get('/api/globals/site-settings?depth=0')).json()) as Settings

  test.beforeAll(async ({ browser }) => {
    page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage()
    await login({ page, user })
    await page.goto('/admin')
    await page.evaluate(() => sessionStorage.removeItem('mb-assistant'))
    await page.reload()
    await page.getByRole('button', { name: 'Open the assistant' }).click()
    chat = page.getByRole('region', { name: 'Assistant' })
    box = chat.getByLabel('Your question')
  })

  test.afterAll(async () => {
    for (const id of uploaded) await page.request.delete(`/api/media/${id}`)
  })

  test('typing / opens the command menu', async () => {
    await box.fill('/')
    const menu = chat.getByRole('listbox', { name: 'Quick commands' })
    await expect(menu.getByRole('option', { name: /\/logo\b/ }).first()).toBeVisible()
    await box.fill('/ph')
    await expect(menu.getByRole('option')).toHaveCount(2) // /phone, /photos
    await box.fill('/phon')
    await box.press('Tab')
    await expect(box).toHaveValue('/phone ')
    await expect(menu).toHaveCount(0)
    await box.fill('/nothing-like-this')
    await box.press('Enter')
    await expect(chat.getByText('I do not know /nothing-like-this')).toBeVisible()
  })

  test('/phone: preview, apply, undo', async () => {
    const before = (await settings()).phone ?? ''
    await box.fill('/phone call me')
    await box.press('Enter')
    await expect(chat.getByText('That does not look like a phone number')).toBeVisible()

    await box.fill('/phone 302-555-0199')
    await box.press('Enter')
    const card = chat.getByRole('group', { name: 'Change the phone number' })
    await expect(card).toContainText('302-555-0199')
    if (before) await expect(card).toContainText(before)
    expect((await settings()).phone).toBe(before) // nothing yet

    await card.getByRole('button', { name: 'Apply' }).click()
    await expect(card.getByRole('status')).toContainText('Phone saved')
    expect((await settings()).phone).toBe('302-555-0199')

    await card.getByRole('button', { name: 'Undo' }).click()
    await expect(card).toContainText('Undone')
    expect((await settings()).phone ?? '').toBe(before)
  })

  test('/logo with a chosen file: apply then undo restores the old logo', async () => {
    const before = idOf((await settings()).logo)
    await chat.locator('input[type=file]').setInputFiles({
      name: 'test-logo.png',
      mimeType: 'image/png',
      buffer: await png('#1d5fa8'),
    })
    await expect(chat.locator('.mb-chat__tray-item')).toHaveCount(1)
    await box.fill('/logo')
    await box.press('Enter')
    const card = chat.getByRole('group', { name: /logo \(light backgrounds\)/i })
    await expect(card.locator('.mb-card__after img')).toHaveCount(1)
    await card.getByRole('button', { name: 'Apply' }).click()
    await expect(card.getByRole('status')).toContainText('Logo saved')
    const now = idOf((await settings()).logo)
    expect(now).not.toBe(before)
    uploaded.push(now!)

    await card.getByRole('button', { name: 'Undo' }).click()
    await expect(card).toContainText('Undone')
    expect(idOf((await settings()).logo)).toBe(before)
  })

  test('a dropped photo without a command offers choices; cancel changes nothing', async () => {
    const buffer = await png('#d96f25')
    const transfer = await page.evaluateHandle((bytes) => {
      const dt = new DataTransfer()
      dt.items.add(new File([new Uint8Array(bytes)], 'dropped.png', { type: 'image/png' }))
      return dt
    }, Array.from(buffer))
    await chat.dispatchEvent('dragover', { dataTransfer: transfer })
    await expect(chat.getByText('Drop photos here')).toBeVisible()
    await chat.dispatchEvent('drop', { dataTransfer: transfer })
    await expect(chat.locator('.mb-chat__tray-item')).toHaveCount(1)

    await chat.getByRole('button', { name: 'Send' }).click()
    await expect(chat.getByText('What should I do with this photo?')).toBeVisible()
    await chat.getByRole('button', { name: 'Add to Photos' }).click()
    const card = chat.getByRole('group', { name: 'Add 1 photo to the library' })
    await card.getByRole('button', { name: 'Cancel' }).click()
    await expect(card).toContainText('Cancelled — nothing changed')
  })

  test('/palette and /color save a colour draft, undo puts it back', async () => {
    const draft = async () =>
      (await (await page.request.get('/api/globals/theme?draft=true&depth=0')).json()) as {
        preset: string
        brandColor?: string
      }
    const before = await draft()

    await box.fill('/palette nonsense')
    await box.press('Enter')
    await expect(chat.getByText('There is no palette called “nonsense”')).toBeVisible()

    await box.fill('/color 1d5fa8')
    await box.press('Enter')
    const card = chat.getByRole('group', { name: 'Build the colours from your brand colour' })
    await expect(card).toContainText('Custom from #1D5FA8')
    await card.getByRole('button', { name: 'Apply' }).click()
    await expect(card.getByRole('status')).toContainText('Saved as a draft')
    await expect(card.getByRole('link', { name: /Preview and publish/ })).toHaveAttribute(
      'href',
      '/admin/globals/theme',
    )
    expect(await draft()).toMatchObject({ preset: 'auto', brandColor: '#1D5FA8' })

    await card.getByRole('button', { name: 'Undo' }).click()
    await expect(card).toContainText('Undone')
    expect((await draft()).preset).toBe(before.preset)
  })

  test('the server checks every request itself', async ({ request }) => {
    // not logged in
    expect(
      (await request.post('/api/assistant/apply', { data: { action: 'settings' } })).status(),
    ).toBe(401)
    // a bad value sent straight to the endpoint
    const bad = await page.request.post('/api/assistant/apply', {
      data: { action: 'settings', fields: { phone: 'not a phone' } },
    })
    expect(bad.status()).toBe(400)
    // fields the assistant may not touch
    const other = await page.request.post('/api/assistant/apply', {
      data: { action: 'settings', fields: { companyName: 'Hacked' } },
    })
    expect(other.status()).toBe(400)
    // links into the server's own network are refused
    for (const url of [
      'http://127.0.0.1:3000/api/users',
      'http://169.254.169.254/latest',
      'http://localhost./x.png',
    ]) {
      const res = await page.request.post('/api/assistant/image-url', { data: { url } })
      expect(res.status(), url).toBe(400)
      expect((await res.json()).error).toMatch(/private network|unusual port/)
    }
  })
})
