import {
  bindDropzone,
  downloadBlob,
  formatFileSize,
  friendlyError,
  hideErrorBox,
  setProgress,
  showErrorBox,
  whenDomReady
} from './ai-common.js';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const BG_REMOVAL_URL = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/index.mjs';

let currentFile = null;
let resultBlob = null;
let modelLoaded = false;

const $ = (id) => document.getElementById(id);

function baseName(name) {
  return name.replace(/\.[^.]+$/, '');
}

function log(stage, msg) {
  console.log(`[bg-remove] ${stage}: ${msg}`);
}

function showPreview(file) {
  const url = URL.createObjectURL(file);
  $('previewOriginal').src = url;
  $('previewOriginal').onload = () => URL.revokeObjectURL(url);
  $('previewSection').classList.remove('hidden');
  $('resultCol').classList.add('hidden');
  $('statsRow').classList.add('hidden');
  $('downloadBtn').classList.add('hidden');
  $('processBtn').disabled = false;
  $('originalSize').textContent = formatFileSize(file.size);
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function processImage() {
  if (!currentFile) return;
  hideErrorBox();
  $('processBtn').disabled = true;
  $('downloadBtn').classList.add('hidden');
  $('resultCol').classList.add('hidden');
  $('statsRow').classList.add('hidden');

  const timeoutMs = 5 * 60 * 1000;

  // --- SharedArrayBuffer / COOP+COEP check ---
  if (typeof SharedArrayBuffer === 'undefined') {
    log('env', 'SharedArrayBuffer is NOT available — performance will be degraded');
  } else {
    log('env', 'SharedArrayBuffer is available');
  }
  log('env', `crossOriginIsolated = ${crossOriginIsolated}`);

  // --- Stage 1: Load module ---
  log('import', `Fetching module from ${BG_REMOVAL_URL}`);
  setProgress(true, 0, 'Loading library...');

  let mod;
  try {
    mod = await import(BG_REMOVAL_URL);
    log('import', 'Dynamic import() resolved OK');
  } catch (importErr) {
    log('import', `FAILED: ${importErr.message}`);
    showErrorBox(`Module load failed: ${importErr.message}`);
    setProgress(false);
    $('processBtn').disabled = false;
    return;
  }

  // --- Stage 2: Extract removeBackground function ---
  log('extract', 'Looking for removeBackground export...');
  const removeBackground = mod.removeBackground || mod.default?.removeBackground || mod.default;
  log('extract', `removeBackground type = ${typeof removeBackground}`);

  if (typeof removeBackground !== 'function') {
    log('extract', 'Available exports: ' + Object.keys(mod).join(', '));
    log('extract', 'mod.default keys: ' + (mod.default ? Object.keys(mod.default).join(', ') : 'N/A'));
    showErrorBox('Could not find removeBackground function in the loaded module. Check console for details.');
    setProgress(false);
    $('processBtn').disabled = false;
    return;
  }

  // --- Stage 3: Start inference ---
  log('inference', `Starting removeBackground for file: ${currentFile.name} (${formatFileSize(currentFile.size)})`);
  setProgress(true, 0, 'Removing background...');

  try {
    const blob = await withTimeout(
      removeBackground(currentFile, {
        progress: (key, current, total) => {
          if (!total) return;
          const pct = Math.round((current / total) * 100);
          const isFetch = /fetch|download|model|wasm/i.test(String(key));
          log('progress', `${key} — ${current}/${total} (${pct}%)`);
          if (isFetch && pct < 100) {
            setProgress(true, pct, `Loading AI model... ${pct}%`);
          } else if (pct >= 100 && isFetch) {
            modelLoaded = true;
            setProgress(true, 0, 'Removing background...');
          } else if (!isFetch) {
            setProgress(true, Math.min(99, pct), 'Removing background...');
          }
        }
      }),
      timeoutMs
    );

    log('inference', `Done — result size: ${formatFileSize(blob.size)}`);
    modelLoaded = true;
    resultBlob = blob;
    const resultUrl = URL.createObjectURL(blob);
    $('previewResult').src = resultUrl;
    $('resultCol').classList.remove('hidden');
    $('resultSize').textContent = formatFileSize(blob.size);
    $('statsRow').textContent = `${formatFileSize(currentFile.size)} → ${formatFileSize(blob.size)}`;
    $('statsRow').classList.remove('hidden');
    $('downloadBtn').classList.remove('hidden');
    setProgress(false);
  } catch (err) {
    log('inference', `FAILED at step: ${err.message}`);
    log('inference', `Full error: ${err.stack || err}`);
    showErrorBox(friendlyError(err));
    setProgress(false);
    $('processBtn').disabled = false;
  }
}

function setupRemoveBackgroundTool() {
  const dropzone = $('dropzone');
  const fileInput = $('fileInput');
  if (!dropzone || !fileInput) return;

  bindDropzone({
    dropzone,
    fileInput,
    accept: ACCEPT,
    onFile: (file) => {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        showErrorBox('Unsupported file format. Please upload JPG, PNG, or WEBP.');
        return;
      }
      hideErrorBox();
      currentFile = file;
      resultBlob = null;
      showPreview(file);
    }
  });

  $('processBtn')?.addEventListener('click', processImage);

  $('downloadBtn')?.addEventListener('click', () => {
    if (!resultBlob || !currentFile) return;
    downloadBlob(resultBlob, `${baseName(currentFile.name)}_no_bg.png`);
  });
}

export function initRemoveBackgroundTool() {
  whenDomReady(setupRemoveBackgroundTool);
}
