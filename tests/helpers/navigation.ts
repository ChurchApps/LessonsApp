import { Page, expect } from "@playwright/test";

// Use /login?returnUrl to auto-login from jwt cookie and preserve the destination.
export async function gotoAuthenticated(page: Page, dest: string) {
  await page.goto(`/login?returnUrl=${encodeURIComponent(dest)}`);
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 30000 });
}

export async function navigateToAdmin(page: Page) {
  await page.goto(`/login?returnUrl=${encodeURIComponent("/admin")}`);
  await expect(page).toHaveURL(/\/admin(\/|$)/, { timeout: 30000 });
}

export async function navigateToPortal(page: Page) {
  await page.goto(`/login?returnUrl=${encodeURIComponent("/portal")}`);
  await expect(page).toHaveURL(/\/portal(\/|$)/, { timeout: 30000 });
}

export async function navigateToBrowse(page: Page) {
  await page.goto("/");
}

