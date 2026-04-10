# Skill: Playwright Config

## playwright.config.js (canonical)
```js
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir       : './tests',
  testMatch     : '**/*.spec.js',
  fullyParallel : true,
  forbidOnly    : !!process.env.CI,          // block .only in CI
  retries       : process.env.CI ? 2 : 0,
  workers       : process.env.CI ? 4 : '50%',
  reporter: [
    ['html',  { outputFolder: 'reports/html', open: 'never' }],
    ['json',  { outputFile:  'reports/json/results.json'   }],
    ['allure-playwright', { outputFolder: 'reports/allure-results' }],
    ['github'],   // annotations on CI
    ['list'],     // console
  ],
  use: {
    baseURL           : process.env.BASE_URL,
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
```

## .env.example
```dotenv
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com
TEST_USER_EMAIL=user@test.com
TEST_USER_PASSWORD=Pass123!
LOG_LEVEL=info
SLACK_WEBHOOK_URL=
```

## package.json scripts
```json
{
  "scripts": {
    "test"                   : "playwright test",
    "test:headed"            : "playwright test --headed",
    "test:ui"                : "playwright test --ui",
    "test:debug"             : "playwright test --debug",
    "test:smoke"             : "playwright test --grep @smoke",
    "test:regression"        : "playwright test --grep @regression",
    "test:chrome"            : "playwright test --project=chromium",
    "test:firefox"           : "playwright test --project=firefox",
    "test:mobile"            : "playwright test --project=mobile-chrome",
    "setup:auth"             : "playwright test tests/auth.setup.js",
    "report:html"            : "playwright show-report reports/html",
    "report:allure:generate" : "allure generate reports/allure-results --clean -o reports/allure-report",
    "report:allure:open"     : "allure open reports/allure-report"
  }
}
```

## .gitignore additions
```
node_modules/
test-results/
reports/
auth/storageState.json
.env
blob-report/
allure-report/
playwright-report/
```
