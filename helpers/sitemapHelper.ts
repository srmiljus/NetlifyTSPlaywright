import { APIRequestContext } from '@playwright/test';
import { parseStringPromise } from 'xml2js';
import { SitemapUrl } from './seoConstants';

// Fetch and parse sitemap.xml, return a list of up to `limit` page URLs
export async function getSitemapUrls(
  request: APIRequestContext,
  limit = 10
): Promise<string[]> {
  // Send GET request to sitemap.xml endpoint
  const response = await request.get(SitemapUrl);

  // Throw an error if sitemap is not found (non-200 response)
  if (response.status() !== 200) {
    throw new Error(`sitemap.xml not found. Status: ${response.status()}`);
  }

  // Get raw XML response as string
  const xml = await response.text();

  // Parse XML into JavaScript object
  const parsed = await parseStringPromise(xml);

  // Extract and return list of URLs (limited to given count)
  return parsed.urlset.url.map((entry: any) => entry.loc[0]).slice(0, limit);
}