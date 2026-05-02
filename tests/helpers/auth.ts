import { Page } from "@playwright/test";

export type Identity = {
  email: string;
  password: string;
};

export const LESSONS_ADMIN: Identity = {
  email: "lessons-admin@demo.churchapps.org",
  password: "password",
};

export const GRACE_ADMIN: Identity = {
  email: "demo@b1.church",
  password: "password",
};

/**
 * Log in via the LessonsApp /login form. If the page already shows authenticated
 * UI (e.g., the user landed on a protected route), this is a no-op.
 */
export async function login(page: Page, identity: Identity = LESSONS_ADMIN) {
  await page.goto("/login");

  // If we're not on /login (already authenticated), bail.
  const onLogin = await page.locator('input[type="email"]').waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);
  if (!onLogin) return;

  await page.fill('input[type="email"]', identity.email);
  await page.fill('input[type="password"]', identity.password);
  await page.click('button[type="submit"]');

  const churchDialog = page.locator('[role="dialog"]').filter({ hasText: /Select a Church/i });
  await Promise.race([
    churchDialog.waitFor({ state: "visible", timeout: 15000 }).catch(() => { }),
    page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 }).catch(() => { }),
  ]);

  if (await churchDialog.isVisible().catch(() => false)) {
    const firstChurch = page.locator('[role="dialog"] h3, [role="dialog"] [role="button"], [role="dialog"] button').first();
    await firstChurch.click({ timeout: 10000 });
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });
  }
}
