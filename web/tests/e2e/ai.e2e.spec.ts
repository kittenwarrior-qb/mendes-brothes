import { expect, test, type Page } from '@playwright/test'

import { login } from '../helpers/login'

/*
 * AI assistant, end to end, against the stub in tests/helpers/ai-stub.mjs:
 *   node tests/helpers/ai-stub.mjs
 *   AI_BASE_URL=http://127.0.0.1:8787 pnpm start        (the site under test)
 *   AI_STUB=1 E2E_BASE_URL=… SEED_ADMIN_EMAIL=… SEED_ADMIN_PASSWORD=… pnpm test:e2e ai
 * Nothing is published: suggestions are applied to the form and then left unsaved.
 */
const user = {
  email: process.env.SEED_ADMIN_EMAIL || '',
  password: process.env.SEED_ADMIN_PASSWORD || '',
}
const GOOD_KEY = 'test-key-good-1234'

test.describe.serial('AI assistant', () => {
  test.skip(!process.env.AI_STUB || !user.email, 'needs the AI stub (see the comment above)')
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage()
    // moving on from a form with unsaved AI suggestions asks for confirmation
    page.on('dialog', (d) => void d.accept().catch(() => undefined))
    await login({ page, user })
    await page.request.post('/api/ai/settings', { data: { remove: true } })
  })

  test('chat without a key: built-in answers and suggestions', async () => {
    await page.goto('/admin')
    await page.getByRole('button', { name: 'Open the assistant' }).click()
    const chat = page.getByRole('region', { name: 'Assistant' })
    await expect(chat.getByText('Quick answers about this admin')).toBeVisible()
    await chat.getByLabel('Your question').fill('how do I change the logo?')
    await chat.getByLabel('Your question').press('Enter')
    await expect(chat.getByText('The logo is in the Logos tab', { exact: false })).toBeVisible()
    await expect(chat.getByRole('link', { name: /Open Company info & logo/ })).toHaveAttribute(
      'href',
      '/admin/globals/site-settings',
    )
    // the answer shows the guide's screenshots; one click enlarges, arrows move, Escape closes
    await chat.getByRole('button', { name: /Enlarge screenshot: The Logos tab/ }).click()
    const viewer = page.getByRole('dialog', { name: /The Logos tab/ })
    await expect(viewer.locator('img')).toHaveAttribute('src', '/help/adm-logos.webp')
    await expect(viewer).toContainText('2 / 2')
    await viewer.getByRole('button', { name: 'Previous picture' }).click()
    await expect(page.getByRole('dialog', { name: /Company info: phone/ })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.mb-viewer')).toHaveCount(0)
    await chat.getByLabel('Your question').fill('what is the weather tomorrow')
    await chat.getByLabel('Your question').press('Enter')
    await expect(chat.getByText('I do not have a ready answer')).toBeVisible()
    // a suggested question answers itself
    await chat.getByRole('button', { name: 'Back up or restore the website' }).click()
    await expect(chat.getByText('press “Back up now”', { exact: false })).toBeVisible()
    await chat.getByRole('button', { name: 'New chat' }).click()
    await chat.getByRole('button', { name: 'Close the assistant' }).click()
  })

  test('settings: a wrong key is refused, a good key connects', async () => {
    await page.goto('/admin/ai')
    await expect(page.getByRole('radio', { name: /Google Gemini/ })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('link', { name: /Open Google to get a key/ })).toHaveAttribute(
      'href',
      'https://aistudio.google.com/apikey',
    )
    await page.getByLabel('API key').fill('not-a-real-key-000')
    await page.getByRole('button', { name: 'Test & save' }).click()
    await expect(page.locator('.mb-ai__error')).toContainText('did not accept the key')

    await page.getByLabel('API key').fill(GOOD_KEY)
    await page.getByRole('button', { name: 'Test & save' }).click()
    await expect(page.getByText('Connected to Google Gemini')).toBeVisible()
    await expect(page.getByText(/Key ending in 1234/)).toBeVisible()
    // the key itself is never shown again
    await expect(page.locator('body')).not.toContainText(GOOD_KEY)
  })

  test('chat with a key: the AI answers, knows the site, and remembers the conversation', async () => {
    await page.getByRole('button', { name: 'Open the assistant' }).click()
    const chat = page.getByRole('region', { name: 'Assistant' })
    await expect(chat.getByText('AI answers · ask anything')).toBeVisible()
    await chat.getByLabel('Your question').fill('Which accent colour fits a construction company?')
    await chat.getByLabel('Your question').press('Enter')
    await expect(
      chat.getByText('Stub answer (knows the current palette): Which accent colour', {
        exact: false,
      }),
    ).toBeVisible()
    await chat.getByLabel('Your question').fill('And what about the logo?')
    await chat.getByLabel('Your question').press('Enter')
    await expect(
      chat.getByText('Use a wide logo with a transparent background.', { exact: false }),
    ).toBeVisible()
    // a path in the answer is a link
    await expect(chat.getByRole('link', { name: '/admin/globals/site-settings' })).toBeVisible()
    // [image: …] becomes a picture; an unknown id is dropped, and no tag text is left behind
    const last = chat.locator('.mb-chat__bubble').last()
    await expect(last.locator('.mb-chat__thumbs button')).toHaveCount(1)
    await expect(last).not.toContainText('[image')
    const res = await page.request.get('/help/adm-logos.webp')
    expect(res.headers()['content-type']).toContain('image/webp')
    // still there after a reload
    await page.reload()
    await expect(
      page
        .getByRole('region', { name: 'Assistant' })
        .getByText('Use a wide logo', { exact: false }),
    ).toBeVisible()
    await page
      .getByRole('region', { name: 'Assistant' })
      .getByRole('button', { name: 'Close the assistant' })
      .click()
  })

  test('a text field: fix spelling, preview, then use it', async () => {
    const { docs } = await (
      await page.request.get('/api/projects?limit=1&depth=0&sort=-completedAt')
    ).json()
    await page.goto(`/admin/collections/projects/${docs[0].id}`)
    await page.locator('.tabs-field__tab-button', { hasText: 'Overview' }).click()
    const summary = page.locator('#field-summary')
    await summary.fill('We recieve teh lot and clear it.')
    await page.getByRole('button', { name: 'AI: improve this text' }).click()
    await page.getByRole('button', { name: 'Fix spelling & grammar' }).click()
    await expect(page.getByLabel('AI suggestion')).toHaveValue('We receive the lot and clear it.')
    // nothing has changed yet
    await expect(summary).toHaveValue('We recieve teh lot and clear it.')
    await page.getByRole('button', { name: 'Use this' }).click()
    await expect(summary).toHaveValue('We receive the lot and clear it.')
    // the form noticed the change (not just the DOM)
    await expect(page.locator('#action-save')).toBeEnabled()
  })

  test('next to Publish: Google title & description', async () => {
    await page.getByRole('button', { name: 'AI', exact: true }).click()
    await page.getByRole('menuitem', { name: /Write Google title/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: /Google title/ })).toBeVisible()
    await dialog.getByRole('button', { name: 'Use this' }).click()
    await page.locator('.tabs-field__tab-button', { hasText: 'SEO' }).click()
    await expect(page.locator('#field-meta__title')).toHaveValue('Land Clearing in Lewes, DE')
    await expect(page.locator('#field-meta__description')).toHaveValue(/Wooded lot cleared/)
  })

  test('next to Publish: project description fills the summary and the write-up', async () => {
    await page.getByRole('button', { name: 'AI', exact: true }).click()
    await page.getByRole('menuitem', { name: /Write the description/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('The owner needed the lot opened up')).toBeVisible()
    await dialog.getByRole('button', { name: 'Use this' }).click()
    await page.locator('.tabs-field__tab-button', { hasText: 'Overview' }).click()
    await expect(page.locator('#field-summary')).toHaveValue(/^We cleared and mulched a wooded lot/)
    await page.locator('.tabs-field__tab-button', { hasText: 'Details' }).click()
    await expect(page.locator('.rich-text-lexical [contenteditable]').first()).toContainText(
      'We mulched the brush, pulled the stumps',
    )
  })

  test('rich text: fix the selected words', async () => {
    const editor = page.locator('.rich-text-lexical [contenteditable]').first()
    await editor.click()
    await page.keyboard.press('Control+A')
    await page.keyboard.type('We recieve teh permit first.')
    await page.keyboard.press('Control+A')
    await page.getByRole('button', { name: 'AI: improve this text' }).click()
    await page.getByRole('button', { name: 'Fix spelling & grammar' }).click()
    await expect(page.getByLabel('AI suggestion')).toHaveValue('We receive the permit first.')
    await page.getByRole('button', { name: 'Use this' }).click()
    await expect(editor).toContainText('We receive the permit first.')
    await expect(editor).not.toContainText('recieve')
  })

  test('next to Publish: check before publishing lists problems', async () => {
    await page.locator('.tabs-field__tab-button', { hasText: 'Overview' }).click()
    await page.locator('#field-summary').fill('We recieve the lot.')
    await page.getByRole('button', { name: 'AI', exact: true }).click()
    await page.getByRole('menuitem', { name: /Check before publishing/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: /to look at/ })).toBeVisible()
    await expect(dialog.getByText('“recieve” is misspelled.')).toBeVisible()
    await dialog.getByRole('button', { name: 'Close' }).click()
  })

  test('photos: describe an existing photo', async () => {
    const { docs } = await (
      await page.request.get('/api/media?limit=1&depth=0&where[alt][like]=Excavator')
    ).json()
    await page.goto(`/admin/collections/media/${docs[0].id}`)
    await page.locator('#field-alt').fill('')
    await page.getByRole('button', { name: 'Describe this photo' }).click()
    await expect(page.locator('#field-alt')).toHaveValue(
      'Excavator loading soil into a dump truck on a cleared lot',
    )
  })

  test('no key: the buttons are gone and managers are pointed to the setup screen', async () => {
    await page.request.post('/api/ai/settings', { data: { remove: true } })
    const { docs } = await (
      await page.request.get('/api/projects?limit=1&depth=0&sort=-completedAt')
    ).json()
    await page.goto(`/admin/collections/projects/${docs[0].id}`)
    await page.locator('#field-title').click()
    await expect(page.getByRole('link', { name: 'Set up AI' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'AI: improve this text' })).toHaveCount(0)
  })
})
