// pages/base.page.js
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /** Navigate to a path relative to baseURL */
  async goto(path = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Click after confirming element is visible */
  async clickElement(locator, opts = {}) {
    await locator.waitFor({ state: 'visible' });
    await locator.click(opts);
  }

  /** Clear then fill an input */
  async fillInput(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async getTitle() {
    return this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  /** Wait for URL to match pattern */
  async waitForURL(pattern) {
    await this.page.waitForURL(pattern, { timeout: 15_000 });
  }
}
