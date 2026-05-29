export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const u = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${u[i]}`;
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function friendlyError(err) {
  const msg = err?.message || String(err);
  if (/network|fetch|failed to fetch|load/i.test(msg)) {
    return 'Model failed to load. Check your internet connection and try refreshing.';
  }
  if (/memory|allocation|oom/i.test(msg)) {
    return 'Not enough memory for this image. Try a smaller file or close other tabs.';
  }
  if (/format|type|unsupported/i.test(msg)) {
    return 'Unsupported file format. Please use a supported image type.';
  }
  if (/timeout/i.test(msg)) {
    return 'Processing took too long. Try a smaller image.';
  }
  return msg.length > 120 ? 'Something went wrong. Please try again.' : msg;
}

/** Inline upload icon — does not depend on Lucide timing. */
export const UPLOAD_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>`;

export function whenDomReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

export function bindDropzone({ dropzone, fileInput, accept, multiple = false, onFile }) {
  if (!dropzone || !fileInput) {
    console.error('bindDropzone: missing dropzone or fileInput');
    return;
  }

  fileInput.accept = accept;
  fileInput.multiple = multiple;
  let dragCounter = 0;
  const iconWrap = dropzone.querySelector('#dropzoneIconWrap');

  const setActive = (on) => {
    if (on) {
      dropzone.classList.add('scale-[1.02]', 'shadow-xl', 'shadow-indigo-500/10', 'border-brand', 'bg-brand/5');
      iconWrap?.classList.add('text-brand', 'animate-bounce');
    } else {
      dropzone.classList.remove('scale-[1.02]', 'shadow-xl', 'shadow-indigo-500/10', 'border-brand', 'bg-brand/5');
      iconWrap?.classList.remove('text-brand', 'animate-bounce');
    }
  };

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files || []);
    if (files.length) onFile(multiple ? files : files[0]);
    fileInput.value = '';
  });

  dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    if (dragCounter === 1) setActive(true);
  });
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      setActive(false);
    }
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    setActive(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) onFile(multiple ? files : files[0]);
  });
}

export function setProgress(visible, pct = 0, label = '') {
  const wrap = document.getElementById('progressWrap');
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressLabel');
  if (!wrap || !bar || !text) return;
  wrap.classList.toggle('hidden', !visible);
  bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  text.textContent = label;
}

export function showErrorBox(message) {
  const box = document.getElementById('errorBox');
  if (!box) return;
  box.textContent = message;
  box.classList.remove('hidden');
}

export function hideErrorBox() {
  document.getElementById('errorBox')?.classList.add('hidden');
}

export function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export const AI_PAGE_STYLES = `
  details.seo-faq summary::-webkit-details-marker { display: none; }
  details.seo-faq summary::marker { content: ''; }
  .checkerboard {
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 16px 16px;
    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
  }
  .dark .checkerboard {
    background-image: linear-gradient(45deg, #334155 25%, transparent 25%),
      linear-gradient(-45deg, #334155 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #334155 75%),
      linear-gradient(-45deg, transparent 75%, #334155 75%);
  }
`;

export const AI_BADGE = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 ml-0 md:ml-3 align-middle">✨ AI-Powered</span>`;
