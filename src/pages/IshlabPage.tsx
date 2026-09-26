import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { Logo } from '../components/Logo';
import { IcForm } from '../components/ishlab/IcForm';
import { Chain, Check, Dotted, Eyebrow, IcCta, Section, SectionHead, goTo } from '../components/ishlab/IcUi';
import { ProductionLine } from '../components/ishlab/ProductionLine';
import {
  IC_FORM_ID, caseStudy, channels, diagnostics, faq, finalCta, fit, hero, industries, modules, nav, problem, process, states, system,
} from '../content/ishlab';
import { scrollToId } from '../lib/scroll';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal } from '../ui/Reveal';

const ease = [0.22, 1, 0.36, 1] as const;
const pad2 = (n: number) => String(n).padStart(2, '0');

/* ───────── Header ───────── */
function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  /** true when the menu was closed by choosing a destination — focus then goes there, not back to the toggle. */
  const navigating = useRef(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    // Move focus into the menu, keep Tab inside [toggle + menu], Escape closes.
    const raf = requestAnimationFrame(() => (menuRef.current?.querySelector('a') as HTMLElement | null)?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href],button') ?? [])].filter(Boolean) as HTMLElement[];
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === -1 || i === items.length - 1 ? 0 : i + 1);
      e.preventDefault();
      items[next].focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      // Closed with Escape or the toggle: return focus to the toggle.
      if (!navigating.current) toggleRef.current?.focus({ preventScroll: true });
      navigating.current = false;
    };
  }, [open]);

  // Closing the menu happens synchronously; goTo() scrolls two frames later, after the scroll lock is gone.
  const closeForNavigation = () => { navigating.current = true; setOpen(false); };
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); goTo(id, 'nav', open ? closeForNavigation : undefined); };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${solid || open ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="shell flex h-16 items-center justify-between lg:h-20">
          <a href="/" aria-label="FAZO Digital — bosh sahifa" data-cursor="hover"><Logo /></a>
          <nav aria-label="Sahifa bo‘limlari" className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className="group relative text-[14px] text-mist transition-colors hover:text-bone">
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-bone transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={`#${IC_FORM_ID}`} onClick={(e) => { e.preventDefault(); goTo(IC_FORM_ID, 'header', open ? closeForNavigation : undefined); }} data-cursor="hover"
              className="hidden h-11 items-center border border-line-strong px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink md:inline-flex">
              Loyihani muhokama qilish
            </a>
            <button ref={toggleRef} type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="ic-menu" aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
              className="relative flex h-11 w-11 items-center justify-center border border-line-strong lg:hidden">
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div ref={menuRef} id="ic-menu" role="dialog" aria-modal="true" aria-label="Menyu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 px-4 pb-10 pt-24 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>
            <nav aria-label="Sahifa bo‘limlari" className="flex flex-col border-t border-line">
              {nav.map((n, i) => (
                <motion.a key={n.id} href={`#${n.id}`} onClick={go(n.id)}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease }}
                  className="flex items-center justify-between border-b border-line py-5 text-[1.6rem] font-semibold tracking-[-0.02em] text-bone">
                  {n.label}<span className="font-mono text-[11px] text-ash">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto">
              <IcCta location="menu" onNavigate={closeForNavigation} className="w-full">Loyihani muhokama qilish</IcCta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── Hero ───────── */
const CALLOUTS = [
  { k: 'Mahsulot', v: 'Sex · Tayyor tovar', pos: { left: '6%', top: '62%' }, side: 'left' as const },
  { k: 'Talab', v: 'Kontent · Reklama', pos: { left: '58.75%', top: '24.2%' }, side: 'right' as const },
  { k: 'Buyurtma', v: 'Lead · CRM', pos: { left: '95%', top: '53.2%' }, side: 'right' as const },
];

function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } });
  return (
    <section aria-labelledby="ic-hero" className="relative isolate overflow-hidden pt-16 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-20">
      <div aria-hidden className="pointer-events-none absolute right-[-12%] top-[6%] -z-10 h-[520px] w-[620px] rounded-full bg-violet/[0.07] blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-10%] left-[30%] -z-10 h-[320px] w-[520px] rounded-full bg-forge/[0.05] blur-[120px]" />
      <div className="shell grid w-full gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
        <motion.div className="relative order-2 -mx-4 pb-12 sm:mx-0 sm:pb-16 lg:order-2 lg:col-span-6 lg:-mr-8 lg:pb-0 xl:-mr-14"
          initial={reduce ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease }}>
          <div className="relative mx-auto max-w-[640px] lg:max-w-none">
            <ProductionLine className="block aspect-[800/620] h-auto w-full [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent),linear-gradient(180deg,transparent,#000_12%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]" />
            <ul aria-hidden className="hidden sm:block">
              {CALLOUTS.map((c, i) => (
                <motion.li key={c.k} className="absolute" style={c.pos}
                  initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1.1 + i * 0.25, ease }}>
                  <span className={`absolute whitespace-nowrap border border-line-strong bg-ink/85 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur ${c.side === 'left' ? 'left-3 -top-[15px]' : 'right-4 -top-[15px]'}`}>
                    <span className={i === 0 ? 'text-forge' : 'text-violet'}>0{i + 1}</span> <span className="text-bone">{c.k}</span> <span className="text-ash">· {c.v}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="order-1 pt-6 sm:pt-12 lg:order-1 lg:col-span-6 lg:pt-0">
          <motion.div {...up(0)}><Eyebrow>{hero.eyebrow}</Eyebrow></motion.div>
          <motion.h1 id="ic-hero" {...up(0.08)}
            className="mt-4 text-[2rem] font-bold leading-[1.05] sm:mt-6 tracking-[-0.04em] min-[400px]:text-[2.3rem] sm:text-[3.1rem] lg:text-[3.1rem] xl:text-[3.4rem] 2xl:text-[4.1rem]">
            <span className="block text-bone/55">{hero.titleA}</span>
            <span className="mt-1 block max-w-[20ch]"><Dotted text={hero.titleB} /></span>
          </motion.h1>
          <motion.p {...up(0.16)} className="mt-4 max-w-[50ch] text-[1rem] leading-relaxed text-bone/80 min-[400px]:text-[1.06rem] sm:mt-6 sm:text-[1.17rem]">{hero.text}</motion.p>
          <motion.div {...up(0.26)} className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <IcCta location="hero" className="w-full sm:w-auto sm:whitespace-nowrap">{hero.cta}</IcCta>
            <IcCta location="hero-secondary" to="tizim" variant="ghost" className="w-full sm:w-auto sm:whitespace-nowrap">{hero.ctaSecondary}</IcCta>
          </motion.div>
          <motion.div {...up(0.36)} className="mt-7 border-t border-line pt-5 sm:mt-9">
            <ol aria-label="Tizim bosqichlari" className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.14em] sm:text-[11px]">
              {hero.chain.map((c, i) => (
                <li key={c} className="flex items-center gap-2.5">
                  <span className={i === hero.chain.length - 1 ? 'text-bone' : 'text-mist'}>{c}</span>
                  {i < hero.chain.length - 1 && <span aria-hidden className="text-forge">→</span>}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 01. Problem ───────── */
function Problem() {
  return (
    <Section labelledBy="ic-problem">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHead index="01" eyebrow={problem.eyebrow} title={problem.title} id="ic-problem" />
        </div>
        <Reveal delay={0.1} className="lg:col-span-5 lg:pt-16">
          <p className="border-l border-forge/70 pl-5 text-[1.05rem] leading-relaxed text-bone/85 sm:text-[1.12rem]">{problem.text}</p>
        </Reveal>
      </div>
      <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {problem.cards.map((c, i) => (
          <Reveal as="li" key={c.t} delay={(i % 3) * 0.06} className="group relative bg-ink p-5 transition-colors duration-500 hover:bg-surface-1 sm:p-8">
            <span className="font-mono text-[11px] text-ash transition-colors duration-500 group-hover:text-forge">{pad2(i + 1)}</span>
            <h3 className="mt-4 text-[1.1rem] font-semibold leading-snug tracking-[-0.015em] text-bone sm:mt-10 sm:text-[1.25rem]">{c.t}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-mist">{c.d}</p>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-12 lg:mt-16">
        <p className="max-w-[30ch] text-[1.6rem] font-bold leading-[1.12] tracking-[-0.03em] text-bone sm:text-[2.1rem] lg:text-[2.5rem]">
          <Dotted text={problem.statement} />
        </p>
      </Reveal>
    </Section>
  );
}

/* ───────── 02. Diagnostics ───────── */
function Diagnostics() {
  return (
    <Section id="diagnostika" labelledBy="ic-diag">
      <div className="relative overflow-hidden border border-line-strong bg-surface-1/80">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet/[0.12] blur-[100px]" />
        <div className="relative grid lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-6 lg:p-14">
            <Reveal><Eyebrow index="02">{diagnostics.eyebrow}</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h2 id="ic-diag" className="mt-6 text-[1.95rem] font-bold leading-[1.05] tracking-[-0.035em] text-bone sm:text-[2.6rem] lg:text-[3rem]"><Dotted text={diagnostics.title} /></h2>
            </Reveal>
            <Reveal delay={0.1}><p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-mist">{diagnostics.text}</p></Reveal>
            <Reveal delay={0.12} className="mt-7 border-t border-line pt-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-violet">{diagnostics.outcomeTitle}</p>
              <ul className="mt-3 space-y-2">
                {diagnostics.outcome.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[0.97rem] leading-snug text-bone/90">
                    <Check className="mt-[5px] text-violet" />{o}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15} className="mt-9">
              <IcCta location="diagnostics" className="w-full sm:w-auto">{diagnostics.cta}</IcCta>
            </Reveal>
          </div>
          <ol className="grid border-t border-line sm:grid-cols-2 lg:col-span-6 lg:border-l lg:border-t-0">
            {diagnostics.items.map((it, i) => (
              <Reveal as="li" key={it.t} delay={i * 0.06}
                className={`relative flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10 ${i > 0 ? 'border-t border-line' : ''} ${i === 1 ? 'sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''}`}>
                <span className="font-mono text-[2.4rem] font-medium leading-none tracking-[-0.04em] text-bone/20">{pad2(i + 1)}</span>
                <div>
                  <h3 className="text-[1.2rem] font-bold leading-tight tracking-[-0.015em] text-bone">{it.t}</h3>
                  <p className="mt-1.5 text-[0.92rem] leading-snug text-mist">{it.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* ───────── 03. B2C / B2B ───────── */
function Channels() {
  return (
    <Section id="sotuv-yollari" labelledBy="ic-channels">
      <SectionHead index="03" eyebrow={channels.eyebrow} title={channels.title} text={channels.text} id="ic-channels" />
      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2">
        {channels.cards.map((c, ci) => {
          const b2b = ci === 1;
          return (
            <Reveal key={c.tag} delay={ci * 0.08} className={`relative flex flex-col overflow-hidden border ${b2b ? 'border-violet/45 bg-[linear-gradient(160deg,rgba(122,107,255,0.10),rgba(122,107,255,0.0)_55%)]' : 'border-line-strong bg-surface-1/70'}`}>
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
                <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${b2b ? 'text-violet' : 'text-forge'}`}>{c.tag}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">Yo‘l {pad2(ci + 1)}</span>
              </div>
              <div className="flex flex-1 flex-col px-5 py-7 sm:px-8 sm:py-9">
                <div className="flex items-end justify-between gap-4">
                  <h3 className="max-w-[18ch] text-[1.5rem] font-bold leading-[1.1] tracking-[-0.025em] text-bone sm:text-[1.9rem]">{c.title}</h3>
                  <p aria-hidden className="shrink-0 text-right leading-none">
                    <span className="tabular block text-[3.2rem] font-bold tracking-[-0.05em] text-bone/15 sm:text-[4.2rem]">{c.qty}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">dona</span>
                  </p>
                </div>
                <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-mist">{c.text}</p>
                <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">{c.segmentsLabel}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.segments.map((s) => <li key={s} className="border border-line-strong px-3 py-1.5 text-[0.9rem] text-bone/90">{s}</li>)}
                </ul>
                <div className="mt-auto pt-9">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">Voronka</p>
                  <Chain items={c.flow} accent={b2b ? 'text-violet' : 'text-forge'} className="mt-3" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-4">
        <div className="flex flex-col gap-6 border border-line-strong bg-ink p-6 sm:p-10 lg:flex-row lg:items-center lg:gap-12">
          <div aria-hidden className="flex shrink-0 items-baseline gap-4 font-bold tracking-[-0.05em]">
            <span className="tabular text-[2.6rem] leading-none text-forge sm:text-[3.4rem]">1</span>
            <span className="font-mono text-[12px] tracking-[0.1em] text-ash">≠</span>
            <span className="tabular text-[2.6rem] leading-none text-violet sm:text-[3.4rem]">50</span>
          </div>
          <p className="max-w-[46ch] text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-bone sm:text-[1.55rem]">{channels.example}</p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────── 04. Marketing system pipeline ───────── */
function Pipeline() {
  const reduce = useReducedMotion();
  const rows = [system.stages.slice(0, 5), system.stages.slice(5)];
  const groupOf = (i: number) => system.groups.findIndex((g) => i >= g.from && i <= g.to);
  const isFocus = (i: number) => i === system.focus;
  const node = (i: number) => (
    <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] ${isFocus(i) ? 'border-violet bg-violet text-white shadow-[0_0_40px_-4px_rgba(122,107,255,0.7)]' : i === system.stages.length - 1 ? 'border-forge/70 bg-ink text-forge' : 'border-line-strong bg-ink text-bone'}`}>{pad2(i + 1)}</span>
  );

  return (
    <Section id="tizim" labelledBy="ic-system" className="overflow-hidden">
      <SectionHead index="04" eyebrow={system.eyebrow} title={system.title} text={system.text} id="ic-system" />

      {/* Desktop: two tracks of five, joined by a return connector */}
      <div className="mt-16 hidden lg:block">
        {rows.map((row, r) => (
          <div key={r} className={r === 1 ? 'mt-0' : ''}>
            <div className="relative">
              <div className="absolute top-[22px] h-px bg-line-strong" style={{ left: '10%', right: '10%' }} />
              <motion.div aria-hidden className="absolute top-[22px] h-px origin-left bg-violet" style={{ left: '10%', right: '10%' }}
                initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 1.6, delay: r * 0.9, ease: [0.65, 0, 0.35, 1] }} />
              <ol className="relative grid grid-cols-5 gap-3">
                {row.map((s, j) => {
                  const i = r * 5 + j;
                  const g = system.groups[groupOf(i)];
                  return (
                    <motion.li key={s.t} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                      transition={{ duration: 0.6, delay: r * 0.9 + j * 0.16, ease }} className="flex flex-col items-center text-center">
                      {node(i)}
                      <div className={`mt-5 flex h-full w-full flex-col border px-4 py-4 ${isFocus(i) ? 'border-violet/60 bg-violet/[0.08]' : 'border-line bg-surface-1/70'}`}>
                        <p className={`font-mono text-[9.5px] uppercase tracking-[0.14em] ${isFocus(i) ? 'text-violet' : 'text-ash'}`}>{g.name}</p>
                        <h3 className="mt-2 text-[1rem] font-semibold uppercase leading-tight tracking-[0.01em] text-bone">{s.t}</h3>
                        <p className="mt-1.5 text-[0.85rem] leading-snug text-mist">{s.d}</p>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
            {r === 0 && (
              <div aria-hidden className="relative h-16">
                <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 64">
                  <path d="M90 0 V32 H10 V64" fill="none" stroke="#7a6bff" strokeOpacity="0.5" strokeDasharray="1.2 1.2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile / tablet: vertical rail */}
      <ol className="relative mt-12 max-w-[720px] space-y-2.5 lg:hidden">
        <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-line-strong via-violet to-line-strong" />
        {system.stages.map((s, i) => {
          const g = groupOf(i);
          const first = system.groups[g].from === i;
          return (
            <li key={s.t} className="relative">
              {first && <p className={`pl-14 font-mono text-[10.5px] uppercase tracking-[0.14em] ${g === 1 ? 'text-violet' : 'text-mist'} ${i === 0 ? '' : 'pt-4'} pb-2`}>{system.groups[g].name}</p>}
              <Reveal y={14} className="flex items-center gap-4">
                {node(i)}
                <div className={`min-w-0 flex-1 border px-4 py-3 ${isFocus(i) ? 'border-violet/60 bg-violet/[0.08]' : 'border-line bg-surface-1/70'}`}>
                  <h3 className="text-[0.98rem] font-semibold uppercase tracking-[0.01em] text-bone">{s.t}</h3>
                  <p className="mt-0.5 text-[0.86rem] text-mist">{s.d}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <Reveal className="mt-10 lg:mt-14">
        <div className="relative overflow-hidden border border-violet/40 bg-[linear-gradient(120deg,rgba(122,107,255,0.14),rgba(122,107,255,0.02)_60%)] p-6 sm:p-10">
          <p className="text-[1.45rem] font-bold leading-[1.15] tracking-[-0.025em] text-bone/60 sm:text-[2rem]">{system.highlightA}</p>
          <p className="text-[1.45rem] font-bold leading-[1.15] tracking-[-0.025em] text-bone sm:text-[2rem]"><Dotted text={system.highlightB} /></p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────── 05. Modules ───────── */
function Modules() {
  return (
    <Section labelledBy="ic-modules">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead index="05" eyebrow={modules.eyebrow} title={modules.title} id="ic-modules" />
            <Reveal delay={0.15}>
              <p className="mt-8 flex max-w-[44ch] items-start gap-3 border-t border-line pt-5 text-[1rem] leading-snug text-bone/85">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-forge" />{modules.note}
              </p>
            </Reveal>
          </div>
        </div>
        <ol className="border-t border-line lg:col-span-7">
          {modules.items.map((m, i) => (
            <Reveal as="li" key={m.t} delay={i * 0.04} className="group grid grid-cols-[auto_1fr] gap-x-5 border-b border-line py-6 sm:grid-cols-[56px_minmax(0,0.9fr)_minmax(0,1.3fr)] sm:gap-x-8 sm:py-8">
              <span className="pt-1 font-mono text-[11px] text-ash transition-colors duration-500 group-hover:text-violet">{pad2(i + 1)}</span>
              <h3 className="text-[1.25rem] font-bold leading-tight tracking-[-0.02em] text-bone sm:text-[1.45rem]">{m.t}</h3>
              <p className="col-start-2 mt-2 text-[0.97rem] leading-relaxed text-mist sm:col-start-3 sm:mt-0">{m.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ───────── 06. Case — performance report ───────── */
function CaseReport() {
  return (
    <Section id="tajriba" labelledBy="ic-case">
      <SectionHead index="06" eyebrow={caseStudy.eyebrow} title={caseStudy.title} text={caseStudy.text} id="ic-case" />
      <Reveal className="mt-12 lg:mt-16">
        <article aria-label="Loyiha hisoboti" className="relative overflow-hidden border border-line-strong bg-surface-1/90">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-forge/[0.08] blur-[110px]" />
          <header className="relative flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-bone">
              <span aria-hidden className="h-2 w-2 rounded-full bg-forge" />{caseStudy.label}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
              Davr: <span className="text-bone">{caseStudy.period}</span>
            </p>
          </header>

          <dl className="relative grid border-b border-line sm:grid-cols-3">
            {caseStudy.metrics.map((m, i) => (
              <div key={m.k} className={`flex flex-col-reverse px-5 py-8 sm:px-8 sm:py-12 ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}>
                <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist">{m.k}</dt>
                <dd className={`tabular text-[3rem] font-bold leading-none tracking-[-0.05em] min-[400px]:text-[3.4rem] sm:text-[3.2rem] lg:text-[4.6rem] xl:text-[5.4rem] ${i === 2 ? 'text-bone' : 'text-bone/90'}`}>
                  {m.v.includes(' ')
                    ? <>{m.v.slice(0, m.v.lastIndexOf(' '))}{' '}<span className="ml-0.5 text-[0.4em] font-semibold tracking-[-0.02em] text-mist">{m.v.slice(m.v.lastIndexOf(' ') + 1)}</span></>
                    : m.v}
                </dd>
              </div>
            ))}
          </dl>

          <ol className="relative grid md:grid-cols-3">
            {caseStudy.story.map((s, i) => (
              <li key={s.k} className={`px-5 py-7 sm:px-8 sm:py-9 ${i > 0 ? 'border-t border-line md:border-l md:border-t-0' : ''}`}>
                <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist">
                  <span className={i === 2 ? 'text-forge' : 'text-violet'}>0{i + 1}</span>{s.k}
                </p>
                <p className={`mt-4 text-[1rem] leading-relaxed ${i === 2 ? 'text-bone' : 'text-bone/85'}`}>{s.d}</p>
              </li>
            ))}
          </ol>

          <footer className="relative flex gap-3 border-t border-line bg-ink/60 px-5 py-5 sm:px-8">
            <span aria-hidden className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-forge text-[11px] font-bold text-forge">i</span>
            <p className="text-[0.9rem] leading-snug text-bone/80">{caseStudy.disclaimer}</p>
          </footer>
        </article>
      </Reveal>
    </Section>
  );
}

/* ───────── 07. Industries ───────── */
function Industries() {
  return (
    <Section labelledBy="ic-industries">
      <SectionHead index="07" eyebrow={industries.eyebrow} title={industries.title} id="ic-industries" />
      <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line lg:mt-16 lg:grid-cols-3">
        {industries.items.map((it, i) => {
          const proven = it === industries.proven;
          const last = i === industries.items.length - 1;
          return (
            <Reveal as="li" key={it} delay={(i % 3) * 0.05}
              className={`group relative flex min-h-[104px] flex-col justify-between gap-5 p-4 transition-colors duration-500 sm:min-h-[150px] sm:p-7 ${proven ? 'bg-surface-2' : 'bg-ink hover:bg-surface-1'} ${last ? 'col-span-2 lg:col-span-1' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] text-ash">{pad2(i + 1)}</span>
                {proven && <span className="border border-forge/60 px-1.5 py-1 text-right font-mono text-[9px] uppercase leading-tight tracking-[0.1em] text-forge sm:px-2 sm:text-[9.5px] sm:tracking-[0.14em]">{industries.provenTag}</span>}
              </div>
              <h3 className={`break-words text-[1.05rem] font-bold leading-tight tracking-[-0.02em] min-[400px]:text-[1.15rem] sm:text-[1.6rem] ${last ? 'text-mist' : 'text-bone'}`}>{it}</h3>
            </Reveal>
          );
        })}
      </ul>
      <Reveal className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-[52ch] text-[1.08rem] leading-relaxed text-bone/85">{industries.note}</p>
        <IcCta location="industries" variant="ghost" className="w-full shrink-0 sm:w-auto">{industries.cta}</IcCta>
      </Reveal>
    </Section>
  );
}

/* ───────── 08. Business states ───────── */
function States() {
  return (
    <Section labelledBy="ic-states">
      <SectionHead index="08" eyebrow={states.eyebrow} title={states.title} id="ic-states" />
      <ol className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
        {states.items.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 0.08} className="group relative flex flex-col border border-line-strong bg-surface-1/70 p-6 transition-colors duration-500 hover:border-bone/35 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[2.8rem] font-medium leading-none tracking-[-0.04em] text-bone/20 transition-colors duration-500 group-hover:text-violet">{pad2(i + 1)}</span>
              <span aria-hidden className="flex gap-1.5">
                {[0, 1, 2].map((k) => <span key={k} className={`h-1.5 w-6 ${k <= i ? 'bg-violet' : 'bg-line-strong'}`} />)}
              </span>
            </div>
            <h3 className="mt-10 text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-bone sm:text-[1.55rem]">{s.t}</h3>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-mist">{s.d}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-8">
        <IcCta location="states" className="w-full sm:w-auto">{states.cta}</IcCta>
      </Reveal>
    </Section>
  );
}

/* ───────── 09. Process ───────── */
function Process() {
  return (
    <Section labelledBy="ic-process">
      <SectionHead index="09" eyebrow={process.eyebrow} title={process.title} id="ic-process" />
      <ol className="relative mt-12 grid gap-2.5 lg:mt-16 lg:grid-cols-6 lg:gap-0">
        <span aria-hidden className="absolute bottom-8 left-[21px] top-8 w-px bg-line-strong lg:hidden" />
        <span aria-hidden className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[21px] hidden h-px bg-line-strong lg:block" />
        {process.steps.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 0.07} className="relative flex gap-4 lg:block">
            <span className={`relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[12px] lg:mx-auto ${i === 0 ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{pad2(i + 1)}</span>
            <div className="min-w-0 flex-1 border border-line bg-surface-1/70 px-4 py-3.5 lg:mx-1.5 lg:mt-5 lg:min-h-[150px] lg:px-4 lg:py-5">
              <h3 className="text-[1rem] font-semibold uppercase tracking-[0.01em] text-bone">{s.t}</h3>
              <p className="mt-1 text-[0.88rem] leading-snug text-mist lg:mt-2">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ───────── 10. Fit ───────── */
function Fit() {
  return (
    <Section labelledBy="ic-fit">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHead index="10" eyebrow={fit.eyebrow} title={fit.title} text={fit.text} id="ic-fit" />
        </div>
        <Reveal delay={0.1} className="lg:col-span-6 lg:pt-16">
          <div className="border border-line-strong bg-surface-1/80">
            <p className="border-b border-line px-5 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-violet sm:px-8">{fit.listTitle}</p>
            <ul className="divide-y divide-line">
              {fit.list.map((it) => (
                <li key={it} className="flex items-center gap-4 px-5 py-4 text-[1rem] text-bone sm:px-8">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-violet/60 text-violet"><Check /></span>{it}
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-6 sm:px-8">
              <p className="text-[1rem] leading-relaxed text-bone/85">{fit.closing}</p>
              <IcCta location="fit" className="mt-6 w-full sm:w-auto">Loyihani muhokama qilish</IcCta>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── 11. FAQ ───────── */
function FaqItem({ q, a, index, open, onToggle }: { q: string; a: string; index: number; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-line">
      <h3>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} data-cursor="hover"
          className="group flex min-h-[64px] w-full items-center gap-4 py-5 text-left sm:gap-6">
          <span className="w-7 shrink-0 font-mono text-[11px] text-ash">{pad2(index + 1)}</span>
          <span className="flex-1 text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-bone sm:text-[1.2rem]">{q}</span>
          <span aria-hidden className={`relative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors duration-300 ${open ? 'border-violet text-violet' : 'border-line-strong text-bone group-hover:border-bone/50'}`}>
            <span className="absolute h-px w-3.5 bg-current" />
            <span className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ${open ? 'scale-y-0' : ''}`} />
          </span>
        </button>
      </h3>
      <div id={`${id}-a`} role="region" aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden" aria-hidden={!open}>
          <p className={`max-w-[68ch] pb-6 pl-11 pr-2 text-[0.98rem] leading-relaxed text-mist transition-opacity duration-500 sm:pl-[52px] ${open ? 'opacity-100' : 'opacity-0'}`}>{a}</p>
        </div>
      </div>
    </li>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="savollar" labelledBy="ic-faq">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHead index="11" eyebrow={faq.eyebrow} title={faq.title} id="ic-faq" />
        </div>
        <Reveal delay={0.1} className="lg:col-span-8">
          <ul className="border-t border-line">
            {faq.items.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} open={open === i} onToggle={() => setOpen((v) => (v === i ? null : i))} />
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── 12. Final CTA + form ───────── */
function ApplicationSection() {
  return (
    <section id={IC_FORM_ID} aria-labelledby="ic-final" className="relative scroll-mt-16 border-t border-line py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[80%] -translate-x-1/2 rounded-full bg-violet/[0.07] blur-[120px]" />
      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="12">{finalCta.eyebrow}</Eyebrow>
            <h2 id="ic-final" className="mt-6 text-[1.95rem] font-bold leading-[1.06] tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3rem]">
              <span className="block text-bone/55">{finalCta.titleA}</span>
              <span className="block"><Dotted text={finalCta.titleB} /></span>
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-mist">{finalCta.text}</p>
            <a href={`#${IC_FORM_ID}-card`} data-cursor="hover"
              onClick={(e) => { e.preventDefault(); track('IshlabCTA', { location: 'final' }, { custom: true }); scrollToId(`${IC_FORM_ID}-card`); window.setTimeout(() => (document.getElementById('name') as HTMLInputElement | null)?.focus({ preventScroll: true }), 700); }}
              className="group mt-8 inline-flex min-h-14 w-full items-center justify-center gap-4 border border-line-strong px-7 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink sm:w-auto">
              {finalCta.cta}
              <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5"><path d="M6 1v13M1 9l5 5 5-5" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
            </a>
            <ul className="mt-8 space-y-3">
              {finalCta.aside.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[0.93rem] leading-snug text-bone/80">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-violet" />{a}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-7">
          <IcForm />
        </div>
      </div>
    </section>
  );
}

/* ───────── Sticky mobile CTA ───────── */
function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const formEl = document.getElementById(IC_FORM_ID);
    let typing = false;
    const update = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.7;
      const formReached = formEl ? formEl.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setShow(pastHero && !formReached && !typing);
    };
    const onFocusIn = (e: FocusEvent) => { typing = !!(e.target as HTMLElement | null)?.closest?.('input,textarea,select'); update(); };
    const onFocusOut = () => { typing = false; update(); };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  return (
    <div aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/85 px-4 pt-3 backdrop-blur-xl transition-[transform,opacity,visibility] duration-500 md:hidden ${show ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-full opacity-0'}`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
      <IcCta location="sticky-mobile" className="w-full">Loyihani muhokama qilish</IcCta>
    </div>
  );
}

/* ───────── Footer ───────── */
function MiniFooter() {
  return (
    <footer className="border-t border-line pb-28 pt-10 md:pb-10">
      <div className="shell flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ash sm:flex-row sm:items-center">
        <a href="/" aria-label="FAZO Digital — bosh sahifa"><Logo className="text-[14px]" markClass="h-5" /></a>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>FAZO Digital © 2026</span>
          <a href="/privacy" target="_blank" rel="noopener" className="transition-colors hover:text-bone">Maxfiylik siyosati</a>
        </div>
      </div>
    </footer>
  );
}

export default function IshlabPage() {
  useEffect(() => {
    captureAttribution();
    initPixel();
    track('ViewContent', { content_name: 'Ishlab chiqarish landing', content_category: 'ishlab-chiqarish' }, { onceKey: 'ic-view-content' });
  }, []);
  return (
    <div className="relative">
      <Header />
      <Hero />
      <Problem />
      <Diagnostics />
      <Channels />
      <Pipeline />
      <Modules />
      <CaseReport />
      <Industries />
      <States />
      <Process />
      <Fit />
      <Faq />
      <ApplicationSection />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
