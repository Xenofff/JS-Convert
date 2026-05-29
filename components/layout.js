import { TOOLS } from './tools.js';

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function toolLink(tool, extraClass = '') {
  return `
    <a href="${tool.href}" class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand/5 dark:hover:bg-brand/10 transition-colors ${extraClass}">
      <i data-lucide="${tool.icon}" class="w-4 h-4 text-brand"></i>
      <span class="text-sm font-bold text-slate-700 dark:text-slate-200">${tool.title}</span>
    </a>
  `;
}

function dropdown(label, itemsHtml) {
  return `
    <div class="relative group">
      <button class="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
        <span class="text-slate-700 dark:text-slate-100">${label}</span>
        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors"></i>
      </button>
      <div class="absolute left-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
        <div class="min-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;
}

export function initLayout(options = {}) {
  const {
    activeCategory = '',
    pageTitle = '',
    showNav = true
  } = options;

  const header = el(
    'header',
    'sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800'
  );

  const imagesMenu = TOOLS.images.map(t => toolLink(t)).join('');
  const docsMenu = TOOLS.documents.map(t => toolLink(t)).join('');
  const dataMenu = TOOLS.data.map(t => toolLink(t)).join('');

  header.innerHTML = `
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="w-9 h-9 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
          <i data-lucide="refresh-cw" class="w-5 h-5"></i>
        </div>
        <span class="text-xl font-bold tracking-tight">JS-Convert</span>
      </a>

      ${showNav ? `
      <nav class="hidden md:flex items-center gap-3">
        ${dropdown('Images', imagesMenu)}
        ${dropdown('Documents', docsMenu)}
        ${dropdown('Data', dataMenu)}
        <a href="/compress/" class="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
          <i data-lucide="minimize-2" class="w-4 h-4 text-brand"></i>
          <span class="text-slate-700 dark:text-slate-100">Compress</span>
        </a>
      </nav>
      ` : ''}

      <a href="https://github.com/Xenofff/JS-Convert" target="_blank" class="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all shadow-sm flex items-center justify-center">
        <i data-lucide="github" class="w-5 h-5 text-slate-700 dark:text-slate-200"></i>
      </a>
    </div>
  `;

  const footer = el('footer', 'mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12');
  footer.innerHTML = `
    <div class="max-w-5xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">JS-Convert</h4>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Privacy-first, client-side file converter. No uploads, no accounts — everything runs locally in your browser.
          </p>
        </div>
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">All Converters</h4>
          <div class="grid grid-cols-2 gap-2">
            ${TOOLS.images.slice(0, 8).map(t => toolLink(t, 'border border-slate-200/60 dark:border-slate-800/60')).join('')}
          </div>
        </div>
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">More Tools</h4>
          <div class="space-y-2">
            ${TOOLS.images.slice(8).map(t => toolLink(t)).join('')}
            ${TOOLS.documents.map(t => toolLink(t)).join('')}
            ${TOOLS.data.map(t => toolLink(t)).join('')}
            ${TOOLS.compress.map(t => toolLink(t)).join('')}
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 JS-Convert • Local & Secure</p>
        <a href="/" class="text-xs font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">${pageTitle ? pageTitle : 'Home'}</a>
      </div>
    </div>
  `;

  const main = document.querySelector('main');
  if (main) {
    document.body.insertBefore(header, main);
  } else {
    document.body.prepend(header);
  }
  document.body.appendChild(footer);

  // Tailwind helper styles for the existing "glass" header design
  if (!document.getElementById('layoutStyles')) {
    const style = el('style');
    style.id = 'layoutStyles';
    style.textContent = `
      .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
      .dark .glass { background: rgba(17, 24, 39, 0.8); }
    `;
    document.head.appendChild(style);
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

