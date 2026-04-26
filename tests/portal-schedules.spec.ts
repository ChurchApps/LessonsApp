// Coverage for ChurchAppsSupport/docs/lessons-church/classrooms/scheduling-lessons.md.
// /portal lists a church's classrooms; selecting one reveals its schedule pane
// with the seeded entries for that classroom.

import { portalTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Portal schedules", () => {
  test("selecting a classroom reveals its schedule pane", async ({ page }) => {
    await page.getByRole("button", { name: SEED.CLASSROOMS.ELEMENTARY.name }).click();
    await expect(page.getByText("Creation (Elementary)")).toBeVisible({ timeout: 15000 });
  });

  test("preschool classroom shows its scheduled lesson", async ({ page }) => {
    await page.getByRole("button", { name: SEED.CLASSROOMS.PRESCHOOL.name }).click();
    await expect(page.getByText("Mary's Visit (Preschool)")).toBeVisible({ timeout: 15000 });
  });
});
