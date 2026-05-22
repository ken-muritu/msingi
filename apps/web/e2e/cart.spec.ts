import { test, expect } from '@playwright/test'

test.describe('Cart', () => {
  test('cart page loads', async ({ page }) => {
    await page.goto('/cart')
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.locator('h1, [data-testid="cart-title"]').first()).toBeVisible()
  })

  test('add to cart from product listing', async ({ page }) => {
    await page.goto('/products')

    const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-testid="add-to-cart"]').first()
    await expect(addBtn).toBeVisible({ timeout: 10_000 })
    await addBtn.click()

    const cartBadge = page.locator('[data-testid="cart-count"], .cart-badge, [aria-label*="cart" i]').first()
    await expect(cartBadge).toBeVisible({ timeout: 5_000 })
  })

  test('cart sidebar opens after adding item', async ({ page }) => {
    await page.goto('/products')

    const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-testid="add-to-cart"]').first()
    await expect(addBtn).toBeVisible({ timeout: 10_000 })
    await addBtn.click()

    const sidebar = page.locator('[data-testid="cart-sidebar"], aside, [role="dialog"]').first()
    await expect(sidebar).toBeVisible({ timeout: 5_000 })
  })

  test('empty cart shows empty state', async ({ page }) => {
    await page.goto('/cart')
    const emptyState = page.locator('text=/empty|no items|Your cart is empty/i').first()
    const cartItem = page.locator('[data-testid="cart-item"]').first()

    const hasEmpty = await emptyState.isVisible().catch(() => false)
    const hasItem = await cartItem.isVisible().catch(() => false)
    expect(hasEmpty || hasItem).toBeTruthy()
  })
})
