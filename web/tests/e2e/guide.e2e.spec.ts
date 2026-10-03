import { expect, test, type Locator, type Page } from '@playwright/test'

import { login } from '../helpers/login'

/*
 * The assistant without an AI key: answers that come from the website itself.
 * Read-only. Skipped while an AI key is connected (the AI answers instead).
 */
const user = {
  email: process.env.SEED_ADMIN_EMAIL || '',
  password: process.env.SEED_ADMIN_PASSWORD || '',
}

test.describe.serial('Assistant built-in answers about this website', () => {
  test.skip(!user.email, 'needs SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD')
  let page: Page
  let chat: Locator
  let box: Locator

  const ask = async (question: string) => {
    await box.fill(question)
    await box.press('Enter')
    return chat.locator('.mb-chat__bubble').last()
  }

  test.beforeAll(async ({ browser }) => {
    page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage()
    await login({ page, user })
    const status = await (await page.request.get('/api/ai/status')).json()
    test.skip(status.enabled, 'an AI key is connected')
    await page.goto('/admin')
    await page.evaluate(() => sessionStorage.removeItem('mb-assistant'))
    await page.reload()
    await page.getByRole('button', { name: 'Open the assistant' }).click()
    chat = page.getByRole('region', { name: 'Assistant' })
    box = chat.getByLabel('Your question')
  })

  test('text pasted from the website: the page, the section and the list it comes from', async () => {
    // what the home page really says, read from the site
    const pages = await (
      await page.request.get('/api/pages?where[slug][equals]=home&depth=0')
    ).json()
    const home = pages.docs[0]
    const row = home.layout.findIndex((b: { blockType: string }) => b.blockType === 'steps') + 1
    const heading = String(home.layout[row - 1].heading).replace(/\*/g, '')
    const towns = await (await page.request.get('/api/service-areas?limit=3&depth=0')).json()
    const names = towns.docs.map((t: { name: string }) => t.name)

    const bubble = await ask(`${heading}\n${names.join('\n')}\nwhere does this come from?`)
    await expect(bubble).toContainText('That text comes from')
    await expect(bubble).toContainText(`Page “${home.title}” → section ${row}`)
    await expect(
      bubble.getByRole('link', { name: new RegExp(`Open ${home.title}`) }),
    ).toHaveAttribute('href', `/admin/collections/pages/${home.id}`)
    await expect(bubble).toContainText(`Towns we serve: `)
    await expect(bubble.getByRole('link', { name: /Open Towns we serve/ })).toHaveAttribute(
      'href',
      '/admin/collections/service-areas',
    )
  })

  test('removing, hiding and adding a section, in English or Vietnamese', async () => {
    let bubble = await ask('how do I delete the steps section?')
    await expect(bubble).toContainText('Removing the “Steps (how it works)” section')
    await expect(bubble).toContainText('choose “Remove”')
    await expect(bubble.getByRole('link', { name: /^Open / }).first()).toHaveAttribute(
      'href',
      /\/admin\/collections\/pages\/\d+/,
    )

    bubble = await ask('ẩn section banner')
    await expect(bubble).toContainText('Hidden everywhere')

    bubble = await ask('xóa thị trấn')
    await expect(bubble).toContainText('Change the towns you serve')
    await expect(bubble.getByRole('link', { name: /Open Towns we serve/ })).toBeVisible()
  })

  test('the endpoint needs a login', async ({ request }) => {
    const res = await request.post('/api/assistant/answer', { data: { question: 'hello' } })
    expect(res.status()).toBe(401)
  })
})
