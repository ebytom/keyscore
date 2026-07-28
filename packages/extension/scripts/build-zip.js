#!/usr/bin/env node

/**
 * Build script to create a downloadable ZIP of the Chrome extension
 * Outputs to packages/web/public/extension/keyscore-extension.zip
 */

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __dirname = dirname(fileURLToPath(import.meta.url));
const extensionDir = join(__dirname, '..');
const outputDir = join(__dirname, '../../web/public/extension');
const outputFile = join(outputDir, 'keyscore-extension.zip');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Create a write stream
const output = createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for close
output.on('close', () => {
  const sizeKB = (archive.pointer() / 1024).toFixed(2);
  console.log(`✅ Extension packaged successfully!`);
  console.log(`   📦 ${outputFile}`);
  console.log(`   📊 Size: ${sizeKB} KB`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err.message);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive to the file
archive.pipe(output);

// Add extension files
const filesToInclude = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.js',
  'README.md',
];

const dirsToInclude = [
  'content-scripts',
  'icons',
];

// Add individual files
filesToInclude.forEach(file => {
  const filePath = join(extensionDir, file);
  if (existsSync(filePath)) {
    archive.file(filePath, { name: file });
  }
});

// Add directories
dirsToInclude.forEach(dir => {
  const dirPath = join(extensionDir, dir);
  if (existsSync(dirPath)) {
    archive.directory(dirPath, dir);
  }
});

// Finalize the archive
archive.finalize();
