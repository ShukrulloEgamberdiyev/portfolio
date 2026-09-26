import type { ReactNode } from 'react';
import { IC_FORM_ID } from '../../content/ishlab';
import { scrollToId } from '../../lib/scroll';
import { track } from '../../lib/tracking';

/* Section scaffolding, eyebrow and the violet full stop are shared with /qurilish — one design language. */
export { Dotted, Eyebrow, Section, SectionHead } from '../qurilish/QrUi';

/**
 * Moves keyboard/screen-reader focus to the destination without a second scroll jump:
 * an element marked [data-focus-target] inside the section (e.g. the form heading), else the section itself.
 */
export function focusTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = (el.querySelector('[data-focus-target]') as HTMLElement | null) ?? el;
  if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/**
 * Scrolls to a section and moves focus there; CTA clicks are tracked so paid traffic shows which block converts.
 * `before` runs first (e.g. closing the mobile menu); the scroll then waits two frames so the menu's
 * scroll lock is released before smooth scrolling starts.
 */
export function goTo(id: string, location: string, before?: () => void) {
  track('IshlabCTA', { location, target: id }, { custom: true });
  const run = () => { scrollToId(id); focusTarget(id); };
  if (!before) { run(); return; }
  before();
  requestAnimationFrame(() => requestAnimationFrame(run));
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** FAZO button language (bone slab, violet wipe, mono label, arrow swap). Defaults to the application form. */
export function IcCta({ children, location, to = IC_FORM_ID, variant = 'solid', className = '', onNavigate }: {
  children: ReactNode; location: string; to?: string; variant?: 'solid' | 'ghost'; className?: string; onNavigate?: () => void;
}) {
  const solid = variant === 'solid';
  return (
    <a href={`#${to}`} data-cursor="hover"
      onClick={(e) => { e.preventDefault(); goTo(to, location, onNavigate); }}
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

/** Small mono "→" chain, used for flows (Kreativ → Reklama → …). Wraps cleanly on narrow screens. */
export function Chain({ items, accent = 'text-forge', className = '' }: { items: string[]; accent?: string; className?: string }) {
  return (
    <ol className={`flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] ${className}`}>
      {items.map((it, i) => (
        <li key={it} className="flex items-center gap-2">
          <span className="whitespace-nowrap border border-line-strong bg-ink/60 px-2.5 py-1.5 text-bone">{it}</span>
          {i < items.length - 1 && <span aria-hidden className={accent}>→</span>}
        </li>
      ))}
    </ol>
  );
}

export function Check({ className = '' }: { className?: string }) {
  return <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`shrink-0 ${className}`}><path d="m2 6.3 2.6 2.5L10 3.2" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>;
}
