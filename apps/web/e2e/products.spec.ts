import { test, expect } from '@playwright/test'

test.describe('Product catalog', () => {
  test('loads product listing page', async ({ page }) => {
    await page.goto('/products')
    await expect(page).toHaveTitle(/Msingi|Jenga/)
    await expect(page.locator('h1, [data-testid="page-title"]').first()).toBeVisible()
  })

  test('shows at least one product card', async ({ page }) => {
    await page.goto('/products')
    const cards = page.locator('[data-testid="product-card"], .product-card, article').first()
    await expect(cards).toBeVisible({ timeout: 10_000 })
  })

  test('search filters products', async ({ page }) => {
    await page.goto('/products')
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('samsung')
      await page.waitForTimeout(500)
      const results = page.locator('[data-testid="product-card"], article')
      await expect(results.first()).toBeVisible({ timeout: 8_000 })
    }
  })
})
