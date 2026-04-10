<div align="center">

# 🎭 Next Gen Playwright Framework

**Enterprise E2E automation · Zero flakiness · Ships with CI/CD**

[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node 20](https://img.shields.io/badge/Node-20_LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Allure](https://img.shields.io/badge/Report-Allure-FF6347?style=flat-square)](https://allurereport.org)

</div>

---

## ⚡ Quick Start

```bash
npm ci                              # install
npx playwright install --with-deps  # browsers
cp .env.example .env                # configure
npm run setup:auth                  # save login session
npm run test:smoke                  # 🚀 go
```

---

## 🛠️ Stack

| | Tool | Purpose |
|---|---|---|
| 🎭 | **Playwright** | Browser automation + test runner |
| 🟨 | **JavaScript** (ESM) | Language |
| ⚙️ | **GitHub Actions** | CI/CD — 4 parallel shards |
| 📊 | **Allure + HTML** | Reports → GitHub Pages |
| 🃏 | **Faker.js** | Dynamic test data |
| 🔐 | **dotenv** | Environment management |

---

## 🏗️ Architecture

```
Spec File  →  fixtures/index.js  →  Page Objects  →  Components
   ↑                  ↑                   ↑               ↑
no locators      DI via fixture      all selectors    reusable UI
no data          chaining            live here         blocks
   ↓
test-data/*.js   ← all hardcoded strings live here
```

---

## 📁 Key Files

```
├── fixtures/index.js        ← single import · typed MyFixtures
├── pages/
│   ├── base.page.js         ← shared helpers
│   ├── login.page.js        ← login POM
│   ├── dashboard.page.js    ← dashboard POM (injects navbar)
│   └── components/
│       └── navbar.component.js
├── test-data/
│   └── dashboard.data.js    ← zero magic strings in specs
├── utils/
│   ├── api.helper.js · data.generator.js · wait.helper.js
├── tests/auth.setup.js      ← saves storageState once
└── .github/workflows/
    ├── playwright.yml        ← 4-shard pipeline
    └── playwright-scheduled.yml ← nightly cron
```

---

## 🧪 Commands

| Command | What it does |
|---|---|
| `npm test` | All tests, all browsers |
| `npm run test:smoke` | `@smoke` tagged tests only |
| `npm run test:regression` | Full regression suite |
| `npm run test:headed` | Watch tests run live |
| `npm run test:ui` | Playwright UI mode |
| `npm run report:html` | Open HTML report |
| `npm run report:allure:open` | Open Allure report |

---

## 💉 Dependency Injection

No `new` calls in test files — ever. Playwright fixtures handle DI:

```js
// fixtures/index.js
export const test = base.extend({
  navbar:        async ({ authPage },          use) => use(new NavbarComponent(authPage)),
  dashboardPage: async ({ authPage, navbar },  use) => use(new DashboardPage(authPage, navbar)),
  loginPage:     async ({ authPage },          use) => use(new LoginPage(authPage)),
});

// In any spec:
import { test, expect } from '../../../fixtures/index.js';
test('...', async ({ dashboardPage }) => { ... }); // ← injected, typed, ready
```

---

## 🚀 CI/CD Pipeline

```
push / PR  →  📦 Install  →  🧪 Shard ×4  →  📊 Merge Reports  →  📢 Slack
                                ↓
                        blob artifacts per shard
                                ↓
                      HTML · JSON · Allure → GitHub Pages
```

> **Set these GitHub Secrets:** `BASE_URL` · `TEST_USER_EMAIL` · `TEST_USER_PASSWORD` · `SLACK_WEBHOOK_URL`

---

## 📊 Reports After CI

| Report | Location |
|---|---|
| 🌐 HTML | Artifact → `playwright-html-report` |
| 📈 Allure | GitHub Pages → `/allure/` |
| 📋 Summary | Inline on every PR / push |

---

<div align="center">

*Built for speed. Designed for scale. Ready for CI.*

![](https://img.shields.io/badge/tests-passing-brightgreen?style=for-the-badge)
![](https://img.shields.io/badge/browsers-3-blue?style=for-the-badge)
![](https://img.shields.io/badge/shards-4-orange?style=for-the-badge)

</div>
