import type { ReactNode } from 'react';
import { AV_FORM_ID } from '../../content/avtosalon';
import { scrollToId } from '../../lib/scroll';
import { track } from '../../lib/tracking';
import { Reveal } from '../../ui/Reveal';

/** Every CTA on the landing scrolls to the one application form. */
export function goToForm(location: string) {
  track('AvtosalonCTA', { location }, { custom: true });
  scrollToId(AV_FORM_ID);
}

export function AvCta({ children, location, variant = 'solid', className = '' }: { children: ReactNode; location: string; variant?: 'solid' | 'ghost'; className?: string }) {
  const base = 'group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98]';
  const look = variant === 'solid'
    ? 'bg-signal text-ink hover:bg-[#ffd35c] shadow-[0_10px_40px_-12px_rgba(245,195,59,0.55)]'
    : 'border border-line-strong text-bone hover:border-signal/70 hover:text-signal';
  return (
    <a href={`#${AV_FORM_ID}`} data-cursor="hover" className={`${base} ${look} ${className}`}
      onClick={(e) => { e.preventDefault(); goToForm(location); }}>
      <span>{children}</span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

export function Eyebrow({ children, index }: { children: ReactNode; index?: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
      {index && <span className="text-signal">{index}</span>}
      <span aria-hidden className="inline-block h-px w-8 bg-line-strong" />
      {children}
    </p>
  );
}

export function SectionHead({ index, eyebrow, title, text, id, center = false }: { index: string; eyebrow: string; title: string; text?: string; id: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-[860px] text-center [&_p:first-child]:justify-center' : 'max-w-[900px]'}>
      <Reveal><Eyebrow index={index}>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className="mt-6 text-[2rem] font-bold leading-[1.04] tracking-[-0.035em] text-bone sm:text-[2.6rem] lg:text-[3.4rem]">{title}</h2>
      </Reveal>
      {text && <Reveal delay={0.1}><p className={`mt-5 text-[1.05rem] leading-relaxed text-mist sm:text-[1.15rem] ${center ? 'mx-auto' : ''} max-w-[56ch]`}>{text}</p></Reveal>}
    </div>
  );
}

export function Section({ id, labelledBy, children, className = '' }: { id?: string; labelledBy: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative border-t border-line py-20 sm:py-24 lg:py-32 ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionCta({ label, location }: { label: string; location: string }) {
  return <Reveal className="mt-12 lg:mt-16"><AvCta location={location}>{label}</AvCta></Reveal>;
}

/* ───────── line icons (24px, 1.5 stroke) ───────── */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
export const ICONS: Record<string, ReactNode> = {
  quality: <><circle cx="11" cy="11" r="7" {...P} /><path d="m20 20-3.5-3.5M8 11h6" {...P} /></>,
  budget: <><path d="M4 18V9m5 9V5m5 13v-6m5 6V8" {...P} /></>,
  content: <><rect x="3.5" y="4.5" width="17" height="12" rx="2" {...P} /><path d="m10 8.5 4 2-4 2z" {...P} /><path d="M8 20h8" {...P} /></>,
  lost: <><path d="M4 7h10l-3-3M20 17H10l3 3" {...P} /><path d="M18 5l2 2-2 2" {...P} opacity=".4" /></>,
  team: <><circle cx="9" cy="8" r="3" {...P} /><path d="M3.5 19c.7-3 2.9-4.5 5.5-4.5s4.8 1.5 5.5 4.5" {...P} /><path d="M16 5.5a3 3 0 0 1 0 5.5M17.5 14.7c1.5.6 2.6 2 3 4.3" {...P} /></>,
  chart: <><path d="M4 4v16h16" {...P} /><path d="m8 14 3-3 3 2 5-6" {...P} /></>,
  strategy: <><circle cx="12" cy="12" r="8" {...P} /><circle cx="12" cy="12" r="4" {...P} /><circle cx="12" cy="12" r=".6" {...P} /></>,
  copy: <><path d="M5 19l1.2-4.2L15.5 5.5a2 2 0 0 1 3 3L9.2 17.8z" {...P} /><path d="M13.5 7.5l3 3" {...P} /></>,
  design: <><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.8 0-1 .8-1.6 1.8-1.6h2c2 0 3.4-1.4 3.4-3.6 0-4-3.6-7.3-8-7.3z" {...P} /><circle cx="8" cy="11" r="1" {...P} /><circle cx="11" cy="7.5" r="1" {...P} /><circle cx="15.5" cy="8.5" r="1" {...P} /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" {...P} /><path d="m16 10 5-3v10l-5-3" {...P} /></>,
  performance: <><path d="M4 16a8 8 0 1 1 16 0" {...P} /><path d="m12 16 4-5" {...P} /><path d="M4 19h16" {...P} /></>,
  crm: <><rect x="3.5" y="4" width="17" height="16" rx="2" {...P} /><path d="M3.5 9h17M9 9v11" {...P} /></>,
};

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <svg aria-hidden className={className} width="24" height="24" viewBox="0 0 24 24">{ICONS[name]}</svg>;
}
