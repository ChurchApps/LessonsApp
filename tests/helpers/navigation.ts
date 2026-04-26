import { Page, expect } from "@playwright/test";

// LessonsApp's admin/portal pages don't restore auth from cookies — they push to
// /login if ApiHelper.isAuthenticated is false on mount. The login page DOES
// auto-login from the jwt cookie (set during the global-setup flow) but only
// honors a returnUrl query param. So we go through /login?returnUrl=/<dest>
// to preserve the destination across the auto-login round-trip.
async function gotoViaLogin(page: Page, dest: string, expectedUrl: RegExp) {
  await page.goto(`/login?returnUrl=${encodeURIComponent(dest)}`);
  await expect(page).toHaveURL(expectedUrl, { timeout: 30000 });
}

export async function navigateToAdmin(page: Page) {
  await gotoViaLogin(page, "/admin", /\/admin(\/|$)/);
}

export async function navigateToPortal(page: Page) {
  await gotoViaLogin(page, "/portal", /\/portal(\/|$)/);
}

export async function navigateToBrowse(page: Page) {
  await page.goto("/");
}

