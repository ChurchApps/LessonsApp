import { defineConfig, devices } from "@playwright/test";
import path from "path";

const ROOT = process.cwd();
export const STORAGE_STATE_LESSONS_ADMIN = path.join(ROOT, "tests", ".auth-lessons-admin.json");
export const STORAGE_STATE_GRACE = path.join(ROOT, "tests", ".auth-grace.json");

const baseURL = process.env.BASE_URL || "http://localhost:3501";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // One retry covers the occasional Next.js dev-server compilation hiccup
  // when many parallel workers warm up routes simultaneously.
  retries: 1,
  // 18+ concurrent Next.js dev compilations overwhelm the dev server. Cap workers
  // at 4 so /login compiles once, becomes hot-cached, and individual tests can
  // complete their auto-login round-trip within the 30s navigation budget.
  workers: process.env.CI ? 2 : 4,
  reporter: "list",
  timeout: 90 * 1000,
  expect: { timeout: 10 * 1000 },

  globalSetup: "./tests/global-setup.ts",

  use: {
    baseURL,
    storageState: STORAGE_STATE_LESSONS_ADMIN,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // Bring up the full stack: main Api (auth), LessonsApi (data), LessonsApp (UI).
  // All marked reuseExistingServer so a developer running the API/UI manually doesn't conflict.
  webServer: [
    {
      command: "npm --prefix ../Api run dev",
      url: "http://localhost:8084/health",
      reuseExistingServer: true,
      timeout: 90 * 1000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "npm --prefix ../LessonsApi run dev",
      url: "http://localhost:8090/health",
      reuseExistingServer: true,
      timeout: 90 * 1000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "npm run dev",
      // Hit /login because the app's `/` currently returns 500 from a pre-existing
      // SSR bug; /login is a stable health probe for the dev server itself.
      url: "http://localhost:3501/login",
      reuseExistingServer: true,
      timeout: 180 * 1000,
    },
  ],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: true },
      // fullyParallel: false keeps tests within a file serial; multiple files
      // run in parallel via the workers setting above.
      fullyParallel: false,
    },
  ],
});
