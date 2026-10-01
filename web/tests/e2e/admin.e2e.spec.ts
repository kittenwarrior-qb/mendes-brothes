import { expect, test, type Page } from '@playwright/test'

import { login } from '../helpers/login'

/*
 * Uses the admin created by `pnpm seed` (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD).
 * Deliberately avoids the Payload Local API: running it in dev mode against a
 * production database would "push" the schema and block future migrations.
 */
const user = {
  email: process.env.SEED_ADMIN_EMAIL || '',
  password: process.env.SEED_ADMIN_PASSWORD || '',
}

test.describe('admin panel', () => {
  test.skip(!user.email || !user.password, 'set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD')
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await (await browser.newContext()).newPage()
    await login({ page, user })
  })

  test('dashboard shows the quick links', async () => {
    await page.goto('/admin')
    await expect(page.getByText('New leads')).toBeVisible()
    await expect(page.getByText('Colours, fonts & layout')).toBeVisible()
  })

  test('theme settings expose colour pickers', async () => {
    await page.goto('/admin/globals/theme')
    await expect(page.locator('input[type="color"]').first()).toBeVisible()
  })

  test('projects list opens', async () => {
    await page.goto('/admin/collections/projects')
    await expect(page.locator('h1', { hasText: 'Projects' }).first()).toBeVisible()
  })
})
