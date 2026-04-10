# Skill: Reporting

## Reporter Stack
| Reporter | Package | Output | Purpose |
|----------|---------|--------|---------|
| `html` | built-in | `reports/html/` | Human-readable, trace viewer |
| `json` | built-in | `reports/json/results.json` | Machine-readable / job summary |
| `blob` | built-in | `blob-report/` | Shard merging intermediate |
| `allure-playwright` | `allure-playwright` | `reports/allure-results/` | Historical trends, GitHub Pages |
| `github` | built-in | GitHub annotations | Inline CI feedback on PR |
| `list` | built-in | console | Local dev feedback |

## Install Allure
```bash
npm install -D allure-playwright
npm install -g allure-commandline   # or use npx allure
```

## Reporter Config (in playwright.config.js)
```js
reporter: [
  ['html',  { outputFolder: 'reports/html', open: 'never' }],
  ['json',  { outputFile:  'reports/json/results.json'   }],
  ['allure-playwright', { outputFolder: 'reports/allure-results' }],
  ['github'],
  ['list'],
],
```

## Local Report Commands
```bash
# HTML (opens browser)
npx playwright show-report reports/html

# Allure (generate then open)
allure generate reports/allure-results --clean -o reports/allure-report
allure open reports/allure-report

# OR via npm scripts:
npm run report:html
npm run report:allure:generate && npm run report:allure:open
```

## Shard Merging (CI)
```bash
# After downloading all blob-report-* artifacts into ./all-blobs/:
npx playwright merge-reports --reporter html,json ./all-blobs
```

## Allure Annotations in Tests
```js
import { test, expect } from '../../../fixtures/index.js';

test('TC-001: Login @smoke', async ({ loginPage }) => {
  test.info().annotations.push(
    { type: 'feature',  description: 'Authentication' },
    { type: 'severity', description: 'critical'       },
    { type: 'issue',    description: 'PROJ-123'       },
  );
  // test steps...
});
```

## GitHub Pages Setup (one-time)
1. Repo → Settings → Pages → Source: `gh-pages` branch
2. Allure report auto-deploys on every `main` push via workflow
3. URL: `https://<org>.github.io/<repo>/allure/`
