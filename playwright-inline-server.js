const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

(async () => {
  // Step 1: Start the server in the same process
  console.log('Starting Next.js production server...');
  const server = spawn('node', ['.next/standalone/server.js'], {
    cwd: '/home/z/my-project',
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Wait for server to be ready
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:3000/', (r) => {
          let data = '';
          r.on('data', chunk => data += chunk);
          r.on('end', () => resolve({ status: r.statusCode, data }));
        }).on('error', reject);
      });
      if (res.status === 200) {
        serverReady = true;
        console.log('Server ready! Status:', res.status);
        break;
      }
    } catch (e) {
      // not ready yet
    }
  }

  if (!serverReady) {
    console.error('Server failed to start');
    server.kill();
    process.exit(1);
  }

  // Step 2: Launch Playwright browser
  console.log('Launching Playwright browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    deviceScaleFactor: 3
  });

  const page = await context.newPage();

  // Step 3: Navigate
  console.log('Navigating to http://127.0.0.1:3000/ ...');
  try {
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'load', timeout: 20000 });
    console.log('Page loaded. Title:', await page.title());
    console.log('URL:', page.url());
  } catch (e) {
    console.error('Navigation error:', e.message);
    // Try to continue
  }

  // Wait for hydration
  await page.waitForTimeout(5000);

  // Step 4: Take screenshot of the hero section
  // First get the hero section bounds
  const heroBounds = await page.evaluate(() => {
    const heroSection = document.querySelector('section.min-h-screen');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) };
    }
    return null;
  });
  
  console.log('Hero section bounds:', JSON.stringify(heroBounds));

  if (heroBounds) {
    // Screenshot just the hero section
    await page.screenshot({
      path: '/home/z/my-project/hero-mobile-check.png',
      clip: { x: 0, y: 0, width: 375, height: Math.min(heroBounds.height + 20, 812) }
    });
    console.log('Hero screenshot saved to hero-mobile-check.png');
  } else {
    await page.screenshot({ path: '/home/z/my-project/hero-mobile-check.png', fullPage: false });
    console.log('Full viewport screenshot saved (hero not found)');
  }

  // Step 5: Run the overlap check JavaScript
  const result = await page.evaluate(() => {
    const content = document.querySelector('.min-h-screen .max-w-5xl');
    if (!content) {
      return JSON.stringify({
        error: 'Selector .min-h-screen .max-w-5xl not found',
        hasMinHScreen: !!document.querySelector('.min-h-screen'),
        hasMaxW5xl: !!document.querySelector('.max-w-5xl'),
        bodyChildCount: document.body.children.length,
        title: document.title,
        url: window.location.href
      });
    }
    const children = content.children;
    const results = [];

    for (let i = 0; i < children.length - 1; i++) {
      const a = children[i].getBoundingClientRect();
      const b = children[i+1].getBoundingClientRect();
      const gap = b.top - a.bottom;
      results.push({
        idx: i,
        element: children[i].tagName + (children[i].className ? ' ' + children[i].className.substring(0, 60) : ''),
        top: Math.round(a.top),
        bottom: Math.round(a.bottom),
        gapToNext: Math.round(gap)
      });
    }

    // Check if language toggle overlaps with badge
    const toggle = document.querySelector('[aria-label*="Cambiar"]') || document.querySelector('[aria-label*="Switch"]') || document.querySelector('[aria-label*="Language"]');
    const badge = content.querySelector('.inline-flex');
    if (toggle && badge) {
      const tRect = toggle.getBoundingClientRect();
      const bRect = badge.getBoundingClientRect();
      results.push({
        check: 'toggle_vs_badge',
        toggleBottom: Math.round(tRect.bottom),
        badgeTop: Math.round(bRect.top),
        gap: Math.round(bRect.top - tRect.bottom),
        overlaps: bRect.top < tRect.bottom
      });
    }

    results.unshift({ pageURL: window.location.href, pageTitle: document.title });
    return JSON.stringify(results, null, 2);
  });

  console.log('\n=== JavaScript Evaluation Result ===');
  console.log(result);

  // Cleanup
  await browser.close();
  server.kill();
  process.exit(0);
})();
