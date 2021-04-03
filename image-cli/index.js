#!/usr/bin/env node

/* eslint-disable no-console */

// @ts-check

/**
 * Prereq for using the script:
 *   Install imagemagick: https://imagemagick.org/script/download.php
 *
 * Usage:
 * ./image-cli.js [command] [basePath]
 *
 * Commands:
 * - transform: resize and optimize all images inside basePath
 * - check-size: ensure that all images inside basePath are smaller than 20KB.
 */

const {
  readdirSync,
  mkdirSync,
  rmdirSync,
  unlinkSync,
  statSync
} = require('fs');
const { join, extname, normalize } = require('path');

const sharp = require('sharp');
const compressImages = require('compress-images');

/**
 * @param {string} basePath
 * @returns {string[]}
 */
const imagePaths = (basePath) =>
  readdirSync(basePath).filter(
    (filename) =>
      extname(filename) === '.jpg' ||
      extname(filename) === '.jpeg' ||
      extname(filename) === '.png'
  );

/**
 * @param {number} height
 * @param {string} source
 * @param {string} output
 * @returns {Promise<void>}
 */
const resizeImage = (height, source, output) =>
  new Promise((resolve, reject) => {
    sharp(source)
      .resize({ height })
      .toFile(output, (error) => {
        if (error) {
          reject(error.message);
        } else {
          console.log(`Sucessfully resized ${source} to height ${height}px!`);
          resolve();
        }
      });
  });

/**
 * @param {string} baseDirectory
 * @param {string} outputDirectory
 * @returns {Promise<void>}
 */
const optimizeImages = (baseDirectory, outputDirectory) => {
  // Turn `\` back into `/` for windows compatibility.
  const sources = normalize(join(baseDirectory, '/*.{jpg,jpeg,png}')).replace(
    /\\/g,
    '/'
  );
  return new Promise((resolve, reject) => {
    compressImages(
      sources,
      outputDirectory,
      { compress_force: false, statistic: false, autoupdate: true },
      false,
      { jpg: { engine: 'mozjpeg', command: ['-quality', '75', '-optimize'] } },
      {
        png: {
          engine: 'pngquant',
          command: ['--quality', '70-80', '--speed', '1']
        }
      },
      { svg: { engine: false, command: false } },
      { gif: { engine: false, command: false } },
      (error, completed) => {
        if (error) {
          reject(error);
          return;
        }
        if (completed) {
          console.log(`Successfully optimized all images in ${baseDirectory}`);
          resolve();
        }
      }
    );
  });
};

/**
 * @param {string} source
 * @returns {number}
 */
const getSizeInKB = (source) => Math.ceil(statSync(source).size / 1024);

/**
 * @param {string} basePath
 * @param {string} outputPath
 * @param {boolean} noResize
 * @returns {Promise<void>}
 */
const transformForAll = async (basePath, outputPath, noResize) => {
  if (noResize) {
    await optimizeImages(basePath, outputPath);
    return;
  }
  const resizeOutputDirectory = normalize(join(outputPath, 'temp'));
  const images = imagePaths(basePath);
  mkdirSync(resizeOutputDirectory, { recursive: true });
  await Promise.all(
    images.map((it) =>
      resizeImage(500, join(basePath, it), join(resizeOutputDirectory, it))
    )
  );
  await optimizeImages(resizeOutputDirectory, outputPath);
  images.forEach((it) => unlinkSync(join(resizeOutputDirectory, it)));
  rmdirSync(resizeOutputDirectory);
};

/**
 * @param {string} basePath
 * @param {number} maxSize
 * @returns {void}
 */
const checkMaxSizeForAll = (basePath, maxSize) => {
  const violators = imagePaths(basePath)
    .map((it) => join(basePath, it))
    .filter((it) => getSizeInKB(it) > maxSize);
  if (violators.length === 0) {
    console.log(
      `All images' sizes are within the maximum allowed range (${maxSize}KB).`
    );
    return;
  }
  console.error(
    `These images are too big. Maybe you forget to transform them.`
  );
  console.error(`Max allowed: ${maxSize}KB.`);
  console.group();
  violators.forEach((it) => console.error(it));
  console.groupEnd();
  process.exit(1);
};

/** @returns {Promise<void>} */
const main = async () => {
  const cliArguments = process.argv;
  const command = cliArguments[2];
  const basePath = cliArguments[3];
  switch (command) {
    case 'transform':
      await transformForAll(
        normalize(basePath),
        normalize(join(basePath, 'build/')),
        cliArguments[4] === '--no-resize'
      );
      return;
    case 'check-size':
      checkMaxSizeForAll(
        normalize(basePath),
        parseFloat(cliArguments[4] || '20')
      );
      return;
    default:
      console.error(`Unknown command: ${cliArguments.slice(2).join(' ')}`);
      process.exit(2);
  }
};

main();
