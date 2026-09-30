import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { QrForm } from '../components/qurilish/QrForm';
import { Dotted, QrCta } from '../components/qurilish/QrUi';
import { CTA, QR_FORM_ID, hero, offer, problem, register, system } from '../content/qurilish';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal } from '../ui/Reveal';
import mark from '../assets/fazo-mark.png';
import heroWide from '../assets/qurilish/hero-1920.jpg';
import heroWideWebp from '../assets/qurilish/hero-1920.webp';
import heroMid from '../assets/qurilish/hero-960.jpg';
import heroMidWebp from '../assets/qurilish/hero-960.webp';

const ease = [0.22, 1, 0.36, 1] as const;

/** No site navigation on this ad landing: one compact brand line, one goal (registration). */
function Brand({ className = '' }: { className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-bone/85 ${className}`}>
      <img src={mark} alt="" aria-hidden className="h-[18px] w-auto" />
      <span>FAZO Digital <span className="text-violet">·</span> {hero.label}</span>
    </p>
  );
}

/** Reklama → murojaat → CRM → sotuv, as one compact wrapping line. */
function Flow({ steps, className = '' }: { steps: string[]; className?: string }) {
  return (
    <ol className={`flex flex-wrap items-center gap-x-2 gap-y-2.5 ${className}`}>
      {steps.map((t, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={t} className="flex items-center gap-2">
            <span className={`inline-flex min-h-10 items-center border px-3.5 text-[0.95rem] font-semibold tracking-[-0.01em] sm:min-h-12 sm:px-5 sm:text-[1.1rem] ${last ? 'border-violet bg-violet text-white' : 'border-line-strong bg-ink text-bone'}`}>{t}</span>
            {!last && <span aria-hidden className="text-mist">→</span>}
          </li>
        );
      })}
    </ol>
  );
}

/* ───────── Hero: the whole offer on the first mobile screen ───────── */
function Hero() {
  const reduce = useReducedMotion();
  const up = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease } });
  return (
    <section aria-labelledby="qr-hero" className="relative isolate overflow-hidden lg:flex lg:min-h-[86svh] lg:flex-col">
      {/* Phones: compact brand line, a short band of the construction photo, then the offer */}
      <div className="shell flex h-11 items-center lg:hidden" style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}><Brand /></div>
      <div className="relative -z-10 lg:hidden">
        <picture>
          <source type="image/webp" srcSet={heroMidWebp} />
          <img src={heroMid} alt={hero.imageAlt} width={960} height={640} decoding="async" {...{ fetchpriority: 'high' }}
            className="h-[23svh] min-h-[150px] max-h-[230px] w-full object-cover object-[50%_32%] sm:max-h-[320px] sm:h-[34svh]" />
        </picture>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Desktop: split — copy left, the site under construction right; gradient only at the seam */}
      <div className="absolute inset-y-0 left-[47%] right-0 -z-10 hidden overflow-hidden lg:block">
        <picture>
          <source type="image/webp" srcSet={heroWideWebp} />
          <img src={heroWide} alt={hero.imageAlt} width={1920} height={1280} decoding="async" {...{ fetchpriority: 'high' }}
            className="h-full w-full origin-[60%_15%] scale-[1.22] object-cover object-[62%_30%]" />
        </picture>
        <div aria-hidden className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-ink to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="shell hidden pt-8 lg:block"><Brand /></div>
      <div className="shell w-full lg:flex lg:flex-1 lg:items-center">
        <div className="pb-10 pt-1 sm:max-w-[600px] lg:max-w-[45%] lg:py-14">
          <motion.h1 id="qr-hero" {...up(0)}
            className="text-[1.95rem] font-bold leading-[1.04] tracking-[-0.035em] min-[400px]:text-[2.1rem] sm:text-[2.8rem] lg:text-[3rem] xl:text-[3.5rem]">
            <Dotted text={hero.title} />
          </motion.h1>
          <motion.p {...up(0.06)} className="mt-3 text-[0.98rem] leading-snug text-bone/80 sm:mt-5 sm:text-[1.1rem] sm:leading-relaxed">{hero.text}</motion.p>
          <motion.dl {...up(0.12)} className="mt-4 divide-y divide-line-strong border border-line-strong bg-surface-1/70 sm:mt-6">
            {hero.system.map((it) => (
              <div key={it.k} className="flex items-baseline gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5">
                <dt className="w-[92px] shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-violet sm:w-[120px] sm:text-[11px]">{it.k}</dt>
                <dd className="text-[0.95rem] font-semibold leading-snug text-bone sm:text-[1.05rem]">{it.v}</dd>
              </div>
            ))}
          </motion.dl>
          <motion.div {...up(0.18)} className="mt-4 sm:mt-7">
            <QrCta location="hero" className="w-full !text-[13px] sm:w-auto sm:min-w-[300px]">{CTA}</QrCta>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── A. Problem ───────── */
function Problem() {
  return (
    <section aria-labelledby="qr-problem" className="border-t border-line py-12 sm:py-16 lg:py-20">
      <div className="shell grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-14">
        <Reveal className="lg:col-span-5">
          <h2 id="qr-problem" className="text-[1.8rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.4rem] lg:text-[2.8rem]">{problem.title}</h2>
        </Reveal>
        <ul className="divide-y divide-line border-y border-line lg:col-span-7">
          {problem.points.map((t, i) => (
            <Reveal as="li" key={t} delay={i * 0.05} className="flex items-center gap-4 py-4 sm:py-5">
              <span aria-hidden className="h-2 w-2 shrink-0 bg-violet" />
              <span className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-bone sm:text-[1.25rem]">{t}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── B. System + C. Partnership ───────── */
function SystemOffer() {
  return (
    <section aria-labelledby="qr-system" className="border-t border-line py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <Reveal>
          <h2 id="qr-system" className="max-w-[22ch] text-[1.8rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.4rem] lg:text-[2.8rem]"><Dotted text={system.title} /></h2>
        </Reveal>
        <Reveal delay={0.05}><Flow steps={system.steps} className="mt-6 sm:mt-8" /></Reveal>

        <Reveal delay={0.1} className="mt-10 sm:mt-14">
          <div aria-label="Hamkorlik" className="flex flex-col gap-5 border border-line-strong bg-surface-1/80 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">{offer.label}</p>
              <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="tabular text-[2.2rem] font-bold leading-none tracking-[-0.04em] text-bone sm:text-[2.8rem]">{offer.price}</span>
                <span className="font-mono text-[13px] uppercase tracking-[0.1em] text-mist">{offer.per}</span>
              </p>
              <p className="mt-2.5 text-[0.95rem] text-bone/80">{offer.adBudget}</p>
            </div>
            <QrCta location="pricing" className="w-full !text-[13px] lg:w-auto lg:min-w-[280px]">{CTA}</QrCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── D. Registration ───────── */
function Registration() {
  return (
    <section id={QR_FORM_ID} aria-labelledby="qr-form-title" className="relative scroll-mt-2 border-t border-line pb-16 pt-10 sm:py-16 lg:py-20">
      <div className="shell relative grid gap-6 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10">
            <h2 id="qr-form-title" className="text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3rem]">{register.title}</h2>
            <p className="mt-3 max-w-[40ch] text-[1rem] leading-relaxed text-mist sm:text-[1.05rem]">{register.text}</p>
          </div>
        </div>
        <div className="lg:col-span-8">
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
      <Problem />
      <SystemOffer />
      <Registration />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
