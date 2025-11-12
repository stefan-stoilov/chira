import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config();

const CI = !!process.env.CI;

const baseURL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "././src/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: CI,
  /* Retry on CI only */
  retries: CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `pnpm ${CI ? "start" : "dev"}`,
    url: baseURL,
    timeout: 1000 * 60 * 5,
    reuseExistingServer: !CI,
  },
});
