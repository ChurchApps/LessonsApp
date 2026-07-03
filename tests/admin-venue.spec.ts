import { adminTest as test, expect } from "./helpers/test-fixtures";
import { gotoAuthenticated } from "./helpers/navigation";

const NEW_SECTION_NAME = "Zacchaeus Test Section";
const RENAMED_SECTION_NAME = "Zacchaeus Renamed Section";
const NEW_ROLE_NAME = "Zacchaeus Test Role";
const NEW_ACTION_TEXT = "Say something testable for Zacchaeus.";
const VENUE_ID = "VEN00000001";

test.describe("Venue editor", () => {
  test("renders the seeded venue structure", async ({ page }) => {
    await gotoAuthenticated(page, `/admin/venue/${VENUE_ID}`);
    await expect(page.getByText("Lesson Structure")).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Welcome").first()).toBeVisible();
    await expect(page.getByText("Bible Story").first()).toBeVisible();
    await expect(page.getByText("Lead Teacher").first()).toBeVisible();
  });

  test.describe.serial("section / role / action CRUD lifecycle", () => {
    test.beforeEach(async ({ page }) => {
      await gotoAuthenticated(page, `/admin/venue/${VENUE_ID}`);
      await expect(page.getByText("Lesson Structure")).toBeVisible({ timeout: 30000 });
    });

    test("adds a section", async ({ page }) => {
      const titleHeading = page.getByRole("heading", { name: /Creation: Preschool/i }).first();
      const addBtn = titleHeading.locator("xpath=following::button[1]");
      await addBtn.click();

      await page.getByRole("menuitem", { name: /Create New Section/i }).click();

      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(NEW_SECTION_NAME);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      await expect(page.getByText(NEW_SECTION_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("adds a role to that section", async ({ page }) => {
      const sectionRow = page.locator("li").filter({ hasText: NEW_SECTION_NAME }).first();
      await sectionRow.locator('button[title="Add Role"]').click();

      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(NEW_ROLE_NAME);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      // New role auto-opens the action editor; cancel to see the role in the tree.
      const cancelBtn = page.getByRole("button", { name: /^Cancel$/ }).first();
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();
      }
      await expect(page.getByText(NEW_ROLE_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("adds an action to that role", async ({ page }) => {
      const roleRow = page.locator("li").filter({ hasText: NEW_ROLE_NAME }).first();
      await roleRow.locator('button[title="Add Action"]').click();

      const editor = page.locator("#markdown-editor-content");
      await editor.waitFor({ state: "visible", timeout: 15000 });
      await editor.click();
      await page.keyboard.type(NEW_ACTION_TEXT);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      // New action auto-opens another drawer; cancel to see it in the tree.
      const cancelBtn = page.getByRole("button", { name: /^Cancel$/ }).first();
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();
      }

      await expect(page.getByText(NEW_ACTION_TEXT.substring(0, 50), { exact: false }).first()).toBeVisible({ timeout: 15000 });
    });

    test("renames the section", async ({ page }) => {
      await page.getByText(NEW_SECTION_NAME).first().click();
      const nameInput = page.locator('input[name="name"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 10000 });
      await nameInput.fill(RENAMED_SECTION_NAME);
      await page.getByRole("button", { name: /^Save$/ }).first().click();

      await expect(page.getByText(RENAMED_SECTION_NAME).first()).toBeVisible({ timeout: 15000 });
    });

    test("deletes the action, role, and section", async ({ page }) => {
      page.on("dialog", (d) => d.accept());

      await page.getByText(NEW_ACTION_TEXT.substring(0, 30), { exact: false }).first().click();
      await page.locator('button[aria-label*="Delete"], svg[data-testid="DeleteIcon"]').first().click({ timeout: 10000 });
      await page.waitForTimeout(1500);

      await page.getByText(NEW_ROLE_NAME).first().click();
      await page.locator('button[aria-label*="Delete"], svg[data-testid="DeleteIcon"]').first().click({ timeout: 10000 });
      await page.waitForTimeout(1500);

      await page.getByText(RENAMED_SECTION_NAME).first().click();
      await page.locator('button[aria-label*="Delete"], svg[data-testid="DeleteIcon"]').first().click({ timeout: 10000 });

      await expect(page.getByText(RENAMED_SECTION_NAME)).toBeHidden({ timeout: 15000 });
    });
  });
});
