import { test, expect } from '../fixtures';
import { generateRandomEmail } from '../utils/emailGenerator';
import { Routes, TestData } from '../helpers/appConstants';

// Test suite for newsletter lead capture form (TC1)
test.describe('Lead Capture Form - TC1', () => {

  // TC1-001: Verify that the newsletter form is visible on the homepage
  test('TC1-001: newsletter form is visible on homepage', async ({ homePage }) => {
    await homePage.verifyNewsletterFormIsVisible();
  });

  // TC1-002: Submit a valid email and verify thank-you message appears
  test('TC1-002: valid email submission shows success message', async ({ homePage, thanksPage }) => {
    const randomEmail = generateRandomEmail();
    await homePage.subscribeToNewsletter(randomEmail);
    await thanksPage.expectThankYouMessageVisible();
  });

  // TC1-003: Submit empty email and verify no redirect occurs
  test('TC1-003: empty email shows required field error', async ({ homePage }) => {
    await homePage.subscribeToNewsletter(TestData.EMPTY_EMAIL);
    await homePage.assertNotRedirectedToThankYou();
  });

  // TC1-004: Submit invalid email and verify no redirect occurs
  test('TC1-004: invalid email shows validation error', async ({ homePage }) => {
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);
    await homePage.assertNotRedirectedToThankYou();
  });

  // TC1-005: Compare required field error between homepage and thank-you page
  test('TC1-005: compare required field error styles between homepage and thank-you page', async ({ page, homePage, thanksPage }) => {
    await homePage.subscribeToNewsletter(TestData.EMPTY_EMAIL);

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

    await page.goto(Routes.THANK_YOU);
    await homePage.subscribeToNewsletter(TestData.EMPTY_EMAIL);

    const thankYouStyles = await thanksPage.getRequiredFieldErrorStyles();
    console.log('Thank-you styles:', thankYouStyles);

    expect(homepageStyles.clip).not.toBe(thankYouStyles.clip);
    expect(homepageStyles.clipPath).not.toBe(thankYouStyles.clipPath);
    expect(homepageStyles.width).not.toBe(thankYouStyles.width);
    expect(homepageStyles.height).not.toBe(thankYouStyles.height);
  });

  // TC1-006: Compare invalid email error between homepage and thank-you page
  test('TC1-006: compare invalid email error styles between homepage and thank-you page', async ({ page, homePage, thanksPage }) => {
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);

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

    await page.goto(Routes.THANK_YOU);
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);

    const thankYouStyles = await thanksPage.getInvalidEmailErrorStyles();
    console.log('Thank-you styles:', thankYouStyles);

    expect(homepageStyles.clip).not.toBe(thankYouStyles.clip);
    expect(homepageStyles.clipPath).not.toBe(thankYouStyles.clipPath);
    expect(homepageStyles.width).not.toBe(thankYouStyles.width);
    expect(homepageStyles.height).not.toBe(thankYouStyles.height);
  });

});