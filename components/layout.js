import { TOOLS } from './tools.js';

const GITHUB_SVG = `<svg viewBox="0 0 24 24" class="w-5 h-5 fill-current text-slate-700 dark:text-slate-200" aria-hidden="true">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
</svg>`;

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
      <button type="button" class="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
        <span class="text-slate-700 dark:text-slate-100">${label}</span>
        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors"></i>
      </button>
      <div class="absolute left-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
        <div class="min-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;
}

export function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored === 'dark' || (stored !== 'light' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
  return isDark;
}

function bindThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn || btn.dataset.bound === 'true') return;
  btn.dataset.bound = 'true';

  btn.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    window.lucide?.createIcons?.();
  });
}

export function initLayout(options = {}) {
  const {
    pageTitle = '',
    showNav = true
  } = options;

  initTheme();

  const imagesMenu = TOOLS.images.map(t => toolLink(t)).join('');
  const docsMenu = TOOLS.documents.map(t => toolLink(t)).join('');
  const pdfMenu = (TOOLS.pdf || []).map(t => toolLink(t)).join('');
  const audioMenu = (TOOLS.audio || []).map(t => toolLink(t)).join('');

  const moreToolCategories = [
    { label: 'Data', items: TOOLS.data },
    { label: 'Subtitles & Fonts', items: [...(TOOLS.subtitles || []), ...(TOOLS.fonts || [])] },
    { label: 'Icons, Calendar & AI', items: [...(TOOLS.icons || []), ...(TOOLS.calendar || []), ...(TOOLS.utilities || []), ...(TOOLS.ai || [])] }
  ];

  const moreToolsMenuHtml = `
    <div class="absolute top-full right-0 mt-2 w-[640px] max-md:w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 grid grid-cols-3 max-md:grid-cols-1 gap-6 hidden" id="moreToolsMenu">
      ${moreToolCategories.map(cat => `
        <div>
          <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">${cat.label}</div>
          ${cat.items.map(t => `
            <a href="${t.href}" class="flex items-center gap-2 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand transition-colors">
              <i data-lucide="${t.icon}" class="w-3.5 h-3.5 text-brand flex-shrink-0"></i>
              ${t.title}
            </a>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;

  const headerHtml = `
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-2 flex-shrink-0">
        <div class="w-9 h-9 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
          <i data-lucide="refresh-cw" class="w-5 h-5"></i>
        </div>
        <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">JS-Convert</span>
      </a>

      ${showNav ? `
      <nav class="hidden md:flex items-center gap-3 flex-1 justify-center">
        ${dropdown('Images', imagesMenu)}
        ${dropdown('Documents', docsMenu)}
        ${dropdown('PDF Tools', pdfMenu)}
        ${dropdown('Audio', audioMenu)}
        <a href="/compress/" class="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
          <i data-lucide="minimize-2" class="w-4 h-4 text-brand"></i>
          <span class="text-slate-700 dark:text-slate-100">Compress</span>
        </a>
        <div class="relative" id="moreToolsWrapper">
          <button type="button" id="moreToolsBtn" class="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
            <span class="text-slate-700 dark:text-slate-100">More Tools</span>
            <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 transition-colors"></i>
          </button>
          ${moreToolsMenuHtml}
        </div>
        <a href="/blog/" class="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
          <i data-lucide="book-open" class="w-4 h-4 text-brand"></i>
          <span class="text-slate-700 dark:text-slate-100">Blog</span>
        </a>
      </nav>
      ` : ''}

      <div class="flex items-center gap-2 flex-shrink-0">
        <button id="themeToggle" type="button" aria-label="Toggle dark mode" class="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all shadow-sm flex items-center justify-center">
          <i data-lucide="sun" class="w-5 h-5 text-orange-500 block dark:hidden"></i>
          <i data-lucide="moon" class="w-5 h-5 text-blue-400 hidden dark:block"></i>
        </button>
        <a href="https://github.com/Xenofff/JS-Convert" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" class="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all shadow-sm flex items-center justify-center">
          ${GITHUB_SVG}
        </a>
      </div>
    </div>
  `;

  const footerHtml = `
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
            ${(TOOLS.pdf || []).map(t => toolLink(t)).join('')}
            ${TOOLS.data.map(t => toolLink(t)).join('')}
            ${TOOLS.compress.map(t => toolLink(t)).join('')}
            ${(TOOLS.audio || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.subtitles || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.fonts || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.icons || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.dev || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.calendar || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.utilities || []).map(t => toolLink(t)).join('')}
            ${(TOOLS.ai || []).map(t => toolLink(t)).join('')}
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 JS-Convert &bull; Local &amp; Secure</p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/privacy/" class="text-xs font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">Privacy Policy</a>
          <a href="/terms/" class="text-xs font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">Terms of Service</a>
          <a href="/" class="text-xs font-bold text-slate-400 hover:text-brand transition-colors uppercase tracking-widest">${pageTitle || 'Home'}</a>
        </div>
      </div>
    </div>
  `;

  function inject() {
    const header = el('header', 'sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800');
    header.innerHTML = headerHtml;

    const footer = el('footer', 'mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12');
    footer.innerHTML = footerHtml;

    const main = document.querySelector('main');
    if (main) {
      document.body.insertBefore(header, main);
    } else {
      document.body.prepend(header);
    }
    document.body.appendChild(footer);

    bindThemeToggle();

    const moreToolsBtn = document.getElementById('moreToolsBtn');
    const moreToolsMenu = document.getElementById('moreToolsMenu');
    if (moreToolsBtn && moreToolsMenu) {
      moreToolsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !moreToolsMenu.classList.contains('hidden');
        moreToolsMenu.classList.toggle('hidden', isOpen);
        moreToolsBtn.querySelector('[data-lucide="chevron-down"]')?.classList.toggle('rotate-180', !isOpen);
      });
      document.addEventListener('click', (e) => {
        if (!moreToolsMenu.contains(e.target) && !moreToolsBtn.contains(e.target)) {
          moreToolsMenu.classList.add('hidden');
          moreToolsBtn.querySelector('[data-lucide="chevron-down"]')?.classList.remove('rotate-180');
        }
      });
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(inject, { timeout: 1500 });
  } else {
    setTimeout(inject, 0);
  }
}
