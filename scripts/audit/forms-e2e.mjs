/**
 * Formalarni soxta server bilan brauzerda sinash: /apply (UZ/RU/EN), /avtosalon, /ishlab-chiqarish, /card.
 *   npx vite preview --port 4173   (boshqa oynada)
 *   FORMS=apply,avtosalon node scripts/audit/forms-e2e.mjs
 * Haqiqiy server (script.google.com) ga hech qanday so‘rov ketmaydi — hammasi page.route bilan ushlanadi.
 */
import { chromium } from 'playwright';

const B = process.env.BASE || 'http://localhost:4173';
const ONLY = (process.env.FORMS || '').split(',').filter(Boolean);
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
let pass = 0; let fail = 0;
const log = (form, k, v) => {
  if (v === true) pass++; else if (v === false) fail++;
  console.log(`${v === true ? 'PASS' : v === false ? 'FAIL' : 'INFO'} [${form}] ${k}${v !== true && v !== false ? ': ' + v : ''}`);
};

const pickRadio = async (page, name, value) => {
  const sel = value === undefined ? `input[name="${name}"]` : `input[name="${name}"][value="${value}"]`;
  const input = page.locator(sel).first();
  const id = await input.getAttribute('id');
  const label = id ? page.locator(`label[for="${id}"]`) : page.locator(`label:has(${sel})`).first();
  if (id && await label.count()) await label.first().click(); else await page.locator(`label:has(${sel})`).first().click();
};

const FORMS = {
  ishlab: {
    url: '/ishlab-chiqarish', scope: '#ariza-card', success: /Arizangiz (qabul qilindi|yangilandi)/, first: 'name',
    phoneStep: 0, needsFp: true,
    steps: [async (p, name) => {
      await p.fill('#name', name); await p.fill('#phone', '901234567'); await p.fill('#product', 'Krovat va shkaflar');
      await p.fill('#region', 'Namangan'); await pickRadio(p, 'channel', 'Chakana'); await pickRadio(p, 'budget', '$500–$1,000');
    }],
  },
  avtosalon: {
    url: '/avtosalon', scope: '#ariza', draft: ['#dealer', 'Sinov Avto'], success: /Arizangiz qabul qilindi|yangilandi/, first: 'dealer', phoneStep: 3, needsFp: true,
    steps: [
      async (p) => {
        await p.fill('#dealer', 'Sinov Avto'); await p.selectOption('#region', 'Toshkent shahri'); await p.fill('#instagram', '@sinov_avto');
        await pickRadio(p, 'carTypes', 'Yangi avtomobillar'); await pickRadio(p, 'branches', '1'); await pickRadio(p, 'stock', '10–29');
      },
      async (p) => {
        await pickRadio(p, 'marketingOwner', 'Agentlik'); await pickRadio(p, 'targetStatus', 'Ha'); await pickRadio(p, 'budget', '$3,000–5,000');
        await p.fill('#monthlyLeads', '120');
      },
      async (p) => {
        await pickRadio(p, 'monthlySales', '10–29'); await pickRadio(p, 'salesStaff', '3–5'); await pickRadio(p, 'rop', 'Yo‘q');
        await pickRadio(p, 'crm', 'Yo‘q'); await pickRadio(p, 'leadSystem', 'Telegram');
      },
      async (p, name) => {
        await pickRadio(p, 'goals', 'Target reklamani kuchaytirish'); await p.fill('#problem', 'Murojaatlar sotuvgacha yetmaydi');
        await p.fill('#name', name); await p.fill('#position', 'Direktor'); await p.fill('#phone', '901234567'); await p.fill('#telegram', '@sinov_user');
      },
    ],
  },
  card: {
    url: '/card', scope: '[role=dialog]', kept: ['#problem', 'Murojaat kam'], success: /Arizangiz qabul qilindi/, first: 'name', phoneStep: 0, newIdOnChange: true,
    open: async (p) => { await p.locator('button[aria-haspopup=dialog]').first().click(); await p.waitForTimeout(600); },
    steps: [
      async (p, name) => { await p.fill('#name', name); await p.fill('#phone', '901234567'); await p.fill('#business', 'Sinov biznes'); await p.fill('#link', '@sinov_biz'); },
      async (p) => { await pickRadio(p, 'need', 'SMM'); await pickRadio(p, 'experience', 'Yo‘q'); await pickRadio(p, 'currentSpend', '$300 gacha'); },
      async (p) => { await pickRadio(p, 'readyBudget', '$500–1,000'); await p.fill('#problem', 'Murojaat kam'); },
    ],
  },
};
for (const [lang, prefix, ok] of [['uz', '', /Ariza qabul qilindi/], ['ru', '/ru', /Заявка получена/], ['en', '/en', /Application received/]]) {
  FORMS['apply-' + lang] = {
    url: prefix + '/apply', scope: 'form', success: ok, first: 'name', phoneStep: 4, contactField: true, siteForm: true, kept: ['#contact', '+998 90 123 45 67'],
    steps: [
      async (p, name) => { await p.fill('#name', name); await p.fill('#company', 'Sinov MChJ'); },
      async (p) => { await pickRadio(p, 'industry'); await pickRadio(p, 'revenue'); },
      async (p) => { await pickRadio(p, 'spend'); await pickRadio(p, 'budget'); },
      async (p) => { await pickRadio(p, 'problem'); await pickRadio(p, 'objective'); },
      async (p) => { await pickRadio(p, 'decision'); await p.fill('#contact', '+998 90 123 45 67'); },
    ],
  };
}

async function fresh(cfg, query = '', w = 390) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 700, hasTouch: w < 700 });
  const page = await ctx.newPage(); const reqs = []; let mode = 'ok'; const store = {};
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/script.google.com/**', async (route) => {
    const p = JSON.parse(route.request().postData()); reqs.push(p);
    const m = mode;
    if (m === 'lost') { store[p.submissionId] = p.fingerprint ?? JSON.stringify(p); return route.abort('connectionreset'); }
    if (m === 'offline') return route.abort('internetdisconnected');
    if (m === '500') return route.fulfill({ status: 500, body: 'err' });
    if (m === 'html') return route.fulfill({ status: 200, contentType: 'text/html', body: '<html>login</html>' });
    if (m === 'health') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"status":"FAZO application endpoint"}' });
    if (m === 'slow') await new Promise((r) => setTimeout(r, 3000));
    const key = p.fingerprint ?? JSON.stringify({ ...p, elapsed: '', submittedAt: '' });
    const had = store[p.submissionId]; store[p.submissionId] = key;
    const extra = had ? (had === key ? { duplicate: true } : { updated: true }) : {};
    return route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, saved: true, submissionId: p.submissionId, ...(p.fingerprint ? { fingerprint: p.fingerprint } : {}), ...extra }) });
  });
  await page.goto(B + cfg.url + query, { waitUntil: 'load' }); await page.waitForTimeout(1200);
  if (cfg.open) await cfg.open(page);
  return { ctx, page, reqs, errors, setMode: (m) => { mode = m; } };
}
const primary = (page, cfg) => page.locator(`${cfg.scope} button[type=submit]`).first();
const succeeded = async (page, cfg) => (await page.getByText(cfg.success).count()) > 0;
async function fillAll(page, cfg, name = 'Test Sinov') {
  for (let i = 0; i < cfg.steps.length; i++) {
    await cfg.steps[i](page, name);
    if (i < cfg.steps.length - 1) { await primary(page, cfg).click(); await page.waitForTimeout(700); }
  }
}
async function gotoStep(page, cfg, n, name = 'Test Sinov') {
  for (let i = 0; i < n; i++) { await cfg.steps[i](page, name); await primary(page, cfg).click(); await page.waitForTimeout(700); }
}
const waitDone = (page) => page.waitForTimeout(6000);

async function run(key, cfg) {
  const L = (k, v) => log(key, k, v);
  // 1. bo‘sh yuborish: so‘rov ketmaydi, aria-invalid + describedby, fokus birinchi xatoda
  { const { ctx, page, reqs } = await fresh(cfg);
    await primary(page, cfg).click(); await page.waitForTimeout(600);
    L('empty: no request', reqs.length === 0);
    const a = await page.evaluate((id) => { const el = document.getElementById(id); const d = el?.getAttribute('aria-describedby') || '';
      return { inv: el?.getAttribute('aria-invalid') === 'true', desc: d.split(' ').some((x) => x && document.getElementById(x)?.textContent?.trim()), focus: document.activeElement?.id };
    }, cfg.first);
    L('empty: aria-invalid on first field', a.inv); L('empty: aria-describedby → error text', !!a.desc); L('empty: focus on first error', a.focus === cfg.first);
    await ctx.close(); }
  // 2. telefon: 10 raqam kesilmaydi va xato; +998 qo‘yilsa ajraladi
  if (!cfg.contactField) { const { ctx, page } = await fresh(cfg);
    await gotoStep(page, cfg, cfg.phoneStep);
    await page.fill('#phone', '9012345678'); await page.locator('#phone').blur(); await primary(page, cfg).click(); await page.waitForTimeout(500);
    L('phone: 10 digits kept', (await page.inputValue('#phone')).replace(/\D/g, '').length === 10);
    L('phone: 10 digits → error', await page.evaluate(() => document.getElementById('phone')?.getAttribute('aria-invalid') === 'true'));
    await page.fill('#phone', '+998 90 123 45 67'); L('phone: +998 paste normalised', (await page.inputValue('#phone')) === '90 123 45 67');
    await ctx.close(); }
  // 3. muvaffaqiyat + ikki marta bosish + UTM
  { const q = '?utm_source=meta&utm_medium=paid&utm_campaign=test&utm_content=' + 'x'.repeat(3000) + '&fbclid=' + 'f'.repeat(1500);
    const { ctx, page, reqs, errors } = await fresh(cfg, q);
    await fillAll(page, cfg); await primary(page, cfg).dblclick(); await waitDone(page);
    L('double click → one request', reqs.length === 1); L('success shown', await succeeded(page, cfg));
    const p = reqs[0] || {};
    L('utm_source passed', p.utm_source === 'meta'); L('utm_campaign passed', p.utm_campaign === 'test');
    L('page ≤ 1000', (p.page || '').length <= 1000 && (p.page || '').length > 0);
    if ('utm_content' in p) L('utm_content ≤ 200', p.utm_content.length <= 200);
    if ('fbclid' in p) L('fbclid passed (≤500)', p.fbclid.length > 0 && p.fbclid.length <= 500);
    if ('phone' in p) L('phone canonical', p.phone === '+998 90 123 45 67');
    L('no page errors', errors.length === 0 || errors.join(' | '));
    await ctx.close(); }
  // 4. uzilish / 500 / HTML / health → success yo‘q, xato ko‘rinadi, ma’lumot saqlanadi
  for (const m of ['offline', '500', 'html', 'health']) {
    const { ctx, page, reqs, setMode } = await fresh(cfg); setMode(m);
    await fillAll(page, cfg); await primary(page, cfg).click(); await waitDone(page);
    L(`${m}: no success`, !(await succeeded(page, cfg)));
    L(`${m}: alert shown`, (await page.locator('[role=alert]').count()) > 0);
    const [ks, kv] = cfg.kept || ['#name', 'Test Sinov'];
    L(`${m}: data kept`, (await page.inputValue(ks).catch(() => '')) === kv);
    if (m === '500') {
      const t = await page.locator('[role=alert]').first().innerText();
      L('500: no technical detail', !/\b500\b|http|json|script\.google|fetch/i.test(t));
      setMode('ok'); await primary(page, cfg).click(); await waitDone(page);
      L('500 → retry succeeds', await succeeded(page, cfg));
      L('retry reuses id', reqs.length === 2 && reqs[0].submissionId === reqs[1].submissionId);
    }
    await ctx.close();
  }
  // 5. sekin javob: tugma bloklanadi, keyin success
  { const { ctx, page, reqs, setMode } = await fresh(cfg); setMode('slow');
    await fillAll(page, cfg); await primary(page, cfg).click(); await page.waitForTimeout(800);
    L('slow: button disabled while sending', await primary(page, cfg).isDisabled().catch(() => false));
    await primary(page, cfg).click({ force: true, timeout: 1000 }).catch(() => {});
    await page.waitForTimeout(9000);
    L('slow: success after delay', await succeeded(page, cfg)); L('slow: one request', reqs.length === 1);
    await ctx.close(); }
  // 6. javob yo‘qoldi, keyin ism o‘zgardi → yangi ma’lumot yuboriladi, success faqat shundan keyin
  { const { ctx, page, reqs, setMode } = await fresh(cfg); setMode('lost');
    await fillAll(page, cfg); await primary(page, cfg).click(); await waitDone(page);
    L('lost: no success', !(await succeeded(page, cfg)));
    // ism birinchi bosqichda bo‘lsa — orqaga qaytib o‘zgartiramiz
    const nameStep = cfg.steps.findIndex((s) => s.toString().includes("'#name'"));
    for (let i = cfg.steps.length - 1; i > nameStep; i--) { await page.locator(`${cfg.scope} button[type=button]`).filter({ hasText: /Orqaga|Назад|Back|←/ }).first().click(); await page.waitForTimeout(500); }
    await page.fill('#name', 'Yangi Ism');
    setMode('ok');
    for (let i = nameStep; i < cfg.steps.length - 1; i++) { await primary(page, cfg).click(); await page.waitForTimeout(700); }
    await primary(page, cfg).click(); await waitDone(page);
    const last = reqs.at(-1) || {};
    L('lost+changed: success', await succeeded(page, cfg));
    L('lost+changed: last request carries new name', last.name === 'Yangi Ism');
    L(`lost+changed: id ${cfg.newIdOnChange ? 'new' : 'reused'}`, cfg.newIdOnChange ? last.submissionId !== reqs[0].submissionId : last.submissionId === reqs[0].submissionId);
    await ctx.close(); }
  // 7. sahifa yangilansa qoralama saqlanadi
  { const { ctx, page } = await fresh(cfg);
    await cfg.steps[0](page, 'Test Sinov'); await page.waitForTimeout(300); await page.reload(); await page.waitForTimeout(1200);
    if (cfg.open) await cfg.open(page);
    const [ds, dv] = cfg.draft || ['#name', 'Test Sinov'];
    L('draft survives reload', (await page.inputValue(ds).catch(() => '')) === dv);
    await ctx.close(); }
}

for (const [key, cfg] of Object.entries(FORMS)) {
  if (ONLY.length && !ONLY.some((o) => key.startsWith(o))) continue;
  try { await run(key, cfg); } catch (e) { log(key, 'CRASH', false); console.log(String(e).slice(0, 400)); }
}
console.log(`\nJami: ${pass} PASS, ${fail} FAIL`);
await browser.close();
