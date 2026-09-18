const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');

function waitForServer(url, timeout = 20000) {
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
  const server = spawn('npx', ['next', 'dev', '-p', '3000', '-H', '0.0.0.0'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  let serverOutput = '';
  server.stdout.on('data', (d) => { serverOutput += d.toString(); });
  server.stderr.on('data', (d) => { serverOutput += d.toString(); });

  try {
    await waitForServer('http://localhost:3000', 20000);
    console.log('Server is up!');
  } catch (e) {
    console.log('Server output:', serverOutput.substring(serverOutput.length - 500));
    console.error('Failed to start server:', e.message);
    process.exit(1);
  }

  // Launch browser
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  console.log('Page loaded. Title:', await page.title());
  
  // Wait for dynamic content
  await page.waitForTimeout(3000);

  // Find the Transformation heading
  const headingSelector = 'h2:has-text("From Invisible to Impossible to Ignore")';
  try {
    const heading = page.locator(headingSelector).first();
    const count = await heading.count();
    console.log('Heading "From Invisible to Impossible to Ignore" count:', count);
    if (count > 0) {
      await heading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      console.log('Scrolled to transformation section');
    } else {
      // Try broader search
      const pageText = await page.evaluate(() => {
        const allH2 = Array.from(document.querySelectorAll('h2'));
        return allH2.map(h => h.textContent.trim());
      });
      console.log('All h2 headings found:', JSON.stringify(pageText));
      
      // Try finding by partial text
      const altHeading = page.locator('h2').filter({ hasText: 'Invisible' }).first();
      if (await altHeading.count() > 0) {
        console.log('Found heading via partial text match');
        await altHeading.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
      }
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

  // Also dump some extra info for debugging
  const extraInfo = await page.evaluate(() => {
    const allCursorGrab = document.querySelectorAll('[class*="cursor-grab"]');
    const allImgSrcs = Array.from(document.querySelectorAll('img')).map(i => i.src.split('/').pop()).filter(s => s.includes('before') || s.includes('after') || s.includes('brother'));
    return JSON.stringify({
      cursorGrabElements: allCursorGrab.length,
      imgsWithBeforeAfter: allImgSrcs,
      allImgSrcs: Array.from(document.querySelectorAll('img')).map(i => i.src.split('/').pop())
    });
  });
  console.log('\n=== Extra Debug Info ===');
  console.log(extraInfo);

  await browser.close();
  server.kill();
  process.exit(0);
})();
