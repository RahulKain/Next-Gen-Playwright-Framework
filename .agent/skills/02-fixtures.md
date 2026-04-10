# Skill: Fixtures

## pages.fixture.js — Inject POMs
```js
// fixtures/pages.fixture.js
import { test as base } from '@playwright/test';
import { LoginPage }     from '../pages/login.page.js';
import { DashboardPage } from '../pages/dashboard.page.js';

export const test = base.extend({
  loginPage:     async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
});
```

## auth.fixture.js — Reuse Saved Auth State
```js
// fixtures/auth.fixture.js
import { test as pagesTest } from './pages.fixture.js';

export const test = pagesTest.extend({
  // Provides an already-authenticated page
  authPage: async ({ browser }, use) => {
    const ctx  = await browser.newContext({ storageState: 'auth/storageState.json' });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});
```

## index.js — Single Import Point
```js
// fixtures/index.js
export { test, expect } from './auth.fixture.js';
```

## auth.setup.js — Runs Once Before Tests
```js
// tests/auth.setup.js
import { test as setup, expect } from '@playwright/test';

setup('save auth state', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[data-testid="email"]').fill(process.env.TEST_USER_EMAIL);
  await page.locator('[data-testid="password"]').fill(process.env.TEST_USER_PASSWORD);
  await page.locator('[data-testid="submit"]').click();
  await expect(page).toHaveURL(/dashboard/);
  await page.context().storageState({ path: 'auth/storageState.json' });
});
```

## Spec File Template
```js
// tests/e2e/<feature>/<feature>.spec.js
import { test, expect } from '../../../fixtures/index.js';
import data from '../../../test-data/users.json' assert { type: 'json' };

test.describe('<Feature> — <Module>', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto('/<path>');
  });

  test('TC-001: <description> @smoke', async ({ loginPage }) => {
    // arrange → act → assert
  });

  test('TC-002: <description> @regression', async ({ loginPage }) => {});
});
```

## Adding a New Fixture
1. Add to `pages.fixture.js` (POM) or `auth.fixture.js` (session)
2. Re-export from `fixtures/index.js`
3. Never import `test` from `@playwright/test` directly in spec files
