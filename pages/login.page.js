// pages/login.page.js
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.errorAlert    = page.locator('.oxd-alert-content-text');
    this.logo          = page.locator('.orangehrm-login-logo');
  }

  async goto() {
    await super.goto('/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.goto();
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage() {
    await this.errorAlert.waitFor({ state: 'visible' });
    return this.errorAlert.textContent();
  }

  async isLogoVisible() {
    return this.logo.isVisible();
  }
}
