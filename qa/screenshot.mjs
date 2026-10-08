// BGC-003 visual regression harness — captures full-page screenshots of the
// reference HTML and the Next.js app at the required viewport widths.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const REF = 'http://127.0.0.1:3200/BGC%20Holding.html';
const APP = 'http://localhost:3100/';
const WIDTHS = [375, 430, 768, 1024, 1440, 1920];
const OUT = 'qa/shots';

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--no-sandbox'],
});

for (const width of WIDTHS) {
  for (const [name, url] of [['ref', REF], ['app', APP]]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    // Scroll through the page so IntersectionObserver reveals fire, then back to top.
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const t = setInterval(() => {
          y += 600;
          window.scrollTo(0, y);
          if (y >= document.body.scrollHeight) {
            clearInterval(t);
            res();
          }
        }, 60);
      });
    });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
    // Also capture the hero (top of page) for detail comparison.
    await page.screenshot({ path: `${OUT}/${name}-${width}-hero.png` });
    // Horizontal overflow check
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    console.log(`${name}-${width}: overflow=${overflow}px`);
    await page.close();
  }
}

await browser.close();
console.log('done');
