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
    await page.goto('http://127.0.0.1:81/', { waitUntil: 'networkidle', timeout: 20000 });
    console.log('Page loaded. Title:', await page.title());
    console.log('URL:', page.url());
  } catch (e) {
    console.error('Navigation error:', e.message);
    // Try to continue anyway
  }

  // Wait for dynamic content
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: '/home/z/my-project/hero-mobile-viewport-check.png', fullPage: false });
  console.log('Screenshot saved to hero-mobile-viewport-check.png');

  // Run the JavaScript to check vertical spacing
  const jsCode = `
    (() => {
      const content = document.querySelector(".min-h-screen .max-w-5xl");
      if (!content) {
        const hasMinH = document.querySelector(".min-h-screen");
        const hasMaxW = document.querySelector(".max-w-5xl");
        return JSON.stringify({
          error: "Selector .min-h-screen .max-w-5xl not found",
          hasMinHScreen: !!hasMinH,
          hasMaxW5xl: !!hasMaxW,
          minHClasses: hasMinH ? hasMinH.className.substring(0, 80) : null,
          maxWClasses: hasMaxW ? hasMaxW.className.substring(0, 80) : null,
          topLevelClasses: Array.from(document.body.children).map(c => c.tagName + "." + (c.className || "").substring(0, 50)).join(", "),
          pageTitle: document.title,
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
          element: children[i].tagName + (children[i].className ? " " + children[i].className.substring(0, 60) : ""),
          top: Math.round(a.top),
          bottom: Math.round(a.bottom),
          gapToNext: Math.round(gap)
        });
      }
      const toggle = document.querySelector("[aria-label*=Cambiar]") || document.querySelector("[aria-label*=Switch]") || document.querySelector("[aria-label*=Language]");
      const badge = content.querySelector(".inline-flex");
      if (toggle && badge) {
        const tRect = toggle.getBoundingClientRect();
        const bRect = badge.getBoundingClientRect();
        results.push({
          check: "toggle_vs_badge",
          toggleBottom: Math.round(tRect.bottom),
          badgeTop: Math.round(bRect.top),
          gap: Math.round(bRect.top - tRect.bottom),
          overlaps: bRect.top < tRect.bottom
        });
      }
      results.unshift({ pageURL: window.location.href, pageTitle: document.title });
      return JSON.stringify(results, null, 2);
    })();
  `;

  const result = await page.evaluate(jsCode);
  console.log('\n=== JavaScript Evaluation Result ===');
  console.log(result);

  await browser.close();
  process.exit(0);
})();
