import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n';
import { seoFor } from '../lib/seo';

function upsert(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) { el = create(); document.head.appendChild(el); }
  apply(el);
}

/** Keeps title, description and canonical in sync on client-side navigation. */
export function Seo() {
  const { pathname } = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    const seo = seoFor(pathname === '' ? '/' : pathname, lang);
    document.title = seo.title;
    upsert('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), (el) => el.setAttribute('content', seo.description));
    upsert('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), (el) => el.setAttribute('href', seo.canonical));
    upsert('meta[property="og:title"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); return m; }, (el) => el.setAttribute('content', seo.title));
    upsert('meta[property="og:url"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); return m; }, (el) => el.setAttribute('content', seo.canonical));
  }, [pathname, lang]);

  return null;
}

/** Scrolls to the top on route change (anchor links handle their own scrolling). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
