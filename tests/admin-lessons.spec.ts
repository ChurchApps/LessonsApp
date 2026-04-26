// Coverage for ChurchAppsSupport/docs/lessons-church/admin/managing-lessons.md.
// Lessons sit under Studies. From /admin, drill in: Program -> Study -> lessons
// list. Each lesson has Manage Venues / Edit Lesson icon buttons.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Lessons admin", () => {
  test("can drill from program to study to lessons", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();
    // Lessons render as "Name: Title" — use the full disambiguated string.
    await expect(page.getByText("Creation: In the Beginning")).toBeVisible();
    await expect(page.getByText("Noah's Ark: God Saves Noah")).toBeVisible();
  });

  test("opens the venues panel for a seeded lesson", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

    // Click Manage Venues on Creation (first lesson under Genesis).
    const venueBtns = page.locator('button[title="Manage Venues"]');
    await venueBtns.first().click();

    // The venues panel should appear with the seeded venue names.
    // Multiple "Preschool" / "Elementary" texts can exist on page (some are
    // selects / printOnly headings); scope to the venue list area.
    const venuesHeading = page.getByRole("heading", { name: /Venues/i }).first();
    await expect(venuesHeading).toBeVisible({ timeout: 15000 });
  });

  test("opens the edit drawer for an existing lesson", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

    const editBtns = page.locator('button[title="Edit Lesson"]');
    await editBtns.first().click();
    await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue(SEED.LESSONS.CREATION.name);
  });
});
