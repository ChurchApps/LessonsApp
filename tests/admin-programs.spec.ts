// Coverage for ChurchAppsSupport/docs/lessons-church/admin/managing-programs.md.
// Programs are the top-level grouping in the curriculum hierarchy.
// /admin lists them as expandable cards; "Add Program" opens an edit drawer.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const DISPOSABLE_PROGRAM_NAME = "Zacchaeus Test Program";
const DISPOSABLE_PROGRAM_SLUG = "zacchaeus-test-program";

test.describe("Programs admin", () => {
  test("renders the seeded programs list", async ({ page }) => {
    // Two h6 headings on /admin contain "Programs" — the section heading and the
    // page subtitle "Manage programs, studies and lessons...". Match the section heading by exact text.
    await expect(page.getByRole("heading", { name: "Programs", exact: true })).toBeVisible();
    await expect(page.getByText(SEED.PROGRAMS.OT.name).first()).toBeVisible();
    await expect(page.getByText(SEED.PROGRAMS.NT.name).first()).toBeVisible();
  });

  test("opens the Add Program drawer from the header", async ({ page }) => {
    await page.getByRole("button", { name: "Add Program" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeVisible();
    // The form should be primed with the empty-state defaults (no name yet).
    await expect(page.locator('input[name="name"]')).toHaveValue("");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeHidden();
  });

  // Cleanup: pretest resets the lessons DB before every run, so the Zacchaeus
  // program created here gets wiped without an explicit delete step.
  test("creates a new program", async ({ page }) => {
    await page.getByRole("button", { name: "Add Program" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeVisible();

    await page.locator('input[name="name"]').fill(DISPOSABLE_PROGRAM_NAME);
    await page.locator('input[name="slug"]').fill(DISPOSABLE_PROGRAM_SLUG);
    await page.locator('input[name="shortDescription"]').fill("Test program for Playwright");
    await page.getByRole("button", { name: "Save" }).click();

    // After save, the new program appears in the list.
    await expect(page.getByText(DISPOSABLE_PROGRAM_NAME).first()).toBeVisible({ timeout: 15000 });
  });
});
