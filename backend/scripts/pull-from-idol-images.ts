/* eslint-disable no-console */
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { allMemberImages } from '../src/API/imageAPI';

const main = async () => {
  console.log('Downloading all member images...');
  const processedImages = await allMemberImages();

  const imageProcessingList = processedImages.map((image) => {
    const outputFolder = 'temp';

    const fullPath = join(outputFolder, image.fileName);

    return downloadImage(image.url, fullPath)
      .then(() => console.log('Download complete'))
      .catch((error) => console.error('Download failed:', error));
  });
  await Promise.all(imageProcessingList);
};

async function downloadImage(url: string, outputPath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    await writeFile(outputPath, Buffer.from(imageBuffer));

    console.log(`Image downloaded successfully to: ${outputPath}`);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

main();
