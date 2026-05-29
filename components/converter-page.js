import { initLayout } from './layout.js';

function $(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateName(originalName, newExt) {
  const base = originalName.replace(/\.[^/.]+$/, '');
  return `${base}${newExt}`;
}

function statusIcon(status) {
  switch (status) {
    case 'converting':
      return { icon: 'loader-2', cls: 'w-4 h-4 text-brand animate-spin flex-shrink-0' };
    case 'success':
      return { icon: 'check-circle', cls: 'w-4 h-4 text-emerald-500 flex-shrink-0' };
    case 'error':
      return { icon: 'x-circle', cls: 'w-4 h-4 text-red-500 flex-shrink-0' };
    default:
      return { icon: 'clock', cls: 'w-4 h-4 text-slate-400 flex-shrink-0' };
  }
}

/** Safe for HTMLElement and SVGElement (Lucide replaces <i> with <svg>). */
function setClass(el, classValue) {
  if (el) el.setAttribute('class', classValue);
}

export function initConverterPage(config) {
  const start = () => setupConverterPage(config);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}

function setupConverterPage(config) {
  const {
    pageTitle = 'Converter',
    subtitle = '',
    accept = '*/*',
    outputMime,
    outputExt,
    perFileConvert, // async (file) => Blob
    multiple = true,
    layout = { showNav: true }
  } = config;

  initLayout({ pageTitle, ...layout });

  const dropzone = $('dropzone');
  const fileInput = $('fileInput');
  const filesList = $('filesList');
  const fileCountDisplay = $('fileCountDisplay');
  const convertBtn = $('convertBtn');
  const progressInner = $('progressInner');
  const conversionStatus = $('conversionStatus');

  const h1 = document.querySelector('main h1');
  if (h1) h1.textContent = pageTitle;
  const subtitleEl = document.getElementById('subtitle');
  if (subtitleEl) subtitleEl.textContent = subtitle;

  fileInput.accept = accept;
  fileInput.multiple = multiple;

  let selectedFiles = [];
  let statuses = [];
  let dragCounter = 0;

  function setDropActive(active) {
    const iconWrap = document.getElementById('dropzoneIconWrap');
    if (active) {
      dropzone.classList.add('scale-[1.02]', 'shadow-xl', 'shadow-indigo-500/10', 'border-brand', 'bg-brand/5');
      iconWrap?.classList.add('text-brand', 'animate-bounce');
    } else {
      dropzone.classList.remove('scale-[1.02]', 'shadow-xl', 'shadow-indigo-500/10', 'border-brand', 'bg-brand/5');
      iconWrap?.classList.remove('text-brand', 'animate-bounce');
    }
  }

  function renderList() {
    if (selectedFiles.length === 0) {
      filesList.classList.add('hidden');
      fileCountDisplay.classList.add('hidden');
      filesList.innerHTML = '';
      return;
    }

    filesList.classList.remove('hidden');
    fileCountDisplay.classList.remove('hidden');
    fileCountDisplay.textContent = `${selectedFiles.length} file(s)`;

    filesList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between text-xs bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5';

      const left = document.createElement('div');
      left.className = 'flex items-center gap-2 flex-1 min-w-0';

      const fileIcon = document.createElement('i');
      fileIcon.setAttribute('data-lucide', 'file');
      fileIcon.className = 'w-3 h-3 text-slate-500 flex-shrink-0';

      const fileName = document.createElement('span');
      fileName.className = 'truncate text-slate-700 dark:text-slate-300';
      fileName.textContent = file.name;

      const fileSize = document.createElement('span');
      fileSize.className = 'text-slate-400 flex-shrink-0 ml-2';
      fileSize.textContent = formatFileSize(file.size);

      left.appendChild(fileIcon);
      left.appendChild(fileName);

      const st = statuses[index] || 'pending';
      const stCfg = statusIcon(st);
      const statusSlot = document.createElement('span');
      statusSlot.className = 'inline-flex flex-shrink-0';
      statusSlot.dataset.fileIndex = String(index);
      const stEl = document.createElement('i');
      stEl.setAttribute('data-lucide', stCfg.icon);
      setClass(stEl, stCfg.cls);
      statusSlot.appendChild(stEl);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'ml-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors flex-shrink-0';
      removeBtn.innerHTML = '<i data-lucide="x" class="w-3 h-3"></i>';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        selectedFiles.splice(index, 1);
        statuses.splice(index, 1);
        renderList();
        window.lucide?.createIcons?.();
      };

      row.appendChild(left);
      row.appendChild(fileSize);
      row.appendChild(statusSlot);
      row.appendChild(removeBtn);
      filesList.appendChild(row);
    });

    window.lucide?.createIcons?.();
  }

  function setStatus(i, st) {
    statuses[i] = st;
    const slot = filesList.querySelector(`[data-file-index="${i}"]`);
    if (!slot) return;

    const cfg = statusIcon(st);
    let icon = slot.querySelector('i[data-lucide], svg');
    if (!icon || icon instanceof SVGElement) {
      slot.innerHTML = '';
      icon = document.createElement('i');
      slot.appendChild(icon);
    }
    icon.setAttribute('data-lucide', cfg.icon);
    setClass(icon, cfg.cls);
    window.lucide?.createIcons?.();
  }

  function addFiles(files) {
    if (!multiple && files.length > 1) files = files.slice(0, 1);
    selectedFiles.push(...files);
    files.forEach(() => statuses.push('pending'));
    renderList();
  }

  dropzone.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    document.getElementById('fileInput')?.click();
  });
  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) addFiles(files);
    fileInput.value = '';
  });

  dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    if (dragCounter === 1) setDropActive(true);
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
      setDropActive(false);
    }
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    setDropActive(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) addFiles(files);
  });

  convertBtn.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (!(btn instanceof HTMLButtonElement)) return;

    if (selectedFiles.length === 0) {
      alert('Please select file(s)');
      return;
    }

    btn.disabled = true;
    conversionStatus.classList.remove('hidden');
    progressInner.style.width = '0%';

    const total = selectedFiles.length;
    const zipEnabled = total > 1 && typeof window.JSZip !== 'undefined';
    const zip = zipEnabled ? new window.JSZip() : null;

    let ok = 0;
    let hadErrors = false;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      progressInner.style.width = `${(i / total) * 100}%`;
      conversionStatus.textContent = `Converting ${i + 1} of ${total}: ${file.name}`;
      setStatus(i, 'converting');

      try {
        const outBlob = await perFileConvert(file, { outputMime });
        const outName = generateName(file.name, outputExt);
        if (zipEnabled) {
          zip.file(outName, outBlob);
        } else {
          downloadBlob(outBlob, outName);
        }
        setStatus(i, 'success');
        ok++;
      } catch (err) {
        console.error(err);
        setStatus(i, 'error');
        hadErrors = true;
      }
    }

    progressInner.style.width = '100%';

    if (zipEnabled && ok > 0) {
      conversionStatus.textContent = 'Preparing ZIP...';
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `converted_${Date.now()}.zip`);
      conversionStatus.textContent = hadErrors ? 'Complete (some errors)' : 'Complete!';
    } else {
      conversionStatus.textContent = ok ? (hadErrors ? 'Complete (some errors)' : 'Complete!') : 'Error';
    }

    setTimeout(() => {
      btn.disabled = false;
      progressInner.style.width = '0%';
      conversionStatus.classList.add('hidden');
      if (!hadErrors) {
        selectedFiles = [];
        statuses = [];
      } else {
        // keep only failed for retry
        const keptFiles = [];
        const keptSt = [];
        selectedFiles.forEach((f, i) => {
          if (statuses[i] === 'error') {
            keptFiles.push(f);
            keptSt.push('pending');
          }
        });
        selectedFiles = keptFiles;
        statuses = keptSt;
      }
      renderList();
    }, 1500);
  });

}

