// Coverage for ChurchAppsSupport/docs/lessons-church/browsing/viewing-lessons.md.
// Anonymous visitors can view a lesson's structure (venues, sections, roles, actions)
// at /[programSlug]/[studySlug]/[lessonSlug].

import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Public lesson browsing", () => {
  test("renders the seeded Creation lesson", async ({ page }) => {
    await page.goto(
      `/${SEED.PROGRAMS.OT.slug}/${SEED.STUDIES.GENESIS.slug}/${SEED.LESSONS.CREATION.slug}`
    );
    // Heading area should mention either the lesson name or its title.
    await expect(page.getByRole("heading", { name: /Creation|In the Beginning/ }).first()).toBeVisible({ timeout: 30000 });

    // The seeded Preschool venue's first action ("Welcome to Sunday School…")
    // appears in two paragraph elements (one for the volunteer view, one printOnly).
    await expect(page.getByText("Welcome to Sunday School! We are so glad you are here.").first()).toBeVisible();
    await expect(page.getByText("Bible Story").first()).toBeVisible();
  });
});
