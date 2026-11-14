import { defineConfig, devices } from "@playwright/test";

// Smoke: read-only checks against the local stack (LessonsApp has no demo site).
//   SMOKE_BASE_URL=http://localhost:3501 yarn test:smoke
const baseURL = process.env.SMOKE_BASE_URL;
if (!baseURL) throw new Error("SMOKE_BASE_URL is required (e.g. http://localhost:3501)");
// Smoke never runs against production: only demo and local hosts are allowed.
if (!/(^|\.)demo|^localhost$|\.localtest\.me$|^127\.0\.0\.1$/.test(new URL(baseURL).hostname)) {
  throw new Error(`SMOKE_BASE_URL ${baseURL} is not a demo or local host; smoke tests do not run against production`);
}

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: /\.smoke\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 4,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  timeout: 60 * 1000,
  expect: { timeout: 15 * 1000 },
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure", navigationTimeout: 30 * 1000 },
  projects: [{ name: "public", use: { ...devices["Desktop Chrome"], headless: true } }]
});
