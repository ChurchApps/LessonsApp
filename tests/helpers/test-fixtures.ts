import { test as base, expect } from "@playwright/test";
import { STORAGE_STATE_LESSONS_ADMIN, STORAGE_STATE_GRACE } from "../../playwright.config";
import { navigateToAdmin, navigateToPortal } from "./navigation";

// adminTest: logged in as the curriculum publisher (CHU00000099 / lessons-admin),
// already on /admin. Use for /admin/* spec coverage.
export const adminTest = base.extend({
  storageState: STORAGE_STATE_LESSONS_ADMIN,
  page: async ({ page }, use) => {
    await navigateToAdmin(page);
    await use(page);
  },
});

// portalTest: logged in as the church admin (CHU00000001 / demo@b1.church),
// already on /portal. Use for /portal/* spec coverage.
export const portalTest = base.extend({
  storageState: STORAGE_STATE_GRACE,
  page: async ({ page }, use) => {
    await navigateToPortal(page);
    await use(page);
  },
});

// browseTest: anonymous visitor (no storage state). Use for public browse routes.
export const browseTest = base.extend({
  storageState: { cookies: [], origins: [] },
});

export { expect };
