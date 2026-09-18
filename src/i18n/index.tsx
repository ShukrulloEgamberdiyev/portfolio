import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Dict, Lang } from './types';
import type { PageDict } from './pageTypes';
import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';
import { pagesUz } from './pages.uz';
import { pagesRu } from './pages.ru';
import { pagesEn } from './pages.en';

export const dictionaries: Record<Lang, Dict> = { uz, ru, en };
export const pageDictionaries: Record<Lang, PageDict> = { uz: pagesUz, ru: pagesRu, en: pagesEn };
export const LANGS: Lang[] = ['uz', 'ru', 'en'];
const STORAGE_KEY = 'fazo.lang';

type Ctx = { lang: Lang; t: Dict; p: PageDict; setLang: (l: Lang) => void };
const LangContext = createContext<Ctx | null>(null);

/** Uzbek lives at the root; Russian and English live under /ru and /en. */
export function langFromPath(pathname: string): Lang {
  const seg = pathname.split('/')[1];
  return seg === 'ru' || seg === 'en' ? seg : 'uz';
}

export function langPrefix(lang: Lang) {
  return lang === 'uz' ? '' : `/${lang}`;
}

function initialLangFromBrowser(): Lang {
  try {
    return langFromPath(window.location.pathname);
  } catch {
    return 'uz';
  }
}

export function LangProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? initialLangFromBrowser);
  const t = dictionaries[lang];
  const p = pageDictionaries[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  }, [lang]);

  /** Switching language keeps the current page and swaps the URL prefix. */
  const setLang = (next: Lang) => {
    if (next === lang) return;
    if (typeof window === 'undefined') { setLangState(next); return; }
    const rest = window.location.pathname.replace(/^\/(ru|en)(?=\/|$)/, '') || '/';
    window.location.assign(`${langPrefix(next)}${rest}${window.location.search}`);
  };

  const value = useMemo(() => ({ lang, t, p, setLang }), [lang, t, p]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
