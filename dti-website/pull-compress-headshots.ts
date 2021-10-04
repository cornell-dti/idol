#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { join } from 'path';

import fetch from 'node-fetch';
import fs from 'fs-extra';

const HEADSHOT_TEMP = 'headshot_tmp';

async function getMemberImages() {
  const { images } = await fetch(
    'https://idol.cornelldti.org/.netlify/functions/api/allMemberImages'
  ).then((response) => response.json() as Promise<{ images: readonly ProfileImage[] }>);
  return images;
}

async function downloadFile(image: ProfileImage) {
  const { fileName } = image;
  const filePath = join(HEADSHOT_TEMP, fileName);
  const response = await fetch(image.url);
  const buffer = await response.buffer();
  await fs.outputFile(filePath, buffer);
}

async function downloadAllImages(): Promise<void> {
  await fs.mkdir(HEADSHOT_TEMP, { recursive: true });
  await fs.emptyDir(HEADSHOT_TEMP);
  const memberImages = await getMemberImages();
  await Promise.all(memberImages.map(downloadFile));
}

async function main(): Promise<void> {
  await downloadAllImages();
  spawnSync('yarn', ['image-cli', 'transform', 'headshot_tmp'], {
    stdio: 'inherit',
    shell: true
  });
  const buildPath = join(HEADSHOT_TEMP, 'build');
  await Promise.all(
    fs
      .readdirSync(buildPath)
      .map((filename) =>
        fs.copyFile(join(buildPath, filename), join('public', 'static', 'members', filename))
      )
  );
  await fs.emptyDir(HEADSHOT_TEMP);
  await fs.remove(HEADSHOT_TEMP);
}

main();
