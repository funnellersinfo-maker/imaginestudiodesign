import sharp from 'sharp';
const svg = `<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#C62285"/>
      <stop offset="50%" stop-color="#6A3DFF"/>
      <stop offset="100%" stop-color="#2D7FE0"/>
    </linearGradient>
  </defs>
  <rect width="600" height="200" fill="#0a0a1f"/>
  <text x="50" y="100" font-family="Geist" font-weight="800" font-size="48" fill="url(#g)">PREMIUM GRADIENT TEST</text>
  <text x="50" y="150" font-family="Geist" font-weight="500" font-size="20" fill="#888">SUBTEXT · WILMINGTON NC</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('/tmp/grad-test.png');
console.log('OK saved');
const m = await sharp('/tmp/grad-test.png').metadata();
console.log('size:', m.width+'x'+m.height);
