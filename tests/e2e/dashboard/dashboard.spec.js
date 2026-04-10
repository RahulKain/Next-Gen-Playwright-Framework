// tests/e2e/dashboard/dashboard.spec.js
import { test, expect }      from '../../../fixtures/index.js';
import { DashboardPage }     from '../../../pages/dashboard.page.js';
import { NavbarComponent }   from '../../../pages/components/navbar.component.js';
import { dashboardData as d} from '../../../test-data/dashboard.data.js';

/**
 * Rules enforced here:
 *  ✅ All test data imported from test-data/dashboard.data.js
 *  ✅ All locators live in DashboardPage / NavbarComponent
 *  ✅ No raw page.locator() / getByRole() in this file
 *  ✅ No hardcoded strings — only references to `d.<key>`
 */
test.describe('OrangeHRM Dashboard', () => {

  // ── Session Management ───────────────────────────────────────────

  test('TC-01: Unauthorized access redirects to Login @smoke @security',
    async ({ browser }) => {
      const ctx  = await browser.newContext({ storageState: undefined });
      const page = await ctx.newPage();
      await page.goto('/web/index.php/dashboard/index');
      await expect(page).toHaveURL(d.urls.login, { timeout: 15_000 });
      await ctx.close();
    }
  );

  // ── Global Nav & UI ──────────────────────────────────────────────

  test('TC-04: Sidebar shows all authorized modules @smoke',
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      const texts = await dashboardPage.getVisibleNavItems();
      for (const module of d.modules.expected) {
        expect(
          texts.some(t => t.trim().includes(module)),
          `Module "${module}" missing from sidebar`
        ).toBeTruthy();
      }
    }
  );

  test('TC-05: Sidebar search filters results dynamically @regression',
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.searchSidebar(d.sidebarSearch.term);

      const visible = dashboardPage.getNavItemByName(d.sidebarSearch.visibleResult);
      const hidden  = dashboardPage.getNavItemByName(d.sidebarSearch.hiddenResult);

      await expect(visible).toBeVisible();
      await expect(hidden).toBeHidden();
    }
  );

  test('TC-06: Sidebar collapses and expands @regression @ui',
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.toggleSidebar();
      expect(await dashboardPage.isSidebarCollapsed()).toBeTruthy();
      await dashboardPage.toggleSidebar();
      expect(await dashboardPage.isSidebarCollapsed()).toBeFalsy();
    }
  );

  test('TC-07: Dashboard is responsive on mobile viewport @ui @regression',
    async ({ browser }) => {
      // Mobile context needs its own browser context & viewport
      const ctx   = await browser.newContext({
        storageState : 'auth/storageState.json',
        viewport     : d.mobile.viewport,
      });
      const page   = await ctx.newPage();

      // Mirror what fixtures/index.js does — explicit construction
      const navbar    = new NavbarComponent(page);
      const dashboard = new DashboardPage(page, navbar);

      await dashboard.goto();

      // Sidebar collapses to hamburger on mobile
      await expect(dashboard.navbar.sidebar).not.toBeInViewport();

      // No horizontal scrollbar
      const hasHScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHScroll, 'Horizontal scroll detected on mobile').toBeFalsy();

      await ctx.close();
    }
  );

  // ── Quick Launch ─────────────────────────────────────────────────

  test('TC-08: Quick Launch — Assign Leave routes correctly @smoke',
    async ({ dashboardPage, authPage }) => {
      await dashboardPage.goto();
      await dashboardPage.clickQuickLaunch(d.quickLaunch.assignLeave.button);
      await expect(authPage).toHaveURL(d.quickLaunch.assignLeave.url);
    }
  );

  test('TC-09: Quick Launch — Timesheets routes correctly @smoke',
    async ({ dashboardPage, authPage }) => {
      await dashboardPage.goto();
      await dashboardPage.clickQuickLaunch(d.quickLaunch.timesheets.button);
      await expect(authPage).toHaveURL(d.quickLaunch.timesheets.url);
    }
  );

  test('TC-10: Quick Launch — rapid clicks do not duplicate navigation @regression @edge',
    async ({ dashboardPage, authPage }) => {
      await dashboardPage.goto();
      // Triple-click using the locator owned by DashboardPage
      await dashboardPage.leaveListBtn.click();
      await dashboardPage.leaveListBtn.click();
      await dashboardPage.leaveListBtn.click();
      await expect(authPage).toHaveURL(d.quickLaunch.leaveList.url);
      expect(
        await authPage.evaluate(() => window.history.length),
        'Too many history entries — possible duplicate navigation'
      ).toBeLessThan(d.navigation.maxHistoryLength);
    }
  );

  // ── Time at Work ─────────────────────────────────────────────────

  test('TC-11: Time at Work — Punch button routes to Punch In/Out @smoke',
    async ({ dashboardPage, authPage }) => {
      await dashboardPage.goto();
      await dashboardPage.clickElement(dashboardPage.punchButton);
      await expect(authPage).toHaveURL(d.urls.punch);
    }
  );

  // ── My Actions ───────────────────────────────────────────────────

  test('TC-14: My Actions — empty state is not blank @regression @ui',
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await expect(dashboardPage.myActionsWidget).toBeVisible();
      const count = await dashboardPage.getPendingActionsCount();
      if (count === 0) {
        const text = await dashboardPage.getMyActionsText();
        expect(text?.trim().length, 'My Actions widget is completely blank').toBeGreaterThan(0);
      }
    }
  );

  // ── Charts / Data Viz ────────────────────────────────────────────

  test('TC-15: Employee Distribution chart renders @regression',
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await expect(dashboardPage.empDistributionChart).toBeVisible();
      expect(await dashboardPage.isEmpDistributionChartVisible()).toBe(true);
    }
  );

  // ── API / Error Handling ─────────────────────────────────────────

  test('TC-18: Graceful degradation when chart API returns 500 @regression @error-handling',
    async ({ dashboardPage, authPage }) => {
      await authPage.route('**/api/v2/dashboard/**', route =>
        route.fulfill({ status: 500, body: 'Internal Server Error' })
      );
      await dashboardPage.goto();

      // Core chrome still intact — assert via POM locators
      await expect(dashboardPage.navbar.sidebar).toBeVisible();
      await expect(dashboardPage.navbar.topBar).toBeVisible();

      // No leaked JS error message in the DOM
      const body = await authPage.textContent('body');
      expect(body).not.toContain('Cannot read properties');
    }
  );
});
