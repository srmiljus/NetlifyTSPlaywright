import { test, expect } from '@playwright/test';
import { getSitemapUrls } from '../helpers/sitemapHelper';
import {
  ImportantPaths,
  SitemapUrl,
  RobotsTxtUrl,
} from '../helpers/seoConstants';

// Test suite for sitemap.xml, robots.txt, and SEO meta validation (TC2)
test.describe('SEO Verification - TC2', () => {

  // TC2-001: Verify that sitemap.xml exists and returns 200
  test('TC2-001: sitemap.xml should exist', async ({ request }) => {
    const response = await request.get(SitemapUrl);
    expect(response.status()).toBe(200);
  });

  // TC2-002: Verify that all URLs in sitemap.xml are accessible (return status 200)
  test('TC2-002: URLs listed in sitemap.xml should be accessible (status 200)', async ({ request }) => {
    const urls = await getSitemapUrls(request, 10);

    for (const url of urls) {
      const res = await request.get(url);
      expect(res.status(), `Failed on URL: ${url}`).toBe(200);
    }
  });

  // TC2-003: Ensure important pages are not disallowed in robots.txt
  test('TC2-003: important pages should NOT be disallowed in robots.txt', async ({ request }) => {
    const res = await request.get(RobotsTxtUrl);
    const robotsTxt = await res.text();

    for (const path of ImportantPaths) {
      expect(robotsTxt).not.toContain(`Disallow: ${path}`);
    }
  });

  // TC2-004+: Ensure important pages do not contain <meta name="robots" content="noindex">
  ImportantPaths.forEach((path, index) => {
    test(`TC2-00${index + 4}: "${path}" should NOT have <meta name="robots" content="noindex">`, async ({ page }) => {
      // Navigate to the target page
      await page.goto(path);

      // Locate meta[name="robots"] if it exists
      const robotsMeta = await page.locator('meta[name="robots"]').first();

      // If meta tag is present, ensure it doesn't contain 'noindex'
      if (await robotsMeta.count()) {
        const content = await robotsMeta.getAttribute('content');
        expect(content?.toLowerCase()).not.toContain('noindex');
      }
    });
  });
});