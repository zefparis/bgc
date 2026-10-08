// BGC-003 functional validation — drives the app in headless Chrome.
import { chromium } from '@playwright/test';

const APP = 'http://localhost:3100/';
let pass = 0;
let fail = 0;
const results = [];
function report(name, ok, detail = '') {
  if (ok) pass++; else fail++;
  results.push(`${ok ? 'PASS' : 'FAIL'} — ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });

// ── Desktop context ──────────────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(APP, { waitUntil: 'networkidle' });

  // No unexpected third-party script execution
  const extScripts = await page.evaluate(() =>
    [...document.scripts]
      .map((s) => s.src)
      .filter((src) => src && !src.startsWith(location.origin)),
  );
  report('no external script tags', extScripts.length === 0, extScripts.join(', '));

  // CSP header present (from response)
  // (checked separately via curl; here we assert no CSP console violations)
  const cspViolations = errors.filter((e) => /content security policy/i.test(e));
  report('no CSP violations in console', cspViolations.length === 0, errors.join(' | '));

  // Nav scrolled class
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);
  const scrolled = await page.evaluate(() =>
    document.querySelector('header.nav').classList.contains('scrolled'),
  );
  report('nav gains .scrolled on scroll', scrolled);
  await page.evaluate(() => window.scrollTo(0, 0));

  // Anchor navigation
  await page.click('a[href="#about"]');
  await page.waitForTimeout(900); // smooth scroll
  const aboutTop = await page.evaluate(() => {
    const el = document.querySelector('#about');
    return Math.abs(el.getBoundingClientRect().top) < 120;
  });
  report('anchor scroll reaches #about', aboutTop);

  // Active link tracking
  const activeHref = await page.evaluate(() => {
    const a = document.querySelector('.nav-links a.active');
    return a ? a.getAttribute('href') : null;
  });
  report('active nav link tracks scroll position', activeHref === '#about', `got ${activeHref}`);

  // Contact modal opens via nav CTA
  await page.click('a.nav-cta');
  await page.waitForTimeout(400);
  const modalOpen = await page.evaluate(() =>
    document.querySelector('.modal-backdrop').classList.contains('open'),
  );
  report('contact modal opens via Contact us', modalOpen);

  // Focus moves into modal
  const focused = await page.evaluate(
    () => document.activeElement?.getAttribute('name'),
  );
  report('focus lands on name input', focused === 'name', `got ${focused}`);

  // Body scroll locked
  const locked = await page.evaluate(() => document.body.style.overflow === 'hidden');
  report('body scroll locked while open', locked);

  // Escape closes
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const modalClosed = await page.evaluate(
    () => !document.querySelector('.modal-backdrop').classList.contains('open'),
  );
  report('Escape closes modal', modalClosed);
  const unlocked = await page.evaluate(() => document.body.style.overflow === '');
  report('body scroll restored on close', unlocked);

  // Focus returns to the element that opened the modal
  const focusRestored = await page.evaluate(
    () => document.activeElement === document.querySelector('a.nav-cta'),
  );
  report('focus restored to trigger on close', focusRestored);

  // Reopen — focus trap: Tab on last element wraps to first, Shift+Tab wraps back
  await page.click('a.nav-cta');
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const card = document.querySelector('.modal-card');
    const focusables = card.querySelectorAll(
      'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])',
    );
    focusables[focusables.length - 1].focus();
  });
  await page.keyboard.press('Tab');
  const wrappedForward = await page.evaluate(() => {
    const card = document.querySelector('.modal-card');
    const first = card.querySelector('button.modal-close');
    return document.activeElement === first;
  });
  await page.keyboard.press('Shift+Tab');
  const wrappedBack = await page.evaluate(() => {
    const card = document.querySelector('.modal-card');
    const focusables = card.querySelectorAll(
      'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])',
    );
    return document.activeElement === focusables[focusables.length - 1];
  });
  report('Tab cycles focus within modal (focus trap)', wrappedForward && wrappedBack);

  // Empty submit shows validation error, no thanks
  await page.click('.modal-submit');
  await page.waitForTimeout(200);
  const errShown = await page.evaluate(() =>
    document.querySelector('.submit-error').classList.contains('show'),
  );
  const thanksAbsent = await page.evaluate(
    () => !document.querySelector('.contact-thanks'),
  );
  report('empty submit shows validation error', errShown);
  report('no success shown on invalid submit', thanksAbsent);

  // Valid submit → 503 → mailto fallback (intercept navigation)
  await page.fill('input[name="name"]', 'QA Tester');
  await page.fill('input[name="email"]', 'qa@example.com');
  await page.fill('textarea[name="message"]', 'Functional test message');
  let mailtoUrl = null;
  page.on('framenavigated', (f) => {
    if (f.url.startsWith('mailto:')) mailtoUrl = f.url;
  });
  // mailto: doesn't navigate frame in headless; capture via location change attempt
  await page.evaluate(() => {
    // Intercept location.href assignment to inspect mailto target
    const orig = Object.getOwnPropertyDescriptor(window, 'location');
    window.__mailto = null;
    try {
      Object.defineProperty(window, 'location', {
        configurable: true,
        get: () => orig.get.call(window),
        set: (v) => { window.__mailto = v; },
      });
    } catch { /* location may not be redefinable; fall back below */ }
  });
  await page.click('.modal-submit');
  await page.waitForTimeout(1200);
  // 503 → mailto fallback shows the "Almost done" state, NOT the
  // "message has been received" copy — no misleading success.
  const fallbackShown = await page.evaluate(() => {
    const el = document.querySelector('.contact-thanks');
    return el ? el.textContent.includes('email client') : false;
  });
  const falseSuccess = await page.evaluate(() => {
    const el = document.querySelector('.contact-thanks');
    return el ? el.textContent.includes('has been received') : false;
  });
  report('unconfigured API → mailto fallback state shown',
    fallbackShown,
    `mailto=${mailtoUrl ?? 'n/a'}`);
  report('fallback does NOT claim delivery', !falseSuccess);

  await page.close();
}

// ── Mobile context (375px) ───────────────────────────────────
{
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto(APP, { waitUntil: 'networkidle' });

  const burgerVisible = await page.evaluate(() => {
    const b = document.querySelector('.nav-burger');
    return getComputedStyle(b).display !== 'none';
  });
  report('burger visible at 375px', burgerVisible);

  const linksHidden = await page.evaluate(() => {
    const l = document.querySelector('.nav-links');
    return getComputedStyle(l).display === 'none';
  });
  report('desktop links hidden at 375px', linksHidden);

  await page.click('.nav-burger');
  await page.waitForTimeout(400);
  const menuOpen = await page.evaluate(() =>
    document.querySelector('.nav-mobile').classList.contains('open'),
  );
  const ariaExpanded = await page.evaluate(
    () => document.querySelector('.nav-burger').getAttribute('aria-expanded') === 'true',
  );
  report('burger opens mobile menu', menuOpen);
  report('aria-expanded reflects state', ariaExpanded);

  await page.click('.nav-mobile a[href="#business"]');
  await page.waitForTimeout(1000);
  const menuClosed = await page.evaluate(
    () => !document.querySelector('.nav-mobile').classList.contains('open'),
  );
  const atBusiness = await page.evaluate(() => {
    const el = document.querySelector('#business');
    return el.getBoundingClientRect().top < 200;
  });
  report('mobile link navigates and closes menu', menuClosed && atBusiness);

  // Modal on mobile
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('.nav-burger');
  await page.waitForTimeout(300);
  await page.click('.nav-mobile-cta');
  await page.waitForTimeout(400);
  const mOpen = await page.evaluate(() =>
    document.querySelector('.modal-backdrop').classList.contains('open'),
  );
  report('mobile Contact us opens modal', mOpen);

  await page.close();
}

// ── Reduced motion ───────────────────────────────────────────
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  const heroAnimated = await page.evaluate(() => {
    const h1 = document.querySelector('.hero h1');
    const a = getComputedStyle(h1).animationName;
    return a === 'none';
  });
  report('prefers-reduced-motion disables hero animation', heroAnimated);
  const revealVisible = await page.evaluate(() => {
    const el = document.querySelector('.reveal');
    return getComputedStyle(el).opacity === '1';
  });
  report('reveal elements visible under reduced-motion', revealVisible);
  await page.close();
}

// ── Rate limiting (LAST — consumes the limiter bucket) ───────
{
  const statuses = [];
  for (let i = 0; i < 8; i++) {
    const res = await fetch(APP + 'api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rate Limit Probe',
        email: 'probe@example.com',
        message: 'rate limit probe',
      }),
    });
    statuses.push(res.status);
  }
  report(
    'rate limiter returns 429 after 5 req/10min',
    statuses.includes(429),
    statuses.join(','),
  );
  report(
    'API degrades gracefully (503→429, no 5xx crash)',
    statuses.every((s) => s === 503 || s === 429),
  );
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
