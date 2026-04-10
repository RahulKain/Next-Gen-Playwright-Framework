# Skill: Page Object Model

## Dependency Injection — PageFactory
```
Rule: NEVER use `new SomePage(page)` in test files or fixtures.
      Always use pageFactory.create(SomePage).
```
```js
// utils/page.factory.js  (already implemented)
// - Reads static dependencies = [DepClass, ...] from each class
// - Recursively resolves deps, constructs once, caches per test
// - factory.clear() called in fixture teardown automatically

// To add a dependency to a page:
//   1. Import the dep class
//   2. Add it to static dependencies = [DepClass]
//   3. Accept it as a constructor param after `page`
//   That's it — no fixture changes needed.
```

```js
// Example: page with two injected components
import { NavbarComponent } from './components/navbar.component.js';
import { ModalComponent }  from './components/modal.component.js';

export class CheckoutPage extends BasePage {
  static dependencies = [NavbarComponent, ModalComponent]; // ← declare

  constructor(page, navbar, modal) {  // ← receive
    super(page);
    this.navbar = navbar;  // ← use
    this.modal  = modal;
  }
}
// Fixture just does: pageFactory.create(CheckoutPage)
// Factory auto-resolves NavbarComponent + ModalComponent
```

## BasePage
```js
// pages/base.page.js
export class BasePage {
  constructor(page) { this.page = page; }

  async goto(path = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }
  async clickElement(loc, opts = {}) {
    await loc.waitFor({ state: 'visible' });
    await loc.click(opts);
  }
  async fillInput(loc, val) {
    await loc.clear();
    await loc.fill(val);
  }
  async getTitle() { return this.page.title(); }
}
```

## Feature Page
```js
// pages/login.page.js
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    // ALL locators here — never in tests
    this.email    = page.locator('[data-testid="email"]');
    this.password = page.locator('[data-testid="password"]');
    this.submit   = page.locator('[data-testid="submit"]');
    this.error    = page.locator('[data-testid="error"]');
  }
  async login(email, pwd) {
    await this.goto('/login');
    await this.fillInput(this.email, email);
    await this.fillInput(this.password, pwd);
    await this.clickElement(this.submit);
  }
  async getError() { return this.error.textContent(); }
}
```

## Component (Reusable)
```js
// pages/components/navbar.component.js
export class NavbarComponent {
  constructor(page) {
    this.page   = page;
    this.menu   = page.locator('[data-testid="nav-menu"]');
    this.logout = page.locator('[data-testid="nav-logout"]');
  }
  async clickLogout() {
    await this.menu.click();
    await this.logout.click();
  }
}
```

## Locator Priority (use in order)
1. `data-testid` attribute → most stable
2. `page.getByRole()` → semantic, accessible
3. `page.getByLabel()` / `getByPlaceholder()`
4. `page.getByText()` → for static text
5. CSS selector → last resort, no XPath

## Naming Conventions
- Page files: `<feature>.page.js`
- Component files: `<name>.component.js`
- Methods: verbs → `login()`, `clickSubmit()`, `getErrorText()`
- Locators: nouns → `emailInput`, `submitBtn`, `errorMsg`
