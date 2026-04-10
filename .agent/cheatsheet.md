# Playwright-JS Cheatsheet — Quick Reference

## Locators
```js
page.locator('[data-testid="x"]')         // preferred
page.getByRole('button', { name: 'Save'}) // semantic
page.getByLabel('Email')
page.getByPlaceholder('Enter email')
page.getByText('Welcome')
page.locator('ul > li').nth(2)            // nth item
page.locator('.row').filter({ hasText: 'John' })
```

## Assertions (always use expect — auto-retry)
```js
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toHaveText('exact')
await expect(locator).toContainText('partial')
await expect(locator).toHaveValue('input val')
await expect(locator).toBeEnabled() / toBeDisabled()
await expect(locator).toHaveCount(3)
await expect(page).toHaveURL(/dashboard/)
await expect(page).toHaveTitle('My App')
```

## Network Interception
```js
// Mock a response
await page.route('**/api/users', route =>
  route.fulfill({ status: 200, json: [{ id: 1, name: 'Mock' }] })
);

// Block analytics/ads
await page.route('**/{analytics,ads}**', r => r.abort());

// Intercept and modify
await page.route('**/api/order', async route => {
  const json = await route.fetch().then(r => r.json());
  json.status = 'modified';
  await route.fulfill({ json });
});
```

## API Test (within Playwright)
```js
test('GET /users returns 200', async ({ request }) => {
  const res = await request.get(`${process.env.API_BASE_URL}/api/users`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveLength(5);
});
```

## Parallel / Sharding
```js
// playwright.config.js
fullyParallel: true   // files run in parallel
workers: 4            // concurrent workers

// CLI sharding (CI matrix)
npx playwright test --shard=1/4
npx playwright test --shard=2/4
```

## Tags & Filtering
```js
test('TC-001: Login @smoke', ...)        // inline tag
npx playwright test --grep @smoke        // run tagged
npx playwright test --grep-invert @slow  // exclude tagged
```

## Debug Tools
```bash
npx playwright test --debug              # step debugger
npx playwright test --ui                 # UI mode
npx playwright show-trace trace.zip      # trace viewer
PWDEBUG=1 npx playwright test           # pause on each action
```

## Storage State (Auth Reuse)
```js
// Save
await page.context().storageState({ path: 'auth/storageState.json' });

// Load (in config or fixture)
const ctx = await browser.newContext({ storageState: 'auth/storageState.json' });
```

## Screenshots & Video (config)
```js
screenshot: 'only-on-failure'   // never | always | only-on-failure
video:      'retain-on-failure'  // off | on | retain-on-failure
trace:      'on-first-retry'    // off | on | retain-on-failure | on-first-retry
```

## Common Patterns
```js
// Wait for network idle after click
await Promise.all([
  page.waitForLoadState('networkidle'),
  page.locator('[data-testid="save"]').click(),
]);

// Upload file
await page.locator('input[type="file"]').setInputFiles('/path/to/file.csv');

// Drag and drop
await page.locator('#source').dragTo(page.locator('#target'));

// Clipboard
await page.locator('#copy-btn').click();
const text = await page.evaluate(() => navigator.clipboard.readText());

// Dialog handling
page.on('dialog', d => d.accept());
```
