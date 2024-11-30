/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { allMemberImages, getWriteSignedURL } from '../src/API/imageAPI';

const RESIZE_HEIGHT = 500;
const OUTPUT_FOLDER = 'temp';
const MAX_SIZE_KB = 300;

const main = async () => {
  console.log('Downloading and processing all member images...');
  const processedImages = await allMemberImages();

  const imageProcessingList = processedImages.map((image) => {
    const fullPath = join(OUTPUT_FOLDER, image.fileName);
    return downloadAndProcessImage(image.url, fullPath, image.fileName)
      .then(() => console.log(`Processing complete for ${image.fileName}`))
      .catch((error) => console.error('Processing failed:', error));
  });

  await Promise.all(imageProcessingList);
};

async function uploadToBucket(buffer: Buffer, fileName: string): Promise<void> {
  const signedUrl = await getWriteSignedURL(fileName);
  
  const response = await fetch(signedUrl, {
    method: 'PUT',
    body: buffer,
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload compressed file ${fileName} to bucket: ${response.statusText}`);
  }
  
  console.log(`Successfully re-uploaded compressed file ${fileName} to bucket`);
}

async function downloadAndProcessImage(url: string, outputPath: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const bufferSize = Buffer.byteLength(imageBuffer) / 1024;

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

    await uploadToBucket(processedImage, fileName);
    await writeFile(outputPath, processedImage);
    console.log(`Image processed and saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

main();