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
  const server = spawn('npx', ['next', 'dev', '-p', '3001', '-H', '0.0.0.0'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  let serverOutput = '';
  server.stdout.on('data', (d) => { serverOutput += d.toString(); });
  server.stderr.on('data', (d) => { serverOutput += d.toString(); });

  try {
    await waitForServer('http://localhost:3001', 20000);
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
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3001...');
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 });
  } catch(e) {
    console.log('Nav error:', e.message.substring(0, 200));
  }
  console.log('Page URL:', page.url());
  
  // Wait for dynamic content
  await page.waitForTimeout(5000);

  // Check page content
  const pageText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log('\n=== Page Text ===');
  console.log(pageText);

  // Check for error overlay
  const errorHtml = await page.evaluate(() => {
    const errorEl = document.querySelector('[data-nextjs-dialog]') || document.querySelector('#__next-error');
    return errorEl ? errorEl.textContent.substring(0, 500) : 'No error overlay found';
  });
  console.log('\n=== Error Overlay ===');
  console.log(errorHtml);

  // Check what scripts are loaded
  const scriptInfo = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.textContent.substring(0, 80));
    return scripts.filter(s => s.length > 0);
  });
  console.log('\n=== Scripts ===');
  console.log(JSON.stringify(scriptInfo, null, 2));

  // Check the server logs
  console.log('\n=== Server Output ===');
  console.log(serverOutput.substring(serverOutput.length - 1000));

  await browser.close();
  server.kill();
  process.exit(0);
})();
