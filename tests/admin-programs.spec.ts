// Coverage for ChurchAppsSupport/docs/lessons-church/admin/managing-programs.md.
// Programs are the top-level grouping in the curriculum hierarchy.
// /admin lists them as expandable cards; "Add Program" opens an edit drawer.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const NEW_PROGRAM_NAME = "Zacchaeus Test Program";
const NEW_PROGRAM_SLUG = "zacchaeus-test-program";
const RENAMED_PROGRAM_NAME = "Zacchaeus Renamed Program";

test.describe("Programs admin", () => {
  test("renders the seeded programs list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Programs", exact: true })).toBeVisible();
    await expect(page.getByText(SEED.PROGRAMS.OT.name).first()).toBeVisible();
    await expect(page.getByText(SEED.PROGRAMS.NT.name).first()).toBeVisible();
  });

  test("opens the Add Program drawer from the header", async ({ page }) => {
    await page.getByRole("button", { name: "Add Program" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue("");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeHidden();
  });

  // Full CRUD lifecycle in a single serial chain so create -> read -> update -> delete
  // share the same disposable record. pretest resets the lessons DB before each
  // run, so a partial failure can't poison the next run.
  test.describe.serial("program CRUD lifecycle", () => {
    test("create: adds a new program", async ({ page }) => {
      await page.getByRole("button", { name: "Add Program" }).first().click();
      await expect(page.getByRole("heading", { name: "Add Program" })).toBeVisible();

      await page.locator('input[name="name"]').fill(NEW_PROGRAM_NAME);
      await page.locator('input[name="slug"]').fill(NEW_PROGRAM_SLUG);
      await page.locator('input[name="shortDescription"]').fill("Test program for Playwright");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.locator(`h6:has-text("${NEW_PROGRAM_NAME}")`)).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the program via the Edit drawer", async ({ page }) => {
      const heading = page.locator(`h6:has-text("${NEW_PROGRAM_NAME}")`).first();
      const row = heading.locator('xpath=ancestor::div[.//button[@title="Edit Program"]][1]');
      await row.locator('button[title="Edit Program"]').first().click();

      await expect(page.getByRole("heading", { name: "Edit Program" })).toBeVisible();
      await page.locator('input[name="name"]').fill(RENAMED_PROGRAM_NAME);
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.locator(`h6:has-text("${RENAMED_PROGRAM_NAME}")`)).toBeVisible({ timeout: 15000 });
      await expect(page.locator(`h6:has-text("${NEW_PROGRAM_NAME}")`)).toBeHidden();
    });

    test("delete: removes the program", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      const heading = page.locator(`h6:has-text("${RENAMED_PROGRAM_NAME}")`).first();
      const row = heading.locator('xpath=ancestor::div[.//button[@title="Edit Program"]][1]');
      await row.locator('button[title="Edit Program"]').first().click();
      await expect(page.getByRole("heading", { name: "Edit Program" })).toBeVisible();

      await page.locator('button[title="Delete program"]').click();
      await expect(page.locator(`h6:has-text("${RENAMED_PROGRAM_NAME}")`)).toBeHidden({ timeout: 15000 });
    });
  });
});
