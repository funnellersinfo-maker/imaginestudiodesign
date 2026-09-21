// create-ads.mjs
// Creates 8 premium 1080x1080 Meta Ads for Imagine Studio Design
// using sharp + real project photos + SVG text overlays with brand gradient.

import { createRequire } from 'module';
import fs from 'fs/promises';
import path from 'path';

// Resolve sharp from the project node_modules (so the script can live anywhere,
// including /tmp, and still find the dependency).
const require = createRequire('/home/z/my-project/package.json');
const sharp = require('sharp');

const PROJECT = '/home/z/my-project';
const OUT_DIR = path.join(PROJECT, 'public/images/ads');

// Brand gradient stops — magenta → hot pink → purple → bright blue
const BRAND = ['#E71D8C', '#C62285', '#6A3DFF', '#2D7FE0'];

const ADS = [
  { name: 'ad1-wraps-en.jpg',       photo: 'real-leon-tires.jpg',           headline: 'YOUR TRUCK IS YOUR BEST SALESPERSON.',  subtext: 'VEHICLE WRAPS · WILMINGTON, NC' },
  { name: 'ad2-wraps-es.jpg',       photo: 'real-cabrera-flooring.jpg',     headline: 'TU VEHÍCULO ES TU MEJOR VENDEDOR.',     subtext: 'VINILOS VEHICULARES · WILMINGTON, NC' },
  { name: 'ad3-fleet-en.jpg',       photo: 'carousel/empire-metal.jpg',      headline: 'MAKE YOUR BUSINESS STAND OUT.',         subtext: 'FLEET BRANDING · WILMINGTON, NC' },
  { name: 'ad4-fleet-es.jpg',       photo: 'carousel/sunrise.jpg',           headline: 'HAZ QUE TU NEGOCIO DESTAQUE.',          subtext: 'BRANDING DE FLOTA · WILMINGTON, NC' },
  { name: 'ad5-embroidery-en.jpg',  photo: 'apparel/service-embroidery.jpg', headline: 'YOUR BRAND. ON EVERY THREAD.',          subtext: 'CUSTOM EMBROIDERY · WILMINGTON, NC' },
  { name: 'ad6-embroidery-es.jpg',  photo: 'apparel/service-caps.jpg',      headline: 'TU MARCA. EN CADA HILO.',              subtext: 'BORDADO PERSONALIZADO · WILMINGTON, NC' },
  { name: 'ad7-apparel-en.jpg',     photo: 'apparel/20220207_154015.jpg',    headline: 'YOUR TEAM SHOULD LOOK LIKE A TEAM.',    subtext: 'CUSTOM APPAREL · WILMINGTON, NC' },
  { name: 'ad8-apparel-es.jpg',     photo: 'apparel/team-booth.jpg',        headline: 'TU EQUIPO DEBE LUCIR COMO UN EQUIPO.', subtext: 'ROPA PERSONALIZADA · WILMINGTON, NC' },
];

const CANVAS = 1080;
const PADDING = 64;            // text left padding
const LOGO_W = 120;            // logo target width
const LOGO_MARGIN = 40;        // logo top/right margin
const HEADLINE_FROM_BOTTOM = 90;
const SUBTEXT_FROM_BOTTOM = 40;

function escapeXml(s) {
  return s.replace(/[<>&"']/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;'
  }[c]));
}

// Premium look: scale the headline font so it always fits one line.
// Spec baseline is 48px; we go bigger when there is room, shrink for long headlines.
function pickHeadlineSize(len) {
  if (len <= 22) return 64;
  if (len <= 26) return 60;
  if (len <= 29) return 54;
  if (len <= 32) return 48;
  if (len <= 35) return 44;
  return 40;
}

async function makeAd(ad) {
  const photoPath = path.join(PROJECT, 'public/images', ad.photo);
  const logoPath  = path.join(PROJECT, 'public/LOGO.png');
  const outPath   = path.join(OUT_DIR, ad.name);

  // ---- 1. Photo: cover-crop to 1080x1080 (respect EXIF orientation) ----
  const photoBase = await sharp(photoPath)
    .rotate()                                   // honor EXIF orientation
    .resize(CANVAS, CANVAS, { fit: 'cover', position: 'center' })
    .toBuffer();

  // ---- 2. Dark gradient overlay (top 40% transparent → bottom 60% dark) ----
  // 0–40% transparent, then ramps to rgba(5,5,16,0.92) at the very bottom.
  const overlaySvg = `<svg width="${CANVAS}" height="${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgb(5,5,16)" stop-opacity="0"/>
      <stop offset="40%"  stop-color="rgb(5,5,16)" stop-opacity="0"/>
      <stop offset="70%"  stop-color="rgb(5,5,16)" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="rgb(5,5,16)" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="url(#dark)"/>
</svg>`;

  // ---- 3. Logo: 120px wide, 50% opacity (multiply alpha channel by 0.5) ----
  const logoMeta = await sharp(logoPath).metadata();
  const logoH = Math.round(LOGO_W * logoMeta.height / logoMeta.width);
  const logoRaw = await sharp(logoPath)
    .resize(LOGO_W, logoH, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer();
  for (let i = 3; i < logoRaw.length; i += 4) {
    logoRaw[i] = Math.round(logoRaw[i] * 0.5);   // 50% opacity
  }
  const logoPng = await sharp(logoRaw, {
    raw: { width: LOGO_W, height: logoH, channels: 4 }
  }).png().toBuffer();

  // ---- 4. Text SVG: brand-gradient headline + gray subtext ----
  const hSize = pickHeadlineSize(ad.headline.length);
  const sSize = 24;
  const headlineBaselineY = CANVAS - HEADLINE_FROM_BOTTOM;
  const subtextBaselineY  = CANVAS - SUBTEXT_FROM_BOTTOM;

  const textSvg = `<svg width="${CANVAS}" height="${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${BRAND[0]}"/>
      <stop offset="35%"  stop-color="${BRAND[1]}"/>
      <stop offset="68%"  stop-color="${BRAND[2]}"/>
      <stop offset="100%" stop-color="${BRAND[3]}"/>
    </linearGradient>
  </defs>
  <text x="${PADDING}" y="${headlineBaselineY}"
        font-family="Geist, sans-serif" font-weight="800" font-size="${hSize}"
        fill="url(#brandGrad)" letter-spacing="-1.5"
        text-rendering="geometricPrecision">${escapeXml(ad.headline)}</text>
  <text x="${PADDING}" y="${subtextBaselineY}"
        font-family="Geist, sans-serif" font-weight="500" font-size="${sSize}"
        fill="#9aa0b4" letter-spacing="3.5"
        text-rendering="geometricPrecision">${escapeXml(ad.subtext)}</text>
</svg>`;

  // ---- 5. Composite everything onto the photo ----
  const logoX = CANVAS - LOGO_W - LOGO_MARGIN;
  const logoY = LOGO_MARGIN;

  await sharp(photoBase)
    .composite([
      { input: Buffer.from(overlaySvg), blend: 'over' },
      { input: logoPng,                 blend: 'over', left: logoX, top: logoY },
      { input: Buffer.from(textSvg),    blend: 'over' },
    ])
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outPath);

  const stat = await fs.stat(outPath);
  return { name: ad.name, bytes: stat.size, hSize };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const results = [];
  for (const ad of ADS) {
    const r = await makeAd(ad);
    console.log(`✓ ${r.name.padEnd(28)}  font=${r.hSize}px  ${(r.bytes / 1024).toFixed(1)} KB`);
    results.push(r);
  }
  const totalKB = results.reduce((s, r) => s + r.bytes, 0) / 1024;
  console.log(`\n✅ Created ${results.length} ads in ${OUT_DIR}`);
  console.log(`   Total size: ${totalKB.toFixed(1)} KB`);
}

main().catch(e => { console.error(e); process.exit(1); });
