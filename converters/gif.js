import { loadImageFromBlob } from './image.js';

async function canvasFromImageBlob(blob) {
  const img = await loadImageFromBlob(blob);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export async function gifToPng(gifBlob) {
  const canvas = await canvasFromImageBlob(gifBlob);
  const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1));
  if (!out) throw new Error('Failed to convert GIF to PNG');
  return out;
}

export async function gifToWebp(gifBlob, quality = 0.9) {
  const canvas = await canvasFromImageBlob(gifBlob);
  const out = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (!out) throw new Error('Failed to convert GIF to WebP');
  return out;
}

