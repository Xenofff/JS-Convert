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

let currentFile = null;
let currentImg = null;
let resultBlob = null;

const $ = (id) => document.getElementById(id);

function getScale() {
  return $('scale4x')?.classList.contains('ring-2') ? 4 : 2;
}

function updateDimPreview() {
  if (!currentImg) return;
  const s = getScale();
  const w = currentImg.naturalWidth * s;
  const h = currentImg.naturalHeight * s;
  $('originalDims').textContent = `Original: ${currentImg.naturalWidth} x ${currentImg.naturalHeight} px`;
  $('outputDims').textContent = `Output will be: ${w} x ${h} px`;
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
  updateDimPreview();
}

function getOutputName() {
  const base = currentFile ? currentFile.name.replace(/\.[^.]+$/, '') : 'upscaled';
  return `${base}_${getScale()}x.png`;
}

async function upscaleImage() {
  if (!currentFile || !currentImg) return;
  hideErrorBox();
  const upscaleBtn = $('upscaleBtn');
  if (upscaleBtn) upscaleBtn.disabled = true;
  $('downloadBtn').classList.add('hidden');
  $('compareSection').classList.add('hidden');

  try {
    setProgress(true, 0, 'Initializing TensorFlow.js...');

    if (typeof tf === 'undefined') {
      showErrorBox('TensorFlow.js failed to load. Check your internet connection and refresh.');
      setProgress(false);
      if (upscaleBtn) upscaleBtn.disabled = false;
      return;
    }

    setProgress(true, 10, 'Loading image...');

    const canvas = document.createElement('canvas');
    canvas.width = currentImg.naturalWidth;
    canvas.height = currentImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentImg, 0, 0);

    const s = getScale();
    const outW = currentImg.naturalWidth * s;
    const outH = currentImg.naturalHeight * s;

    setProgress(true, 20, 'Converting to tensor...');

    let tensor = tf.browser.fromPixels(canvas);

    tensor = tf.cast(tensor, 'float32');

    setProgress(true, 30, `Upscaling ${s}x with bilinear interpolation...`);

    const resized = tf.image.resizeBilinear(tensor, [outH, outW]);

    tensor.dispose();

    setProgress(true, 60, 'Applying sharpening filter...');

    const sharpened = tf.tidy(() => {
      const kernel = tf.tensor4d(
        [0, -1, 0, -1, 5, -1, 0, -1, 0],
        [3, 3, 1, 1]
      );
      
      const channels = tf.split(resized, 3, 2);
      
      const sharpen = (channel) => {
        const c = channel.reshape([1, outH, outW, 1]);
        const result = tf.conv2d(c, kernel, 1, 'same');
        return result.reshape([outH, outW, 1]);
      };
      
      return tf.concat([sharpen(channels[0]), sharpen(channels[1]), sharpen(channels[2])], 2);
    });

    resized.dispose();

    setProgress(true, 80, 'Converting to image...');

    const clamped = tf.clipByValue(sharpened, 0, 255);
    sharpened.dispose();

    const finalTensor = tf.cast(clamped, 'int32');
    clamped.dispose();

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = outW;
    outputCanvas.height = outH;
    await tf.browser.toPixels(finalTensor, outputCanvas);
    finalTensor.dispose();

    setProgress(true, 95, 'Preparing download...');

    const blob = await new Promise((resolve, reject) => {
      outputCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create image'))), 'image/png');
    });

    resultBlob = blob;
    $('previewUpscaled').src = outputCanvas.toDataURL('image/png');
    $('compareOriginal').src = $('previewOriginal').src;
    $('compareSection').classList.remove('hidden');
    $('upscaledStats').textContent = `${formatFileSize(currentFile.size)} → ${outW} x ${outH} px (${formatFileSize(blob.size)})`;
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
    downloadBlob(resultBlob, getOutputName());
  });
}

export function initUpscaleImageTool() {
  whenDomReady(setupUpscaleImageTool);
}
