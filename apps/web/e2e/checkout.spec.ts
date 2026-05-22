import { test, expect } from '@playwright/test'

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
    const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add"), [data-testid="add-to-cart"]').first()
    await expect(addBtn).toBeVisible({ timeout: 10_000 })
    await addBtn.click()
    await page.waitForTimeout(300)
  })

  test('checkout page is accessible from cart', async ({ page }) => {
    await page.goto('/cart')
    const checkoutBtn = page.locator('a[href="/checkout"], button:has-text("Checkout"), [data-testid="checkout-btn"]').first()
    await expect(checkoutBtn).toBeVisible({ timeout: 8_000 })
    await checkoutBtn.click()
    await expect(page).toHaveURL(/\/checkout/, { timeout: 8_000 })
  })

  test('checkout form renders required fields', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.locator('input[name="name"], input[placeholder*="name" i]').first()).toBeVisible({ timeout: 8_000 })
    await expect(page.locator('input[name="phone"], input[placeholder*="phone" i]').first()).toBeVisible()
  })

  test('M-PESA payment option is present', async ({ page }) => {
    await page.goto('/checkout')
    const mpesaOption = page.locator('text=/M-PESA|mpesa/i, [data-testid="mpesa-option"]').first()
    await expect(mpesaOption).toBeVisible({ timeout: 8_000 })
  })

  test('checkout validates required fields before submitting', async ({ page }) => {
    await page.goto('/checkout')
    const submitBtn = page.locator('button[type="submit"], button:has-text("Place Order"), button:has-text("Pay")').first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      const error = page.locator('text=/required|fill in|invalid/i, [role="alert"]').first()
      await expect(error).toBeVisible({ timeout: 5_000 })
    }
  })
})
