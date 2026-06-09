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
  const server = spawn('npx', ['next', 'dev', '-p', '3003', '-H', '0.0.0.0'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await waitForServer('http://localhost:3003', 25000);
  console.log('Server is up!');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('http://localhost:3003', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(5000);

  // Scroll to transformation section heading
  const heading = page.locator('h2').filter({ hasText: 'Invisible' }).first();
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  // Take viewport screenshot showing the transformation section area
  await page.screenshot({ path: '/home/z/my-project/transformation-section.png' });
  console.log('Viewport screenshot saved');

  // Run the exact verification JS from the task
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

  await browser.close();
  server.kill('SIGTERM');
  process.exit(0);
})();
