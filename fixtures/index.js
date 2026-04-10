// fixtures/index.js
// Single entry point — all tests import { test, expect } from here.
//
// Playwright's fixture system IS the DI container:
//   - Each fixture is a singleton per test
//   - Dependencies declared in { } are resolved and injected automatically
//   - e.g. dashboardPage receives `authPage` + `navbar` — same instances
//     that other fixtures in the same test use

import { test as base }    from '@playwright/test';
import { LoginPage }       from '../pages/login.page.js';
import { DashboardPage }   from '../pages/dashboard.page.js';
import { NavbarComponent } from '../pages/components/navbar.component.js';

// ─── Type Definitions (JSDoc — for IDE autocomplete) ────────────────────────

/**
 * @typedef  {Object}         MyFixtures
 * @property {import('@playwright/test').Page} authPage       - Authenticated browser page
 * @property {NavbarComponent}                 navbar         - Shared top-bar/sidebar component
 * @property {LoginPage}                       loginPage      - Login page object
 * @property {DashboardPage}                   dashboardPage  - Dashboard page object
 */

// ─── Fixture Definitions ────────────────────────────────────────────────────

export const test = base.extend(/** @type {MyFixtures} */ ({

  // ── Authenticated Page Context ──────────────────────────────────────────
  // Creates a fresh browser context pre-loaded with saved auth cookies/storage.
  // All page-object fixtures below depend on this for their `page` reference.
  authPage: async ({ browser }, use) => {
    const ctx  = await browser.newContext({ storageState: 'auth/storageState.json' });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },

  // ── Shared Component Fixtures ───────────────────────────────────────────
  // Declared as fixtures so Playwright caches them per-test:
  // if both `dashboardPage` and a future `settingsPage` need `navbar`,
  // they get the SAME instance — no duplicate construction.

  navbar: async ({ authPage }, use) => {
    await use(new NavbarComponent(authPage));
  },

  // ── Page Object Fixtures ────────────────────────────────────────────────
  // Dependencies listed in { } are injected by Playwright automatically.
  // Add more page objects here as pages are created.

  loginPage: async ({ authPage }, use) => {
    await use(new LoginPage(authPage));
  },

  dashboardPage: async ({ authPage, navbar }, use) => {
    // DashboardPage receives the same `navbar` instance Playwright resolved above
    await use(new DashboardPage(authPage, navbar));
  },

  // ── Template: Add new pages here ───────────────────────────────────────
  // recruitmentPage: async ({ authPage, navbar }, use) => {
  //   await use(new RecruitmentPage(authPage, navbar));
  // },

}));

export { expect } from '@playwright/test';
