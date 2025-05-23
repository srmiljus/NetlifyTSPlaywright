import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ThanksSigningUpPage } from './pages/ThanksSigningUpPage';

export const test = base.extend<{
  homePage: HomePage;
  thanksPage: ThanksSigningUpPage;
}>({
  homePage: async ({ page }, use) => {
    await page.goto('/'); 
    const homePage = new HomePage(page);
    await homePage.acceptCookiesIfVisible();
    await use(homePage);
  },

  thanksPage: async ({ page }, use) => {
    const thanksPage = new ThanksSigningUpPage(page);
    await use(thanksPage);
  },
});

export { expect } from '@playwright/test';