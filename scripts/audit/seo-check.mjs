/** dist/ dagi prerender HTML: title, description, canonical, og:url, og:locale, hreflang juftliklari, 404 noindex. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const D = 'dist'; const SKIP = /^(server|assets|crm|amina-crm|fonts)$/;
const files = [];
(function walk(dir) { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) { if (!SKIP.test(f)) walk(p); } else if (f.endsWith('.html')) files.push(p); } })(D);
const get = (h, re) => (h.match(re) || [])[1];
const pages = {}; const problems = [];
for (const f of files) {
  const h = readFileSync(f, 'utf8');
  const route = '/' + f.slice(D.length + 1).replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  const p = {
    title: get(h, /<title>([^<]*)<\/title>/), desc: get(h, /<meta name="description" content="([^"]*)"/),
    canonical: get(h, /<link rel="canonical" href="([^"]*)"/), ogUrl: get(h, /<meta property="og:url" content="([^"]*)"/),
    ogLocale: get(h, /<meta property="og:locale" content="([^"]*)"/), robots: get(h, /<meta name="robots" content="([^"]*)"/),
    alts: [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    h1: (h.match(/<h1[\s>]/g) || []).length,
  };
  pages[route] = p;
}
const titles = {};
for (const [r, p] of Object.entries(pages)) {
  const is404 = /404/.test(r);
  const other = /^\/(avazbek|card|077agency)/.test(r);
  if (is404) { if (!/noindex/.test(p.robots || '')) problems.push(`${r}: 404 without noindex`); continue; }
  if (!p.title) problems.push(`${r}: no title`); else (titles[p.title] ||= []).push(r);
  if (!p.desc) problems.push(`${r}: no description`);
  if (other) continue;
  if (!p.canonical) problems.push(`${r}: no canonical`);
  else if (!p.canonical.startsWith('https://www.fazodigital.uz')) problems.push(`${r}: canonical not www: ${p.canonical}`);
  if (p.ogUrl !== p.canonical) problems.push(`${r}: og:url ${p.ogUrl} ≠ canonical`);
  if (!p.ogLocale) problems.push(`${r}: no og:locale`);
  const want = r.startsWith('/ru') ? 'ru' : r.startsWith('/en') ? 'en' : 'uz';
  if (p.ogLocale && !p.ogLocale.toLowerCase().startsWith(want)) problems.push(`${r}: og:locale ${p.ogLocale} for ${want}`);
  if (p.h1 !== 1) problems.push(`${r}: h1 count ${p.h1}`);
  // hreflang: har alternate sahifa mavjud va u ham shu sahifaga qaytib ishora qiladi
  for (const [lang, href] of p.alts) {
    const target = href.replace('https://www.fazodigital.uz', '') || '/';
    const t = pages[target];
    if (!t) { problems.push(`${r}: hreflang ${lang} → missing page ${target}`); continue; }
    if (lang !== 'x-default' && !t.alts.some(([, h2]) => h2 === p.canonical)) problems.push(`${r}: hreflang ${lang} → ${target} has no return link`);
  }
}
for (const [t, rs] of Object.entries(titles)) if (rs.length > 1) problems.push(`duplicate title "${t}": ${rs.join(', ')}`);
console.log(`pages: ${Object.keys(pages).length}`);
console.log(problems.length ? problems.join('\n') : 'no problems');
