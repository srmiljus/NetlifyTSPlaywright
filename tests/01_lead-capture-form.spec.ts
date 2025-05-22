import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ThanksSigningUpPage } from '../pages/ThanksSigningUpPage';
import { generateRandomEmail } from '../utils/emailGenerator';
import { Routes, TestData } from '../helpers/appConstants';

// Test suite for newsletter lead capture form (TC1)
test.describe('Lead Capture Form - TC1', () => {
  let homePage: HomePage;
  let thanksPage: ThanksSigningUpPage;

  // Setup: Initialize page objects and navigate to homepage before each test
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    thanksPage = new ThanksSigningUpPage(page);
    await homePage.open();
    await homePage.acceptCookiesIfVisible();
  });

  // TC1-001: Verify that the newsletter form is visible on the homepage
  test('TC1-001: newsletter form is visible on homepage', async () => {
    await homePage.verifyNewsletterFormIsVisible();
  });

  // TC1-002: Submit a valid email and verify thank-you message appears
  test('TC1-002: valid email submission shows success message', async () => {
    const randomEmail = generateRandomEmail();
    await homePage.subscribeToNewsletter(randomEmail);
    await thanksPage.expectThankYouMessageVisible();
  });

  // TC1-003: Submit empty email and verify no redirect occurs
  test('TC1-003: empty email shows required field error', async () => {
    await homePage.subscribeToNewsletter(TestData.EMPTY_EMAIL);
    await homePage.assertNotRedirectedToThankYou();
  });

  // TC1-004: Submit invalid email and verify no redirect occurs
  test('TC1-004: invalid email shows validation error', async () => {
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);
    await homePage.assertNotRedirectedToThankYou();
  });

  // TC1-005: Compare required field error between homepage and thank-you page
  test('TC1-005: Compare required field error styles between homepage and thank-you page', async ({ page }) => {
    await homePage.subscribeToNewsletter(TestData.EMPTY_EMAIL);
    // Capture styles from homepage while error is "hidden"
    const homepageStyles = await page.evaluate(() => {
      const el = document.querySelector('label.hs-error-msg');
      const cs = window.getComputedStyle(el!);
      return {
        display: cs.display,
        clip: cs.clip,
        clipPath: cs.clipPath,
        width: cs.width,
        height: cs.height,
      };
    });
    console.log('Homepage styles BEFORE navigation:', homepageStyles);

    // Go to thank-you page and trigger same error again
    await page.goto(Routes.THANK_YOU);
    await homePage.subscribeToNewsletter(TestData.EMPTY_EMAIL);

    // Capture styles from thank-you page while error is visible
    const thankYouStyles = await thanksPage.getRequiredFieldErrorStyles();
    console.log('Thank-you styles:', thankYouStyles);

    // Compare the styles
    expect(homepageStyles.clip).not.toBe(thankYouStyles.clip);
    expect(homepageStyles.clipPath).not.toBe(thankYouStyles.clipPath);
    expect(homepageStyles.width).not.toBe(thankYouStyles.width);
    expect(homepageStyles.height).not.toBe(thankYouStyles.height);
  });

  // TC1-006: Compare invalid email error between homepage and thank-you page
  test('TC1-006: Compare invalid email error styles between homepage and thank-you page', async ({ page }) => {
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);
    // Capture styles from homepage while error is "hidden"
    const homepageStyles = await page.evaluate(() => {
      const el = document.querySelector('label.hs-error-msg');
      const cs = window.getComputedStyle(el!);
      return {
        display: cs.display,
        clip: cs.clip,
        clipPath: cs.clipPath,
        width: cs.width,
        height: cs.height,
      };
    });
    console.log('Homepage styles BEFORE navigation:', homepageStyles);

    // Go to thank-you page and trigger same error again
    await page.goto(Routes.THANK_YOU);
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);

    // Capture styles from thank-you page while error is visible
    const thankYouStyles = await thanksPage.getInvalidEmailErrorStyles();
    console.log('Thank-you styles:', thankYouStyles);

    // Compare the styles
    expect(homepageStyles.clip).not.toBe(thankYouStyles.clip);
    expect(homepageStyles.clipPath).not.toBe(thankYouStyles.clipPath);
    expect(homepageStyles.width).not.toBe(thankYouStyles.width);
    expect(homepageStyles.height).not.toBe(thankYouStyles.height);
  });

});