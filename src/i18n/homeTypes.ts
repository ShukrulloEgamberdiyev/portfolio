import type { Line } from './types';

/** Copy for the home page (src/pages/Home.tsx). One file per language: home.uz.ts, home.ru.ts, home.en.ts. */
export type HomeCopy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    lines: Line[];
    audience: string;
    sub: string;
    cta: string;
    secondary: string;
    chainLabel: string;
    chain: string[];
    benefits: { t: string; d: string }[];
  };
  problems: { label: string; title: Line[]; intro: string; items: { t: string; d: string }[]; closing: string };
  services: {
    label: string;
    title: Line[];
    intro: string;
    parts: { does: string; gets: string; needs: string; limits: string };
    open: string;
    close: string;
    items: { name: string; summary: string; does: string[]; gets: string; needs: string; limits: string }[];
  };
  crm: {
    label: string;
    title: Line[];
    intro: string;
    readyLabel: string;
    ready: { t: string; d: string }[];
    setupLabel: string;
    setup: { t: string; d: string }[];
    diagram: { label: string; steps: { t: string; d: string }[]; loop: string; crmBadge: string };
    capi: { title: string; text: string; not: string };
    pricing: { title: string; text: string };
  };
  cases: {
    label: string;
    title: Line[];
    intro: string;
    fields: { problem: string; work: string; result: string; term: string };
    noResult: string;
    items: { name: string; industry: string; problem: string; work: string[]; result?: string; term?: string }[];
  };
  process: { label: string; title: Line[]; steps: { t: string; d: string; you: string }[]; youLabel: string };
  fit: {
    label: string;
    title: Line[];
    industriesLabel: string;
    industries: string[];
    needLabel: string;
    need: string[];
    notLabel: string;
    not: string[];
    price: string;
  };
  faq: { label: string; title: Line[]; items: { q: string; a: string }[] };
  apply: { label: string; title: Line[]; text: string; points: string[] };
};
