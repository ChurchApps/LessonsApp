import { adminTest, portalTest, browseTest, expect } from "./helpers/test-fixtures";

// Smoke test the test harness itself: each fixture should land on an
// authenticated (or for browse, anonymous) page without an auth redirect.

adminTest("admin context loads and is not redirected to /login", async ({ page }) => {
  await expect(page).not.toHaveURL(/\/login/);
});

portalTest("portal context loads and is not redirected to /login", async ({ page }) => {
  await expect(page).not.toHaveURL(/\/login/);
});

browseTest("browse context loads the public home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveURL(/\/admin|\/portal/);
});
