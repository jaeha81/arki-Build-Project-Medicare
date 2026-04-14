import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/en/auth/login")
    await expect(page.getByRole("heading", { name: /sign in|login|ログイン/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("empty form submission shows errors", async ({ page }) => {
    await page.goto("/en/auth/login")
    await page.getByRole("button", { name: /sign in|login|ログイン/i }).click()
    // zod validation: email required
    await expect(page.getByText(/email/i)).toBeVisible()
  })

  test("dashboard redirects unauthenticated users", async ({ page }) => {
    await page.goto("/en/dashboard")
    // should redirect to login
    await expect(page).toHaveURL(/auth\/login|login/)
  })

  test("register page renders", async ({ page }) => {
    await page.goto("/en/auth/register")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })
})
