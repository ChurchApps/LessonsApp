// Coverage for ChurchAppsSupport/docs/lessons-church/presenting/presenter-mode.md.
// /classroom/:id is the volunteer-facing presenter route. It pulls a classroom's
// upcoming schedule and renders the lesson cards anonymously.

import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

// The presenter page filters schedules by `upcoming=1` query param: with the
// flag, only future schedules are shown; without it, only past schedules.
// Seed dates are intentionally in mid-2026 (so they remain "upcoming"
// for a long time), so all tests use ?upcoming=1.

test.describe("Classroom presenter mode", () => {
  test("renders the seeded Preschool Room presenter view", async ({ page }) => {
    await page.goto(`/classroom/${SEED.CLASSROOMS.PRESCHOOL.id}?upcoming=1`);

    await expect(
      page.getByRole("heading", { name: new RegExp(SEED.CLASSROOMS.PRESCHOOL.name, "i") }).first()
    ).toBeVisible({ timeout: 30000 });

    // The upcoming scheduled lesson is Mary's Visit (per the seed data).
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
