import { chromium, type FullConfig } from "@playwright/test";
import { verifyEnv } from "./setup/verify-env.mjs";
import { STORAGE_STATE_LESSONS_ADMIN, STORAGE_STATE_GRACE } from "../playwright.config";

type Identity = {
  email: string;
  password: string;
  churchName: string;
  storagePath: string;
  label: string;
};

const IDENTITIES: Identity[] = [
  {
    email: "lessons-admin@demo.churchapps.org",
    password: "password",
    churchName: "Lessons.church Free Curriculum",
    storagePath: STORAGE_STATE_LESSONS_ADMIN,
    label: "lessons-admin (CHU00000099)",
  },
  {
    email: "demo@b1.church",
    password: "password",
    churchName: "Grace Community Church",
    storagePath: STORAGE_STATE_GRACE,
    label: "demo@b1.church (Grace)",
  },
];

async function loginAndSave(baseURL: string, identity: Identity) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log(`global-setup: logging in as ${identity.label}...`);

  try {
    await page.goto(baseURL + "/login");

    const emailInput = page.locator('input[type="email"]');
    await emailInput.waitFor({ state: "visible", timeout: 30000 });
    await emailInput.fill(identity.email);
    await page.fill('input[type="password"]', identity.password);
    await page.click('button[type="submit"]');

    // After submit, we expect either:
    //  - a church-selection dialog (for users with >1 church)
    //  - a redirect away from /login
    const churchDialog = page.locator('[role="dialog"]').filter({ hasText: /Select a Church/i });
    await Promise.race([
      churchDialog.waitFor({ state: "visible", timeout: 20000 }).catch(() => { }),
      page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 }).catch(() => { }),
    ]);

    if (await churchDialog.isVisible().catch(() => false)) {
      // The SelectableChurch component renders the church name inside an
      // <h3> within a clickable Paper. Click the h3 — events bubble to the Paper.
      const churchHeading = page.locator(`[role="dialog"] h3:has-text("${identity.churchName}")`).first();
      await churchHeading.waitFor({ state: "visible", timeout: 10000 });
      await churchHeading.click({ timeout: 10000 });
      await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 30000 });
    }

    // Make sure we ended up authenticated
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 30000 }).catch(() => { });

    await context.storageState({ path: identity.storagePath });
    console.log(`global-setup: ${identity.label} OK -> ${identity.storagePath}`);
  } finally {
    await browser.close();
  }
}

async function warmRoutes(baseURL: string) {
  // Pre-compile the routes tests will hit so the first parallel test worker
  // doesn't pay the Turbopack first-compile tax. Auth state is irrelevant —
  // we only need to trigger compilation.
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    for (const url of ["/login", "/admin", "/portal", "/old-testament-heroes"]) {
      await p.goto(baseURL + url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => { });
    }
    console.log("global-setup: warm-up done.");
  } finally {
    await browser.close();
  }
}

async function globalSetup(config: FullConfig) {
  await verifyEnv({ fullCheck: true });

  const baseURL = config.projects[0]?.use?.baseURL || "http://localhost:3501";

  await warmRoutes(baseURL);

  // Run sequentially so the dev server doesn't have to compile every route at once.
  for (const id of IDENTITIES) {
    await loginAndSave(baseURL, id);
  }
}

export default globalSetup;
