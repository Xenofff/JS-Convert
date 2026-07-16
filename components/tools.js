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
    { href: '/heic-to-png/', title: 'HEIC to PNG', icon: 'smartphone', key: 'heic-to-png' },
    { href: '/avif-to-jpg/', title: 'AVIF to JPG', icon: 'image', key: 'avif-to-jpg' },
    { href: '/avif-to-png/', title: 'AVIF to PNG', icon: 'image', key: 'avif-to-png' }
  ],
  documents: [
    { href: '/jpg-to-pdf/', title: 'JPG to PDF', icon: 'file-text', key: 'jpg-to-pdf' },
    { href: '/png-to-pdf/', title: 'PNG to PDF', icon: 'file-text', key: 'png-to-pdf' }
  ],
  data: [
    { href: '/json-to-csv/', title: 'JSON to CSV', icon: 'table', key: 'json-to-csv' },
    { href: '/csv-to-json/', title: 'CSV to JSON', icon: 'braces', key: 'csv-to-json' }
  ],
  audio: [
    { href: '/mp3-to-wav/', title: 'MP3 to WAV', icon: 'music', key: 'mp3-to-wav' },
    { href: '/wav-to-mp3/', title: 'WAV to MP3', icon: 'music-2', key: 'wav-to-mp3' },
    { href: '/m4a-to-mp3/', title: 'M4A to MP3', icon: 'headphones', key: 'm4a-to-mp3' }
  ],
  pdf: [
    { href: '/merge-pdf/',    title: 'Merge PDF',    icon: 'combine',      key: 'merge-pdf'    },
    { href: '/split-pdf/',    title: 'Split PDF',    icon: 'scissors',     key: 'split-pdf'    },
    { href: '/compress-pdf/', title: 'Compress PDF', icon: 'file-minus',   key: 'compress-pdf' },
    { href: '/rotate-pdf/',   title: 'Rotate PDF',   icon: 'rotate-cw',    key: 'rotate-pdf'   }
  ],
  compress: [
    { href: '/compress/', title: 'Compress Images', icon: 'minimize-2', key: 'compress' }
  ],
  utilities: [
    { href: '/qr-code/', title: 'QR Code Generator', icon: 'qr-code', key: 'qr-code' },
    { href: '/color-converter/', title: 'Color Converter', icon: 'palette', key: 'color-converter' }
  ],
  subtitles: [
    { href: '/srt-to-vtt/', title: 'SRT to VTT', icon: 'captions', key: 'srt-to-vtt' },
    { href: '/vtt-to-srt/', title: 'VTT to SRT', icon: 'captions', key: 'vtt-to-srt' }
  ],
  fonts: [
    { href: '/ttf-to-woff2/', title: 'TTF to WOFF2', icon: 'type', key: 'ttf-to-woff2' },
    { href: '/woff2-to-ttf/', title: 'WOFF2 to TTF', icon: 'type', key: 'woff2-to-ttf' }
  ],
  icons: [
    { href: '/png-to-ico/', title: 'PNG to ICO', icon: 'image-plus', key: 'png-to-ico' },
    { href: '/ico-to-png/', title: 'ICO to PNG', icon: 'image-minus', key: 'ico-to-png' }
  ],
  dev: [
    { href: '/xml-to-json/', title: 'XML to JSON', icon: 'braces', key: 'xml-to-json' },
    { href: '/json-to-xml/', title: 'JSON to XML', icon: 'code', key: 'json-to-xml' }
  ],
  calendar: [
    { href: '/ics-to-csv/', title: 'ICS to CSV', icon: 'calendar', key: 'ics-to-csv' }
  ],
  ai: [
    { href: '/image-to-text/', title: 'Image to Text (OCR)', icon: 'scan-text', key: 'image-to-text' },
    { href: '/upscale-image/', title: 'Upscale Image 2x/4x', icon: 'zoom-in', key: 'upscale-image' }
  ]
};

export const ALL_TOOLS = [
  ...TOOLS.images,
  ...TOOLS.documents,
  ...TOOLS.pdf,
  ...TOOLS.compress,
  ...TOOLS.data,
  ...TOOLS.audio,
  ...TOOLS.utilities,
  ...TOOLS.subtitles,
  ...TOOLS.fonts,
  ...TOOLS.icons,
  ...TOOLS.dev,
  ...TOOLS.calendar,
  ...TOOLS.ai
];
