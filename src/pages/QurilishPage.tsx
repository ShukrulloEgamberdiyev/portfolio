import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { QrForm } from '../components/qurilish/QrForm';
import { Dotted, Eyebrow, Icon, QrCta, Section, SectionHead, goToForm } from '../components/qurilish/QrUi';
import { Skyline } from '../components/qurilish/Skyline';
import { QR_FORM_ID, finalCta, hero, journey, nav, pillars, pricing, problem, promise, proof, system } from '../content/qurilish';
import { scrollToId } from '../lib/scroll';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal } from '../ui/Reveal';

const ease = [0.22, 1, 0.36, 1] as const;

/* ───────── Header ───────── */
function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); scrollToId(id); };

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
            <a href={`#${QR_FORM_ID}`} onClick={(e) => { e.preventDefault(); setOpen(false); goToForm('header'); }} data-cursor="hover"
              className="hidden h-11 items-center border border-line-strong px-5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink md:inline-flex">
              Loyihani muhokama qilish
            </a>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="qr-menu" aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
              className="relative flex h-11 w-11 items-center justify-center border border-line-strong lg:hidden">
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-px w-5 bg-bone transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div id="qr-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
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
              <QrCta location="menu" className="w-full">Loyihani muhokama qilish</QrCta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── 01. Hero ───────── */
const CALLOUT_POS = [
  { left: '35%', top: '20%' },
  { left: '74%', top: '40%' },
  { left: '62%', top: '70%' },
];

function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } });
  return (
    <section aria-labelledby="qr-hero" className="relative isolate overflow-hidden pt-16 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-20">
      <div aria-hidden className="pointer-events-none absolute right-[-10%] top-[10%] -z-10 h-[520px] w-[620px] rounded-full bg-violet/[0.07] blur-[140px]" />
      <div className="shell grid w-full gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
        {/* Visual — first on mobile so the project is what the visitor sees */}
        <motion.div className="relative order-1 -mx-4 sm:mx-0 lg:order-2 lg:col-span-6 lg:-mr-8 xl:-mr-14"
          initial={reduce ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease }}>
          <div className="relative mx-auto max-w-[640px] lg:max-w-none">
            <Skyline className="block h-auto w-full [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent),linear-gradient(180deg,transparent,#000_14%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]" />
            {/* Architectural callouts: where FAZO's system touches the project */}
            <ul aria-hidden className="hidden sm:block">
              {hero.callouts.map((c, i) => (
                <motion.li key={c.k} className="absolute" style={CALLOUT_POS[i]}
                  initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1.1 + i * 0.25, ease }}>
                  <span className="absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full border border-violet bg-ink" />
                  <span className={`absolute top-0 h-px w-10 bg-violet/60 ${i === 0 ? 'left-1' : 'right-1'}`} />
                  <span className={`absolute -top-[15px] whitespace-nowrap border border-line-strong bg-ink/85 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur ${i === 0 ? 'left-11' : 'right-11'}`}>
                    <span className="text-violet">0{i + 1}</span> <span className="text-bone">{c.k}</span> <span className="text-ash">· {c.v}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="order-2 pb-16 sm:pb-20 lg:order-1 lg:col-span-6 lg:pb-0">
          <motion.div {...up(0)}><Eyebrow>{hero.eyebrow}</Eyebrow></motion.div>
          <motion.h1 id="qr-hero" {...up(0.08)}
            className="mt-6 max-w-[19ch] text-[2.15rem] font-bold leading-[1.04] tracking-[-0.04em] min-[400px]:text-[2.4rem] sm:text-[3.3rem] lg:text-[3.35rem] xl:text-[4rem] 2xl:text-[4.6rem]">
            <Dotted text={hero.title} />
          </motion.h1>
          <motion.p {...up(0.16)} className="mt-6 max-w-[48ch] text-[1.08rem] leading-relaxed text-bone/80 sm:text-[1.2rem]">{hero.text}</motion.p>
          <motion.div {...up(0.26)} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <QrCta location="hero" className="w-full sm:w-auto">{hero.cta}</QrCta>
          </motion.div>
          <motion.p {...up(0.34)} className="mt-8 flex max-w-[52ch] items-start gap-3 border-t border-line pt-5 text-[0.93rem] leading-snug text-mist">
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-lamp" />{hero.context}
          </motion.p>
          {/* Mobile: the callouts as a compact chain */}
          <motion.ol {...up(0.4)} aria-label="Tizim" className="mt-6 grid grid-cols-3 gap-px border border-line bg-line sm:hidden">
            {hero.callouts.map((c, i) => (
              <li key={c.k} className="bg-ink px-2.5 py-3">
                <span className="font-mono text-[10px] text-violet">0{i + 1}</span>
                <span className="mt-1 block text-[0.85rem] font-semibold leading-tight text-bone">{c.k}</span>
                <span className="mt-0.5 block text-[0.72rem] leading-snug text-ash">{c.v}</span>
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* ───────── 02. Problem ───────── */
const PROBLEM_ICONS = ['cost', 'same', 'lost', 'split'];
function Problem() {
  return (
    <Section labelledBy="qr-problem">
      <SectionHead index="01" eyebrow={problem.eyebrow} title={problem.title} id="qr-problem" />
      <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {problem.cards.map((c, i) => (
          <Reveal as="li" key={c.t} delay={i * 0.06} className="group relative flex gap-4 bg-ink p-5 transition-colors duration-500 hover:bg-surface-1 sm:block sm:p-8">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong text-bone transition-colors duration-500 group-hover:border-violet group-hover:text-violet"><Icon name={PROBLEM_ICONS[i]} /></span>
              <span className="hidden font-mono text-[11px] text-ash sm:inline">0{i + 1}</span>
            </div>
            <div>
              <h3 className="text-[1.1rem] font-semibold leading-snug tracking-[-0.015em] text-bone sm:mt-8 sm:text-[1.25rem] lg:mt-12">{c.t}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-mist sm:mt-2.5">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-12 lg:mt-16">
        <p className="max-w-[26ch] text-[1.7rem] font-bold leading-[1.1] tracking-[-0.03em] text-bone sm:text-[2.2rem] lg:text-[2.6rem]">
          <Dotted text={problem.statement} />
        </p>
      </Reveal>
    </Section>
  );
}

/* ───────── 03. FAZO system ───────── */
function SystemFlow() {
  const reduce = useReducedMotion();
  const groupOf = (i: number) => system.groups.findIndex((g) => i >= g.from && i <= g.to);
  const n = system.stages.length;
  return (
    <Section id="tizim" labelledBy="qr-system" className="overflow-hidden">
      <SectionHead index="02" eyebrow={system.eyebrow} title={system.title} text={system.text} id="qr-system" />

      {/* Desktop: one track, three zones, with the optimisation loop returning underneath */}
      <div className="mt-16 hidden xl:block">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {system.groups.map((g) => (
            <div key={g.name} style={{ gridColumn: `${g.from + 1} / ${g.to + 2}` }}
              className={`flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.14em] ${g.from === system.focus ? 'justify-center text-violet' : 'text-mist'}`}>
              {g.from === system.focus ? <span>{g.name}</span> : <><span className="whitespace-nowrap">{g.name}</span><span className="h-px flex-1 bg-line-strong" /></>}
            </div>
          ))}
        </div>
        <div className="relative mt-6">
          <div className="absolute top-[22px] h-px bg-line-strong" style={{ left: `${50 / n}%`, right: `${50 / n}%` }} />
          <motion.div aria-hidden className="absolute top-[22px] h-px origin-left bg-violet" style={{ left: `${50 / n}%`, right: `${50 / n}%` }}
            initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }} />
          <ol className="relative grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {system.stages.map((s, i) => {
              const focus = i === system.focus;
              return (
                <motion.li key={s.t} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.22, ease }} className="flex flex-col items-center text-center">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[12px] ${focus ? 'border-violet bg-violet text-white shadow-[0_0_40px_-4px_rgba(122,107,255,0.7)]' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={`mt-5 flex h-full w-full flex-col border px-3 py-4 ${focus ? 'border-violet/60 bg-violet/[0.08]' : 'border-line bg-surface-1/70'}`}>
                    <h3 className="break-words text-[0.95rem] font-semibold uppercase leading-tight tracking-[0.01em] text-bone [hyphens:auto]">{s.t}</h3>
                    <p className="mt-2 text-[0.82rem] leading-snug text-ash">{s.d}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
          {/* return loop */}
          <div className="relative mt-4 h-14" aria-hidden>
            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 56">
              <path d={`M ${100 - 50 / n} 0 V 28 H ${50 / n} V 0`} fill="none" stroke="#7a6bff" strokeOpacity="0.45" strokeDasharray="1.2 1.2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <p className="-mt-[38px] flex justify-center">
            <span className="relative bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mist"><span className="text-violet">↺</span> {system.loop}</span>
          </p>
        </div>
      </div>

      {/* Mobile / tablet: vertical line, grouped */}
      <ol className="relative mt-12 max-w-[720px] space-y-2.5 xl:hidden">
        <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-line-strong via-violet to-line-strong" />
        {system.stages.map((s, i) => {
          const g = groupOf(i);
          const first = system.groups[g].from === i;
          const focus = i === system.focus;
          return (
            <li key={s.t} className="relative">
              {first && <p className={`pl-14 font-mono text-[10.5px] uppercase tracking-[0.14em] ${focus ? 'text-violet' : 'text-mist'} ${i === 0 ? '' : 'pt-4'} pb-2`}>{system.groups[g].name}</p>}
              <Reveal y={14} className="flex items-center gap-4">
                <span className={`relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[12px] ${focus ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
                <div className={`min-w-0 flex-1 border px-4 py-3 ${focus ? 'border-violet/60 bg-violet/[0.08]' : 'border-line bg-surface-1/70'}`}>
                  <h3 className="text-[0.98rem] font-semibold uppercase tracking-[0.01em] text-bone">{s.t}</h3>
                  <p className="mt-0.5 text-[0.86rem] text-ash">{s.d}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
        <li className="relative pt-3">
          <Reveal y={10} className="flex items-center gap-4">
            <span className="relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border border-dashed border-violet/70 bg-ink text-[15px] text-violet">↺</span>
            <p className="flex-1 text-[0.9rem] leading-snug text-mist">{system.loop}</p>
          </Reveal>
        </li>
      </ol>
    </Section>
  );
}

/* ───────── 04. What we build ───────── */
const PILLAR_ICONS = ['strategy', 'reach', 'infra', 'sales'];
function Pillars() {
  return (
    <Section id="yonalishlar" labelledBy="qr-pillars">
      <SectionHead index="03" eyebrow={pillars.eyebrow} title={pillars.title} id="qr-pillars" />
      <ol className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:mt-16 xl:grid-cols-4">
        {pillars.items.map((p, i) => (
          <Reveal as="li" key={p.t} delay={i * 0.07} className="group relative flex flex-col bg-ink p-6 transition-colors duration-500 hover:bg-surface-1 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[2.4rem] font-medium leading-none tracking-[-0.04em] text-bone/20 transition-colors duration-500 group-hover:text-violet">0{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center border border-line-strong text-bone"><Icon name={PILLAR_ICONS[i]} /></span>
            </div>
            <h3 className="mt-10 text-[1.35rem] font-bold uppercase leading-tight tracking-[-0.02em] text-bone lg:mt-14">{p.t}</h3>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-violet">{p.role}</p>
            <ul className="mt-6 divide-y divide-line border-t border-line">
              {p.list.map((it) => (
                <li key={it} className="flex items-center gap-3 py-3 text-[0.97rem] text-bone/85">
                  <span aria-hidden className="h-px w-3 shrink-0 bg-bone/40" />{it}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-4">
        <div className="relative flex flex-col gap-6 overflow-hidden border border-violet/40 bg-[linear-gradient(120deg,rgba(122,107,255,0.14),rgba(122,107,255,0.02)_60%)] p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[30ch] text-[1.45rem] font-bold leading-[1.15] tracking-[-0.025em] text-bone sm:text-[1.9rem]">{pillars.statement}</p>
          <QrCta location="pillars" variant="ghost" className="w-full shrink-0 sm:w-auto">Loyihani muhokama qilish</QrCta>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────── 05. Buyer journey ───────── */
function Journey() {
  const reduce = useReducedMotion();
  return (
    <Section labelledBy="qr-journey">
      <SectionHead index="04" eyebrow={journey.eyebrow} title={journey.title} id="qr-journey" />
      <div className="mt-12 lg:mt-16">
        {/* two demand sources */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:mx-auto lg:max-w-[980px]">
          {journey.sources.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08} className="border border-line-strong bg-surface-1/80 p-4 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-violet">{s.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash">{i === 0 ? 'Talab yaratish' : 'Talabni ushlash'}</span>
              </div>
              <h3 className="mt-4 text-[1.15rem] font-bold uppercase tracking-[-0.01em] text-bone sm:mt-6 sm:text-[1.5rem]">{s.t}</h3>
              <p className="mt-2 text-[0.86rem] leading-relaxed text-mist sm:text-[0.97rem]">{s.d}</p>
            </Reveal>
          ))}
        </div>
        {/* merge connector */}
        <div aria-hidden className="relative mx-auto h-16 w-full lg:max-w-[980px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 64" preserveAspectRatio="none">
            <path d="M25 0 V20 Q25 32 37 32 H50 V64" fill="none" stroke="#f5f5f5" strokeOpacity="0.2" vectorEffect="non-scaling-stroke" />
            <path d="M75 0 V20 Q75 32 63 32 H50" fill="none" stroke="#f5f5f5" strokeOpacity="0.2" vectorEffect="non-scaling-stroke" />
          </svg>
          <motion.span className="absolute left-1/2 top-8 h-6 w-px -translate-x-1/2 bg-violet"
            animate={reduce ? undefined : { y: [0, 24], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }} />
        </div>
        {/* single path to the manager */}
        <ol className="relative grid gap-2.5 lg:grid-cols-4 lg:gap-0">
          <span aria-hidden className="absolute bottom-8 left-[21px] top-8 w-px bg-line-strong lg:hidden" />
          {journey.steps.map((s, i) => {
            const last = i === journey.steps.length - 1;
            return (
              <Reveal as="li" key={s.t} delay={i * 0.08} className="relative flex gap-4 lg:block">
                <span className={`relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[12px] lg:mx-auto ${last ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{s.n}</span>
                {!last && <span aria-hidden className="absolute left-[calc(50%+30px)] right-[calc(-50%+30px)] top-[21px] hidden h-px bg-line-strong lg:block" />}
                {!last && <svg aria-hidden width="7" height="10" viewBox="0 0 7 10" className="absolute right-[calc(-50%+30px)] top-[16px] hidden text-violet lg:block"><path d="m1 1 4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>}
                <div className="min-w-0 flex-1 border border-line bg-surface-1/70 px-4 py-3.5 lg:mx-2 lg:mt-5 lg:px-5 lg:py-5 lg:text-center">
                  <h3 className="text-[1rem] font-semibold uppercase tracking-[0.01em] text-bone lg:text-[1.05rem]">{s.t}</h3>
                  <p className="mt-1 text-[0.88rem] leading-snug text-mist lg:mt-2">{s.d}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

/* ───────── 06. Responsibility ───────── */
function Responsibility() {
  return (
    <Section labelledBy="qr-promise">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal><Eyebrow index="05">{promise.eyebrow}</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 id="qr-promise" className="mt-6 text-[1.1rem] font-medium text-mist sm:text-[1.25rem]">{promise.title}</h2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[2.1rem] font-bold leading-[1.04] tracking-[-0.04em] text-bone sm:text-[2.9rem] lg:text-[3.4rem]"><Dotted text={promise.statement} /></p>
          </Reveal>
          <Reveal delay={0.15}><p className="mt-6 max-w-[48ch] text-[1.08rem] leading-relaxed text-mist">{promise.text}</p></Reveal>
          <Reveal delay={0.2} className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">{promise.ours}</p>
            <ul className="mt-4 divide-y divide-line border border-line">
              {promise.oursList.map((it) => (
                <li key={it} className="flex items-center gap-3 px-4 py-3.5 text-[0.97rem] text-bone">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="shrink-0 text-violet"><path d="m2 6.3 2.6 2.5L10 3.2" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>{it}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-6 lg:pt-16">
          <div className="relative border border-line-strong bg-surface-1/80 p-6 sm:p-10">
            <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-lamp/70" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-lamp">Shaffoflik</p>
            <h3 className="mt-5 text-[1.45rem] font-bold leading-[1.15] tracking-[-0.025em] text-bone sm:text-[1.8rem]">{promise.honestTitle}</h3>
            <p className="mt-4 text-[1rem] leading-relaxed text-mist">{promise.honestText}</p>
            <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">Yakuniy sotuvga ta’sir qiladi</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {promise.factors.map((f) => (
                <li key={f} className="border border-line-strong px-3.5 py-2 text-[0.9rem] text-bone/85">{f}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── 07. Experience ───────── */
function Proof() {
  return (
    <Section labelledBy="qr-proof">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead index="06" eyebrow={proof.eyebrow} title={proof.title} text={proof.text} id="qr-proof" />
          </div>
        </div>
        <div className="space-y-4 lg:col-span-7">
          {proof.cases.map((c, ci) => (
            <Reveal key={ci} className="border border-line-strong bg-surface-1/70">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone">{c.label}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">Anonim loyiha</span>
              </div>
              <ol className="grid sm:grid-cols-2">
                {[
                  { k: proof.steps[0], wide: true, body: <p className="text-[1.05rem] leading-relaxed text-bone">{c.task}</p> },
                  { k: proof.steps[1], wide: false, body: <Tags items={c.did} /> },
                  { k: proof.steps[2], wide: false, body: <Tags items={c.ads} /> },
                  // Shown only when a verified result exists for this case.
                  ...(c.result?.length ? [{ k: 'Natija', wide: true, body: (
                    <ul className="space-y-2">
                      {c.result.map((r) => (
                        <li key={r} className="flex items-start gap-2.5 text-[0.97rem] leading-snug text-bone">
                          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="mt-[5px] shrink-0 text-violet"><path d="m2 6.3 2.6 2.5L10 3.2" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>{r}
                        </li>
                      ))}
                    </ul>
                  ) }] : []),
                ].map((s, i, all) => (
                  <li key={s.k} className={`border-line px-5 py-6 sm:px-8 sm:py-7 ${s.wide ? 'sm:col-span-2' : ''} ${i > 0 ? 'border-t' : ''} ${i === 2 ? 'sm:border-l' : ''}`}>
                    <p className="mb-4 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist">
                      <span className="text-violet">0{i + 1}</span>{s.k}{i < all.length - 1 && <span aria-hidden className="text-ash">→</span>}
                    </p>
                    {s.body}
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
          <Reveal><p className="px-1 text-[0.85rem] leading-snug text-ash">{proof.note}</p></Reveal>
        </div>
      </div>
    </Section>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => <li key={t} className="border border-line-strong px-3 py-1.5 text-[0.88rem] text-bone/90">{t}</li>)}
    </ul>
  );
}

/* ───────── 08. Partnership / pricing ───────── */
function Pricing() {
  return (
    <Section id="hamkorlik" labelledBy="qr-pricing">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHead index="07" eyebrow={pricing.eyebrow} title={pricing.title} text={pricing.text} id="qr-pricing" />
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-[46ch] border-l border-violet pl-5 text-[1.05rem] leading-relaxed text-bone/85">{pricing.qualify}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-6">
          <div className="relative overflow-hidden border border-line-strong bg-surface-1/90">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/[0.14] blur-[90px]" />
            <div className="relative px-6 pb-8 pt-8 sm:px-10 sm:pt-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">Xizmat narxi</p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular text-[2.4rem] font-bold leading-none tracking-[-0.045em] text-bone min-[400px]:text-[2.8rem] sm:text-[3.6rem]">{pricing.price}</span>
                <span className="font-mono text-[14px] uppercase tracking-[0.1em] text-mist">{pricing.per}</span>
              </p>
              <p className="mt-4 text-[0.95rem] leading-snug text-mist">{pricing.priceNote}</p>
              <ul className="mt-8 grid gap-x-6 border-t border-line pt-6 sm:grid-cols-2">
                {pricing.includes.map((it) => (
                  <li key={it} className="flex items-center gap-3 py-2 text-[0.95rem] text-bone/90">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-violet" />{it}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex gap-3 border-t border-line bg-ink/60 px-6 py-5 sm:px-10">
              <span aria-hidden className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-lamp text-[11px] font-bold text-lamp">i</span>
              <p className="text-[0.93rem] leading-snug text-bone/90">{pricing.adBudget}</p>
            </div>
            <div className="relative border-t border-line px-6 py-6 sm:px-10">
              <QrCta location="pricing" className="w-full sm:w-auto">Loyihani muhokama qilish</QrCta>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── 09. Final CTA + form ───────── */
function ApplicationSection() {
  return (
    <section id={QR_FORM_ID} aria-labelledby="qr-form-title" className="relative scroll-mt-16 border-t border-line py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[80%] -translate-x-1/2 rounded-full bg-violet/[0.07] blur-[120px]" />
      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="08">{finalCta.eyebrow}</Eyebrow>
            <h2 id="qr-form-title" className="mt-6 text-[1.95rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3rem]"><Dotted text={finalCta.title} /></h2>
            <p className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-mist">{finalCta.text}</p>
            <a href={`#${QR_FORM_ID}-card`} data-cursor="hover"
              onClick={(e) => { e.preventDefault(); track('QurilishCTA', { location: 'final' }, { custom: true }); scrollToId(`${QR_FORM_ID}-card`); window.setTimeout(() => (document.getElementById('name') as HTMLInputElement | null)?.focus({ preventScroll: true }), 700); }}
              className="group mt-8 inline-flex min-h-14 items-center gap-4 border border-line-strong px-7 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink">
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
          <QrForm />
        </div>
      </div>
    </section>
  );
}

/* ───────── Sticky mobile CTA ───────── */
function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const formEl = document.getElementById(QR_FORM_ID);
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
      <QrCta location="sticky-mobile" className="w-full">Loyihani muhokama qilish</QrCta>
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

export default function QurilishPage() {
  useEffect(() => {
    captureAttribution();
    initPixel();
    track('ViewContent', { content_name: 'Qurilish landing', content_category: 'qurilish' }, { onceKey: 'qr-view-content' });
  }, []);
  return (
    <div className="relative">
      <Header />
      <Hero />
      <Problem />
      <SystemFlow />
      <Pillars />
      <Journey />
      <Responsibility />
      <Proof />
      <Pricing />
      <ApplicationSection />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
