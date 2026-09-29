import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { QrForm } from '../components/qurilish/QrForm';
import { Dotted, Eyebrow, Icon, QrCta, Section, SectionHead, goToForm } from '../components/qurilish/QrUi';
import { CTA, QR_FORM_ID, finalCta, handle, hero, nav, pricing, problem, process } from '../content/qurilish';
import { scrollToId } from '../lib/scroll';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal } from '../ui/Reveal';
import heroWide from '../assets/qurilish/hero-1920.jpg';
import heroWideWebp from '../assets/qurilish/hero-1920.webp';
import heroMid from '../assets/qurilish/hero-960.jpg';
import heroMidWebp from '../assets/qurilish/hero-960.webp';

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
              Ariza qoldirish
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
              <QrCta location="menu" className="w-full">{CTA}</QrCta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── 01. Hero ───────── */
function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });
  return (
    <section aria-labelledby="qr-hero" className="relative isolate overflow-hidden pt-16 lg:flex lg:min-h-[88svh] lg:items-center lg:pt-20">
      {/* Mobile / tablet: the building in daylight, text flows below */}
      <div className="relative -z-10 lg:hidden">
        <picture>
          <source type="image/webp" srcSet={heroMidWebp} />
          <img src={heroMid} alt={hero.imageAlt} width={960} height={768} decoding="async" {...{ fetchpriority: 'high' }}
            className="aspect-[16/11] w-full object-cover object-[60%_40%] sm:aspect-[16/9]" />
        </picture>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>
      {/* Desktop: full-bleed photo, text sits on the sky side with a soft gradient */}
      <div className="absolute inset-y-0 left-[36%] right-0 -z-10 hidden lg:block">
        <picture>
          <source type="image/webp" srcSet={heroWideWebp} />
          <img src={heroWide} alt={hero.imageAlt} width={1920} height={1080} decoding="async" {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover object-[62%_center]" />
        </picture>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.55)_16%,rgba(5,5,5,0.08)_40%,rgba(5,5,5,0)_60%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      <div className="shell w-full">
        <div className="max-w-[640px] pb-14 pt-2 sm:pb-16 lg:max-w-[46%] lg:py-16">
          <motion.div {...up(0)}><Eyebrow>{hero.eyebrow}</Eyebrow></motion.div>
          <motion.h1 id="qr-hero" {...up(0.06)}
            className="mt-5 text-[2.1rem] font-bold leading-[1.05] tracking-[-0.035em] min-[400px]:text-[2.3rem] sm:text-[3rem] lg:text-[3.4rem] xl:text-[3.9rem]">
            <Dotted text={hero.title} />
          </motion.h1>
          <motion.p {...up(0.14)} className="mt-5 max-w-[50ch] text-[1.05rem] leading-relaxed text-bone/85 sm:text-[1.15rem]">{hero.text}</motion.p>
          <motion.div {...up(0.22)} className="mt-8">
            <QrCta location="hero" className="w-full sm:w-auto">{CTA}</QrCta>
          </motion.div>
          <motion.p {...up(0.3)} className="mt-6 flex max-w-[52ch] items-start gap-3 text-[0.9rem] leading-snug text-bone/70">
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-violet" />{hero.context}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ───────── 02. Problem ───────── */
const PROBLEM_ICONS = ['cost', 'same', 'lost'];
function Problem() {
  return (
    <Section labelledBy="qr-problem" className="!py-16 sm:!py-20 lg:!py-24">
      <SectionHead index="01" eyebrow={problem.eyebrow} title={problem.title} id="qr-problem" />
      <ul className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3 lg:mt-12">
        {problem.cards.map((c, i) => (
          <Reveal as="li" key={c.t} delay={i * 0.06} className="flex gap-4 bg-ink p-5 sm:p-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line-strong text-violet"><Icon name={PROBLEM_ICONS[i]} /></span>
            <div>
              <h3 className="text-[1.08rem] font-semibold leading-snug tracking-[-0.015em] text-bone sm:text-[1.2rem]">{c.t}</h3>
              <p className="mt-1.5 text-[0.93rem] leading-relaxed text-mist">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ───────── 03. How a buyer arrives ───────── */
function Process() {
  const reduce = useReducedMotion();
  const n = process.steps.length;
  return (
    <Section id="jarayon" labelledBy="qr-process" className="overflow-hidden !py-16 sm:!py-20 lg:!py-24">
      <SectionHead index="02" eyebrow={process.eyebrow} title={process.title} id="qr-process" />

      {/* Desktop: one horizontal line */}
      <div className="relative mt-14 hidden lg:block">
        <div className="absolute top-[22px] h-px bg-line-strong" style={{ left: `${50 / n}%`, right: `${50 / n}%` }} />
        <motion.div aria-hidden className="absolute top-[22px] h-px origin-left bg-violet" style={{ left: `${50 / n}%`, right: `${50 / n}%` }}
          initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }} />
        <ol className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {process.steps.map((s, i) => {
            const last = i === n - 1;
            return (
              <motion.li key={s.t} initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.25, ease }} className="flex flex-col items-center text-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[12px] ${last ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-5 text-[1.05rem] font-bold uppercase leading-tight tracking-[0.01em] text-bone xl:text-[1.15rem]">{s.t}</h3>
                <p className="mt-2 max-w-[22ch] text-[0.9rem] leading-snug text-mist">{s.d}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* Mobile / tablet: vertical line */}
      <ol className="relative mt-10 max-w-[560px] space-y-2 lg:hidden">
        <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-line-strong via-violet to-violet" />
        {process.steps.map((s, i) => {
          const last = i === n - 1;
          return (
            <Reveal as="li" key={s.t} y={12} className="relative flex items-center gap-4">
              <span className={`relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[12px] ${last ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1 py-2.5">
                <h3 className="text-[1rem] font-bold uppercase tracking-[0.01em] text-bone">{s.t}</h3>
                <p className="mt-0.5 text-[0.88rem] leading-snug text-mist">{s.d}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>

      <Reveal className="mt-10 lg:mt-14">
        <div className="flex flex-col gap-6 border border-violet/40 bg-[linear-gradient(120deg,rgba(122,107,255,0.14),rgba(122,107,255,0.02)_60%)] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[48ch] text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] text-bone sm:text-[1.4rem]">{process.statement}</p>
          <QrCta location="process" className="w-full shrink-0 sm:w-auto">{CTA}</QrCta>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────── 04. What we handle ───────── */
const HANDLE_ICONS = ['strategy', 'reach', 'infra', 'sales'];
function Handle() {
  return (
    <Section labelledBy="qr-handle" className="!py-16 sm:!py-20 lg:!py-24">
      <SectionHead index="03" eyebrow={handle.eyebrow} title={handle.title} id="qr-handle" />
      <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-12 xl:grid-cols-4">
        {handle.items.map((it, i) => (
          <Reveal as="li" key={it.t} delay={i * 0.06} className="group flex gap-4 bg-ink p-5 transition-colors duration-500 hover:bg-surface-1 sm:block sm:p-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line-strong text-bone transition-colors group-hover:border-violet group-hover:text-violet"><Icon name={HANDLE_ICONS[i]} /></span>
            <div>
              <h3 className="text-[1.1rem] font-bold uppercase leading-tight tracking-[-0.01em] text-bone sm:mt-7">{it.t}</h3>
              <p className="mt-1.5 text-[0.93rem] leading-relaxed text-mist sm:mt-2.5">{it.d}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ───────── 05. Partnership ───────── */
function Pricing() {
  return (
    <Section id="hamkorlik" labelledBy="qr-pricing" className="!py-16 sm:!py-20 lg:!py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHead index="04" eyebrow={pricing.eyebrow} title={pricing.title} id="qr-pricing" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[46ch] border-l border-line-strong pl-4 text-[0.95rem] leading-relaxed text-mist">{pricing.honest}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative overflow-hidden border border-line-strong bg-surface-1/90">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet/[0.14] blur-[90px]" />
            <div className="relative px-6 py-7 sm:px-10 sm:py-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">Xizmat narxi</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular text-[2.3rem] font-bold leading-none tracking-[-0.045em] text-bone min-[400px]:text-[2.7rem] sm:text-[3.4rem]">{pricing.price}</span>
                <span className="font-mono text-[14px] uppercase tracking-[0.1em] text-mist">{pricing.per}</span>
              </p>
              <p className="mt-3 text-[0.95rem] leading-snug text-mist">{pricing.priceNote}</p>
            </div>
            <div className="relative flex gap-3 border-t border-line bg-ink/60 px-6 py-4 sm:px-10">
              <span aria-hidden className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-lamp text-[11px] font-bold text-lamp">i</span>
              <p className="text-[0.93rem] leading-snug text-bone/90">{pricing.adBudget}</p>
            </div>
            <div className="relative border-t border-line px-6 py-5 sm:px-10">
              <QrCta location="pricing" className="w-full sm:w-auto">{CTA}</QrCta>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ───────── 06. Form ───────── */
function ApplicationSection() {
  return (
    <section id={QR_FORM_ID} aria-labelledby="qr-form-title" className="relative scroll-mt-16 border-t border-line py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[80%] -translate-x-1/2 rounded-full bg-violet/[0.07] blur-[120px]" />
      <div className="shell relative grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="05">{finalCta.eyebrow}</Eyebrow>
            <h2 id="qr-form-title" className="mt-5 text-[1.95rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3rem]"><Dotted text={finalCta.title} /></h2>
            <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-mist">{finalCta.text}</p>
            <ul className="mt-6 hidden space-y-2.5 sm:block">
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
      <QrCta location="sticky-mobile" className="w-full">{CTA}</QrCta>
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
      <Process />
      <Handle />
      <Pricing />
      <ApplicationSection />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
