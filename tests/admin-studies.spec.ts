// Coverage for ChurchAppsSupport/docs/lessons-church/admin/managing-studies.md.
// Studies live inside Programs. From /admin, expanding a Program reveals its
// studies and exposes an "Add Study" icon button. Each study has its own edit
// affordance; lessons live one level deeper.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const DISPOSABLE_STUDY_NAME = "Zacchaeus Test Study";
const DISPOSABLE_STUDY_SLUG = "zacchaeus-test-study";

test.describe("Studies admin", () => {
  test("expanding a program reveals its studies", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await expect(page.getByText(SEED.STUDIES.GENESIS.name).first()).toBeVisible();
    await expect(page.getByText(SEED.STUDIES.EXODUS.name).first()).toBeVisible();
  });

  // Cleanup: pretest resets the lessons DB before every run.
  test("creates a new study under Old Testament Heroes", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();

    // The page has multiple "Add Study" buttons (one per program). Find the
    // one closest to the OT program's h6 by walking up the DOM ancestors.
    const otHeading = page.locator(`h6:has-text("${SEED.PROGRAMS.OT.name}")`).first();
    const otRow = otHeading.locator('xpath=ancestor::div[.//button[@title="Add Study"]][1]');
    await otRow.locator('button[title="Add Study"]').first().click();

    await expect(page.getByRole("heading", { name: "Add Study" })).toBeVisible();
    await page.locator('input[name="name"]').fill(DISPOSABLE_STUDY_NAME);
    await page.locator('input[name="slug"]').fill(DISPOSABLE_STUDY_SLUG);
    // StudyEdit requires the slug "Check" button to be clicked before save
    // (sets internal `checked` state that validate() requires).
    await page.getByRole("button", { name: "Check" }).click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(DISPOSABLE_STUDY_NAME).first()).toBeVisible({ timeout: 15000 });
  });
});
