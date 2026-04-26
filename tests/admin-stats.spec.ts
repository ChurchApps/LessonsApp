// Coverage for ChurchAppsSupport/docs/lessons-church/admin/statistics.md.
// /admin/stats/:programId shows download/usage statistics for a program.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Program stats", () => {
  test("opens the stats page for a seeded program", async ({ page }) => {
    await page.goto(`/admin/stats/${SEED.PROGRAMS.OT.id}`);
    // The stats page should not redirect to /login (we're authenticated).
    await expect(page).not.toHaveURL(/\/login/);
    // The page should mention the program name somewhere.
    await expect(page.getByText(SEED.PROGRAMS.OT.name).first()).toBeVisible({ timeout: 15000 });
  });
});
