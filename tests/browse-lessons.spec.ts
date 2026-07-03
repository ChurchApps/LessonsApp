import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Public lesson browsing", () => {
  test("renders the seeded Creation lesson", async ({ page }) => {
    await page.goto(
      `/${SEED.PROGRAMS.OT.slug}/${SEED.STUDIES.GENESIS.slug}/${SEED.LESSONS.CREATION.slug}`
    );
    await expect(page.getByRole("heading", { name: /Creation|In the Beginning/ }).first()).toBeVisible({ timeout: 30000 });

    // Action text renders twice: volunteer view and printOnly copy.
    await expect(page.getByText("Welcome to Sunday School! We are so glad you are here.").first()).toBeVisible();
    await expect(page.getByText("Bible Story").first()).toBeVisible();
  });
});
