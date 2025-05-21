import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ThanksSigningUpPage } from '../pages/ThanksSigningUpPage';
import { generateRandomEmail } from '../utils/emailGenerator';
import { TestData } from '../helpers/appConstants';

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
    // Generate a random email (e.g., jenny1234@gmail.com)
    const randomEmail = generateRandomEmail();

    // Submit the form and validate successful redirection
    await homePage.subscribeToNewsletter(randomEmail);
    await thanksPage.expectThankYouMessageVisible();
  });

  // TC1-003: Submit empty email and verify required field error appears
  test('TC1-003: empty email shows required field error', async () => {
    // Pre-condition: error not visible before interaction
    await homePage.expectRequiredFieldErrorNotVisible();

    // Submit the form without entering email
    await homePage.subscribeToNewsletter('');

    // Post-condition: stay on same page and error appears
    await homePage.assertNotRedirectedToThankYou();
    await homePage.expectRequiredFieldErrorVisible();
  });

  // TC1-004: Submit invalid email and verify validation error appears and no redirect occurs
  test('TC1-004: invalid email shows validation error', async () => {
    // Pre-condition: error not visible initially
    await homePage.expectInvalidEmailErrorNotVisible();

    // Submit the form with invalid email
    await homePage.subscribeToNewsletter(TestData.INVALID_EMAIL);

    // Post-condition: no redirect and error becomes visible
    await homePage.assertNotRedirectedToThankYou();
    await homePage.expectInvalidEmailErrorVisible();
  });
});