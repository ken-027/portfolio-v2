import sharp from 'sharp';
import {
    fileURLToPath
} from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(
    import.meta.url));
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'og-image.png');

const svgContent = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#0F172A"/>
      <stop offset="1" stop-color="#1E293B"/>
    </linearGradient>

    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stop-color="#22D3EE"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>

    <linearGradient id="textGrad" x1="80" y1="320" x2="980" y2="430" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e40af"/>
      <stop offset="0.5" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>

    <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1" fill="#334155" fill-opacity="0.6"/>
    </pattern>

    <filter id="orbBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Dot grid overlay -->
  <rect width="1200" height="630" fill="url(#dotGrid)"/>

  <!-- Decorative orbs -->
  <circle cx="200" cy="120" r="280" fill="#22D3EE" fill-opacity="0.12" filter="url(#orbBlur)"/>
  <circle cx="1050" cy="530" r="320" fill="#1e40af" fill-opacity="0.18" filter="url(#orbBlur)"/>
  <circle cx="900" cy="200" r="180" fill="#4f46e5" fill-opacity="0.10" filter="url(#orbBlur)"/>

  <!-- Logo rounded rect -->
  <rect x="80" y="60" width="100" height="100" rx="20" fill="url(#bgGrad)" stroke="#334155" stroke-width="3"/>

  <!-- Logo brackets (scaled from favicon 37px → 100px, scale=2.7027, translate +80,+60) -->
  <path d="M112 95 L102 110 L112 125" stroke="url(#cyanGrad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M125 125 L135 95" stroke="url(#cyanGrad)" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M148 95 L158 110 L148 125" stroke="url(#cyanGrad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Brand name -->
  <text x="200" y="126" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="52" fill="#F8FAFC" letter-spacing="-1">KDevTech</text>

  <!-- Name label -->
  <text x="80" y="290" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="28" fill="#22D3EE" letter-spacing="2">KENNETH ANDALES</text>

  <!-- Headline -->
  <text x="80" y="370" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="72" fill="url(#textGrad)" letter-spacing="-2">Full-Stack Developer</text>
  <text x="80" y="455" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="72" fill="url(#textGrad)" letter-spacing="-2">for Startups</text>

  <!-- Sub-tagline -->
  <text x="80" y="510" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-weight="500" font-size="28" fill="#94A3B8">MVP · SaaS · AI Integration · Web Apps · Philippines · Remote</text>

  <!-- Separator -->
  <line x1="80" y1="545" x2="1120" y2="545" stroke="#334155" stroke-width="1.5"/>

  <!-- URL -->
  <text x="80" y="590" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-weight="500" font-size="26" fill="#64748B">kenneth-andales.kdevtech.com</text>

  <!-- Tech pills -->
  <!-- TypeScript pill -->
  <rect x="620" y="562" width="140" height="36" rx="18" fill="#1e293b" fill-opacity="0.8" stroke="#334155" stroke-width="1"/>
  <text x="690" y="580" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">TypeScript</text>

  <!-- Node.js pill -->
  <rect x="772" y="562" width="110" height="36" rx="18" fill="#1e293b" fill-opacity="0.8" stroke="#334155" stroke-width="1"/>
  <text x="827" y="580" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">Node.js</text>

  <!-- React pill -->
  <rect x="894" y="562" width="86" height="36" rx="18" fill="#1e293b" fill-opacity="0.8" stroke="#334155" stroke-width="1"/>
  <text x="937" y="580" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">React</text>

  <!-- PostgreSQL pill -->
  <rect x="992" y="562" width="128" height="36" rx="18" fill="#1e293b" fill-opacity="0.8" stroke="#334155" stroke-width="1"/>
  <text x="1056" y="580" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="20" fill="#94A3B8" text-anchor="middle" dominant-baseline="middle">PostgreSQL</text>
</svg>
`;

async function main() {
    const svgBuffer = Buffer.from(svgContent);
    await sharp(svgBuffer).png().toFile(OUTPUT_PATH);
    console.log(`OG image written to ${OUTPUT_PATH}`);
}

main().catch(err => {
    console.error('Failed to generate OG image:', err);
    process.exit(1);
});