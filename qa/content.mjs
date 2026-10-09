// BGC-007 content-coverage validation — asserts, in a real browser render,
// that every item the BGC-006 audit found missing is now present, and that
// the unsupported legacy copy is gone. Runs against APP (default local prod
// server on :3100; override with APP=https://staging-url when reviewing).
import { chromium } from '@playwright/test';

const APP = process.env.APP ?? 'http://localhost:3100/';
let pass = 0;
let fail = 0;
const results = [];
function report(name, ok, detail = '') {
  if (ok) pass++;
  else fail++;
  results.push(`${ok ? 'PASS' : 'FAIL'} — ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const resp = await page.goto(APP, { waitUntil: 'networkidle' });
report('page loads', resp.status() === 200, `HTTP ${resp.status()}`);
// Reveal-on-scroll: bring every section into view before asserting.
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, 0));

const has = async (text) =>
  (await page.locator(`text=${JSON.stringify(text).slice(1, -1)}`).count()) > 0;

// ── Previously MISSING content (BGC-006) ──────────────────────
for (const [name, text] of [
  ['institutional disclaimer', 'do not constitute an offer'],
  ['governance intro (bankable)', 'bankable and legally executable'],
  ['GCC region card', 'Origination, trade flows and capital partners.'],
  ['legal-entity footnote', 'legal entity structure is available on request'],
  ['group headline', 'A holding company built to originate, structure and deliver.'],
  ['structure headline', 'One holding company. Eleven sector-focused operating companies.'],
  ['structure mandate line', 'written sector mandate'],
]) {
  report(`renders: ${name}`, await has(text));
}

// All 11 operating companies — name + description present.
const companies = [
  ['BGC Aviation', 'Aircraft sourcing, leasing structures'],
  ['BGC Automotive', 'Vehicle supply, fleet solutions'],
  ['BGC Contracting', 'Engineering, procurement and construction'],
  ['BGC Energy', 'Power generation and transmission'],
  ['BGC General Trading', 'Sourcing, import and export'],
  ['BGC Commodities', 'bitumen, petroleum products, coal, sulphur'],
  ['BGC Pharma', 'Pharmaceutical import, packaging'],
  ['BGC Security', 'Integrated security, surveillance'],
  ['BGC Drone Technologies', 'Unmanned aerial systems'],
  ['BGC Data Analytics', 'Data governance, analytics platforms'],
  ['BGC AI Center of Excellence', 'Applied AI research'],
];
for (const [name, desc] of companies) {
  report(`company rendered: ${name}`, await has(name) && (await has(desc)));
}

// Capability chips rendered.
report('capability chips rendered', await has('Drone-as-a-service'));
report('capability chips rendered (2)', await has('Sovereign AI'));

// Four regions present.
for (const r of ['Africa', 'GCC', 'Europe', 'Asia']) {
  report(`region card: ${r}`, (await page.locator(`.region-card:has-text("${r}")`).count()) > 0);
}
// GCC must not claim a physical office.
const gccOffice = await page
  .locator('.region-card:has-text("GCC") .region-office')
  .count();
report('GCC card claims no office', gccOffice === 0);

// ── Unsupported legacy copy removed ───────────────────────────
for (const [name, text] of [
  ['legacy hero tagline gone', 'Building businesses. Connecting markets. Delivering projects.'],
  ['legacy hero lede gone', 'We originate opportunities, deploy capital'],
  ['five-step flow gone', 'Understand'],
  ['"No two projects" gone', 'No two projects are the same.'],
  ['"other strategic markets" gone', 'other strategic markets'],
]) {
  report(name, !(await has(text)));
}

// ── Canonical content still intact ────────────────────────────
report('PDF headline is hero H1',
  (await page.locator('.hero h1').innerText()).includes(
    'Eleven operating companies. One execution platform.',
  ),
);
report('nine lifecycle steps', (await page.locator('.step').count()) === 9);
report('phase 09 present', await has('Exit & Succession'));
report('"maturity" wording', await has('concept through to maturity'));
report('partners listed', await has('African Energy Chamber') && (await has('CLG Global')));
report('contact details', await has('+27 11 245 5900') && (await has('info@bgcholding.com')));
report('Sandton address', await has('114 West Street'));

await browser.close();
console.log(results.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
