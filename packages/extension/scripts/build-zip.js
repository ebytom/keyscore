#!/usr/bin/env node

/**
 * Build script to create a downloadable ZIP of the Chrome extension
 * Outputs to packages/web/public/extension/keyscore-extension.zip
 *
 * Supports build-time URL replacement via environment variables:
 * - VITE_API_URL: API server URL (default: http://localhost:4000)
 * - VITE_APP_URL: Web app URL (default: http://localhost:3000)
 */

import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { config } from 'dotenv';

// Load env from monorepo root
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../../..');
config({ path: join(rootDir, '.env.local') });
config({ path: join(rootDir, '.env') });

const extensionDir = join(__dirname, '..');
const outputDir = join(__dirname, '../../web/public/extension');
const outputFile = join(outputDir, 'keyscore-extension.zip');
const tempDir = join(__dirname, '../.build-temp');

// Get URLs from env or use defaults
const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';
const APP_URL = process.env.VITE_APP_URL || 'http://localhost:3000';

console.log(`🔧 Building extension with:`);
console.log(`   API_URL: ${API_URL}`);
console.log(`   APP_URL: ${APP_URL}`);

// Clean and create temp directory
if (existsSync(tempDir)) {
  rmSync(tempDir, { recursive: true });
}
mkdirSync(tempDir, { recursive: true });

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Files that need URL replacement
const filesToProcess = ['popup.js', 'background.js', 'popup.html', 'manifest.json'];

// Files to copy as-is
const filesToCopy = ['README.md'];

// Directories to copy
const dirsToInclude = ['content-scripts', 'icons'];

// Process files with URL replacement
filesToProcess.forEach(file => {
  const srcPath = join(extensionDir, file);
  if (existsSync(srcPath)) {
    let content = readFileSync(srcPath, 'utf-8');

    // Replace localhost URLs with production URLs
    content = content.replace(/http:\/\/localhost:4000/g, API_URL);
    content = content.replace(/http:\/\/localhost:3000/g, APP_URL);

    writeFileSync(join(tempDir, file), content);
  }
});

// Copy files that don't need processing
filesToCopy.forEach(file => {
  const srcPath = join(extensionDir, file);
  if (existsSync(srcPath)) {
    cpSync(srcPath, join(tempDir, file));
  }
});

// Copy directories
dirsToInclude.forEach(dir => {
  const srcPath = join(extensionDir, dir);
  if (existsSync(srcPath)) {
    cpSync(srcPath, join(tempDir, dir), { recursive: true });
  }
});

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

  // Clean up temp directory
  rmSync(tempDir, { recursive: true });
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

// Add all files from temp directory
archive.directory(tempDir, false);

// Finalize the archive
archive.finalize();
