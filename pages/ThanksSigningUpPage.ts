import { Locator, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Page Object Model for the "Thank You" page shown after newsletter subscription
export class ThanksSigningUpPage extends BasePage {
  private readonly thankYouHeading: Locator;
  private readonly requiredFieldError: Locator;
  private readonly invalidEmailError: Locator;

  constructor(page: Page) {
    super(page);

    // Locator for the thank-you confirmation heading
    this.thankYouHeading = page.getByRole('heading', { name: 'Thank you for signing up!' });

    // Locator for the required field error message (when email is empty)
    this.requiredFieldError = page.locator('label.hs-error-msg', {
      hasText: 'Please complete this required field.',
    }).first();

    // Locator for the invalid email format error message
    this.invalidEmailError = page.locator('label.hs-error-msg', {
      hasText: 'Email must be formatted correctly.',
    }).first();
  }

  // Validates that the thank-you message heading is visible on the page
  async expectThankYouMessageVisible(): Promise<void> {
    await expect(this.thankYouHeading).toBeVisible();
  }

  // Retrieves computed CSS styles of the "required field" error element
  async getRequiredFieldErrorStyles(): Promise<Record<string, string>> {
    return await this.getErrorMessageStyles(this.requiredFieldError);
  }

  // Retrieves computed CSS styles of the "invalid email" error element
  async getInvalidEmailErrorStyles(): Promise<Record<string, string>> {
    return await this.getErrorMessageStyles(this.invalidEmailError);
  }

  // Helper method to extract relevant computed styles for any error element
  private async getErrorMessageStyles(locator: Locator): Promise<Record<string, string>> {
    return await this.page.evaluate((el) => {
      if (!el) {
        throw new Error('Element handle is null');
      }
      const cs = window.getComputedStyle(el);
      return {
        clip: cs.getPropertyValue('clip'),                   // Clipping region of the element
        clipPath: cs.getPropertyValue('clip-path'),          // Advanced clipping path used to visually hide elements
        width: cs.getPropertyValue('width'),                 // Width of the element
        height: cs.getPropertyValue('height'),               // Height of the element
        overflow: cs.getPropertyValue('overflow'),           // Overflow behavior (e.g., hidden content)
        position: cs.getPropertyValue('position'),           // CSS positioning (e.g., absolute, relative)
        visibility: cs.getPropertyValue('visibility'),       // Visibility state (visible, hidden)
        display: cs.getPropertyValue('display'),             // Display mode (none, block, etc.)
      };
    }, await locator.elementHandle());
  }
}