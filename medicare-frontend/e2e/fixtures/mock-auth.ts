import { test as base } from "@playwright/test"

// Authenticated state fixture
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Set the HttpOnly-equivalent cookie for testing
    await page.context().addCookies([
      {
        name: "medicare_auth",
        value: "test-jwt-token",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
      },
    ])
    await use(page)
  },
})

export { expect } from "@playwright/test"
