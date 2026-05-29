import {
  bindDropzone,
  downloadBlob,
  formatFileSize,
  fileToImage,
  friendlyError,
  hideErrorBox,
  setProgress,
  showErrorBox,
  whenDomReady
} from './ai-common.js';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const UPSCALER_URL = 'https://cdn.jsdelivr.net/npm/upscaler/dist/browser/esm/index.js';
const TF_URL = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.esm.js';
const MODEL_2X_URL = 'https://esm.sh/@upscalerjs/esrgan-slim/2x';
const MODEL_4X_URL = 'https://esm.sh/@upscalerjs/esrgan-slim/4x';

let currentFile = null;
let currentImg = null;
let resultBlob = null;
let upscalerInstance = null;
let upscalerScale = null;

const $ = (id) => document.getElementById(id);

function getScale() {
  return $('scale4x')?.classList.contains('ring-2') ? 4 : 2;
}

function updateDimPreview() {
  if (!currentImg) return;
  const s = getScale();
  const w = currentImg.naturalWidth * s;
  const h = currentImg.naturalHeight * s;
  $('originalDims').textContent = `Original: ${currentImg.naturalWidth} × ${currentImg.naturalHeight} px`;
  $('outputDims').textContent = `Output will be: ${w} × ${h} px`;
  const large = currentImg.naturalWidth > 1000 || currentImg.naturalHeight > 1000;
  $('largeWarning').classList.toggle('hidden', !large);
}

function setScaleButtons(s) {
  const btn2 = $('scale2x');
  const btn4 = $('scale4x');
  const active = 'ring-2 ring-brand bg-brand/10 border-brand';
  const idle = 'border-slate-200 dark:border-slate-700';
  if (btn2) btn2.className = `flex-1 py-3 rounded-2xl font-bold border transition-all ${s === 2 ? active : idle}`;
  if (btn4) btn4.className = `flex-1 py-3 rounded-2xl font-bold border transition-all ${s === 4 ? active : idle}`;
  if (upscalerScale !== s) {
    upscalerInstance?.dispose?.();
    upscalerInstance = null;
    upscalerScale = null;
  }
  updateDimPreview();
}

async function getUpscaler() {
  const s = getScale();
  if (!upscalerInstance || upscalerScale !== s) {
    upscalerInstance?.dispose?.();
    const [{ default: Upscaler }, { default: model }] = await Promise.all([
      import(UPSCALER_URL),
      import(s === 4 ? MODEL_4X_URL : MODEL_2X_URL)
    ]);
    upscalerInstance = new Upscaler({ model });
    upscalerScale = s;
  }
  return upscalerInstance;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function upscaleImage() {
  if (!currentFile || !currentImg) return;
  hideErrorBox();
  const upscaleBtn = $('upscaleBtn');
  if (upscaleBtn) upscaleBtn.disabled = true;
  $('downloadBtn').classList.add('hidden');
  $('compareSection').classList.add('hidden');

  const timeoutMs = 5 * 60 * 1000;

  try {
    setProgress(true, 0, 'Loading AI model… (~5MB, first time only)');
    const upscaler = await getUpscaler();
    const tfModule = await import(TF_URL);
    const tf = tfModule.default ?? tfModule;

    const upscaledTensor = await withTimeout(
      upscaler.upscale(currentImg, {
        output: 'tensor',
        patchSize: 64,
        padding: 2,
        progress: (pct) => {
          const p = Math.round(pct * 100);
          setProgress(true, p, `Upscaling... ${p}%`);
        }
      }),
      timeoutMs
    );

    const [h, w] = upscaledTensor.shape;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    await tf.browser.toPixels(upscaledTensor, canvas);
    upscaledTensor.dispose();

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create image'))), 'image/png');
    });

    resultBlob = blob;
    $('previewUpscaled').src = canvas.toDataURL('image/png');
    $('compareOriginal').src = $('previewOriginal').src;
    $('compareSection').classList.remove('hidden');
    $('upscaledStats').textContent = `${formatFileSize(currentFile.size)} → ${w} × ${h} px (${formatFileSize(blob.size)})`;
    $('upscaledStats').classList.remove('hidden');
    $('downloadBtn').classList.remove('hidden');
    setProgress(false);
  } catch (err) {
    showErrorBox(friendlyError(err));
    setProgress(false);
  }
  if (upscaleBtn) upscaleBtn.disabled = false;
}

function setupUpscaleImageTool() {
  const dropzone = $('dropzone');
  const fileInput = $('fileInput');
  if (!dropzone || !fileInput) return;

  bindDropzone({
    dropzone,
    fileInput,
    accept: ACCEPT,
    onFile: async (file) => {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        showErrorBox('Unsupported file format. Please upload JPG, PNG, or WEBP.');
        return;
      }
      hideErrorBox();
      currentFile = file;
      resultBlob = null;
      try {
        currentImg = await fileToImage(file);
        $('previewOriginal').src = URL.createObjectURL(file);
        $('previewWrap').classList.remove('hidden');
        $('compareSection').classList.add('hidden');
        $('downloadBtn').classList.add('hidden');
        updateDimPreview();
        const upscaleBtn = $('upscaleBtn');
        if (upscaleBtn) upscaleBtn.disabled = false;
      } catch {
        showErrorBox('Could not load image. Try another file.');
      }
    }
  });

  $('scale2x')?.addEventListener('click', () => setScaleButtons(2));
  $('scale4x')?.addEventListener('click', () => setScaleButtons(4));
  setScaleButtons(2);

  $('upscaleBtn')?.addEventListener('click', upscaleImage);

  $('downloadBtn')?.addEventListener('click', () => {
    if (!resultBlob) return;
    const base = currentFile ? currentFile.name.replace(/\.[^.]+$/, '') : 'upscaled';
    downloadBlob(resultBlob, `${base}_${getScale()}x.png`);
  });
}

export function initUpscaleImageTool() {
  whenDomReady(setupUpscaleImageTool);
}
