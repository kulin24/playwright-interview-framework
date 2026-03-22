import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const env = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `environments/.env.${env}`) });

export default defineConfig({
  testDir: './tests',
  // How long to wait for a test to complete (30 seconds)
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['line'],
    ['list']
  ],
  
  // Global settings
  use: {
    baseURL: process.env.UI_BASE_URL || 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  // Multi-project setup
  projects: [
    {
      name: 'ui-chrome',
      testMatch: '**/*.spec.ts',
      // grep: /@ui/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { 
        baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      retries: 1,
    },
  ],
  
  // Output directory for artifacts
  outputDir: './test-results',
});