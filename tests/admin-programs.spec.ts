import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const NEW_PROGRAM_NAME = "Zacchaeus Test Program";
const NEW_PROGRAM_SLUG = "zacchaeus-test-program";
const RENAMED_PROGRAM_NAME = "Zacchaeus Renamed Program";

test.describe("Programs admin", () => {
  test("renders the seeded programs list", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Programs", exact: true })).toBeVisible();
    await expect(page.getByText(SEED.PROGRAMS.OT.name).first()).toBeVisible();
    await expect(page.getByText(SEED.PROGRAMS.NT.name).first()).toBeVisible();
  });

  test("opens the Add Program drawer from the header", async ({ page }) => {
    await page.getByRole("button", { name: "Add Program" }).first().click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue("");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Add Program" })).toBeHidden();
  });

  test.describe.serial("program CRUD lifecycle", () => {
    test("create: adds a new program", async ({ page }) => {
      await page.getByRole("button", { name: "Add Program" }).first().click();
      await expect(page.getByRole("heading", { name: "Add Program" })).toBeVisible();

      await page.locator('input[name="name"]').fill(NEW_PROGRAM_NAME);
      await page.locator('input[name="slug"]').fill(NEW_PROGRAM_SLUG);
      await page.locator('input[name="shortDescription"]').fill("Test program for Playwright");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.locator(`h6:has-text("${NEW_PROGRAM_NAME}")`).first()).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the program via the Edit drawer", async ({ page }) => {
      await page.getByTestId("admin-nav").getByText(NEW_PROGRAM_NAME).click();

      await expect(page.getByRole("heading", { name: "Edit Program" })).toBeVisible();
      await page.locator('input[name="name"]').fill(RENAMED_PROGRAM_NAME);
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.locator(`h6:has-text("${RENAMED_PROGRAM_NAME}")`).first()).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(NEW_PROGRAM_NAME)).toHaveCount(0);
    });

    test("delete: removes the program", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      await page.getByTestId("admin-nav").getByText(RENAMED_PROGRAM_NAME).click();
      await expect(page.getByRole("heading", { name: "Edit Program" })).toBeVisible();

      await page.locator('button[title="Delete program"]').click();
      await expect(page.getByText(RENAMED_PROGRAM_NAME)).toHaveCount(0, { timeout: 15000 });
    });
  });
});
