/**
 * Renders every route to static HTML for all three languages, so crawlers and
 * social previews get real markup. Output lands in dist/ next to the SPA bundle.
 *
 *   dist/index.html            → /            (uz)
 *   dist/work/index.html       → /work        (uz)
 *   dist/ru/work/index.html    → /ru/work     (ru)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const { render, seoFor, routes, dictionaries } = await import(join(dist, 'server', 'entry-server.js'));

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const LANGS = ['uz', 'ru', 'en'];
const prefix = (l) => (l === 'uz' ? '' : `/${l}`);
const SITE = 'https://fazodigital.uz';

function page(route, lang) {
  const seo = seoFor(route, lang);
  const html = render(`${route}`, lang);
  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${prefix(l)}${route === '/' ? '/' : route}" />`).join('\n    ')
    + `\n    <link rel="alternate" hreflang="x-default" href="${SITE}${route === '/' ? '/' : route}" />`;

  return template
    .replace('<html lang="uz">', `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(seo.description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${seo.canonical}" />`)
    .replace(/<link rel="alternate"[^>]*>\s*/g, '')
    .replace('</head>', `  ${alternates}\n  </head>`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(seo.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(seo.description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${seo.canonical}" />`)
    .replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>FAZO Digital — ${escapeHtml(dictionaries[lang].footer.tagline)}. ${escapeHtml(dictionaries[lang].footer.location)}. +998 93 040 10 70 · t.me/fazo_digital</noscript>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${html}</div>`);
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let count = 0;
for (const lang of LANGS) {
  for (const route of routes) {
    const out = join(dist, prefix(lang).slice(1), route === '/' ? '' : route.slice(1), 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, page(route, lang));
    count += 1;
  }
}

// 404 fallback for static hosts
writeFileSync(join(dist, '404.html'), page('/404', 'uz'));

// sitemap
const urls = LANGS.flatMap((l) => routes.map((r) => `${SITE}${prefix(l)}${r === '/' ? '/' : r}`));
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq></url>`)
    .join('\n')}\n</urlset>\n`,
);

console.log(`prerendered ${count} pages + sitemap (${urls.length} urls)`);
