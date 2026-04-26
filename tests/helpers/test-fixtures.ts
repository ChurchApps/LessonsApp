import { test as base, expect } from "@playwright/test";
import { STORAGE_STATE_LESSONS_ADMIN, STORAGE_STATE_GRACE } from "../../playwright.config";
import { navigateToAdmin, navigateToPortal } from "./navigation";

// Hide Next.js's dev overlay/portal so it doesn't intercept pointer events.
// Applied via addInitScript so it runs on every page navigation.
const HIDE_NEXTJS_OVERLAY = `
  (() => {
    const apply = () => {
      if (!document.documentElement) return;
      if (document.getElementById('hide-nextjs-portal-style')) return;
      const style = document.createElement('style');
      style.id = 'hide-nextjs-portal-style';
      style.textContent = 'nextjs-portal { display: none !important; }';
      document.documentElement.appendChild(style);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
      apply();
    }
  })();
`;

const withInitScript = (setup: (p: any) => Promise<void> | void) => async ({ page }: any, use: any) => {
  await page.addInitScript(HIDE_NEXTJS_OVERLAY);
  await setup(page);
  await use(page);
};

// adminTest: logged in as the curriculum publisher (CHU00000099 / lessons-admin),
// already on /admin. Use for /admin/* spec coverage.
export const adminTest = base.extend({
  storageState: STORAGE_STATE_LESSONS_ADMIN,
  page: withInitScript(navigateToAdmin),
});

// portalTest: logged in as the church admin (CHU00000001 / demo@b1.church),
// already on /portal. Use for /portal/* spec coverage.
export const portalTest = base.extend({
  storageState: STORAGE_STATE_GRACE,
  page: withInitScript(navigateToPortal),
});

// browseTest: anonymous visitor (no storage state). Use for public browse routes.
export const browseTest = base.extend({
  storageState: { cookies: [], origins: [] },
  page: async ({ page }, use) => {
    await page.addInitScript(HIDE_NEXTJS_OVERLAY);
    await use(page);
  },
});

export { expect };
