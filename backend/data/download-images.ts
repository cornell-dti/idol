#!/usr/bin/env node

import fetch from 'node-fetch';
import { ProfileImage } from '../src/DataTypes';

const fs = require('fs-extra');

const dirPath = './data/members/images/';

async function getMemberImages(): Promise<readonly ProfileImage[]> {
  const { images }: { images: readonly ProfileImage[] } = await fetch(
    'https://idol.cornelldti.org/.netlify/functions/api/allMemberImages'
  ).then((response) => response.json());
  return images;
}

async function downloadFile(image: ProfileImage) {
  const { fileName } = image;
  const filePath = dirPath + fileName;
  const response = await fetch(image.url);
  const buffer = await response.buffer();
  fs.writeFile(filePath, buffer);
}

async function main(): Promise<void> {
  fs.emptyDirSync(dirPath);
  const memberImages = await getMemberImages();
  memberImages.forEach((image) => {
    downloadFile(image);
  });
}

main();
