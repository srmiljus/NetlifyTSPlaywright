import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object Model for the "Thank You" page shown after newsletter subscription
export class ThanksSigningUpPage extends BasePage {
  private readonly thankYouHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Locator for the confirmation heading element
    this.thankYouHeading = page.getByRole('heading', { name: 'Thank you for signing up!' });
  }

  // Assert that the thank-you message is visible on the page
  async expectThankYouMessageVisible(): Promise<void> {
    await expect(this.thankYouHeading).toBeVisible();
  }
}