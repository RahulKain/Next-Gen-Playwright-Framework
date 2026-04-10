// pages/components/navbar.component.js

export class NavbarComponent {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // ── Top bar ─────────────────────────────────────────────────────
    this.topBar         = page.locator('.oxd-topbar');
    this.userDropdown   = page.locator('.oxd-userdropdown-tab');
    this.userAvatar     = page.locator('.oxd-userdropdown-img');
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    this.profileLink    = page.getByRole('menuitem', { name: 'My Info' });

    // ── Sidebar ──────────────────────────────────────────────────────
    this.sidebar        = page.locator('.oxd-sidepanel');
    this.sidebarSearch  = page.locator('.oxd-input[placeholder="Search"]');
    this.sidebarToggle  = page.locator('.oxd-sidepanel-header > button');

    // Nav item text spans — used for text content reads
    this.menuItemNames  = page.locator('.oxd-main-menu-item--name');
    // Full nav item rows — used for visibility assertions after search
    this.navItems       = page.locator('.oxd-nav-item');
  }

  // ── Actions ──────────────────────────────────────────────────────

  async logout() {
    await this.userDropdown.waitFor({ state: 'visible' });
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }

  async search(term) {
    await this.sidebarSearch.waitFor({ state: 'visible' });
    await this.sidebarSearch.clear();
    await this.sidebarSearch.fill(term);
  }

  async toggleCollapse() {
    await this.sidebarToggle.click();
    await this.page.waitForTimeout(400); // CSS transition
  }

  // ── Queries ──────────────────────────────────────────────────────

  /** Returns text content of all visible module name labels */
  async getMenuItemTexts() {
    await this.menuItemNames.first().waitFor({ state: 'visible' });
    return this.menuItemNames.allTextContents();
  }

  /**
   * Returns the nav item row that contains `moduleName`.
   * Use for visibility assertions after a sidebar search.
   * @param {string} moduleName
   */
  getNavItemByName(moduleName) {
    return this.navItems.filter({ hasText: moduleName });
  }

  async isCollapsed() {
    const cls = await this.sidebar.getAttribute('class');
    return cls?.includes('--shrink') || cls?.includes('collapsed') || false;
  }

  async getUserName() {
    await this.userDropdown.waitFor({ state: 'visible' });
    return this.userDropdown.textContent();
  }
}
