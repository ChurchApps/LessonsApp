// Coverage for ChurchAppsSupport/docs/lessons-church/classrooms/setting-up-classrooms.md.
// /portal lists a church's classrooms in a side table with an "Add" button at
// the top. Selecting a classroom reveals its schedule pane.

import { portalTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const DISPOSABLE_CLASSROOM_NAME = "Zacchaeus Test Classroom";

test.describe("Portal classrooms", () => {
  test("renders Grace's seeded classrooms", async ({ page }) => {
    await expect(page.getByRole("button", { name: SEED.CLASSROOMS.PRESCHOOL.name })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: SEED.CLASSROOMS.ELEMENTARY.name })).toBeVisible();
  });

  // Cleanup: pretest resets the lessons DB before every run.
  test("creates a new classroom", async ({ page }) => {
    // The Classrooms section has a small "Add" button next to the heading.
    const classroomsSection = page
      .locator("div")
      .filter({ has: page.getByRole("heading", { name: "Classrooms" }) })
      .first();
    await classroomsSection.getByRole("button", { name: /^Add$/ }).click();

    const nameInput = page.locator('input[name="name"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 10000 });
    await nameInput.fill(DISPOSABLE_CLASSROOM_NAME);

    await page.getByRole("button", { name: /^Save$/ }).first().click();
    await expect(page.getByRole("button", { name: DISPOSABLE_CLASSROOM_NAME })).toBeVisible({ timeout: 15000 });
  });
});
