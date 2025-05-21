import { expect, Page, test } from '@playwright/test';
import path from 'path';
import { combineImagesVertically } from './combineImages';
import { compareScreenshots } from './imageComparer';
import { Routes } from '../helpers/appConstants';
import { HomePage } from '../pages/HomePage';

// Capture a screenshot of the error message block inside the newsletter form
export async function captureErrorScreenshot(page: Page, screenshotPath: string): Promise<void> {
    const locator = page.locator('form:has(label.hs-error-msg)');
    await expect(locator).toBeVisible();
    await locator.screenshot({ path: screenshotPath });
}

// Attach homepage, thank-you, and combined screenshots to the HTML report
export function attachScreenshots(label: string, paths: { homepage: string, thankyou: string, combined: string }): void {
    const getRelativePath = (p: string) => path.relative(process.cwd(), p);

    test.info().attach(`Homepage Screenshot - ${label}`, {
        path: getRelativePath(paths.homepage),
        contentType: 'image/png',
    });

    test.info().attach(`Thank-you Screenshot - ${label}`, {
        path: getRelativePath(paths.thankyou),
        contentType: 'image/png',
    });

    test.info().attach(`Combined Screenshot - ${label}`, {
        path: getRelativePath(paths.combined),
        contentType: 'image/png',
    });
}

// Perform full visual comparison between error messages on homepage and thank-you page
export async function runVisualErrorComparison(
    page: Page,
    input: string,
    dir: string,
    label: string
): Promise<void> {
    const homePage = new HomePage(page);

    // Define output paths for screenshots and comparison images
    const homepagePath = path.join(dir, 'homepage.png');
    const thankyouPath = path.join(dir, 'thankyou.png');
    const diffPath = path.join(dir, 'diff.png');
    const combinedPath = path.join(dir, 'combined.png');

    // Capture error on the homepage
    await homePage.open();
    await homePage.acceptCookiesIfVisible();
    await homePage.subscribeToNewsletter(input);
    await captureErrorScreenshot(page, homepagePath);

    // Capture error on the thank-you page
    await page.goto(Routes.THANK_YOU);
    await homePage.acceptCookiesIfVisible();
    await homePage.subscribeToNewsletter(input);
    await captureErrorScreenshot(page, thankyouPath);

    // Combine both screenshots into a single vertical image
    await combineImagesVertically(homepagePath, thankyouPath, combinedPath);

    // Attach all screenshots to the test report
    attachScreenshots(label, { homepage: homepagePath, thankyou: thankyouPath, combined: combinedPath });

    // Compare screenshots to confirm visual difference exists
    const isDifferent = await compareScreenshots(homepagePath, thankyouPath, diffPath);
    expect(isDifferent, `Expected visual difference for ${label}`).toBe(true);
}