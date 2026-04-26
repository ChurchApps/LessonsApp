// Coverage for ChurchAppsSupport/docs/lessons-church/admin/managing-studies.md.
// Studies live inside Programs.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const NEW_STUDY_NAME = "Zacchaeus Test Study";
const NEW_STUDY_SLUG = "zacchaeus-test-study";
const RENAMED_STUDY_NAME = "Zacchaeus Renamed Study";

test.describe("Studies admin", () => {
  test("expanding a program reveals its studies", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await expect(page.getByText(SEED.STUDIES.GENESIS.name).first()).toBeVisible();
    await expect(page.getByText(SEED.STUDIES.EXODUS.name).first()).toBeVisible();
  });

  test.describe.serial("study CRUD lifecycle", () => {
    test("create: adds a new study under Old Testament Heroes", async ({ page }) => {
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();

      const otHeading = page.locator(`h6:has-text("${SEED.PROGRAMS.OT.name}")`).first();
      const otRow = otHeading.locator('xpath=ancestor::div[.//button[@title="Add Study"]][1]');
      await otRow.locator('button[title="Add Study"]').first().click();

      await expect(page.getByRole("heading", { name: "Add Study" })).toBeVisible();
      await page.locator('input[name="name"]').fill(NEW_STUDY_NAME);
      await page.locator('input[name="slug"]').fill(NEW_STUDY_SLUG);
      // StudyEdit gates Save on a slug "Check" click that flips internal state.
      await page.getByRole("button", { name: "Check" }).click();
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText(NEW_STUDY_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the study", async ({ page }) => {
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();

      const heading = page.getByText(NEW_STUDY_NAME, { exact: false }).first();
      const row = heading.locator('xpath=ancestor::div[.//button[@title="Edit Study"]][1]');
      await row.locator('button[title="Edit Study"]').first().click();

      await expect(page.getByRole("heading", { name: "Edit Study" })).toBeVisible();
      await page.locator('input[name="name"]').fill(RENAMED_STUDY_NAME);
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText(RENAMED_STUDY_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("delete: removes the study", async ({ page }) => {
      page.on("dialog", (d) => d.accept());
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();

      const heading = page.getByText(RENAMED_STUDY_NAME, { exact: false }).first();
      const row = heading.locator('xpath=ancestor::div[.//button[@title="Edit Study"]][1]');
      await row.locator('button[title="Edit Study"]').first().click();
      await expect(page.getByRole("heading", { name: "Edit Study" })).toBeVisible();

      await page.locator('button[title="Delete study"]').click();
      await expect(page.getByText(RENAMED_STUDY_NAME)).toBeHidden({ timeout: 15000 });
    });
  });
});
