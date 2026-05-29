import {
  bindDropzone,
  downloadBlob,
  friendlyError,
  hideErrorBox,
  setProgress,
  showErrorBox,
  whenDomReady
} from './ai-common.js';

const TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/bmp';
let currentFile = null;
let extractedText = '';

const $ = (id) => document.getElementById(id);

function langCode() {
  const v = $('langSelect').value;
  if (v === 'auto') return 'eng+rus';
  return v;
}

function showThumb(file) {
  const url = URL.createObjectURL(file);
  const img = $('thumbPreview');
  img.src = url;
  img.onload = () => URL.revokeObjectURL(url);
  $('thumbWrap').classList.remove('hidden');
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function extractText() {
  if (!currentFile) return;
  hideErrorBox();
  $('extractBtn').disabled = true;
  $('resultSection').classList.add('hidden');

  const timeoutMs = 5 * 60 * 1000;
  let worker;

  try {
    setProgress(true, 0, 'Loading language data...');

    const { default: Tesseract } = await import(TESSERACT_URL);
    worker = await Tesseract.createWorker(langCode(), 1, {
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js',
      logger: (m) => {
        if (m.status === 'loading language traineddata') {
          const pct = m.progress != null ? Math.round(m.progress * 100) : 0;
          setProgress(true, pct, 'Loading language data...');
        }
        if (m.status === 'recognizing text' && m.progress != null) {
          const pct = Math.round(m.progress * 100);
          setProgress(true, pct, 'Recognizing text...');
        }
      }
    });

    const { data: { text, confidence } } = await withTimeout(
      worker.recognize(currentFile),
      timeoutMs
    );

    await worker.terminate();
    worker = null;

    extractedText = text || '';
    $('resultText').value = extractedText;
    $('confidence').textContent = `Accuracy: ${Math.round(confidence || 0)}%`;
    $('charCount').textContent = `Extracted ${extractedText.length.toLocaleString()} characters`;
    $('resultSection').classList.remove('hidden');
    setProgress(false);
  } catch (err) {
    if (worker) await worker.terminate().catch(() => {});
    showErrorBox(friendlyError(err));
    setProgress(false);
  }
  $('extractBtn').disabled = false;
}

function setupImageToTextTool() {
  const dropzone = $('dropzone');
  const fileInput = $('fileInput');
  if (!dropzone || !fileInput) return;

  bindDropzone({
    dropzone,
    fileInput,
    accept: ACCEPT,
    onFile: (file) => {
      if (!file.type.startsWith('image/')) {
        showErrorBox('Unsupported file format. Please upload an image file.');
        return;
      }
      hideErrorBox();
      currentFile = file;
      extractedText = '';
      $('resultSection').classList.add('hidden');
      showThumb(file);
      $('extractBtn').disabled = false;
    }
  });

  $('extractBtn')?.addEventListener('click', extractText);

  $('copyBtn')?.addEventListener('click', async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      $('copyBtn').textContent = 'Copied!';
      setTimeout(() => { $('copyBtn').innerHTML = '<span>Copy to Clipboard</span>'; }, 2000);
    } catch {
      showErrorBox('Could not copy to clipboard. Select the text and copy manually.');
    }
  });

  $('downloadTxtBtn')?.addEventListener('click', () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const base = currentFile ? currentFile.name.replace(/\.[^.]+$/, '') : 'extracted';
    downloadBlob(blob, `${base}.txt`);
  });
}

export function initImageToTextTool() {
  whenDomReady(setupImageToTextTool);
}
