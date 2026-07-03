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

      // Wait for cascade to settle; saving before tree response crashes getDisplayName.
      const treeLoaded = page.waitForResponse(
        (r) => r.url().includes("/lessons/public/tree") && r.status() === 200,
        { timeout: 30000 }
      );
      await page.getByRole("button", { name: /Add Schedule/i }).click();
      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeVisible();
      await treeLoaded;
      await expect(page.locator("#mui-component-select-lesson")).toContainText(":", { timeout: 15000 });

      await page.getByRole("button", { name: /^Save$/ }).first().click();
      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeHidden({ timeout: 15000 });
    });

    test("edit: reschedules an existing lesson to a new date", async ({ page }) => {
      // Use date to locate row; displayName rewrites on save, becoming unstable.
      await page.getByRole("button", { name: SEED.CLASSROOMS.ELEMENTARY.name }).click();

      const treeLoaded = page.waitForResponse(
        (r) => r.url().includes("/lessons/public/tree") && r.status() === 200,
        { timeout: 30000 }
      );
      const row = page.locator("tr").filter({ hasText: "2026-06-07" }).first();
      await row.locator('button[title="Edit schedule"]').click();
      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeVisible();
      await treeLoaded;
      await expect(page.locator("#mui-component-select-lesson")).toContainText(":", { timeout: 15000 });

      const newDate = "2026-12-25";
      await page.locator('input[name="scheduledDate"]').fill(newDate);
      await page.getByRole("button", { name: /^Save$/ }).first().click();
      await expect(page.getByRole("heading", { name: "Edit Schedule" })).toBeHidden({ timeout: 15000 });

      await expect(page.locator("tr").filter({ hasText: newDate })).toBeVisible({ timeout: 15000 });
    });

    test("delete: removes the seeded Noah's Ark schedule from Elementary Room", async ({ page }) => {
      // Use Noah's Ark (not Mary's Visit) to avoid conflict with another test.
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
