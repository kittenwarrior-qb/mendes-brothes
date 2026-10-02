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

  test('dashboard shows the everyday tasks', async () => {
    await page.goto('/admin')
    await expect(page.getByText(/quote requests?$/).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Add a finished project/ })).toBeVisible()
  })

  test('menu is short and settings live on one screen', async () => {
    await page.goto('/admin')
    const menu = page.locator('aside.nav')
    for (const name of [
      'Home',
      'Quote requests',
      'Pages',
      'Projects',
      'Photos',
      'Settings',
      'Help',
    ]) {
      await expect(menu.getByRole('link', { name: new RegExp(`^${name}`) }).first()).toBeAttached()
    }
    await page.goto('/admin/settings')
    await expect(page.getByRole('link', { name: /Colours & fonts/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Backups Download/ })).toBeVisible()
  })

  test('help page lists the how-to guides', async () => {
    await page.goto('/admin/help')
    await expect(page.getByRole('heading', { name: 'How do I…?' })).toBeVisible()
    await expect(page.getByText('Answer a quote request')).toBeVisible()
  })

  test('page editor names sections in plain language', async () => {
    await page.goto('/admin/collections/pages')
    await page.getByRole('link', { name: 'Home', exact: true }).first().click()
    await expect(page.getByText('Big photo header').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add section' })).toBeVisible()
  })

  test('quote requests can be exported', async () => {
    await page.goto('/admin/collections/form-submissions')
    await expect(page.getByText(/Download all as a spreadsheet/)).toBeVisible()
    const res = await page.request.get('/api/leads-export')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('text/csv')
  })

  test('theme offers visual palettes and a brand-colour generator', async () => {
    await page.goto('/admin/globals/theme')
    await expect(page.getByRole('radio', { name: /Sunset Limestone/ })).toBeVisible()
    await page.getByRole('radio', { name: /Custom/ }).click()
    await expect(page.locator('input[type="color"]').first()).toBeVisible()
    // leave the saved palette untouched
    await page.getByRole('radio', { name: /Sunset Limestone/ }).click()
  })

  test('backups screen lists actions', async () => {
    await page.goto('/admin/backups')
    await expect(page.getByRole('button', { name: 'Back up now' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Upload a backup file/ })).toBeVisible()
  })

  test('statistics screen shows the numbers', async () => {
    await page.goto('/admin/statistics?days=30')
    await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible()
    await expect(page.getByRole('img', { name: 'Visitors per day' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Where visitors came from' })).toBeVisible()
  })

  test('projects list opens', async () => {
    await page.goto('/admin/collections/projects')
    await expect(page.locator('h1', { hasText: 'Projects' }).first()).toBeVisible()
  })
})
