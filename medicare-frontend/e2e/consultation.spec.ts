import { test, expect } from "@playwright/test"

test.describe("Consultation flow", () => {
  test("consultation page renders", async ({ page }) => {
    await page.goto("/en/consultation")
    await expect(page.getByRole("main")).toBeVisible()
  })

  test("shows form validation on empty submit", async ({ page }) => {
    await page.goto("/en/consultation")
    const nextBtn = page.getByRole("button", { name: /next|submit|continue/i }).first()
    await expect(nextBtn).toBeVisible()
    await nextBtn.click()
    // zod/react-hook-form validation: at least one error message must appear
    const errorMsg = page.locator("[role='alert'], .text-destructive, [aria-invalid='true'], p.text-red-500").first()
    await expect(errorMsg).toBeVisible({ timeout: 3000 })
  })
})
