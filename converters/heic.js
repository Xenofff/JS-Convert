export async function heicToImageBlob(heicFile, toType = 'image/jpeg', quality = 0.9) {
  // heic2any is shipped as an ESM-friendly module on jsdelivr per requirement
  const mod = await import('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js');
  const heic2any = mod?.default || mod;
  const out = await heic2any({ blob: heicFile, toType, quality });

  // heic2any may return Blob or an array of Blobs
  const blob = Array.isArray(out) ? out[0] : out;
  if (!(blob instanceof Blob)) throw new Error('HEIC conversion failed');
  return blob;
}

