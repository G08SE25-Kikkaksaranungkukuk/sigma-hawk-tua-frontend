import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/setup/global-setup'),
  globalTeardown: require.resolve('./tests/setup/global-teardown'),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Increase timeout for slower operations */
  timeout: 120000, // 120 seconds per test (increased from 60)
  /* Global expect timeout */
  expect: {
    timeout: 20000, // 20 seconds for expect assertions
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    /* Record video for better debugging */
    video: 'retain-on-failure',
    /* Increase action timeout */
    actionTimeout: 30000, // 30 seconds for actions like click, fill (increased from 10)
    /* Increase navigation timeout */
    navigationTimeout: 60000, // 60 seconds for page navigation (increased from 30)
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: 'tests/user.test/userProfile.test.ts',
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.CI ? true : false,
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          slowMo: process.env.CI ? 0 : 1000,
        },
       },
    },
    {
      name: 'chromium',
      dependencies: ['setup'], // This ensures setup runs first
      testIgnore: 'tests/user.test/userProfile.test.ts', // Exclude from this project since it runs in setup
      use: { 
        ...devices['Desktop Chrome'],
        headless: process.env.CI ? true : false, // Headless in CI, headed locally
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          slowMo: process.env.CI ? 0 : 1000, // No slowMo in CI
        },
       },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
