import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Compare two PNG screenshots and generate a diff image; return true if they differ
export async function compareScreenshots(img1Path: string, img2Path: string, diffPath: string): Promise<boolean> {
  // Read the first image from disk
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));

  // Read the second image from disk
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  // Check if image dimensions match
  if (img1.width !== img2.width || img1.height !== img2.height) {
    console.log(`Image size mismatch: ${img1.width}x${img1.height} vs ${img2.width}x${img2.height}`);
    return false;
  }

  // Create a new image buffer to store the pixel differences
  const diff = new PNG({ width: img1.width, height: img1.height });

  // Compare images pixel by pixel using pixelmatch
  const pixelDiff = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.1 });

  // Save the diff image to disk
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`Form diff saved at: ${diffPath}`);

  // Return true if there are visual differences
  return pixelDiff > 0;
}