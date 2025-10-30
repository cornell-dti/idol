/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { allMemberImages } from '../src/API/imageAPI';

const RESIZE_HEIGHT = 500; // Standard height for resizing
const OUTPUT_FOLDER = 'temp';
const MAX_SIZE_KB = 300;

const main = async () => {
  console.log('Downloading and processing all member images...');
  const processedImages = await allMemberImages();

  const imageProcessingList = processedImages.map((image) => {
    const fullPath = join(OUTPUT_FOLDER, image.fileName);
    return downloadAndProcessImage(image.url, fullPath)
      .then(() => console.log(`Processing complete for ${image.fileName}`))
      .catch((error) => console.error('Processing failed:', error));
  });

  await Promise.all(imageProcessingList);
};

async function downloadAndProcessImage(url: string, outputPath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const bufferSize = Buffer.byteLength(imageBuffer) / 1024; // Convert to KB

    if (bufferSize <= MAX_SIZE_KB) {
      await writeFile(outputPath, Buffer.from(imageBuffer));
      console.log(`Image saved directly (size: ${bufferSize.toFixed(2)}KB): ${outputPath}`);
      return;
    }

    const processedImage = await sharp(Buffer.from(imageBuffer))
      .resize({ height: RESIZE_HEIGHT, withoutEnlargement: true })
      .jpeg({ quality: 100 })
      .toBuffer();

    const processedSize = processedImage.length / 1024;
    console.log(
      `Original size: ${bufferSize.toFixed(2)}KB, Processed size: ${processedSize.toFixed(2)}KB`
    );

    await writeFile(outputPath, processedImage);
    console.log(`Image processed and saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

main();
