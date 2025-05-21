import { defineConfig, devices } from '@playwright/test';

// Detect if we are running in CI environment
const isCI = !!process.env.CI;

// Global Playwright configuration
export default defineConfig({
  // Maximum time one test can run
  timeout: 30000,

  // Directory where test artifacts like screenshots, videos, and traces are saved
  outputDir: 'test-results',

  // Default timeout for expect() assertions
  expect: {
    timeout: 5000,
  },

  // Shared context settings applied to all projects unless overridden
  use: {
    baseURL: 'https://www.netlify.com',

    // Headless mode: true in CI, false locally for debugging
    headless: isCI,

    viewport: { width: 1440, height: 900 },
    actionTimeout: 5000,
    navigationTimeout: 10000,
    ignoreHTTPSErrors: true,

    // Automatically capture artifacts on test failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Projects for cross-browser testing
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // HTML report configuration
  reporter: [['html', { outputFolder: 'html-report', open: 'never' }]],
});