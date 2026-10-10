// Issue #1176: every search on lessons.church showed a red "Error" box.

import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test("search page finds a seeded study", async ({ page }) => {
  await page.goto("/search?q=Genesis");
  await expect(page.getByRole("heading", { name: SEED.STUDIES.GENESIS.name }).first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator(".MuiAlert-root")).toHaveCount(0);
});
