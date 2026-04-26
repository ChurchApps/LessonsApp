// Coverage for ChurchAppsSupport/docs/lessons-church/classrooms/scheduling-lessons.md.
// /portal lists a church's classrooms; selecting one reveals its schedule pane
// with Add Schedule + per-row Edit/Delete affordances.

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

  test.describe.serial("schedule CRUD lifecycle", () => {
    test("create: opens Add Schedule and saves with default cascade", async ({ page }) => {
      await page.getByRole("button", { name: SEED.CLASSROOMS.PRESCHOOL.name }).click();
      await page.getByRole("button", { name: /Add Schedule/i }).click();

      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeVisible();
      // The form pre-fills date + cascading selects with valid defaults.
      await page.getByRole("button", { name: /^Save$/ }).first().click();
      // After save, the drawer closes (heading disappears).
      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeHidden({ timeout: 15000 });
    });

    test("delete: removes the seeded Noah's Ark schedule from Elementary Room", async ({ page }) => {
      // Picking the Elementary Room's Noah's Ark schedule because no other test
      // asserts on it; deleting Preschool's Mary's Visit would conflict with
      // the "preschool classroom shows its scheduled lesson" test.
      page.on("dialog", (d) => d.accept());
      await page.getByRole("button", { name: SEED.CLASSROOMS.ELEMENTARY.name }).click();

      const row = page.locator("tr").filter({ hasText: /Noah'?s Ark/i }).first();
      await row.locator('button[title="Edit schedule"]').click();

      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeVisible();
      await page.locator('button[title="Delete schedule"]').click();
      await expect(page.locator("tr").filter({ hasText: /Noah'?s Ark/i })).toBeHidden({ timeout: 15000 });
    });
  });
});
