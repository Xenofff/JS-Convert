<div align="center">

# 🔄 JS-Convert

### 100% Client-Side | Privacy-First File Converter

**No servers. No uploads. Everything runs in your browser.**


</div>

---

## 📖 Overview

JS-Convert is a fully client-side, serverless file converter web application. All processing happens entirely in your browser — **no data is ever uploaded to any server**. It supports image format conversions, PDF creation from images, data format transformations (JSON ↔ CSV), and image compression.

🌐 **Live site:** [jsconvert.site](https://jsconvert.site)

---

## ✨ Features

| Category | Converters |
|----------|-----------|
| 🖼️ **Image** | WebP ↔ PNG, JPG ↔ PNG, WebP ↔ JPG, GIF → PNG, GIF → WebP, SVG → PNG, HEIC → JPG/PNG |
| 📄 **Document** | JPG → PDF, PNG → PDF |
| 📊 **Data** | JSON → CSV, CSV → JSON |
| 🗜️ **Compression** | Image compressor with quality slider & format selection |

### Key Highlights

- 🔒 **100% Private** — Zero data leaves your device. No servers, no tracking.
- 🖱️ **Drag & Drop** — Drop files directly or click to browse.
- 📦 **Batch Processing** — Convert multiple files at once, download as ZIP.
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile.
- 🌙 **Dark Mode** — Automatic dark/light theme support.
- ⚡ **No Build Step** — Pure HTML, CSS, and JavaScript. Zero configuration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | [Lucide Icons](https://lucide.dev/) |
| **Language** | Vanilla JavaScript (ES Modules) |
| **Font** | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| **PDF** | [jsPDF](https://github.com/parallax/jsPDF) v2.5.1 |
| **CSV** | [PapaParse](https://www.papaparse.com/) v5.5.2 |
| **HEIC** | [heic2any](https://github.com/nicedoc/heic2any) v0.0.4 |
| **ZIP** | [JSZip](https://stuk.github.io/jszip/) v3.10.1 |
| **Worker** | Web Workers + OffscreenCanvas |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (ES Modules require HTTP/HTTPS — `file://` won't work)

### Option 1: http-server (recommended)

```bash
# Install globally (one-time)
npm install -g http-server

# Start the server
http-server -c-1

# Open http://localhost:8080
```

### Option 2: Python

```bash
python3 -m http.server 8000

# Open http://localhost:8000
```

### Option 3: npx serve

```bash
npx serve .

# Open http://localhost:3000
```

### Usage

1. 🌐 Open the app in your browser via a local server
2. 📁 Drag & drop files or click **Browse** to select files
3. 🔄 Click **Convert** — the result downloads automatically

---

## 📁 Project Structure

```
JS-Convert/
├── index.html                  # Home page (tool directory)
├── components/
│   ├── tools.js                # Tool registry
│   ├── layout.js               # Shared header/footer
│   └── converter-page.js       # Reusable converter controller
├── converters/
│   ├── image.js                # Image format conversions (Canvas API)
│   ├── pdf.js                  # Image → PDF (jsPDF)
│   ├── data.js                 # JSON ↔ CSV (PapaParse)
│   ├── heic.js                 # HEIC decoding (heic2any)
│   ├── gif.js                  # GIF conversions (Canvas API)
│   └── svg.js                  # SVG → PNG (Canvas rasterization)
├── workers/
│   └── converter.worker.js     # OffscreenCanvas Web Worker
├── jpg-to-png/                 # 15 converter pages (one per tool)
│   └── index.html
├── compress/
│   └── index.html              # Image compressor
├── robots.txt                  # SEO
├── sitemap.xml                 # SEO
└── CNAME                       # GitHub Pages custom domain
```

---

## 🧩 Architecture

Each converter page follows a consistent pattern:

1. A lightweight HTML page with Tailwind classes and Lucide icons
2. Calls `initConverterPage()` with a simple config object:

```javascript
initConverterPage({
  pageTitle: "JPG to PNG",
  subtitle: "Convert JPG images to PNG format",
  accept: "image/jpeg",
  outputMime: "image/png",
  outputExt: ".png",
  perFileConvert: async (file) => {
    // conversion logic
    return new Blob([result], { type: "image/png" });
  }
});
```

The shared controller handles all UI logic — dropzone, file list, progress tracking, and downloads.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with ❤️ for privacy**

</div>
