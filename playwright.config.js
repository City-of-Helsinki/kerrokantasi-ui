// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/tests',

  // Timeout for each test in milliseconds
  timeout: 60 * 1000,

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // The maximum number of retry attempts given to failed tests
  retries: process.env.CI ? 1 : 0,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['junit', { outputFile: 'report/e2e-junit-results.xml' }],
    ['html', { open: 'never', outputFolder: 'report/html' }],
  ],

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.E2E_TESTS_ENV_URL ?? 'http://localhost:8086',

    // Whether to ignore HTTPS errors when sending network requests
    ignoreHTTPSErrors: true,

    // Whether to automatically capture a screenshot after each test
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    // https://playwright.dev/docs/videos
    video: 'on-first-retry',
    contextOptions: { recordVideo: { dir: './report/videos/' } },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'yarn start',
    url: process.env.E2E_TESTS_ENV_URL ?? 'http://localhost:8086',
    reuseExistingServer: true
  }
});
