import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir        : './tests',
  testMatch      : '**/*.spec.js',
  fullyParallel  : true,
  forbidOnly     : !!process.env.CI,
  retries        : process.env.CI ? 2 : 0,
  workers        : process.env.CI ? 4 : '50%',

  reporter: [
    ['html',  { outputFolder: 'reports/html', open: 'never' }],
    ['json',  { outputFile:  'reports/json/results.json'   }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }],
    ['github'],
    ['list'],
  ],

  use: {
    baseURL           : process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    headless          : true,
    screenshot        : 'only-on-failure',
    video             : 'retain-on-failure',
    trace             : 'on-first-retry',
    actionTimeout     : 15_000,
    navigationTimeout : 30_000,
  },

  projects: [
    { name: 'setup', testMatch: '**/auth.setup.js' },
    {
      name: 'chromium',
      use : { ...devices['Desktop Chrome'], storageState: 'auth/storageState.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use : { ...devices['Desktop Firefox'], storageState: 'auth/storageState.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use : { ...devices['Desktop Safari'], storageState: 'auth/storageState.json' },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use : { ...devices['Pixel 7'], storageState: 'auth/storageState.json' },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
});
