// Coverage for ChurchAppsSupport/docs/lessons-church/admin/third-party-providers.md.
// /portal/thirdParty manages external curriculum providers for a church.

import { portalTest as test, expect } from "./helpers/test-fixtures";

const NEW_PROVIDER_NAME = "Zacchaeus Test Provider";
const NEW_PROVIDER_URL = "https://example.com/api/zacchaeus";
const RENAMED_PROVIDER_NAME = "Zacchaeus Renamed Provider";

test.describe("External providers (portal)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/portal/thirdParty");
    await expect(page).toHaveURL(/\/portal\/thirdParty/, { timeout: 30000 });
  });

  test("renders the External Providers page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /External Providers|Third.Party/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test.describe.serial("provider CRUD lifecycle", () => {
    test("create: adds a new provider", async ({ page }) => {
      // Header has an Add button (icon or "Add Provider" / "Add First Provider").
      const addBtn = page.getByRole("button", { name: /Add (First )?Provider/i }).first()
        .or(page.locator('header button:has(svg[data-testid="AddIcon"])').first());
      await addBtn.click({ timeout: 10000 });

      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(NEW_PROVIDER_NAME);
      await page.locator('input[name="apiUrl"]').fill(NEW_PROVIDER_URL);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      await expect(page.getByText(NEW_PROVIDER_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("update: renames the provider", async ({ page }) => {
      const row = page.locator("tr").filter({ hasText: NEW_PROVIDER_NAME }).first();
      await row.locator('button:has(svg[data-testid="EditIcon"])').first().click();

      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(RENAMED_PROVIDER_NAME);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      await expect(page.getByText(RENAMED_PROVIDER_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("delete: removes the provider", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      const row = page.locator("tr").filter({ hasText: RENAMED_PROVIDER_NAME }).first();
      await row.locator('button:has(svg[data-testid="EditIcon"])').first().click();

      // Inside the edit drawer, the delete IconButton is colored "error".
      await page.locator('button:has(svg[data-testid="DeleteIcon"])').first().click();

      await expect(page.getByText(RENAMED_PROVIDER_NAME)).toBeHidden({ timeout: 15000 });
    });
  });
});
