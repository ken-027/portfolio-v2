import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Same mark as public/favicon.svg, scaled to a 512 viewBox.
const svgContent = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F172A"/>
      <stop offset="1" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#22D3EE"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="102" fill="url(#bgGrad)"/>
  <rect x="14" y="14" width="484" height="484" rx="88" stroke="#334155" stroke-width="20"/>
  <path d="M164 179 L113 256 L164 333" stroke="url(#cyanGrad)" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M231 333 L281 179" stroke="url(#cyanGrad)" stroke-width="44" stroke-linecap="round" fill="none"/>
  <path d="M348 179 L399 256 L348 333" stroke="url(#cyanGrad)" stroke-width="44" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`;

const targets = [
  { file: 'pwa-192x192.png', size: 192 },
  { file: 'pwa-512x512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
];

async function main() {
  const svgBuffer = Buffer.from(svgContent);
  for (const { file, size } of targets) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(PUBLIC_DIR, file));
    console.log(`Wrote ${file} (${size}x${size})`);
  }
}

main().catch((err) => {
  console.error('Failed to generate PWA icons:', err);
  process.exit(1);
});
