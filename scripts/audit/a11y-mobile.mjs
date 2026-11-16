/** Bosh sayt mobil menyusi + kichik bosiladigan joylar (<44px) + matn kontrasti. vite preview :4173 kerak. */
import { chromium } from 'playwright';
const B = process.env.BASE || 'http://localhost:4173';
const ROUTES = (process.env.ROUTES || '/,/ru,/en,/about,/work,/process,/expertise,/insights,/privacy,/apply,/qurilish,/avtosalon,/ishlab-chiqarish').split(',');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const out = (s) => console.log(s);
// 1. menyu
for (const r of ['/', '/ru', '/en']) {
  const p = await browser.newPage({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  await p.goto(B + r); await p.waitForTimeout(1500);
  const btn = p.locator('header button[aria-expanded]').first();
  if (!(await btn.count())) { out(`FAIL ${r} menu button missing`); await p.close(); continue; }
  const box = await btn.boundingBox();
  out(`${box.width >= 44 && box.height >= 44 ? 'PASS' : 'FAIL'} ${r} menu button size ${Math.round(box.width)}x${Math.round(box.height)}`);
  await btn.click(); await p.waitForTimeout(700);
  out(`${(await btn.getAttribute('aria-expanded')) === 'true' ? 'PASS' : 'FAIL'} ${r} menu opens`);
  const focusIn = await p.evaluate(() => { const a = document.activeElement; return a && a !== document.body ? (a.closest('[role=dialog],nav,#mobile-menu,header') ? 'inside' : a.tagName) : 'body'; });
  out(`INFO ${r} focus after open: ${focusIn}`);
  // Tab bilan yurish: fokus ko‘rinadimi
  const tabs = [];
  for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return `${a.tagName}:${(a.textContent || '').trim().slice(0, 14)}|ol=${s.outlineStyle}/${s.outlineWidth}|bs=${s.boxShadow !== 'none'}`; })); }
  out(`INFO ${r} tab order: ${tabs.join('  ')}`);
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  out(`${(await btn.getAttribute('aria-expanded')) === 'false' ? 'PASS' : 'FAIL'} ${r} Esc closes`);
  out(`${await p.evaluate(() => document.activeElement?.matches('header button[aria-expanded]')) ? 'PASS' : 'FAIL'} ${r} focus returns to button`);
  await btn.click(); await p.waitForTimeout(700);
  const link = p.locator('[role=dialog] a[href^="/"], #mobile-menu a[href^="/"], nav[aria-label] a[href^="/"]').filter({ visible: true }).nth(1);
  const href = await link.getAttribute('href').catch(() => null);
  if (href) { await link.click(); await p.waitForTimeout(1500); out(`${(await btn.getAttribute('aria-expanded').catch(() => 'false')) !== 'true' ? 'PASS' : 'FAIL'} ${r} link ${href} closes menu (url ${new URL(p.url()).pathname})`); }
  else out(`FAIL ${r} no menu link found`);
  await p.close();
}
// 2. kichik bosiladigan joylar va kontrast
const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
for (const r of ROUTES) {
  const p = await browser.newPage({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await p.goto(B + r); await p.waitForTimeout(2500);
  const res = await p.evaluate(() => {
    const small = []; const low = [];
    const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(.*,\s*0\)$/.test(c) && c !== 'transparent') return c; } return 'rgb(10,10,10)'; };
    for (const a of document.querySelectorAll('a[href], button, [role=tab], summary, label:has(input[type=radio]), label:has(input[type=checkbox])')) {
      const s = getComputedStyle(a); if (s.visibility === 'hidden' || s.display === 'none' || a.closest('[aria-hidden=true]')) continue;
      const b = a.getBoundingClientRect(); if (!b.width || !b.height) continue;
      if (a.closest('p, li p') && a.tagName === 'A' && a.closest('p')?.textContent.trim().length > a.textContent.trim().length + 20) continue; // matn ichidagi havola — istisno (WCAG 2.5.8)
      const hit = a.classList.contains('tap') ? 44 : 0;
      if (Math.max(b.height, hit) < 44 || Math.max(b.width, hit) < 44) small.push(`${a.tagName}"${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
    }
    for (const el of document.querySelectorAll('p, span, a, li, h1, h2, h3, dt, dd, label, button')) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const s = getComputedStyle(el); if (s.visibility === 'hidden' || +s.opacity < 0.5 || el.closest('[aria-hidden=true]') || !/^rgb/.test(s.color)) continue; // oklab/rgba — skript o‘lchay olmaydi
      low.push([s.color, bgOf(el), parseFloat(s.fontSize), +s.fontWeight, (el.textContent || '').trim().slice(0, 30)]);
    }
    return { small, low };
  });
  const bad = res.low.map(([c, bg, fs, fw, t]) => { const a = /rgba/.test(c) ? null : 0; const L1 = lum(c), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); const large = fs >= 24 || (fs >= 18.66 && fw >= 700); return ratio < (large ? 3 : 4.5) ? `${ratio.toFixed(2)} "${t}" ${c}` : null; }).filter(Boolean);
  out(`${r}: small targets ${res.small.length}${res.small.length ? ' → ' + [...new Set(res.small)].slice(0, 12).join('; ') : ''}`);
  out(`${r}: low contrast ${bad.length}${bad.length ? ' → ' + [...new Set(bad)].slice(0, 8).join('; ') : ''}`);
  await p.close();
}
await browser.close();
