import { adminTest as test, expect } from "./helpers/test-fixtures";
import { gotoAuthenticated } from "./helpers/navigation";

// https://github.com/ChurchApps/ChurchAppsSupport/issues/1204
const VENUE_ID = "VEN00000001";
const SAY_A = "Welcome to Sunday School! We are so glad you are here.";
const SAY_B = "In the beginning, God created the heavens and the earth.";

test.describe("Issue 1204: Say action editor shows its text", () => {
  test.beforeEach(async ({ page }) => {
    await gotoAuthenticated(page, `/admin/venue/${VENUE_ID}`);
    await expect(page.getByText("Lesson Structure")).toBeVisible({ timeout: 30000 });
  });

  test("second Say action opened after closing the first shows its text", async ({ page }) => {
    const editor = page.locator("#markdown-editor-content");

    await page.getByText(SAY_A).first().click();
    await expect(editor).toContainText(SAY_A, { timeout: 15000 });
    await page.getByRole("button", { name: /^Cancel$/ }).first().click();
    await expect(editor).toBeHidden();

    await page.getByText(SAY_B).first().click();
    await expect(editor).toContainText(SAY_B, { timeout: 15000 });
  });

  test("switching directly between Say actions shows the new action's text", async ({ page }) => {
    const editor = page.locator("#markdown-editor-content");

    await page.getByText(SAY_A).first().click();
    await expect(editor).toContainText(SAY_A, { timeout: 15000 });

    await page.getByText(SAY_B).first().click();
    await expect(editor).toContainText(SAY_B, { timeout: 15000 });
  });
});
