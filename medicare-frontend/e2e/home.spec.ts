import { test, expect } from "@playwright/test"

test.describe("Home page", () => {
  test("renders en home page", async ({ page }) => {
    await page.goto("/en")
    await expect(page).toHaveTitle(/Medicare/)
    // hero section
    await expect(page.getByRole("main")).toBeVisible()
  })

  test("renders ja home page", async ({ page }) => {
    await page.goto("/ja")
    await expect(page).toHaveTitle(/Medicare/)
  })

  test("navigation links are present", async ({ page }) => {
    await page.goto("/en")
    await expect(page.getByRole("link", { name: /FAQ/i })).toBeVisible()
  })
})
