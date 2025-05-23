# 🎭 NetlifyTSPlaywright Test Suite

This repository contains an end-to-end automated test suite written in **Playwright** with **TypeScript**.
The suite validates key user-facing functionality on the [Netlify website](https://www.netlify.com), including:
- Newsletter form validation
- Sitemap and SEO checks
- Broken link (404) detection
- Pixel-by-pixel **visual validation** of error messages
- **Computed style comparison** of validation blocks (e.g., hidden vs. visible error messages)

All tests are fully integrated with **GitHub Actions CI**, and each pipeline run generates an HTML test report.

---

## ✨ Deliverables

- ✅ A complete Playwright test suite hosted in a public GitHub repository
- ✅ A comprehensive `README.md` with:
  - Setup instructions
  - Test execution instructions
  - Brief explanation of the testing approach
  - Assumptions and limitations
- ✅ A Playwright HTML report (generated locally and published via CI)
- ✅ GitHub Actions integration for automated test execution and reporting

---

## ⚙️ Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/srmiljus/NetlifyTSPlaywright
   cd NetlifyTSPlaywright
   ```

2. **Install dependencies**  
   ```bash
   npm ci
   ```

3. **Install Playwright browsers**  
   ```bash
   npx playwright install --with-deps
   ```

---

## ▶️ Test Execution Instructions

- **Run all tests (locally)**  
  ```bash
  npx playwright test
  ```

- **Run only non-visual (functional) tests**  
  ```bash
  npx playwright test --grep-invert @visual
  ```

- **Run only visual tests**  
  ```bash
  npx playwright test --grep @visual
  ```

- **Show the latest HTML test report locally**  
  ```bash
  npx playwright show-report html-report
  ```

---

## 💡 Approach Explanation

This test suite uses:

	•	✅ Functional validation of the newsletter subscription form (valid, invalid, and empty email inputs)
	•	✅ SEO and sitemap checks to ensure key pages are indexed and crawlable
	•	✅ Broken link detection, verifying no anchor links return 404 status
	•	✅ Pixel-by-pixel visual comparison of validation messages using pixelmatch + sharp
	•	✅ Computed style comparison of validation blocks (e.g., ensuring error messages are present in DOM but hidden via CSS when expected)
	•	✅ Tag-based test grouping (e.g., @visual, @seo) for modular execution in CI pipelines
	•	✅ Clean Page Object Model (POM) structure with reusable methods and locators

---

## ⚠️ Assumptions & Limitations

- Visual comparison assumes consistent UI layout – minor UI shifts may fail tests
- Only desktop Chromium, Firefox, and WebKit are tested
- Mobile or responsive views are currently excluded
- Sitemap test checks the first 10 URLs to balance speed and coverage

---

## 🤖 CI/CD Integration

This project includes full **GitHub Actions** CI integration:

	•	✅ Runs on every push or pull request to main or master
	•	✅ Supports manual test selection via GitHub Actions (Run workflow):
→ run all tests, non-visual only, or visual-only based on tag
	•	✅ Automatically installs dependencies and Playwright browsers
	•	✅ Publishes Playwright HTML report as an artifact after each run

> Workflow file: `.github/workflows/playwright.yml`

---

## 📊 Test Report

The Playwright HTML report is:

- Automatically generated after every test run
- Published as an artifact in GitHub Actions
- Viewable locally by running:
  ```bash
  npx playwright show-report
  ```

---

## 🛠 Tech Stack

- [Playwright](https://playwright.dev/) - v1.52.0
- TypeScript - v5.8.3
- Node.js - v20.x
- GitHub Actions - CI/CD integration
- HTML Reporting - Playwright HTML report
- Visual comparison using [`pixelmatch`](https://github.com/mapbox/pixelmatch) and [`sharp`](https://github.com/lovell/sharp)

---

## 📁 Folder Structure

```
NetlifyTSPlaywright/
│
├── .github/workflows/         # GitHub Actions workflow config
├── helpers/                   # Constants and sitemap parsing
├── html-report/               # HTML test report (ignored via .gitignore)
├── pages/                     # Page Object Models (e.g. HomePage, ThanksPage)
├── tests/                     # All test specs (functional, visual, SEO)
├── utils/                     # Custom visual testing tools
├── playwright.config.ts       # Playwright configuration
└── README.md                  # This documentation file
```
