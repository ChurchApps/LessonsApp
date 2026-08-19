import { adminTest, portalTest, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";
import { gotoAuthenticated } from "./helpers/navigation";
import type { Page } from "@playwright/test";

const NEW_PLAN_NAME = "Zacchaeus Year Plan";
const NEW_PLAN_SLUG = "zacchaeus-year-plan";

async function openYearPlans(page: Page) {
  if (!/\/admin\/yearPlans/.test(page.url())) {
    const link = page.locator("#secondaryMenu").getByText("Year Plans", { exact: true });
    if (await link.isVisible().catch(() => false)) await link.click();
    else await gotoAuthenticated(page, "/admin/yearPlans");
  }
  await expect(page).toHaveURL(/\/admin\/yearPlans/, { timeout: 15000 });
  await expect(page.locator("#page-header-title")).toHaveText("Year Plans", { timeout: 15000 });
}

async function selectOption(page: Page, testId: string, option: string) {
  await page.getByTestId(testId).getByRole("combobox").click();
  const escaped = option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  await page.getByRole("option", { name: new RegExp(`^${escaped}`) }).click();
}

adminTest.describe("Year plans admin", () => {
  adminTest("lists the seeded published year plans", async ({ page }) => {
    await openYearPlans(page);
    await expect(page.getByText(SEED.YEAR_PLANS.ELEMENTARY.name)).toBeVisible();
    await expect(page.getByText(SEED.YEAR_PLANS.PRESCHOOL.name)).toBeVisible();
    await expect(page.getByText("Published")).toHaveCount(2);
  });

  adminTest("opens a seeded plan with hydrated lesson weeks", async ({ page }) => {
    await openYearPlans(page);
    await page.getByRole("button", { name: SEED.YEAR_PLANS.ELEMENTARY.name }).click();
    await expect(page.getByRole("heading", { name: "Edit Plan" })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('input[name="name"]')).toHaveValue(SEED.YEAR_PLANS.ELEMENTARY.name);
    await expect(page.getByTestId("year-plan-publish")).toBeChecked();

    const weeks = page.getByTestId("year-plan-weeks");
    await expect(weeks.getByText("Genesis Stories — Creation")).toBeVisible();
    await expect(weeks.getByText("Genesis Stories — Noah's Ark")).toBeVisible();
    await expect(weeks.getByText("Exodus Adventures — Moses and Pharaoh")).toBeVisible();
    await expect(weeks.getByText("Exodus Adventures — Ten Commandments")).toBeVisible();
    await expect(weeks.getByText("Elementary").first()).toBeVisible();

    await page.getByTestId("year-plan-cancel").click();
    await expect(page.getByRole("heading", { name: "Edit Plan" })).toHaveCount(0);
  });

  adminTest("opens the New Plan editor from Add", async ({ page }) => {
    await openYearPlans(page);
    await page.getByTestId("year-plan-add").click();
    await expect(page.getByRole("heading", { name: "New Plan" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue("");
    await expect(page.getByTestId("year-plan-save")).toBeDisabled();
    await page.getByTestId("year-plan-cancel").click();
    await expect(page.getByRole("heading", { name: "New Plan" })).toHaveCount(0);
  });

  adminTest.describe.serial("year plan CRUD lifecycle", () => {
    adminTest("create: saves weeks from two programs", async ({ page }) => {
      await openYearPlans(page);
      const treeLoaded = page.waitForResponse(
        (r) => r.url().includes("/lessons/public/tree") && r.status() === 200,
        { timeout: 30000 }
      );
      await page.getByTestId("year-plan-add").click();
      await expect(page.getByRole("heading", { name: "New Plan" })).toBeVisible();
      await treeLoaded;

      await page.locator('input[name="name"]').fill(NEW_PLAN_NAME);
      await page.locator('input[name="slug"]').fill(NEW_PLAN_SLUG);
      await page.locator('input[name="venuePreference"]').fill("Elementary");
      await expect(page.getByTestId("year-plan-program")).toContainText(SEED.PROGRAMS.OT.name, { timeout: 15000 });

      await selectOption(page, "year-plan-study", SEED.STUDIES.GENESIS.name);
      await selectOption(page, "year-plan-lesson", SEED.LESSONS.CREATION.name);
      await expect(page.getByTestId("year-plan-venue")).toContainText("Elementary", { timeout: 10000 });
      await expect(page.getByTestId("year-plan-add-week")).toBeEnabled();
      await page.getByTestId("year-plan-add-week").click();
      await expect(page.getByTestId("year-plan-weeks").getByText(/Creation/)).toBeVisible();

      await selectOption(page, "year-plan-program", SEED.PROGRAMS.NT.name);
      await selectOption(page, "year-plan-study", SEED.STUDIES.BIRTH.name);
      await selectOption(page, "year-plan-lesson", "Mary's Visit");
      await expect(page.getByTestId("year-plan-add-week")).toBeEnabled();
      await page.getByTestId("year-plan-add-week").click();
      await expect(page.getByTestId("year-plan-weeks").getByText(/Mary's Visit/)).toBeVisible();

      await page.getByTestId("year-plan-week-down-0").click();
      const rows = page.getByTestId("year-plan-weeks").locator("tbody tr");
      await expect(rows.nth(0)).toContainText(/Mary's Visit/);
      await expect(rows.nth(1)).toContainText(/Creation/);

      await page.getByTestId("year-plan-save").click();
      await expect(page.getByRole("heading", { name: "New Plan" })).toHaveCount(0, { timeout: 15000 });
      await expect(page.getByRole("button", { name: NEW_PLAN_NAME })).toBeVisible();
    });

    adminTest("update: unpublishes the plan", async ({ page }) => {
      await openYearPlans(page);
      await page.getByRole("button", { name: NEW_PLAN_NAME }).click();
      await expect(page.getByRole("heading", { name: "Edit Plan" })).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId("year-plan-weeks").getByText(/Mary's Visit/)).toBeVisible();
      await expect(page.getByTestId("year-plan-weeks").getByText(/Creation/)).toBeVisible();

      await page.getByTestId("year-plan-publish").uncheck();
      await page.getByTestId("year-plan-save").click();
      await expect(page.getByRole("heading", { name: "Edit Plan" })).toHaveCount(0, { timeout: 15000 });

      const row = page.locator("tr").filter({ hasText: NEW_PLAN_NAME });
      await expect(row.getByText("Draft")).toBeVisible();
    });

    adminTest("delete: removes the plan", async ({ page }) => {
      page.on("dialog", (d) => d.accept());
      await openYearPlans(page);
      const row = page.locator("tr").filter({ hasText: NEW_PLAN_NAME });
      await row.locator('button[title="Delete"]').click();
      await expect(page.getByRole("button", { name: NEW_PLAN_NAME })).toHaveCount(0, { timeout: 15000 });
    });
  });
});

portalTest.describe("Year plans church access", () => {
  portalTest("does not offer year plans in the church portal", async ({ page }) => {
    await expect(page.locator("#secondaryMenu").getByText("Year Plans")).toHaveCount(0);
    await page.goto("/admin/yearPlans");
    await expect(page).not.toHaveURL(/\/admin\/yearPlans/, { timeout: 15000 });
  });
});
