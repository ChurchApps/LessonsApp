// Coverage for ChurchAppsSupport/docs/lessons-church/classrooms/setting-up-classrooms.md.
// /portal lists a church's classrooms in a side table; selecting one reveals
// its schedule pane. Each classroom has create / rename / delete affordances.

import { portalTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const NEW_CLASSROOM_NAME = "Zacchaeus Test Classroom";
const RENAMED_CLASSROOM_NAME = "Zacchaeus Renamed Classroom";

test.describe("Portal classrooms", () => {
  test("renders Grace's seeded classrooms", async ({ page }) => {
    await expect(page.getByRole("button", { name: SEED.CLASSROOMS.PRESCHOOL.name })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: SEED.CLASSROOMS.ELEMENTARY.name })).toBeVisible();
  });

  test.describe.serial("classroom CRUD lifecycle", () => {
    test("create: adds a new classroom", async ({ page }) => {
      const classroomsSection = page
        .locator("div")
        .filter({ has: page.getByRole("heading", { name: "Classrooms" }) })
        .first();
      await classroomsSection.getByRole("button", { name: /^Add$/ }).click();

      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(NEW_CLASSROOM_NAME);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      await expect(page.getByRole("button", { name: NEW_CLASSROOM_NAME })).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the classroom", async ({ page }) => {
      const row = page.getByRole("row", { name: new RegExp(NEW_CLASSROOM_NAME) }).first();
      await row.getByRole("button", { name: /Edit classroom/i }).click();

      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(RENAMED_CLASSROOM_NAME);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      await expect(page.getByRole("button", { name: RENAMED_CLASSROOM_NAME })).toBeVisible({ timeout: 15000 });
    });

    test("delete: removes the classroom", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      const row = page.getByRole("row", { name: new RegExp(RENAMED_CLASSROOM_NAME) }).first();
      await row.getByRole("button", { name: /Edit classroom/i }).click();

      await page.locator('button[title="Delete classroom"]').click();
      await expect(page.getByRole("button", { name: RENAMED_CLASSROOM_NAME })).toBeHidden({ timeout: 15000 });
    });
  });
});
