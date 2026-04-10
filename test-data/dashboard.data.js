// test-data/dashboard.data.js

export const dashboardData = {

  /** Expected sidebar modules for the Admin role */
  modules: {
    expected: ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard'],
  },

  /** Sidebar search scenarios */
  sidebarSearch: {
    term          : 'Recruitment',
    visibleResult : 'Recruitment',
    hiddenResult  : 'Admin',
  },

  /** Quick Launch button → expected destination URL pattern */
  quickLaunch: {
    assignLeave : { button: 'Assign Leave', url: /leave\/assignLeave/        },
    timesheets  : { button: 'Timesheets',   url: /time\/viewEmployeeTimesheet|timesheet/i },
    leaveList   : { button: 'Leave List',   url: /leave\/viewLeaveList/      },
  },

  /** Known destination URL patterns */
  urls: {
    login     : /auth\/login/,
    dashboard : /dashboard\/index/,
    punch     : /attendance\/punch/i,
    assignLeave : /leave\/assignLeave/,
  },

  /** Mobile viewport used in responsive tests */
  mobile: {
    viewport: { width: 375, height: 667 },
  },

  /** Max history entries allowed after rapid multi-click navigation */
  navigation: {
    maxHistoryLength: 5,
  },
};
