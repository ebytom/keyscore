#!/usr/bin/env node

/**
 * Generate PNG icons for the Chrome extension
 * Run: node scripts/generate-icons.js
 *
 * Creates icon16.png, icon32.png, icon48.png, icon128.png in ../icons/
 */

const fs = require('fs');
const path = require('path');

// Simple PNG generator using raw bytes (no dependencies)
// Creates a gradient purple icon with a checkmark

function createPNG(size) {
  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = createIHDR(size, size);

  // IDAT chunk (image data)
  const idat = createIDAT(size);

  // IEND chunk
  const iend = createIEND();

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createIHDR(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data.writeUInt8(8, 8);  // bit depth
  data.writeUInt8(6, 9);  // color type (RGBA)
  data.writeUInt8(0, 10); // compression
  data.writeUInt8(0, 11); // filter
  data.writeUInt8(0, 12); // interlace

  return createChunk('IHDR', data);
}

function createIDAT(size) {
  const zlib = require('zlib');

  // Create RGBA pixel data with filter bytes
  const rowSize = size * 4 + 1; // 4 bytes per pixel + 1 filter byte
  const rawData = Buffer.alloc(rowSize * size);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // No filter

    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const pixel = getPixel(x, y, size);
      rawData[pixelOffset] = pixel.r;
      rawData[pixelOffset + 1] = pixel.g;
      rawData[pixelOffset + 2] = pixel.b;
      rawData[pixelOffset + 3] = pixel.a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  return createChunk('IDAT', compressed);
}

function createIEND() {
  return createChunk('IEND', Buffer.alloc(0));
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 lookup table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getPixel(x, y, size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 1;
  const cornerRadius = size * 0.2;

  // Check if inside rounded rectangle
  const inRect = isInRoundedRect(x, y, 0, 0, size, size, cornerRadius);

  if (!inRect) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // Gradient from top-left (#6366f1) to bottom-right (#8b5cf6)
  const t = (x + y) / (size * 2);
  const r = Math.round(99 + (139 - 99) * t);   // 99 -> 139
  const g = Math.round(102 + (92 - 102) * t);  // 102 -> 92
  const b = Math.round(241 + (246 - 241) * t); // 241 -> 246

  // Draw checkmark
  const checkScale = size / 16;
  const checkStartX = 4 * checkScale;
  const checkMidX = 6.5 * checkScale;
  const checkEndX = 12 * checkScale;
  const checkStartY = 8 * checkScale;
  const checkMidY = 10.5 * checkScale;
  const checkEndY = 5 * checkScale;
  const strokeWidth = Math.max(1.5, size / 10);

  // Check if point is on checkmark path
  const onCheck = isOnLine(x, y, checkStartX, checkStartY, checkMidX, checkMidY, strokeWidth) ||
                  isOnLine(x, y, checkMidX, checkMidY, checkEndX, checkEndY, strokeWidth);

  if (onCheck) {
    return { r: 255, g: 255, b: 255, a: 255 };
  }

  return { r, g, b, a: 255 };
}

function isInRoundedRect(x, y, rx, ry, rw, rh, radius) {
  // Check corners
  if (x < rx + radius && y < ry + radius) {
    return distance(x, y, rx + radius, ry + radius) <= radius;
  }
  if (x > rx + rw - radius && y < ry + radius) {
    return distance(x, y, rx + rw - radius, ry + radius) <= radius;
  }
  if (x < rx + radius && y > ry + rh - radius) {
    return distance(x, y, rx + radius, ry + rh - radius) <= radius;
  }
  if (x > rx + rw - radius && y > ry + rh - radius) {
    return distance(x, y, rx + rw - radius, ry + rh - radius) <= radius;
  }

  return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function isOnLine(px, py, x1, y1, x2, y2, width) {
  const lineLen = distance(x1, y1, x2, y2);
  if (lineLen === 0) return distance(px, py, x1, y1) <= width / 2;

  const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / (lineLen * lineLen)));
  const nearX = x1 + t * (x2 - x1);
  const nearY = y1 + t * (y2 - y1);

  return distance(px, py, nearX, nearY) <= width / 2;
}

// Generate icons
const iconsDir = path.join(__dirname, '..', 'icons');
const sizes = [16, 32, 48, 128];

console.log('Generating extension icons...');

sizes.forEach(size => {
  const png = createPNG(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`  ✓ Created ${filePath}`);
});

console.log('Done!');
