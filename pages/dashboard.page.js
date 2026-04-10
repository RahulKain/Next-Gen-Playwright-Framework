// pages/dashboard.page.js
import { BasePage }        from './base.page.js';
import { NavbarComponent } from './components/navbar.component.js';

export class DashboardPage extends BasePage {
  // No static dependencies — DI is via Playwright fixture chaining (see fixtures/index.js)

  /**
   * @param {import('@playwright/test').Page} page
   * @param {NavbarComponent} navbar  ← injected by PageFactory
   */
  constructor(page, navbar) {
    super(page);

    // ── Injected component ─────────────────────────────────────────
    this.navbar = navbar;

    // ── Quick Launch widget ────────────────────────────────────────
    this.quickLaunch    = page.locator('.orangehrm-quick-launch');
    this.assignLeaveBtn = page.getByRole('button', { name: 'Assign Leave' });
    this.leaveListBtn   = page.getByRole('button', { name: 'Leave List'  });
    this.timesheetsBtn  = page.getByRole('button', { name: 'Timesheets'  });
    this.applyLeaveBtn  = page.getByRole('button', { name: 'Apply Leave' });
    this.myLeaveBtn     = page.getByRole('button', { name: 'My Leave'    });
    this.myTimesheetBtn = page.getByRole('button', { name: 'My Timesheet'});

    // ── Time at Work widget ────────────────────────────────────────
    this.timeAtWorkWidget = page.locator('.orangehrm-attendance-card');
    this.punchButton      = page.locator('.orangehrm-attendance-card .oxd-icon-button');

    // ── My Actions widget ──────────────────────────────────────────
    this.myActionsWidget    = page.locator('.oxd-sheet').filter({ hasText: 'My Actions' });
    this.myActionsRows      = this.myActionsWidget.locator('li, .oxd-table-row');
    this.leaveApprovalsLink = page.locator('a').filter({ hasText: 'Leave Requests to Approve' });

    // ── Charts ─────────────────────────────────────────────────────
    this.empDistributionChart = page.locator('.orangehrm-dashboard-widget')
      .filter({ hasText: 'Employee Distribution' });
    this.empOnLeaveWidget     = page.locator('.orangehrm-dashboard-widget')
      .filter({ hasText: 'Employees on Leave Today' });

    // ── Canvas / SVG inside chart widgets ─────────────────────────
    this.empDistributionCanvas = this.empDistributionChart.locator('canvas, svg').first();
  }

  // ── Navigation ────────────────────────────────────────────────────

  async goto() {
    await super.goto('/web/index.php/dashboard/index');
  }

  // ── Navbar delegation ─────────────────────────────────────────────

  async logout()                        { return this.navbar.logout();                   }
  async searchSidebar(term)             { return this.navbar.search(term);               }
  async getVisibleNavItems()            { return this.navbar.getMenuItemTexts();         }
  async toggleSidebar()                 { return this.navbar.toggleCollapse();           }
  async isSidebarCollapsed()            { return this.navbar.isCollapsed();              }
  getNavItemByName(name)                { return this.navbar.getNavItemByName(name);     }

  // ── Quick Launch ──────────────────────────────────────────────────

  /** Click a Quick Launch button by its visible label */
  async clickQuickLaunch(buttonName) {
    const btn = this.page.getByRole('button', { name: buttonName });
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  // ── My Actions ────────────────────────────────────────────────────

  /** Returns count of pending action rows (0 = empty state) */
  async getPendingActionsCount() {
    return this.myActionsRows.count();
  }

  /** Returns the full text of the My Actions widget */
  async getMyActionsText() {
    await this.myActionsWidget.waitFor({ state: 'visible' });
    return this.myActionsWidget.textContent();
  }

  // ── Charts ────────────────────────────────────────────────────────

  /** Returns true if the Employee Distribution chart canvas/svg is visible */
  async isEmpDistributionChartVisible() {
    return this.empDistributionCanvas.isVisible();
  }
}
