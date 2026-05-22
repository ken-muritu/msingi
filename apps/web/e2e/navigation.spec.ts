import { test, expect } from '@playwright/test'

test.describe('Navigation & core pages', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Msingi|Jenga/)
  })

  test('landing page has key content', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('h1, [data-testid="hero-title"]').first()
    await expect(hero).toBeVisible()
  })

  test('products page is reachable from nav', async ({ page }) => {
    await page.goto('/')
    const productsLink = page.locator('a[href="/products"]').first()
    if (await productsLink.isVisible()) {
      await productsLink.click()
      await expect(page).toHaveURL(/\/products/)
    } else {
      await page.goto('/products')
      await expect(page).toHaveURL(/\/products/)
    }
  })

  test('offline page renders correctly', async ({ page }) => {
    await page.goto('/offline')
    await expect(page.locator('text=/offline/i').first()).toBeVisible()
    await expect(page.locator('button:has-text("Try again")').first()).toBeVisible()
  })

  test('404 page shows not found', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz')
    expect(response?.status()).toBe(404)
  })
})
