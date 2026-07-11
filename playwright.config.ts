import { defineConfig, devices } from "@playwright/test";
import { STORAGE_STATE_LESSONS_ADMIN } from "./tests/helpers/storage-paths";

const baseURL = process.env.BASE_URL || "http://localhost:3501";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  // Limit workers to 2 to avoid dev-server overwhelm and race conditions.
  workers: 2,
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
    navigationTimeout: 30 * 1000
  },

  webServer: [
    {
      command: "npm --prefix ../Api run dev",
      url: "http://localhost:8084/health",
      reuseExistingServer: true,
      timeout: 90 * 1000,
      stdout: "pipe",
      stderr: "pipe"
    },
    {
      command: "npm --prefix ../LessonsApi run dev",
      url: "http://localhost:8090/health",
      reuseExistingServer: true,
      timeout: 90 * 1000,
      stdout: "pipe",
      stderr: "pipe"
    },
    {
      command: "npm run dev",
      url: "http://localhost:3501/login",
      reuseExistingServer: true,
      timeout: 180 * 1000
    }
  ],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: true },
      fullyParallel: false
    }
  ]
});
