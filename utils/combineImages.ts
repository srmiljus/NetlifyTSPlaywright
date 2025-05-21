import sharp from 'sharp';
import fs from 'fs';

// Combine two images vertically and save the result to a new file
export async function combineImagesVertically(imagePath1: string, imagePath2: string, outputPath: string): Promise<void> {
  // Load both images using Sharp
  const image1 = sharp(imagePath1);
  const image2 = sharp(imagePath2);

  // Read image metadata to get original dimensions
  const [meta1, meta2] = await Promise.all([image1.metadata(), image2.metadata()]);

  // Calculate the maximum width of the two images
  const width = Math.max(meta1.width ?? 0, meta2.width ?? 0);

  // Resize both images to have the same width and get their buffers
  const buffer1 = await image1.resize({ width }).toBuffer();
  const buffer2 = await image2.resize({ width }).toBuffer();

  // Create a blank canvas large enough to hold both images stacked vertically
  const combined = await sharp({
    create: {
      width,
      height: (meta1.height ?? 0) + (meta2.height ?? 0),
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    // Overlay the two images onto the blank canvas
    .composite([
      { input: buffer1, top: 0, left: 0 },
      { input: buffer2, top: meta1.height ?? 0, left: 0 }
    ])
    .png()
    .toBuffer();

  // Write the combined image to disk
  fs.writeFileSync(outputPath, combined);
}