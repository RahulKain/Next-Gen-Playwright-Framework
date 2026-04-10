
### **Comprehensive Test Cases: OrangeHRM Dashboard**

url: https://opensource-demo.orangehrmlive.com/web/index.php/

username: Admin
password: [PASSWORD]

| TC ID | Module | Description | Steps to Execute | Expected Outcome | Priority | Tags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Session Management | Verify unauthorized access prevention. | 1. Open an incognito window.<br>2. Navigate directly to `/web/index.php/dashboard/index` without logging in. | System denies access and redirects the user to the Login page. | **P0** | Smoke, Security |
| **TC-02** | Session Management | Verify session timeout handling. | 1. Log in and navigate to the Dashboard.<br>2. Remain completely idle until the configured session timeout expires.<br>3. Click on any widget. | The session is invalidated, an alert may appear, and the user is redirected to Login. | **P1** | Regression, Edge |
| **TC-03** | Session Management | Verify multiple tab session handling. | 1. Log in to the Dashboard.<br>2. Duplicate the tab.<br>3. Log out from Tab A.<br>4. Attempt to click a link in Tab B. | Tab B recognizes the terminated session and redirects to Login. | **P1** | Regression, Security |
| **TC-04** | Global Nav & UI | Verify visibility of authorized sidebar modules. | 1. Log in as an Admin.<br>2. Inspect the left-hand navigation sidebar. | All authorized modules (Admin, PIM, Leave, Time, etc.) render with correct icons and text. | **P0** | Smoke |
| **TC-05** | Global Nav & UI | Verify real-time sidebar search functionality. | 1. Click the "Search" input in the sidebar.<br>2. Type "Recruitment". | The sidebar dynamically filters out non-matching items, displaying only "Recruitment". | **P1** | Regression |
| **TC-06** | Global Nav & UI | Verify sidebar collapse/expand toggle. | 1. Click the `<` (chevron) icon at the top of the sidebar.<br>2. Hover over the collapsed icons.<br>3. Click the `>` icon to expand. | Sidebar collapses to icons only. Tooltips appear on hover. Clicking expand restores full text view. | **P1** | UI, Regression |
| **TC-07** | Global Nav & UI | Verify responsive layout on mobile viewports. | 1. Open Developer Tools.<br>2. Set viewport to Mobile (e.g., 375x667).<br>3. Scroll down the dashboard. | Sidebar hides behind a hamburger menu. Dashboard widgets stack vertically without horizontal scrolling. | **P1** | UI, Non-Functional |
| **TC-08** | Quick Launch | Verify "Assign Leave" routing. | 1. Locate the "Quick Launch" widget.<br>2. Click the "Assign Leave" icon. | Page routes to `/web/index.php/leave/assignLeave` successfully. | **P0** | Smoke |
| **TC-09** | Quick Launch | Verify "Timesheets" routing. | 1. Locate the "Quick Launch" widget.<br>2. Click the "Timesheets" icon. | Page routes to the employee timesheet view successfully. | **P0** | Smoke |
| **TC-10** | Quick Launch | Verify rapid multi-click handling. | 1. Locate the "Quick Launch" widget.<br>2. Rapidly triple-click the "Leave List" icon. | Application processes one routing event and loads the page without crashing or generating duplicate states. | **P1** | Edge, Regression |
| **TC-11** | Time at Work | Verify "Punch In" flow. | 1. Ensure no active shift is running.<br>2. Click the stopwatch icon in the "Time at Work" widget. | User is redirected to the Punch In/Out screen. | **P0** | Smoke |
| **TC-12** | Time at Work | Verify logged hours accuracy. | 1. Note the total hours displayed in the widget.<br>2. Navigate to Timesheets.<br>3. Compare widget hours vs. actual logged hours for the week. | Widget data accurately matches the backend timesheet aggregation. | **P1** | Regression |
| **TC-13** | My Actions | Verify pending leave request routing. | 1. Ensure test user has a pending leave request to approve.<br>2. Locate "My Actions" widget.<br>3. Click on the "(1) Leave Requests to Approve" text. | Routes user directly to the filtered Leave List showing the specific pending request. | **P0** | Smoke |
| **TC-14** | My Actions | Verify empty state UI. | 1. Log in as a user with zero pending actions.<br>2. Locate the "My Actions" widget. | Widget displays an empty state message (e.g., "No Pending Actions") instead of blank space. | **P1** | UI, Regression |
| **TC-15** | Data Viz (Charts) | Verify Employee Distribution chart rendering. | 1. Scroll to "Employee Distribution by Sub Unit" chart.<br>2. Hover the mouse cursor over a pie chart slice. | Chart renders properly (Canvas/SVG). Tooltip appears displaying exact percentage/headcount. | **P1** | Regression |
| **TC-16** | Data Viz (Charts) | Verify legend toggle interaction. | 1. Locate a pie/bar chart widget.<br>2. Click on one of the items in the chart's legend. | The chart dynamically re-renders, hiding/showing the data segment corresponding to the clicked legend item. | **P1** | Regression |
| **TC-17** | Data Viz (Charts) | Verify "Employees on Leave Today" empty state. | 1. Ensure DB has 0 approved leaves for the current date.<br>2. View the "Employees on Leave Today" widget. | Widget gracefully handles the empty array, showing a graphic or "No Employees on Leave" text. | **P1** | Edge, Regression |
| **TC-18** | API / Error Handling | Verify graceful failure of chart data endpoint. | 1. Use DevTools to intercept and block the API call fetching chart data (simulate 500/503 error).<br>2. Reload Dashboard. | Quick Launch and NavBar load normally. Failed widgets display a user-friendly fallback error (e.g., "Failed to load data"). | **P1** | Error Handling |
| **TC-19** | Performance | Measure Total Blocking Time (TBT). | 1. Clear browser cache.<br>2. Run Lighthouse/Performance profiler while loading the dashboard. | LCP (Largest Contentful Paint) is < 2.5s and TBT is minimal, ensuring UI is responsive during load. | **P1** | Performance |
```