// Coverage for ChurchAppsSupport/docs/lessons-church/admin/managing-lessons.md.
// Lessons sit under Studies. Each lesson has Manage Venues / Edit Lesson icons.

import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const NEW_LESSON_NAME = "Zacchaeus Test Lesson";
const NEW_LESSON_SLUG = "zacchaeus-test-lesson";
const NEW_LESSON_TITLE = "Zacchaeus Climbs the Tree";
const RENAMED_LESSON_NAME = "Zacchaeus Renamed Lesson";

test.describe("Lessons admin", () => {
  test("can drill from program to study to lessons", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();
    await expect(page.getByText("Creation: In the Beginning")).toBeVisible();
    await expect(page.getByText("Noah's Ark: God Saves Noah")).toBeVisible();
  });

  test("opens the venues panel for a seeded lesson", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();
    // Click any seeded lesson row to open the panel, then switch to the Venues tab.
    await page.getByTestId("admin-main").getByText(/Creation: |Noah's Ark: /).first().click();
    await page.getByTestId("admin-panel").getByRole("button", { name: /Venues/ }).click();
    await expect(page.getByRole("heading", { name: /Venues/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test("opens the edit drawer for an existing lesson", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();
    await page.getByTestId("admin-main").getByText(/Creation: /).first().click();
    await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue(SEED.LESSONS.CREATION.name);
  });

  test.describe.serial("lesson CRUD lifecycle", () => {
    test("create: adds a new lesson under Genesis Stories", async ({ page }) => {
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();
      await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

      // The expanded study now has an "Add lesson to this study" CTA at the bottom.
      await page.getByRole("button", { name: /Add lesson to this study/i }).click();

      await expect(page.getByRole("heading", { name: "Add Lesson" })).toBeVisible();
      await page.locator('input[name="name"]').fill(NEW_LESSON_NAME);
      await page.locator('input[name="title"]').fill(NEW_LESSON_TITLE);
      await page.locator('input[name="slug"]').fill(NEW_LESSON_SLUG);
      await page.getByRole("button", { name: "Check" }).click();
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByTestId("admin-main").getByText(`${NEW_LESSON_NAME}: ${NEW_LESSON_TITLE}`)).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the lesson", async ({ page }) => {
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();
      await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

      // Click the lesson row in the main pane to open its Edit form in the panel.
      await page.getByTestId("admin-main").getByText(`${NEW_LESSON_NAME}: ${NEW_LESSON_TITLE}`).click();

      await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
      await page.locator('input[name="name"]').fill(RENAMED_LESSON_NAME);
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByTestId("admin-main").getByText(`${RENAMED_LESSON_NAME}: ${NEW_LESSON_TITLE}`)).toBeVisible({ timeout: 15000 });
    });

    test("delete: removes the lesson", async ({ page }) => {
      page.on("dialog", (d) => d.accept());
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();
      await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

      await page.getByTestId("admin-main").getByText(`${RENAMED_LESSON_NAME}: ${NEW_LESSON_TITLE}`).click();
      await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
      await page.locator('button[title="Delete lesson"]').click();

      await expect(page.getByTestId("admin-main").getByText(`${RENAMED_LESSON_NAME}: ${NEW_LESSON_TITLE}`)).toHaveCount(0, { timeout: 15000 });
    });
  });
});
