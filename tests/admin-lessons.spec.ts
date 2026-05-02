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
    await page.locator('button[title="Manage Venues"]').first().click();
    await expect(page.getByRole("heading", { name: /Venues/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test("opens the edit drawer for an existing lesson", async ({ page }) => {
    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();
    await page.locator('button[title="Edit Lesson"]').first().click();
    await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue(SEED.LESSONS.CREATION.name);
  });

  test.describe.serial("lesson CRUD lifecycle", () => {
    test("create: adds a new lesson under Genesis Stories", async ({ page }) => {
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();
      await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

      // Find the Add Lesson icon in the Genesis study row.
      const studyHeading = page.locator(`p:has-text("${SEED.STUDIES.GENESIS.name}"), :is(h6, .MuiTypography-subtitle1):has-text("${SEED.STUDIES.GENESIS.name}")`).first();
      const studyRow = studyHeading.locator('xpath=ancestor::div[.//button[@title="Add Lesson"]][1]');
      await studyRow.locator('button[title="Add Lesson"]').first().click();

      await expect(page.getByRole("heading", { name: "Add Lesson" })).toBeVisible();
      await page.locator('input[name="name"]').fill(NEW_LESSON_NAME);
      await page.locator('input[name="title"]').fill(NEW_LESSON_TITLE);
      await page.locator('input[name="slug"]').fill(NEW_LESSON_SLUG);
      await page.getByRole("button", { name: "Check" }).click();
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText(`${NEW_LESSON_NAME}: ${NEW_LESSON_TITLE}`)).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the lesson", async ({ page }) => {
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();
      await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

      const lessonRow = page.locator("div").filter({
        has: page.getByText(`${NEW_LESSON_NAME}: ${NEW_LESSON_TITLE}`),
      }).filter({
        has: page.locator('button[title="Edit Lesson"]'),
      }).first();
      await lessonRow.locator('button[title="Edit Lesson"]').first().click();

      await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
      await page.locator('input[name="name"]').fill(RENAMED_LESSON_NAME);
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText(`${RENAMED_LESSON_NAME}: ${NEW_LESSON_TITLE}`)).toBeVisible({ timeout: 15000 });
    });

    test("delete: removes the lesson", async ({ page }) => {
      page.on("dialog", (d) => d.accept());
      await page.getByText(SEED.PROGRAMS.OT.name).first().click();
      await page.getByText(SEED.STUDIES.GENESIS.name).first().click();

      const lessonRow = page.locator("div").filter({
        has: page.getByText(`${RENAMED_LESSON_NAME}: ${NEW_LESSON_TITLE}`),
      }).filter({
        has: page.locator('button[title="Edit Lesson"]'),
      }).first();
      await lessonRow.locator('button[title="Edit Lesson"]').first().click();
      await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
      await page.locator('button[title="Delete lesson"]').click();

      await expect(page.getByText(`${RENAMED_LESSON_NAME}: ${NEW_LESSON_TITLE}`)).toBeHidden({ timeout: 15000 });
    });
  });
});
