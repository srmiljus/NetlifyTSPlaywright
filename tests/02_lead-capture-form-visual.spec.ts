import { test } from '../fixtures';
import path from 'path';
import fs from 'fs';
import { runVisualErrorComparison } from '../utils/visualUtils';
import { TestData } from '../helpers/appConstants';

// Define screenshot output directories
const screenshotsDir = path.join(__dirname, '..', 'html-report', 'screenshots');
const invalidDir = path.join(screenshotsDir, 'invalidEmail');
const emptyDir = path.join(screenshotsDir, 'withoutEmail');

// Test suite for visual comparison of validation error blocks (TC1)
test.describe('Visual Comparison - TC1', () => {
  // Clean and prepare screenshot folders once before the test suite
  test.beforeAll(() => {
    if (fs.existsSync(screenshotsDir)) {
      fs.rmSync(screenshotsDir, { recursive: true, force: true });
    }

    [screenshotsDir, invalidDir, emptyDir].forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
    });
  });

  // TC1-007: Compare invalid email error block on homepage vs. thank-you page
  test('@visual TC1-007: compare invalid email error on homepage vs thank-you', async ({ page }) => {
    await runVisualErrorComparison(page, TestData.INVALID_EMAIL, invalidDir, 'Invalid Email');
  });

  // TC1-008: Compare required field error block on homepage vs. thank-you page
  test('@visual TC1-008: compare required field error on homepage vs thank-you', async ({ page }) => {
    await runVisualErrorComparison(page, TestData.EMPTY_EMAIL, emptyDir, 'Required Field');
  });
});