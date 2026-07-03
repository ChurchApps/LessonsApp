import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Public browsing", () => {
  test("renders a seeded program page", async ({ page }) => {
    await page.goto(`/${SEED.PROGRAMS.OT.slug}`);
    await expect(page.getByRole("heading", { name: SEED.PROGRAMS.OT.name })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(SEED.STUDIES.GENESIS.name).first()).toBeVisible();
    await expect(page.getByText(SEED.STUDIES.EXODUS.name).first()).toBeVisible();
  });

  test("renders a seeded study page", async ({ page }) => {
    await page.goto(`/${SEED.PROGRAMS.OT.slug}/${SEED.STUDIES.GENESIS.slug}`);
    await expect(page.getByRole("heading", { name: SEED.STUDIES.GENESIS.name })).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(SEED.LESSONS.CREATION.name).first()).toBeVisible();
    await expect(page.getByText(SEED.LESSONS.NOAH.name).first()).toBeVisible();
  });
});
