const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');

function waitForServer(url, timeout = 25000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (Date.now() - start > timeout) return reject(new Error('Server timeout'));
      http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304) resolve();
        else { res.resume(); setTimeout(check, 500); }
      }).on('error', () => setTimeout(check, 500));
    };
    check();
  });
}

(async () => {
  // Start the dev server
  console.log('Starting Next.js dev server...');
  const server = spawn('npx', ['next', 'dev', '-p', '3002', '-H', '0.0.0.0'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  let serverOutput = '';
  server.stdout.on('data', (d) => { serverOutput += d.toString(); });
  server.stderr.on('data', (d) => { serverOutput += d.toString(); });

  try {
    await waitForServer('http://localhost:3002', 25000);
    console.log('Server is up!');
  } catch (e) {
    console.log('Server output:', serverOutput.substring(serverOutput.length - 1000));
    console.error('Failed to start server:', e.message);
    process.exit(1);
  }

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text().substring(0, 200));
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message.substring(0, 200)));

  console.log('Navigating to http://localhost:3002...');
  try {
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle', timeout: 15000 });
  } catch(e) {
    console.log('Nav warning:', e.message.substring(0, 200));
  }
  console.log('Page loaded. Title:', await page.title());
  
  // Wait for dynamic content and any hydration errors
  await page.waitForTimeout(5000);

  // Check for error overlay
  const errorText = await page.evaluate(() => {
    const h2 = document.querySelector('h2');
    return h2 ? h2.textContent : 'No h2 found';
  });
  console.log('First h2 text:', errorText);

  // Find the Transformation heading
  const allH2 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim());
  });
  console.log('All h2 headings:', JSON.stringify(allH2));

  // Scroll to transformation section
  try {
    const heading = page.locator('h2').filter({ hasText: 'Invisible' }).first();
    const count = await heading.count();
    console.log('Transformation heading count:', count);
    if (count > 0) {
      await heading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      console.log('Scrolled to transformation section');
    }
  } catch (e) {
    console.log('Error finding heading:', e.message.substring(0, 200));
  }

  // Take screenshot
  await page.screenshot({ path: '/home/z/my-project/transformation-section.png', fullPage: false });
  console.log('Screenshot saved to transformation-section.png');

  // Run verification JavaScript
  const result = await page.evaluate(() => {
    const slider = document.querySelector('.cursor-grab');
    const beforeImg = document.querySelector('img[src*="before-brothers"]');
    const afterImg = document.querySelector('img[src*="after-brothers"]');
    return JSON.stringify({
      sliderFound: !!slider,
      beforeImgFound: !!beforeImg,
      afterImgFound: !!afterImg,
      sliderClasses: slider ? slider.className : null,
      aspectRatio: slider ? getComputedStyle(slider).aspectRatio : null
    });
  });
  console.log('\n=== Slider Verification Result ===');
  console.log(result);

  // Extra info
  const extraInfo = await page.evaluate(() => {
    const allCursorGrab = document.querySelectorAll('[class*="cursor-grab"]');
    const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src.split('/').pop(), alt: i.alt }));
    return JSON.stringify({
      cursorGrabCount: allCursorGrab.length,
      images: imgs.filter(i => i.src.includes('before') || i.src.includes('after') || i.src.includes('brother'))
    });
  });
  console.log('\n=== Extra Info ===');
  console.log(extraInfo);

  // Check server logs
  console.log('\n=== Server Output ===');
  console.log(serverOutput.substring(Math.max(0, serverOutput.length - 800)));

  await browser.close();
  server.kill();
  process.exit(0);
})();
