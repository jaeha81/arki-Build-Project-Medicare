import { test, expect } from "@playwright/test"

test.describe("FAQ page", () => {
  test("faq page renders accordion items", async ({ page }) => {
    await page.goto("/en/faq")
    await expect(page.getByRole("main")).toBeVisible()
    // At least one accordion item should be present
    const accordionItems = page.locator("[data-accordion-item], [role='button'], details, summary").first()
    await expect(accordionItems).toBeVisible()
  })

  test("accordion item toggles content on click", async ({ page }) => {
    await page.goto("/en/faq")
    // shadcn/ui Accordion trigger has data-state="closed" initially
    const trigger = page.locator("[data-state='closed']").first()
    await expect(trigger).toBeVisible()
    await trigger.click()
    // After click, the item must transition to data-state="open"
    await expect(trigger).toHaveAttribute("data-state", "open", { timeout: 3000 })
  })
})
