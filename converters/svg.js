import { loadImageFromBlob } from './image.js';

export async function svgToPng(svgFile, fallbackWidth = 800, fallbackHeight = 600) {
  const svgText = await svgFile.text();
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
  const img = await loadImageFromBlob(svgBlob);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || fallbackWidth;
  canvas.height = img.naturalHeight || img.height || fallbackHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const blobOut = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1));
  if (!blobOut) throw new Error('Failed to render SVG');
  return blobOut;
}

