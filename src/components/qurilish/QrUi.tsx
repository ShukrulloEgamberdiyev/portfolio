import type { ReactNode } from 'react';
import { QR_FORM_ID } from '../../content/qurilish';
import { scrollToId } from '../../lib/scroll';
import { track } from '../../lib/tracking';
import { Reveal } from '../../ui/Reveal';

/** Every CTA on the landing leads to the one project form. */
export function goToForm(location: string) {
  track('QurilishCTA', { location }, { custom: true });
  scrollToId(QR_FORM_ID);
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** FAZO button language: bone slab, violet wipe on hover, mono uppercase label, arrow swap. */
export function QrCta({ children, location, variant = 'solid', className = '' }: { children: ReactNode; location: string; variant?: 'solid' | 'ghost'; className?: string }) {
  const solid = variant === 'solid';
  return (
    <a href={`#${QR_FORM_ID}`} data-cursor="hover"
      onClick={(e) => { e.preventDefault(); goToForm(location); }}
      className={`group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden px-5 py-3 text-center font-mono text-[12px] font-medium uppercase leading-snug tracking-[0.1em] sm:gap-4 sm:px-7 sm:tracking-[0.14em] transition-colors duration-300 ${solid ? 'bg-bone text-ink' : 'border border-line-strong text-bone hover:border-bone/60'} ${className}`}>
      <span aria-hidden className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100 ${solid ? 'bg-violet' : 'bg-bone/[0.06]'}`} />
      <span className={`relative ${solid ? 'group-hover:text-white' : ''}`}>{children}</span>
      <span className={`relative inline-flex overflow-hidden ${solid ? 'group-hover:text-white' : ''}`}>
        <Arrow className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[140%]" />
        <Arrow className="absolute -translate-x-[140%] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
      </span>
    </a>
  );
}

/** Headline with the FAZO violet full stop. */
export function Dotted({ text }: { text: string }) {
  if (!text.endsWith('.')) return <>{text}</>;
  return <>{text.slice(0, -1)}<span className="text-violet">.</span></>;
}

export function Eyebrow({ children, index }: { children: ReactNode; index?: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
      {index && <span className="text-violet">{index}</span>}
      <span aria-hidden className="inline-block h-px w-8 bg-line-strong" />
      {children}
    </p>
  );
}

export function SectionHead({ index, eyebrow, title, text, id, className = '' }: { index: string; eyebrow: string; title: string; text?: string; id: string; className?: string }) {
  return (
    <div className={`max-w-[920px] ${className}`}>
      <Reveal><Eyebrow index={index}>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className="mt-6 text-[1.95rem] font-bold leading-[1.05] tracking-[-0.035em] text-bone sm:text-[2.6rem] lg:text-[3.3rem]"><Dotted text={title} /></h2>
      </Reveal>
      {text && <Reveal delay={0.1}><p className="mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed text-mist sm:text-[1.15rem]">{text}</p></Reveal>}
    </div>
  );
}

export function Section({ id, labelledBy, children, className = '' }: { id?: string; labelledBy: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative scroll-mt-16 border-t border-line py-20 sm:py-24 lg:py-32 ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}

/* ───────── line icons (24px, 1.5 stroke) ───────── */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const ICONS: Record<string, ReactNode> = {
  cost: <><path d="M4 18V9m5 9V5m5 13v-6m5 6V8" {...P} /></>,
  same: <><rect x="3.5" y="6" width="7" height="12" {...P} /><rect x="13.5" y="6" width="7" height="12" {...P} /><path d="M6 9.5h2M16 9.5h2M6 12.5h2M16 12.5h2" {...P} /></>,
  lost: <><path d="M4 7h10l-3-3M20 17H10l3 3" {...P} /></>,
  split: <><path d="M4 12h5M15 12h5" {...P} /><path d="M11 8v8M13 8v8" {...P} opacity=".45" /><circle cx="4" cy="12" r="1" {...P} /><circle cx="20" cy="12" r="1" {...P} /></>,
  strategy: <><circle cx="12" cy="12" r="8" {...P} /><circle cx="12" cy="12" r="4" {...P} /><circle cx="12" cy="12" r=".6" {...P} /></>,
  reach: <><path d="M4 16a8 8 0 1 1 16 0" {...P} /><path d="m12 16 4-5" {...P} /><path d="M4 19h16" {...P} /></>,
  infra: <><rect x="3.5" y="4" width="17" height="16" {...P} /><path d="M3.5 9h17M9 9v11" {...P} /></>,
  sales: <><circle cx="9" cy="8" r="3" {...P} /><path d="M3.5 19c.7-3 2.9-4.5 5.5-4.5s4.8 1.5 5.5 4.5" {...P} /><path d="M16 5.5a3 3 0 0 1 0 5.5M17.5 14.7c1.5.6 2.6 2 3 4.3" {...P} /></>,
};

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <svg aria-hidden className={className} width="24" height="24" viewBox="0 0 24 24">{ICONS[name]}</svg>;
}
