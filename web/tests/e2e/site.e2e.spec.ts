import { expect, test } from '@playwright/test'

/*
 * End-to-end checks against a seeded site (`pnpm seed`).
 * Base URL: E2E_BASE_URL (default http://localhost:3000).
 */

test.describe('public site', () => {
  test('home page renders hero, services and projects', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/')
    await expect(page).toHaveTitle(/Mendez Brothes/)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('.hero-title')).toBeVisible()
    await expect(page.locator('.s-list a').first()).toBeVisible()
    await expect(page.locator('.pcard').first()).toBeVisible()
    expect(errors).toEqual([])
  })

  test('main navigation reaches every core page', async ({ page }) => {
    await page.goto('/')
    for (const [name, url] of [
      ['About Us', '/about'],
      ['Projects', '/projects'],
      ['Equipment & Technology', '/capabilities'],
      ['Contact', '/contact'],
    ] as const) {
      await page.locator('#navLinks').getByRole('link', { name, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${url}$`))
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('project filters update the URL and results', async ({ page }) => {
    await page.goto('/projects')
    const total = await page.locator('.pcard').count()
    expect(total).toBeGreaterThan(3)

    await page.getByRole('button', { name: 'Excavation', exact: true }).click()
    await expect(page).toHaveURL(/service=excavation/)
    await expect(page.locator('.result-bar strong')).not.toHaveText(String(total))
    const filtered = await page.locator('.pcard').count()
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(total)

    await page.locator('#f-size').selectOption({ label: 'Over 5 acres' })
    await expect(page).toHaveURL(/size=/)

    await page.getByRole('button', { name: 'Clear filters' }).first().click()
    await expect(page).toHaveURL(/\/projects$/)
  })

  test('project detail shows facts and a quote button', async ({ page }) => {
    await page.goto('/projects')
    await page.locator('.pcard').first().click()
    await expect(page).toHaveURL(/\/projects\/.+/)
    await expect(page.locator('.facts')).toContainText('Lot size')
    await expect(page.getByRole('link', { name: /estimate/i }).first()).toBeVisible()
  })

  test('contact form validates and submits a lead', async ({ page, request }) => {
    await page.goto('/contact?service=grading')
    const form = page
      .locator('form')
      .filter({ has: page.getByRole('button', { name: /request estimate/i }) })
    await expect(form.locator('select[name="service"]')).toHaveValue('grading')

    await form.getByRole('button', { name: /request estimate/i }).click()
    await expect(form.locator('.err').first()).toBeVisible()

    await form.locator('input[name="name"]').fill('E2E Test')
    await form.locator('input[name="phone"]').fill('302-555-0199')
    await form.locator('textarea[name="message"]').fill('Automated test — please ignore')
    await form.getByRole('button', { name: /request estimate/i }).click()
    await expect(page.getByRole('status')).toContainText(/thanks/i)

    // clean up the test lead
    const login = await request.post('/api/users/login', {
      data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD },
    })
    if (login.ok()) {
      const { token } = await login.json()
      const headers = { Authorization: `JWT ${token}` }
      const leads = await (
        await request.get('/api/form-submissions?limit=20&sort=-createdAt', { headers })
      ).json()
      for (const d of leads.docs ?? []) {
        if (JSON.stringify(d.submissionData).includes('E2E Test')) {
          await request.delete(`/api/form-submissions/${d.id}`, { headers })
        }
      }
    }
  })

  test('mobile menu opens and closes on navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const menu = page.getByRole('button', { name: 'Open menu' })
    await menu.click()
    await expect(page.locator('#navLinks')).toBeVisible()
    await page.locator('#navLinks').getByRole('link', { name: 'Contact', exact: true }).click()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.locator('#navLinks')).toBeHidden()
  })

  test('unknown pages return a branded 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible()
  })

  test('SEO files are served', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(await robots.text()).toContain('Sitemap:')
    const sitemap = await request.get('/sitemap.xml')
    expect(await sitemap.text()).toContain('/projects/')
  })
})
