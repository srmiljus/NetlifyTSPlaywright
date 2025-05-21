import { test, expect } from '@playwright/test';

// Test suite to verify that no broken (404) links exist on the homepage
test.describe('404 Link Verification - TC3', () => {

  // TC3-001: Ensure all anchor links on the homepage return a valid (non-404) response
  test('TC3-001: verify that no links on the homepage return 404 status', async ({ page, request }) => {
    // Step 1: Navigate to the homepage
    await page.goto('/');

    // Step 2: Extract all unique href values from anchor elements
    const links = await page.$$eval('a[href]', anchors =>
      anchors.map(a => (a as HTMLAnchorElement).href)
    );
    const uniqueLinks = [...new Set(links)];

    // Step 3: Check each link and track 404 responses
    const brokenLinks: string[] = [];

    for (const url of uniqueLinks) {
      // Skip mailto, tel, javascript, and hash links
      if (
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        url.startsWith('javascript:') ||
        url.includes('#')
      ) {
        continue;
      }

      // Send HTTP request and check the response status
      const response = await request.get(url);
      if (response.status() === 404) {
        brokenLinks.push(`${url} - Status: 404`);
      }
    }

    // Step 4: Assert that no broken links are present
    expect(brokenLinks, `Broken links:\n${brokenLinks.join('\n')}`).toEqual([]);
  });
});