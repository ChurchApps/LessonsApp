import { test as base, expect } from "@playwright/test";
import { STORAGE_STATE_LESSONS_ADMIN, STORAGE_STATE_GRACE } from "./storage-paths";
import { navigateToAdmin, navigateToPortal } from "./navigation";

// Hide Next.js dev overlay/portal to prevent pointer event interception.
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

export const adminTest = base.extend({
  storageState: STORAGE_STATE_LESSONS_ADMIN,
  page: withInitScript(navigateToAdmin)
});

export const portalTest = base.extend({
  storageState: STORAGE_STATE_GRACE,
  page: withInitScript(navigateToPortal)
});

export const browseTest = base.extend({
  storageState: { cookies: [], origins: [] },
  page: async ({ page }, use) => {
    await page.addInitScript(HIDE_NEXTJS_OVERLAY);
    await use(page);
  }
});

export { expect };
