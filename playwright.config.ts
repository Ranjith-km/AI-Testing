/**
 * playwright.config.ts
 * Playwright test configuration for Joyalukkas Foundation automation suite
 */

import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './src/constants/config';

const config = loadConfig();
const isCI = process.env.CI === 'true';

export default defineConfig({
  // Test directory
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  
  // Global timeout
  timeout: config.timeout,
  
  // Expect timeout
  expect: {
    timeout: 5000
  },

  // Fullyparallel execution
  fullyParallel: true,
  
  // Fail on console errors
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
    ignoreHTTPSErrors: true
  },

  // Reporters
  reporter: [
    ['html', { outputFolder: 'html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],

  // Web Server (optional for local development)
  webServer: process.env.WEB_SERVER_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: config.baseUrl,
        reuseExistingServer: !isCI,
        timeout: 120000
      },

  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  // Global setup/teardown
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  // Workers configuration
  workers: isCI ? 1 : config.maxParallelWorkers || 4,

  // Output folder
  outputFolder: 'test-results'
});
