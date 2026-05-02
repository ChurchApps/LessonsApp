import { Page, expect } from "@playwright/test";

// LessonsApp's admin/portal pages don't restore auth from cookies — they push to
// /login if ApiHelper.isAuthenticated is false on mount. The login page DOES
// auto-login from the jwt cookie (set during the global-setup flow) but only
// honors a returnUrl query param. So we go through /login?returnUrl=/<dest>
// to preserve the destination across the auto-login round-trip.
export async function gotoAuthenticated(page: Page, dest: string) {
  await page.goto(`/login?returnUrl=${encodeURIComponent(dest)}`);
  // Wait until we land somewhere that isn't /login.
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

