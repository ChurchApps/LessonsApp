import { adminTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

test.describe("Admin workspace layout", () => {
  test("renders the three workspace panes", async ({ page }) => {
    await expect(page.getByTestId("admin-nav")).toBeVisible();
    await expect(page.getByTestId("admin-main")).toBeVisible();
    await expect(page.getByTestId("admin-panel")).toBeVisible();
  });

  test("auto-selects a program so the main pane shows studies on first load", async ({ page }) => {
    const mainPane = page.getByTestId("admin-main");
    await expect(mainPane.getByRole("button", { name: "Add Study" })).toBeVisible();
  });

  test("clicking a program in the nav switches the main pane", async ({ page }) => {
    const nav = page.getByTestId("admin-nav");
    const main = page.getByTestId("admin-main");

    await nav.getByText(SEED.PROGRAMS.NT.name).click();
    await expect(main.getByRole("heading", { name: SEED.PROGRAMS.NT.name, level: 6 })).toBeVisible();
    await expect(main.getByText(SEED.STUDIES.BIRTH.name)).toBeVisible();

    await nav.getByText(SEED.PROGRAMS.OT.name).click();
    await expect(main.getByRole("heading", { name: SEED.PROGRAMS.OT.name, level: 6 })).toBeVisible();
    await expect(main.getByText(SEED.STUDIES.GENESIS.name)).toBeVisible();
  });

  test("empty panel hint shows when nothing is opened", async ({ page }) => {
    const panel = page.getByTestId("admin-panel");
    await expect(panel.getByText(/Select an item/i)).toBeVisible();
  });

  test("clicking a program row opens the panel with Details + Files tabs", async ({ page }) => {
    const nav = page.getByTestId("admin-nav");
    const panel = page.getByTestId("admin-panel");

    await nav.getByText(SEED.PROGRAMS.OT.name).click();

    await expect(panel.getByText("Program", { exact: true })).toBeVisible();
    await expect(panel.getByRole("button", { name: /Details/ })).toBeVisible();
    await expect(panel.getByRole("button", { name: /Files/ })).toBeVisible();
    await expect(panel.getByRole("heading", { name: "Edit Program" })).toBeVisible();
  });

  test("panel close button dismisses the detail pane", async ({ page }) => {
    const nav = page.getByTestId("admin-nav");
    const panel = page.getByTestId("admin-panel");

    await nav.getByText(SEED.PROGRAMS.OT.name).click();
    await expect(panel.getByRole("heading", { name: "Edit Program" })).toBeVisible();

    await panel.locator('button[title="Close panel"]').click();
    await expect(panel.getByText(/Select an item/i)).toBeVisible();
  });

  test("clicking a study row opens its Edit form in the panel", async ({ page }) => {
    const main = page.getByTestId("admin-main");
    const panel = page.getByTestId("admin-panel");

    await main.getByRole("heading", { name: SEED.STUDIES.GENESIS.name, level: 6 }).click();

    await expect(panel.getByRole("heading", { name: "Edit Study" })).toBeVisible();
    await expect(panel.locator('input[name="name"]')).toHaveValue(SEED.STUDIES.GENESIS.name);
  });

  test("expanding a study reveals lesson rows", async ({ page }) => {
    const main = page.getByTestId("admin-main");

    await main.getByText(SEED.STUDIES.GENESIS.name).click();

    await expect(main.getByText(`${SEED.LESSONS.CREATION.name}: In the Beginning`)).toBeVisible();
    await expect(main.getByText(`${SEED.LESSONS.NOAH.name}: God Saves Noah`)).toBeVisible();
  });

  test("clicking a lesson row opens its Edit form in the panel", async ({ page }) => {
    const main = page.getByTestId("admin-main");
    const panel = page.getByTestId("admin-panel");

    await main.getByText(SEED.STUDIES.GENESIS.name).click();
    await main.getByText(/Creation: /).first().click();

    await expect(panel.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
    await expect(panel.locator('input[name="name"]')).toHaveValue(SEED.LESSONS.CREATION.name);
  });

  test("expanded study shows an inline 'Add lesson to this study' button", async ({ page }) => {
    const main = page.getByTestId("admin-main");
    const panel = page.getByTestId("admin-panel");

    await main.getByText(SEED.STUDIES.GENESIS.name).click();
    await main.getByRole("button", { name: /Add lesson to this study/i }).click();

    await expect(panel.getByRole("heading", { name: "Add Lesson" })).toBeVisible();
    await expect(panel.locator('input[name="name"]')).toHaveValue("");
  });

  test("switching tabs swaps the panel body without closing it", async ({ page }) => {
    const nav = page.getByTestId("admin-nav");
    const panel = page.getByTestId("admin-panel");

    await nav.getByText(SEED.PROGRAMS.OT.name).click();
    await expect(panel.getByRole("heading", { name: "Edit Program" })).toBeVisible();

    await panel.getByRole("button", { name: /Files/ }).click();
    await expect(panel.getByRole("heading", { name: "Edit Program" })).toBeHidden();

    await panel.getByRole("button", { name: /Details/ }).click();
    await expect(panel.getByRole("heading", { name: "Edit Program" })).toBeVisible();
  });

  test("Add Study from main header opens the New study form in the panel", async ({ page }) => {
    const main = page.getByTestId("admin-main");
    const panel = page.getByTestId("admin-panel");

    await main.getByRole("button", { name: "Add Study" }).click();
    await expect(panel.getByRole("heading", { name: "Add Study" })).toBeVisible();
    await expect(panel.getByText("Study", { exact: true })).toBeVisible();
    const filesTab = panel.getByRole("button", { name: /Files/ });
    await expect(filesTab).toBeDisabled();
  });
});
