import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object Model for the homepage, extends BasePage with newsletter-specific actions
export class HomePage extends BasePage {
  private readonly acceptCookiesButton: Locator;
  private readonly newsletterEmailInput: Locator;
  private readonly newsletterSubmitButton: Locator;

  constructor(page: Page) {
    super(page);

    // Locator for cookie consent button
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All' });

    // Locators for the newsletter form input and submit button
    this.newsletterEmailInput = page.getByRole('textbox', { name: 'Email*' });
    this.newsletterSubmitButton = page.getByRole('button', { name: 'Subscribe' });
  }

  // Navigates to the homepage URL (root path)
  async open(): Promise<void> {
    await this.page.goto('/');
  }

  // Accepts the cookie consent banner if it is currently visible
  async acceptCookiesIfVisible(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible()) {
      await this.acceptCookiesButton.click();
      await expect(this.acceptCookiesButton).toBeHidden({ timeout: 5000 });
    }
  }

  // Verifies that the newsletter input field and subscribe button are visible
  async verifyNewsletterFormIsVisible(): Promise<void> {
    await expect(this.newsletterEmailInput).toBeVisible();
    await expect(this.newsletterSubmitButton).toBeVisible();
  }

  // Fills in the provided email into the input field and submits the form
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.newsletterEmailInput.click();
    await this.newsletterEmailInput.fill(email);
    await this.newsletterSubmitButton.click();
  }
} 