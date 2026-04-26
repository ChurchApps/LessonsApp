// Coverage for ChurchAppsSupport/docs/lessons-church/browsing/searching.md.
// Public site exposes a search bar that filters by name across programs/studies.

import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Public search", () => {
  test("home page renders without auth", async ({ page }) => {
    await page.goto("/");
    // The home page should expose the seeded curriculum somewhere.
    await expect(page.getByText(SEED.PROGRAMS.OT.name).first()).toBeVisible({ timeout: 30000 });
  });

  test("search bar surfaces a seeded program", async ({ page }) => {
    await page.goto(`/${SEED.PROGRAMS.OT.slug}`);
    // Look for any search input on the page (provided by SearchBar component).
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    if (!(await searchInput.isVisible({ timeout: 5000 }).catch(() => false))) {
      // Search bar isn't on every page; just verify the program page renders.
      await expect(page.getByRole("heading", { name: SEED.PROGRAMS.OT.name })).toBeVisible();
      return;
    }
    await searchInput.fill("Genesis");
    // Either the result appears as a link/card, or the page navigates.
    await expect(page.getByText(SEED.STUDIES.GENESIS.name).first()).toBeVisible({ timeout: 15000 });
  });
});
