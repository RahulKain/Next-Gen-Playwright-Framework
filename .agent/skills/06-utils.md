# Skill: Utilities

## wait.helper.js — Retry-Safe Polling
```js
// utils/wait.helper.js
/**
 * Poll until conditionFn() returns true or timeout exceeded.
 * @param {()=>Promise<boolean>} conditionFn
 * @param {number} timeout ms (default 10s)
 * @param {number} interval ms (default 500ms)
 */
export async function waitFor(conditionFn, timeout = 10_000, interval = 500) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await conditionFn()) return;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error(`waitFor: condition not met in ${timeout}ms`);
}
```

## data.generator.js — Faker-Based Factory
```js
// utils/data.generator.js
import { faker } from '@faker-js/faker';

export const genUser = () => ({
  firstName : faker.person.firstName(),
  lastName  : faker.person.lastName(),
  email     : faker.internet.email(),
  password  : faker.internet.password({ length: 12, memorable: false }),
  phone     : faker.phone.number(),
});

export const genAddress = () => ({
  street  : faker.location.streetAddress(),
  city    : faker.location.city(),
  zip     : faker.location.zipCode(),
  country : faker.location.country(),
});

export const genProduct = () => ({
  name  : faker.commerce.productName(),
  price : faker.commerce.price({ min: 5, max: 500 }),
  sku   : faker.string.alphanumeric(8).toUpperCase(),
});
```

## api.helper.js — Request Wrapper
```js
// utils/api.helper.js
export class ApiHelper {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.req  = request;
    this.base = process.env.API_BASE_URL;
  }
  async get(path, params = {})  {
    const r = await this.req.get(`${this.base}${path}`, { params });
    return r.json();
  }
  async post(path, data)        {
    const r = await this.req.post(`${this.base}${path}`, {
      data, headers: { 'Content-Type': 'application/json' }
    });
    return r.json();
  }
  async put(path, data)         {
    const r = await this.req.put(`${this.base}${path}`, { data });
    return r.json();
  }
  async delete(path)            {
    return this.req.delete(`${this.base}${path}`);
  }
  // Shortcuts
  async createUser(data)  { return this.post('/api/users',    data); }
  async deleteUser(id)    { return this.delete(`/api/users/${id}`); }
}
```

## logger.js
```js
// utils/logger.js
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
  ),
  transports: [new transports.Console()],
});
```

## custom.assertions.js — Soft Assertions
```js
// utils/custom.assertions.js
import { expect } from '@playwright/test';

/**
 * Run multiple assertions without stopping at first failure.
 * Usage: await softAssert(page, async (s) => { s.toHaveTitle(...); });
 */
export async function softAssert(page, assertionsFn) {
  const errors = [];
  const softExpect = new Proxy(expect(page), {
    get(target, prop) {
      return (...args) => {
        try { return target[prop](...args); }
        catch (e) { errors.push(e.message); }
      };
    },
  });
  await assertionsFn(softExpect);
  if (errors.length) throw new Error(`Soft assertion failures:\n${errors.join('\n')}`);
}
```

## Usage in Tests
```js
import { waitFor }    from '../../../utils/wait.helper.js';
import { genUser }    from '../../../utils/data.generator.js';
import { ApiHelper }  from '../../../utils/api.helper.js';
import { logger }     from '../../../utils/logger.js';

// In a fixture or test:
const user = genUser();
const api  = new ApiHelper(request);
const created = await api.createUser(user);
logger.info(`Created user: ${created.id}`);

await waitFor(async () => {
  const el = page.locator('[data-testid="user-row"]');
  return (await el.count()) > 0;
});
```

## Anti-Patterns (Never Do)
```js
// ❌ Arbitrary sleep
await page.waitForTimeout(3000);

// ✅ Use waitFor() or Playwright's built-in waits
await page.locator('...').waitFor({ state: 'visible' });
await expect(page.locator('...')).toBeVisible();
```
