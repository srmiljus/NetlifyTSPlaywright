import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object Model for the homepage, extends BasePage with newsletter-specific actions
export class HomePage extends BasePage {
  private readonly acceptCookiesButton: Locator;
  private readonly newsletterEmailInput: Locator;
  private readonly newsletterSubmitButton: Locator;
  private readonly requiredFieldError: Locator;
  private readonly invalidEmailError: Locator;

  constructor(page: Page) {
    super(page);

    // Locator for cookie consent button
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All' });

    // Locators for the newsletter form
    this.newsletterEmailInput = page.getByRole('textbox', { name: 'Email*' });
    this.newsletterSubmitButton = page.getByRole('button', { name: 'Subscribe' });

    // Locators for validation error messages
    this.requiredFieldError = page.locator('label.hs-error-msg', { hasText: 'Please complete this required field.' }).first();
    this.invalidEmailError = page.locator('label.hs-error-msg', { hasText: 'Email must be formatted correctly.' }).first();
  }

  // Navigate to the homepage
  async open(): Promise<void> {
    await this.page.goto('/');
  }

  // Accept cookies if the banner is visible
  async acceptCookiesIfVisible(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible()) {
      await this.acceptCookiesButton.click();
      await expect(this.acceptCookiesButton).toBeHidden({ timeout: 5000 });
    }
  }

  // Verify that the newsletter form is displayed on the page
  async verifyNewsletterFormIsVisible(): Promise<void> {
    await expect(this.newsletterEmailInput).toBeVisible();
    await expect(this.newsletterSubmitButton).toBeVisible();
  }

  // Fill in the email and submit the newsletter form
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.newsletterEmailInput.click();
    await this.newsletterEmailInput.fill(email);
    await this.newsletterSubmitButton.click();
  }

  // Assert that the required field validation message is visible and correctly rendered
  async expectRequiredFieldErrorVisible(): Promise<void> {
    expect(await this.requiredFieldError.isVisible(), 'Required field error must be visible').toBe(true);

    const box = await this.requiredFieldError.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);

    const text = await this.requiredFieldError.innerText();
    expect(text.trim()).toBe('Please complete this required field.');
  }

  async expectInvalidEmailErrorNotVisible(): Promise<void> {
    await expect(this.invalidEmailError).toBeHidden();
  }

  // Assert that the required field validation message is NOT visible before interaction
  async expectRequiredFieldErrorNotVisible(): Promise<void> {
    await expect(this.requiredFieldError).toBeHidden();
  }

  // Assert that the invalid email format error is visible and correctly rendered
  async expectInvalidEmailErrorVisible(): Promise<void> {
    expect(await this.invalidEmailError.isVisible(), 'Invalid email error must be visible').toBe(true);

    const box = await this.invalidEmailError.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);

    const text = await this.invalidEmailError.innerText();
    expect(text.trim()).toBe('Email must be formatted correctly.');
  }
}