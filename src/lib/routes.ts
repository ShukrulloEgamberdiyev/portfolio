import { CASES, EXPERTISE } from '../data/site';
import { ARTICLES } from '../content/articles';

/** Every route the site renders, without a language prefix. Used for prerendering and the sitemap. */
export const ROUTES: string[] = [
  '/',
  '/expertise',
  ...EXPERTISE.map((e) => `/expertise/${e.slug}`),
  '/work',
  ...CASES.map((c) => `/work/${c.slug}`),
  '/process',
  '/about',
  '/insights',
  ...ARTICLES.map((a) => `/insights/${a.slug}`),
  '/apply',
  '/privacy',
];

/** Uzbek-only landing pages: prerendered once (no /ru, /en copies) and listed in the sitemap. */
export const UZ_ONLY_ROUTES: string[] = ['/avtosalon', '/qurilish'];
