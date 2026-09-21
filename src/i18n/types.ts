export type Lang = 'uz' | 'ru' | 'en';

/** A headline line. `outline` renders stroked type; `accent` adds the violet terminal dot. */
export type Line = { t: string; outline?: boolean; accent?: boolean };

export type CaseCopy = {
  slug: string;
  industry: string;
  challenge: string;
  work: string[];
  result: string[];
  /** Short headline result shown large on the card. Verified figure or qualitative only. */
  headline: string;
};

export type Option = { value: string; label: string };

export type Dict = {
  meta: { title: string; description: string };
  nav: { expertise: string; work: string; process: string; about: string; insights: string; cta: string; menu: string; close: string; skip: string; language: string };
  hero: { eyebrow: string; lines: Line[]; sub: string; ctaPrimary: string; ctaSecondary: string; qualifier: string; scroll: string };
  stats: { label: string; campaigns: string; clients: string; brands: string; funnelTop: string; funnelBottom: string };
  clients: { title: string; note: string };
  problem: { label: string; title: Line[]; intro: string; rows: { has: string; gap: string }[]; transition: string };
  system: { label: string; title: Line[]; intro: string; steps: { name: string; output: string; desc: string }[]; outputLabel: string; hint: string };
  expertise: { label: string; title: Line[]; intro: string; inSystem: string; modules: { name: [string, string]; summary: string; items: string[] }[] };
  work: { label: string; title: Line[]; challenge: string; system: string; result: string; viewAll: string; openCase: string; mediaNote: string; cases: CaseCopy[] };
  why: { label: string; title: Line[]; intro: string; fragmentedLabel: string; fragmented: string[]; fragmentedResult: string; fazoLabel: string; pillars: string[]; fazoResult: string; closing: string[] };
  process: { label: string; title: Line[]; phases: { name: string; desc: string }[] };
  insights: { label: string; title: Line[]; items: { tag: string; title: string }[]; cta: string; readTime: string };
  engagement: { label: string; title: Line[]; text: string; startsFrom: string; per: string; notJust: string; cta: string; qualifier: string; fitLabel: string; fit: string[]; notFitLabel: string; notFit: string[] };
  apply: {
    label: string; title: Line[]; intro: string;
    stepNames: string[];
    name: string; company: string; website: string; websitePh: string;
    industry: string; industries: Option[];
    revenue: string; revenues: Option[];
    spend: string; spends: Option[];
    budget: string; budgetHint: string; budgets: Option[];
    problem: string; problems: Option[]; problemDetail: string;
    objective: string; objectives: Option[];
    decision: string; decisions: Option[];
    contact: string; contactPh: string; contactHint: string;
    next: string; back: string; submit: string; sending: string; required: string; stepOf: string;
    successTitle: string; successText: string; successCta: string; error: string;
  };
  final: { title: Line[]; sub: string; cta: string; telegram: string; labels: { instagram: string; telegram: string; phone: string; location: string; web: string }; location: string };
  footer: { tagline: string; navLabel: string; socialLabel: string; legalLabel: string; privacy: string; contact: string; rights: string; location: string; top: string };
};
