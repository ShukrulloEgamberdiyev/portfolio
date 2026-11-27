import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Checks on the built site (dist/). They run after `npm run build`; without a build they are skipped,
 * so `npm test` still works on a fresh checkout. `npm run verify` builds first.
 */
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const built = existsSync(join(dist, 'index.html')) && existsSync(join(dist, 'sitemap.xml'));
const SITE = 'https://www.fazodigital.uz';
// Client pages with their own code and styles live in the same deployment but are not part of the FAZO site.
const FOREIGN = /^(avazbek|077agency)(\/|\.html$)/;

function htmlFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { if (name !== 'server' && name !== 'assets') htmlFiles(full, out); }
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}
const pages = built ? htmlFiles(dist).map((f) => ({ rel: relative(dist, f).replace(/\\/g, '/'), html: readFileSync(f, 'utf8') })).filter((p) => !FOREIGN.test(p.rel)) : [];
const opts = { skip: built ? false : 'run `npm run build` first' };

test('every page is readable without JavaScript or animation: nothing is prerendered hidden', opts, () => {
  assert.ok(pages.length >= 68, `expected the whole site, got ${pages.length} pages`);
  for (const { rel, html } of pages) {
    const body = html.slice(html.indexOf('<div id="root"'));
    // opacity:0 (but not 0.35 etc.), masked headlines or hidden blocks in inline styles.
    // (Empty progress bars — scaleX(0) on decorative lines — are not content and are allowed.)
    const hidden = body.match(/style="[^"]*(opacity:0(?![.\d])|translateY\(1\d\d%\)|visibility:hidden|display:none)[^"]*"/g) || [];
    assert.deepEqual(hidden, [], `${rel} ships hidden content`);
    assert.match(body, /<h1[\s>]/, `${rel} has no H1 in the HTML`);
  }
});

test('the four landings ship their offer and form in the HTML', opts, () => {
  const text = (rel) => pages.find((p) => p.rel === rel).html.replace(/<[^>]+>/g, ' ');
  assert.match(text('ishlab-chiqarish.html'), /Mahsulot işlab chiqarasiz\./);
  assert.match(text('ishlab-chiqarish.html'), /Loyihani muhokama qiliş/);
  assert.doesNotMatch(text('qurilish.html'), /\$5,000/); // unconfirmed price removed
  assert.match(text('qurilish.html'), /Reklama budjeti alohida ajratiladi/);
  assert.match(text('avtosalon.html'), /Ariza qoldiriş/);
  assert.match(text('talim.html'), /Siz nima olasiz/);
  for (const rel of ['ishlab-chiqarish.html', 'qurilish.html', 'avtosalon.html', 'talim.html']) assert.match(pages.find((p) => p.rel === rel).html, /<form[\s>]/, `${rel} form`);
});

test('head: one title, description, H1; canonical on the served host; 404 is noindex', opts, () => {
  for (const { rel, html } of pages) {
    const head = html.slice(0, html.indexOf('</head>'));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${rel}: exactly one H1`);
    assert.equal((head.match(/<title>/g) || []).length, 1, `${rel}: one title`);
    const desc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    if (rel !== '404.html') assert.ok(desc.length >= 50 && desc.length <= 200, `${rel}: description length ${desc.length}`);
    assert.equal((head.match(/<meta property="og:description" content="([^"]*)"/) || [])[1], desc, `${rel}: og:description matches`);
    assert.doesNotMatch(head, /https:\/\/fazodigital\.uz/, `${rel}: links to the redirecting bare domain`);
    assert.doesNotMatch(head, /fonts\.googleapis|fonts\.gstatic/, `${rel}: render-blocking third-party font request`);
    if (rel === '404.html') {
      assert.match(head, /<meta name="robots" content="noindex/);
      assert.doesNotMatch(head, /rel="canonical"/);
    } else {
      assert.doesNotMatch(head, /noindex/, `${rel} is accidentally noindex`);
      const canonical = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
      assert.ok(canonical.startsWith(SITE), `${rel}: canonical ${canonical}`);
    }
  }
});

test('language versions: html lang, og:locale and hreflang agree', opts, () => {
  const locale = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' };
  for (const { rel, html } of pages) {
    const lang = rel.startsWith('ru/') ? 'ru' : rel.startsWith('en/') ? 'en' : 'uz';
    assert.match(html, new RegExp(`<html lang="${lang}"`), rel);
    assert.match(html, new RegExp(`<meta property="og:locale" content="${locale[lang]}"`), `${rel}: og:locale`);
  }
  const home = pages.find((p) => p.rel === 'ru/index.html').html;
  for (const l of ['uz', 'ru', 'en', 'x-default']) assert.match(home, new RegExp(`hreflang="${l}" href="${SITE}`));
});

test('sitemap and robots point at pages that exist on the served host', opts, () => {
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(urls.length >= 68);
  for (const u of urls) {
    assert.ok(u.startsWith(`${SITE}/`), u);
    const path = u.slice(SITE.length).replace(/^\/|\/$/g, '');
    assert.ok(existsSync(join(dist, path, 'index.html')) || existsSync(join(dist, `${path}.html`)) || path === '', `sitemap lists a missing page: ${u}`);
    assert.doesNotMatch(u, /\/(crm|404)(\/|$)/);
  }
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${SITE}/sitemap.xml`));
});

test('internal links and local assets resolve', opts, () => {
  const exists = (p) => {
    const clean = decodeURI(p.split(/[?#]/)[0]).replace(/^\/|\/$/g, '');
    if (clean === '' || /^(crm)(\/|$)/.test(clean)) return true; // /crm is a separate system behind a rewrite
    return existsSync(join(dist, clean)) || existsSync(join(dist, `${clean}.html`)) || existsSync(join(dist, clean, 'index.html'));
  };
  for (const { rel, html } of pages) {
    for (const m of html.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) assert.ok(exists(m[1]), `${rel}: broken ${m[1]}`);
  }
});

test('no canonical, hreflang or sitemap URL ends in a trailing slash that Vercel would redirect (/ru/ → /ru)', opts, () => {
  const bad = /https:\/\/www\.fazodigital\.uz\/[^"<\s]+\/(?=["<])/;
  for (const p of pages) {
    const links = (p.html.match(/<link rel="(canonical|alternate)"[^>]*>/g) || []).join('\n');
    assert.doesNotMatch(links, bad, p.rel);
  }
  const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  assert.doesNotMatch(sitemap, bad);
  assert.match(sitemap, /<loc>https:\/\/www\.fazodigital\.uz\/ru<\/loc>/);
});
