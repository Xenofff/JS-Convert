export const SITE_DOMAIN = 'https://jsconvert.site';

export const TOOLS = {
  images: [
    { href: '/webp-to-png/', title: 'WebP to PNG', icon: 'image', key: 'webp-to-png' },
    { href: '/webp-to-jpg/', title: 'WebP to JPG', icon: 'file-image', key: 'webp-to-jpg' },
    { href: '/png-to-jpg/', title: 'PNG to JPG', icon: 'file-image', key: 'png-to-jpg' },
    { href: '/png-to-webp/', title: 'PNG to WebP', icon: 'layers', key: 'png-to-webp' },
    { href: '/jpg-to-png/', title: 'JPG to PNG', icon: 'image', key: 'jpg-to-png' },
    { href: '/jpg-to-webp/', title: 'JPG to WebP', icon: 'layers', key: 'jpg-to-webp' },
    { href: '/gif-to-webp/', title: 'GIF to WebP', icon: 'layers', key: 'gif-to-webp' },
    { href: '/gif-to-png/', title: 'GIF to PNG', icon: 'image', key: 'gif-to-png' },
    { href: '/svg-to-png/', title: 'SVG to PNG', icon: 'pen-tool', key: 'svg-to-png' },
    { href: '/heic-to-jpg/', title: 'HEIC to JPG', icon: 'smartphone', key: 'heic-to-jpg' },
    { href: '/heic-to-png/', title: 'HEIC to PNG', icon: 'smartphone', key: 'heic-to-png' }
  ],
  documents: [
    { href: '/jpg-to-pdf/', title: 'JPG to PDF', icon: 'file-text', key: 'jpg-to-pdf' },
    { href: '/png-to-pdf/', title: 'PNG to PDF', icon: 'file-text', key: 'png-to-pdf' }
  ],
  data: [
    { href: '/json-to-csv/', title: 'JSON to CSV', icon: 'table', key: 'json-to-csv' },
    { href: '/csv-to-json/', title: 'CSV to JSON', icon: 'braces', key: 'csv-to-json' }
  ],
  compress: [
    { href: '/compress/', title: 'Compress Images', icon: 'minimize-2', key: 'compress' }
  ],
  ai: [
    { href: '/image-to-text/', title: 'Image to Text (OCR)', icon: 'scan-text', key: 'image-to-text' },
    { href: '/upscale-image/', title: 'Upscale Image 2x/4x', icon: 'zoom-in', key: 'upscale-image' }
  ]
};

export const ALL_TOOLS = [
  ...TOOLS.images,
  ...TOOLS.documents,
  ...TOOLS.compress,
  ...TOOLS.data,
  ...TOOLS.ai
];
