# 🎭 Playwright Test Automation Framework

[![Playwright Tests](https://img.shields.io/badge/Playwright-Tests-blue?logo=playwright)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-green?logo=github)](https://github.com/features/actions)

A **production-ready** test automation framework built with Playwright, demonstrating **senior-level** testing patterns including Page Object Model, API + UI hybrid testing, custom fixtures, and comprehensive CI/CD integration.

## 📋 Table of Contents

- [Framework Overview](#framework-overview)
- [Folder Structure](#folder-structure)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Test Execution](#test-execution)
- [Debugging & Reporting](#debugging--reporting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Interview Talking Points](#interview-talking-points)
- [Best Practices Implemented](#best-practices-implemented)

---

## 🏗️ Framework Overview

This framework demonstrates **enterprise-level** test automation patterns:

- **Page Object Model** with inheritance for maintainable UI tests
- **API + UI Hybrid Testing** - API for setup, UI for verification
- **Custom Fixtures** for reusable, isolated test dependencies
- **Tag-Based Execution** (@smoke, @regression, @ui, @api)
- **Multi-Environment Support** (dev/qa/prod via .env files)
- **CI/CD Ready** with GitHub Actions, sharding, and matrix testing
- **Comprehensive Debugging** with traces, screenshots, and videos

---

## 📁 Folder Structure
    PLAYWRIGHT-INTERVIEW-FRAMEWORK/
    ├── .github/workflows/ # CI/CD pipeline configuration
    ├── .vscode/ # VS Code debug configurations
    ├── debug-artifacts/ # Screenshots, traces, videos on failure
    ├── environments/ # Environment config files (.env.dev, .env.qa)
    ├── scripts/ # Helper scripts for CI
    ├── src/
    │ ├── fixtures/
    │ │ └── customFixtures.ts # Custom test fixtures with authentication
    │ ├── helpers/ # Utility functions (logging, debugging)
    │ ├── pages/
    │ │ ├── ui/ # UI Page Objects
    │ │ │ ├── BasePage.ts # Base class for all pages
    │ │ │ └── LoginPage.ts # Login page specific methods
    │ │ └── api/
    │ │ └── ApiClient.ts # API client with authentication
    │ ├── test-data/ # Static test data files
    ├── tests/
    │ ├── api/ # API tests
    │ ├── smoke/ # Critical path smoke tests
    │ └── ui/ # UI functional tests
    ├── playwright-report/ # Generated test reports
    ├── test-results/ # Test artifacts (traces, videos)
    ├── auth.json # Saved authentication state
    ├── playwright.config.ts # Main Playwright configuration
    ├── package.json # Dependencies and scripts
    ├── tsconfig.json # TypeScript configuration
    └── README.md # This file

---

## ✨ Key Features

### 1. **Page Object Model with Inheritance**
```typescript
// BasePage provides common functionality
export class BasePage {
  async goto(url: string) { ... }
  async takeScreenshot(name: string) { ... }
}

// LoginPage inherits BasePage
export class LoginPage extends BasePage {
  async login(username: string, password: string) { ... }
  async expectErrorMessage(message: string) { ... }
}
```
### 2. **API + UI Hybrid Testing**
```typescript

test('Complete user journey', async ({ apiClient, page }) => {
  // API setup - create data
  const user = await apiClient.post('/users', { name: 'Test User' });
  
  // UI verification - interact with the UI
  await page.goto('/users');
  await expect(page.getByText('Test User')).toBeVisible();
});
```
### 3. **Custom Fixtures with Worker Scope**
```typescript

// Worker-scoped fixture - logs in once per parallel worker
export const test = base.extend({
  authenticatedPage: [async ({ browser }, use) => {
    // Login once, reuse across tests
    const page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await use(page);
  }, { scope: 'worker' }]
});
```
### 4. **Tag-Based Test Organization**
```typescript
test('@smoke @ui Login with valid credentials', async ({ loginPage }) => {
  // Runs with --grep @smoke or --grep @ui
});
```
### 5. **Multi-Environment Configuration**
```bash
# Run against different environments
TEST_ENV=dev npm test
TEST_ENV=qa npm test
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org))
- npm 8+ (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/playwright-interview-framework.git
cd playwright-interview-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Open HTML report
npm run report
```
## 🧪 Test Execution

### Basic Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Debug mode with Playwright Inspector |
| `npm run report` | Open HTML test report |

### Tag-Based Execution

| Command | Description |
|---------|-------------|
| `npm run test:smoke` | Critical path tests only (@smoke) |
| `npm run test:ui` | UI tests only (@ui) |
| `npm run test:api` | API tests only (@api) |
| `npm run test:regression` | Full regression suite (@regression) |

### Advanced Execution

```bash
# Run specific test file
npx playwright test tests/ui/login.spec.ts

# Run with tag combinations
npx playwright test --grep "@ui.*@smoke"     # UI smoke tests
npx playwright test --grep "@ui|@api"        # UI OR API tests
npx playwright test --grep-invert "@slow"    # Exclude slow tests

# Parallel execution
npx playwright test --workers=4              # Run with 4 workers
npx playwright test --workers=4 --grep @ui   # Parallel UI tests

# Sharding (for CI)
npx playwright test --shard=1/3              # Run first of 3 shards

# Production pattern (both)
npx playwright test --shard=1/3 --workers=4  # Total of 12 parallel test executions 4 on each CI runner

```

## 🌍 Environment Selection

```bash
# Run against specific environment
TEST_ENV=dev npm test
TEST_ENV=qa npm run test:smoke
TEST_ENV=staging npm run test:ui
```

## 🐛 Debugging

### Commands

Run Playwright Inspector to step through tests:
`npm run test:debug`

Open trace viewer for post-execution analysis:
`npx playwright show-trace trace.zip`

Run with visible browser:
`npm run test:headed`

### Artifacts on Failure

| Artifact | Location |
|----------|----------|
| Screenshots | debug-artifacts/screenshots/ |
| Videos | debug-artifacts/videos/ |
| Traces | test-results/ |
| HTML Report | playwright-report/ |

### Trace Viewer Features
- DOM snapshots at each action
- Network requests/responses
- Console logs
- Screenshots
- Performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The pipeline runs on:
- Push to `main` and `develop` branches
- Pull requests to `main`
- Daily at midnight
- Manual trigger

### Pipeline Stages

| Stage | Trigger | Purpose |
|-------|---------|---------|
| Lint | All runs | TypeScript + ESLint |
| Smoke | All runs | Critical path tests |
| UI Tests | After smoke | Chrome, Firefox, WebKit |
| API Tests | After smoke | Contract validation |
| Regression | Nightly/main | Full suite with sharding |
| Report | After all | Combined HTML report |

### Run Locally

`./scripts/run-ci-locally.sh`

### View Reports

Reports published to GitHub Pages:
`https://YOUR_USERNAME.github.io/playwright-interview-framework/test-reports/`

## ✅ Best Practices Implemented

| Practice | Implementation |
|----------|----------------|
| Accessibility-first locators | `page.getByRole()` over CSS selectors |
| Auto-waiting | Playwright's built-in wait mechanism |
| Test isolation | Fresh state per test via fixtures |
| Environment config | `.env` files for dev/qa/prod |
| Parallel execution | `fullyParallel: true` |
| Retry logic | `retries: 2` for flaky tests |
| Error artifacts | Screenshots, videos, traces on failure |
| Type safety | Full TypeScript implementation |
| CI/CD ready | GitHub Actions with sharding |

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Playwright | 1.40+ | Test automation framework |
| TypeScript | 5.0+ | Type safety |
| Node.js | 16+ | Runtime environment |
| GitHub Actions | - | CI/CD pipeline |
| dotenv | 16.0+ | Environment configuration |
| ESLint | 8.0+ | Code linting |
| Prettier | 3.0+ | Code formatting |