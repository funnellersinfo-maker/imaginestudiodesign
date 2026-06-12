const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const CDP_PORT = 34081;
const WS_URL = 'ws://127.0.0.1:34081/devtools/page/A3D188ADD24FE27A8FF8F5CE9B4B166C';

let id = 1;
function send(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === msgId) {
        ws.removeListener('message', handler);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

function waitForEvent(ws, method, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.removeListener('message', handler);
      reject(new Error('Timeout waiting for ' + method));
    }, timeout);
    const handler = (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.method === method) {
        clearTimeout(timer);
        ws.removeListener('message', handler);
        resolve(msg.params);
      }
    };
    ws.on('message', handler);
  });
}

async function main() {
  const ws = new WebSocket(WS_URL);
  
  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });
  console.log('Connected to CDP');

  // Enable page events
  await send(ws, 'Page.enable');
  
  // Set viewport to mobile
  await send(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    mobile: true
  });
  console.log('Viewport set to 375x812');

  // Navigate to localhost
  const navPromise = waitForEvent(ws, 'Page.loadEventFired', 15000);
  await send(ws, 'Page.navigate', { url: 'http://127.0.0.1:3000/' });
  
  try {
    await navPromise;
    console.log('Page loaded successfully');
  } catch (e) {
    console.error('Page load timeout, continuing...');
  }

  // Wait for dynamic content to render
  await new Promise(r => setTimeout(r, 4000));

  // Take full hero screenshot
  const screenshotResult = await send(ws, 'Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 375, height: 812, scale: 1 }
  });
  
  fs.writeFileSync('/home/z/my-project/hero-mobile-viewport-check.png', Buffer.from(screenshotResult.data, 'base64'));
  console.log('Screenshot saved to hero-mobile-viewport-check.png');

  // Run the JavaScript to check vertical spacing
  const jsCode = [
    '(() => {',
    '  const content = document.querySelector(".min-h-screen .max-w-5xl");',
    '  if (!content) {',
    '    const hasMinH = document.querySelector(".min-h-screen");',
    '    const hasMaxW = document.querySelector(".max-w-5xl");',
    '    return JSON.stringify({',
    '      error: "Selector .min-h-screen .max-w-5xl not found",',
    '      hasMinHScreen: !!hasMinH,',
    '      hasMaxW5xl: !!hasMaxW,',
    '      minHClasses: hasMinH ? hasMinH.className.substring(0, 80) : null,',
    '      maxWClasses: hasMaxW ? hasMaxW.className.substring(0, 80) : null,',
    '      topLevelClasses: Array.from(document.body.children).map(c => c.tagName + "." + (c.className || "").substring(0, 50)).join(", "),',
    '      pageTitle: document.title,',
    '      htmlSnippet: document.documentElement.outerHTML.substring(0, 2000)',
    '    });',
    '  }',
    '  const children = content.children;',
    '  const results = [];',
    '  for (let i = 0; i < children.length - 1; i++) {',
    '    const a = children[i].getBoundingClientRect();',
    '    const b = children[i+1].getBoundingClientRect();',
    '    const gap = b.top - a.bottom;',
    '    results.push({',
    '      idx: i,',
    '      element: children[i].tagName + (children[i].className ? " " + children[i].className.substring(0, 60) : ""),',
    '      top: Math.round(a.top),',
    '      bottom: Math.round(a.bottom),',
    '      gapToNext: Math.round(gap)',
    '    });',
    '  }',
    '  const toggle = document.querySelector("[aria-label*=Cambiar]") || document.querySelector("[aria-label*=Switch]") || document.querySelector("[aria-label*=Language]");',
    '  const badge = content.querySelector(".inline-flex");',
    '  if (toggle && badge) {',
    '    const tRect = toggle.getBoundingClientRect();',
    '    const bRect = badge.getBoundingClientRect();',
    '    results.push({',
    '      check: "toggle_vs_badge",',
    '      toggleBottom: Math.round(tRect.bottom),',
    '      badgeTop: Math.round(bRect.top),',
    '      gap: Math.round(bRect.top - tRect.bottom),',
    '      overlaps: bRect.top < tRect.bottom',
    '    });',
    '  }',
    '  results.unshift({ pageURL: window.location.href, pageTitle: document.title });',
    '  return JSON.stringify(results, null, 2);',
    '})();'
  ].join('\n');

  const evalResult = await send(ws, 'Runtime.evaluate', {
    expression: jsCode,
    returnByValue: true,
    awaitPromise: true
  });
  
  console.log('\\n=== JavaScript Evaluation Result ===');
  if (evalResult.result.value) {
    console.log(evalResult.result.value);
  } else {
    console.log(JSON.stringify(evalResult.result, null, 2));
  }

  ws.close();
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
