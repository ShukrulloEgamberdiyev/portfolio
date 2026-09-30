import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { QrForm } from '../components/qurilish/QrForm';
import { Dotted, Eyebrow, Icon, QrCta, Section } from '../components/qurilish/QrUi';
import { CTA, QR_FORM_ID, hero, offer, problem, process } from '../content/qurilish';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal } from '../ui/Reveal';
import heroWide from '../assets/qurilish/hero-1920.jpg';
import heroWideWebp from '../assets/qurilish/hero-1920.webp';
import heroMid from '../assets/qurilish/hero-960.jpg';
import heroMidWebp from '../assets/qurilish/hero-960.webp';

const ease = [0.22, 1, 0.36, 1] as const;

/** No site navigation on this landing: one small brand mark, one goal (the form). */
function Brand() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <Logo className="text-[14px]" markClass="h-5" />
      <span aria-hidden className="hidden h-3.5 w-px bg-line-strong min-[400px]:inline-block" />
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-bone/70">{hero.brandNote}</span>
    </div>
  );
}

function H2({ id, text, className = '' }: { id: string; text: string; className?: string }) {
  return (
    <Reveal>
      <h2 id={id} className={`text-[1.95rem] font-bold leading-[1.05] tracking-[-0.035em] text-bone sm:text-[2.6rem] lg:text-[3.2rem] ${className}`}><Dotted text={text} /></h2>
    </Reveal>
  );
}

/* ───────── 1. Hero ───────── */
function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });
  return (
    <section aria-labelledby="qr-hero" className="relative isolate overflow-hidden lg:flex lg:min-h-[92svh] lg:flex-col">
      {/* Mobile / tablet: brand, then the complex in daylight, then the offer */}
      <div className="shell py-4 lg:hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}><Brand /></div>
      <div className="relative -z-10 lg:hidden">
        <picture>
          <source type="image/webp" srcSet={heroMidWebp} />
          <img src={heroMid} alt={hero.imageAlt} width={960} height={540} decoding="async" {...{ fetchpriority: 'high' }}
            className="aspect-[4/3] w-full object-cover object-[62%_35%] sm:aspect-[16/9]" />
        </picture>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink to-transparent" />
      </div>
      {/* Desktop: the photo fills the right side; a soft gradient only behind the text */}
      <div className="absolute inset-y-0 left-[34%] right-0 -z-10 hidden lg:block">
        <picture>
          <source type="image/webp" srcSet={heroWideWebp} />
          <img src={heroWide} alt={hero.imageAlt} width={1920} height={1080} decoding="async" {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover object-[68%_center]" />
        </picture>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.5)_14%,rgba(5,5,5,0.06)_34%,rgba(5,5,5,0)_50%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="shell hidden pt-8 lg:block"><Brand /></div>
      <div className="shell w-full lg:flex lg:flex-1 lg:items-center">
        <div className="max-w-[640px] pb-14 pt-3 sm:pb-16 lg:max-w-[44%] lg:py-16">
          <motion.div {...up(0)}><Eyebrow>{hero.eyebrow}</Eyebrow></motion.div>
          <motion.h1 id="qr-hero" {...up(0.06)}
            className="mt-5 text-[2.3rem] font-bold leading-[1.03] tracking-[-0.035em] min-[400px]:text-[2.55rem] sm:text-[3.2rem] lg:text-[3.6rem] xl:text-[4.1rem]">
            <Dotted text={hero.title} />
          </motion.h1>
          <motion.p {...up(0.14)} className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-bone/85 sm:text-[1.15rem]">{hero.text}</motion.p>
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

/* ───────── 2. Problem + solution ───────── */
const PROBLEM_ICONS = ['cost', 'same', 'lost'];
function ProblemSolution() {
  return (
    <Section labelledBy="qr-problem" className="!py-16 sm:!py-20 lg:!py-24">
      <H2 id="qr-problem" text={problem.title} />
      <ul className="mt-9 grid gap-px border border-line bg-line md:grid-cols-3 lg:mt-12">
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
      <Reveal className="mt-8 lg:mt-10">
        <div className="border border-violet/40 bg-[linear-gradient(120deg,rgba(122,107,255,0.14),rgba(122,107,255,0.02)_60%)] p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-violet">{problem.solutionLabel}</p>
          <p className="mt-3 max-w-[40ch] text-[1.3rem] font-bold leading-snug tracking-[-0.02em] text-bone sm:text-[1.6rem] lg:text-[1.9rem]">{problem.solution}</p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────── 3. How it works + what we handle ───────── */
const HANDLE_ICONS = ['strategy', 'reach', 'infra', 'sales'];
function Process() {
  const reduce = useReducedMotion();
  const n = process.steps.length;
  return (
    <Section labelledBy="qr-process" className="overflow-hidden !py-16 sm:!py-20 lg:!py-24">
      <H2 id="qr-process" text={process.title} />

      {/* One flow for every screen: vertical on phones, horizontal from lg */}
      <ol aria-label="Murojaat yo‘li" className="relative mt-10 flex max-w-[560px] flex-col gap-2 lg:mt-14 lg:grid lg:max-w-none lg:grid-cols-5 lg:gap-4">
        <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-line-strong lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-[21px] lg:h-px lg:w-auto" />
        <motion.span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-gradient-to-b from-line-strong via-violet to-violet lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-[21px] lg:h-px lg:w-auto lg:origin-left lg:bg-gradient-to-r"
          initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 1.4, ease }} />
        {process.steps.map((t, i) => {
          const last = i === n - 1;
          return (
            <Reveal as="li" key={t} y={12} delay={i * 0.08} className="relative flex items-center gap-4 lg:flex-col lg:gap-5 lg:text-center">
              <span className={`relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[12px] ${last ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className="py-2.5 text-[1rem] font-bold uppercase tracking-[0.01em] text-bone lg:py-0 xl:text-[1.1rem]">{t}</span>
            </Reveal>
          );
        })}
      </ol>
      <Reveal className="mt-8 lg:mt-10">
        <p className="max-w-[48ch] border-l-2 border-violet pl-4 text-[1.05rem] leading-relaxed text-bone/85 sm:text-[1.15rem]">{process.note}</p>
      </Reveal>

      <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-14 xl:grid-cols-4">
        {process.items.map((it, i) => (
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

/* ───────── 4. Price + form ───────── */
function OfferForm() {
  return (
    <section id={QR_FORM_ID} aria-labelledby="qr-form-title" className="relative scroll-mt-6 border-t border-line py-16 sm:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[80%] -translate-x-1/2 rounded-full bg-violet/[0.07] blur-[120px]" />
      <div className="shell relative grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-10">
            <h2 id="qr-form-title" className="text-[1.95rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3rem]">{offer.title}</h2>
            <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-mist">{offer.text}</p>
            <div className="relative mt-7 overflow-hidden border border-line-strong bg-surface-1/90">
              <div className="px-5 py-5 sm:px-7 sm:py-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">{offer.priceLabel}</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="tabular text-[2rem] font-bold leading-none tracking-[-0.04em] text-bone min-[400px]:text-[2.3rem] sm:text-[2.7rem]">{offer.price}</span>
                  <span className="font-mono text-[13px] uppercase tracking-[0.1em] text-mist">{offer.per}</span>
                </p>
              </div>
              <div className="flex gap-3 border-t border-line bg-ink/60 px-5 py-3.5 sm:px-7">
                <span aria-hidden className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-lamp text-[11px] font-bold text-lamp">i</span>
                <p className="text-[0.93rem] leading-snug text-bone/90">{offer.adBudget}</p>
              </div>
            </div>
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
    <footer className="border-t border-line pb-28 pt-8 md:pb-8">
      <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
        <span>FAZO Digital © 2026</span>
        <a href="/privacy" target="_blank" rel="noopener" className="transition-colors hover:text-bone">Maxfiylik siyosati</a>
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
      <Hero />
      <ProblemSolution />
      <Process />
      <OfferForm />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
