// BGC-003 — Web Vitals measurement against the production build.
// Local indicator only; production Lighthouse/Web Vitals run post-deploy.
import { chromium } from '@playwright/test';
const APP = 'http://localhost:3100/';
const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__lcp = 0;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__lcp = e.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
});
await page.goto(APP, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const m = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const paints = performance.getEntriesByType('paint');
  const res = performance.getEntriesByType('resource');
  let cls = 0;
  for (const e of performance.getEntriesByType('layout-shift'))
    if (!e.hadRecentInput) cls += e.value;
  return {
    ttfb: Math.round(nav.responseStart * 10) / 10,
    fcp: Math.round(paints.find(p => p.name === 'first-contentful-paint')?.startTime),
    lcp: Math.round(window.__lcp),
    cls: +cls.toFixed(4),
    domLoaded: Math.round(nav.domContentLoadedEventEnd),
    loaded: Math.round(nav.loadEventEnd),
    transferKB: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
    resources: res.length,
  };
});
console.log(JSON.stringify(m, null, 1));
await browser.close();
