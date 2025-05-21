import { Page, expect, Locator } from '@playwright/test';
import { Routes } from '../helpers/appConstants';

// Base class that provides reusable UI interaction methods for all pages
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the specified URL (currently defaults to home '/')
  async goto(url: string) {
    await this.page.goto('/');
  }

  // Click on a given element using string selector or Locator
  async click(locator: string | Locator) {
    if (typeof locator === 'string') {
      await this.page.click(locator);
    } else {
      await locator.click();
    }
  }

  // Fill text into an input field using string selector or Locator
  async type(locator: string | Locator, text: string) {
    if (typeof locator === 'string') {
      await this.page.fill(locator, text);
    } else {
      await locator.fill(text);
    }
  }

  // Check if an element is visible (using string or Locator)
  async isVisible(locator: string | Locator) {
    if (typeof locator === 'string') {
      return this.page.isVisible(locator);
    } else {
      return locator.isVisible();
    }
  }

  // Wait until the current URL contains a specific fragment
  async waitForURLContains(fragment: string) {
    await this.page.waitForURL(`**${fragment}**`);
  }

  // Assert that the current URL contains a specific fragment using regex
  async expectURLtoContain(fragment: string) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  // Assert that the current URL does NOT contain the "thank you" page path
  async assertNotRedirectedToThankYou(): Promise<void> {
    await expect(this.page).not.toHaveURL(new RegExp(Routes.THANK_YOU, 'i'));
  }
}