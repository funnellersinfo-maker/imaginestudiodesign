const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    deviceScaleFactor: 3
  });

  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:81/ ...');
  try {
    await page.goto('http://127.0.0.1:81/', { waitUntil: 'load', timeout: 20000 });
    console.log('Page loaded. Title:', await page.title());
    console.log('URL:', page.url());
  } catch (e) {
    console.error('Navigation error:', e.message);
  }

  // Wait extra for hydration
  console.log('Waiting 5s for hydration...');
  await page.waitForTimeout(5000);

  // Get page content for debugging
  const htmlContent = await page.content();
  console.log('Page HTML length:', htmlContent.length);
  console.log('First 1000 chars:', htmlContent.substring(0, 1000));

  // Take screenshot
  await page.screenshot({ path: '/home/z/my-project/hero-mobile-viewport-check.png', fullPage: false });
  console.log('Screenshot saved to hero-mobile-viewport-check.png');

  // Run JS to inspect the DOM
  const debugResult = await page.evaluate(() => {
    const body = document.body;
    const topClasses = Array.from(body.children).map(c => ({
      tag: c.tagName,
      id: c.id,
      classes: c.className,
      childCount: c.children.length
    }));
    
    // Check all elements with min-h-screen or max-w-5xl classes
    const minHElements = document.querySelectorAll('[class*="min-h"]');
    const maxWElements = document.querySelectorAll('[class*="max-w"]');
    
    return {
      title: document.title,
      bodyChildCount: body.children.length,
      topElements: topClasses.slice(0, 10),
      minHScreenElements: Array.from(minHElements).map(e => e.tagName + '.' + e.className.substring(0, 60)).slice(0, 5),
      maxWElements: Array.from(maxWElements).map(e => e.tagName + '.' + e.className.substring(0, 60)).slice(0, 5),
      bodyHTML: body.innerHTML.substring(0, 500)
    };
  });
  console.log('\n=== DOM Debug ===');
  console.log(JSON.stringify(debugResult, null, 2));

  await browser.close();
  process.exit(0);
})();
