export function isAvifSupported() {
  const img = document.createElement('img');
  return 'avif' in img || (() => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/avif').startsWith('data:image/avif');
  })();
}

export async function avifToImageBlob(file, outputMime = 'image/jpeg', quality = 0.9) {
  if (!isAvifSupported()) {
    throw new Error("Your browser doesn't support AVIF decoding. Try Chrome, Firefox, or a recent Safari.");
  }
  const img = new Image();
  const url = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error("Failed to decode AVIF image. Your browser may not support AVIF."));
    img.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);
  URL.revokeObjectURL(url);
  if (outputMime === 'image/png') {
    return new Promise(resolve => canvas.toBlob(resolve, outputMime));
  }
  return new Promise(resolve => canvas.toBlob(resolve, outputMime, quality));
}
