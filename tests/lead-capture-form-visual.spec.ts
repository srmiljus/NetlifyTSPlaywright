import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { runVisualErrorComparison } from '../utils/visualUtils';

// Define screenshot output directories
const screenshotsDir = path.join(__dirname, '..', 'html-report', 'screenshots');
const invalidDir = path.join(screenshotsDir, 'invalidEmail');
const emptyDir = path.join(screenshotsDir, 'withoutEmail');

// Test suite for visual comparison of validation error blocks (TC1)
test.describe('Visual Comparison - TC1', () => {
  // Before all tests: clean and re-create screenshot folders
  test.beforeAll(() => {
    if (fs.existsSync(screenshotsDir)) {
      fs.rmSync(screenshotsDir, { recursive: true, force: true });
    }

    [screenshotsDir, invalidDir, emptyDir].forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
    });
  });

  // TC1-006: Compare invalid email error block on homepage vs. thank-you page
  test('TC1-006: compare invalid email error on homepage vs thank-you', async ({ page }) => {
    await runVisualErrorComparison(page, 'invalid-email', invalidDir, 'Invalid Email');
  });

  // TC1-007: Compare required field error block on homepage vs. thank-you page
  test('TC1-007: compare required field error on homepage vs thank-you', async ({ page }) => {
    await runVisualErrorComparison(page, '', emptyDir, 'Required Field');
  });
});