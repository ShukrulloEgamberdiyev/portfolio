import { dictionaries, pageDictionaries, langPrefix } from '../i18n';
import type { Lang } from '../i18n/types';
import { CASES, EXPERTISE, SITE_URL } from '../data/site';
import { ARTICLES } from '../content/articles';

export type Seo = { title: string; description: string; canonical: string; image?: string; /** Not a real page (404): keep it out of search results. */ noindex?: boolean };

/** First whole sentence(s) that fit a search snippet — never cut mid-word. */
export function snippet(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = '';
  for (const s of sentences) { if ((out + s).trim().length > max) break; out += s; }
  if (out.trim()) return out.trim();
  return clean.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

const SUFFIX = 'FAZO Digital';

/** One source of truth for page titles — used by the client and by the prerenderer. */
/** "/avtosalon/", "/avtosalon?x" and "/avtosalon" are the same page. */
export function normalizePath(path: string) {
  const clean = (path.split(/[?#]/)[0] || '/').replace(/\/{2,}/g, '/');
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/';
}

export function seoFor(rawPath: string, lang: Lang): Seo {
  const path = normalizePath(rawPath);
  const t = dictionaries[lang];
  const p = pageDictionaries[lang];
  const canonical = `${SITE_URL}${langPrefix(lang)}${path === '/' ? '/' : path}`;
  const make = (title: string, description: string): Seo => ({ title: `${title} — ${SUFFIX}`, description, canonical });

  if (path === '/avtosalon') {
    return {
      title: 'Avtosalonlar uchun marketing va sotuv tizimi | FAZO Digital',
      description: 'Avtosalonlar uchun strategiya, kontent, target reklama, lead generatsiya, CRM va sotuv bo‘limini yagona tizimda yo‘lga qo‘yamiz. Ariza qoldiring — jamoamiz bog‘lanadi.',
      canonical: `${SITE_URL}/avtosalon`,
      image: `${SITE_URL}/og-avtosalon.jpg`,
    };
  }
  if (path === '/qurilish') {
    return {
      title: 'Qurilish kompaniyalari uchun mijoz jalb qilish | FAZO Digital',
      description: 'FAZO Digital turar joy loyihalari uchun Meta Ads, Google Ads, landing, CRM va sotuv tizimi orqali potensial mijozlar oqimini yo‘lga qo‘yadi.',
      canonical: `${SITE_URL}/qurilish`,
      image: `${SITE_URL}/og-qurilish.jpg`,
    };
  }
  if (path === '/ishlab-chiqarish') {
    return {
      title: 'Ishlab chiqarish bizneslari uchun marketing | FAZO Digital',
      description: 'FAZO Digital ishlab chiqarish bizneslari uchun strategiya, kontent, target reklama, landing, CRM va sotuv jarayonlarini yagona tizimga bog‘laydi.',
      canonical: `${SITE_URL}/ishlab-chiqarish`,
      image: `${SITE_URL}/og-ishlab-chiqarish.jpg`,
    };
  }
  if (path === '/card') {
    return {
      title: 'FAZO Digital — Marketing · SMM · Targeting',
      description: 'FAZO Digital raqamli vizitkasi: marketing, SMM va targeting. Biznesingiz uchun marketingni tizimlashtiramiz va uni sotuv bilan bog‘laymiz.',
      canonical: `${SITE_URL}/card`,
      image: `${SITE_URL}/og-image.jpg`,
    };
  }
  if (path === '/') return { title: t.meta.title, description: t.meta.description, canonical };
  if (path === '/work') return make(p.work.title, p.work.intro);
  if (path === '/expertise') return make(p.expertise.title, p.expertise.intro);
  if (path === '/process') return make(p.processPage.title, p.processPage.intro);
  if (path === '/about') return make(p.about.title, p.about.lead);
  if (path === '/insights') return make(p.insightsPage.title, p.insightsPage.intro);
  if (path === '/apply') return make(p.applyPage.title, p.applyPage.intro);
  if (path === '/privacy') return make(p.privacy.title, snippet(p.privacy.sections[0].body));

  const caseSlug = path.startsWith('/work/') ? path.slice(6) : null;
  if (caseSlug) {
    const i = CASES.findIndex((c) => c.slug === caseSlug);
    // Task + how it was approached: enough for a search snippet, and nothing that is not on the page.
    if (i >= 0) return make(`${CASES[i].name} — ${t.work.cases[i].industry}`, snippet(`${t.work.cases[i].challenge} ${p.caseDetail.approaches[caseSlug] ?? ''}`));
  }

  const expSlug = path.startsWith('/expertise/') ? path.slice(11) : null;
  if (expSlug) {
    const i = EXPERTISE.findIndex((e) => e.slug === expSlug);
    if (i >= 0) return make(t.expertise.modules[i].name.join(' '), p.expertiseDetail.modules[i].lead);
  }

  const artSlug = path.startsWith('/insights/') ? path.slice(10) : null;
  if (artSlug) {
    const a = ARTICLES.find((x) => x.slug === artSlug);
    // Articles exist in Uzbek only; the /ru and /en copies show the same text, so they point to the Uzbek original.
    if (a) return { ...make(a.title, a.lead), canonical: `${SITE_URL}${path}` };
  }

  return { ...make(p.notFound.title, p.notFound.text), noindex: true };
}
