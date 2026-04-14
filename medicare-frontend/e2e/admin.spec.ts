import { test, expect } from "@playwright/test"

test.describe("Admin", () => {
  test("admin route redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/admin\/login/)
  })

  test("admin login page renders", async ({ page }) => {
    await page.goto("/admin/login")
    await expect(page.getByRole("heading")).toBeVisible()
  })
})
