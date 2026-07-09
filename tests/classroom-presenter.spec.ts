import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

// Seed dates intentionally in late-2026 to remain "upcoming" long-term (bump demo.sql + these specs together).
// Tests use ?upcoming=1 to filter to future schedules only.

test.describe("Classroom presenter mode", () => {
  test("renders the seeded Preschool Room presenter view", async ({ page }) => {
    await page.goto(`/classroom/${SEED.CLASSROOMS.PRESCHOOL.id}?upcoming=1`);

    await expect(
      page.getByRole("heading", { name: new RegExp(SEED.CLASSROOMS.PRESCHOOL.name, "i") }).first()
    ).toBeVisible({ timeout: 30000 });

    await expect(page.getByText(/Mary'?s Visit/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("renders the seeded Elementary Room presenter view", async ({ page }) => {
    await page.goto(`/classroom/${SEED.CLASSROOMS.ELEMENTARY.id}?upcoming=1`);
    await expect(
      page.getByRole("heading", { name: new RegExp(SEED.CLASSROOMS.ELEMENTARY.name, "i") }).first()
    ).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(/Creation|Noah'?s Ark/).first()).toBeVisible({ timeout: 15000 });
  });
});
