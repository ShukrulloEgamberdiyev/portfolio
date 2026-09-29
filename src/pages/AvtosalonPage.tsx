import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { AvForm } from '../components/avtosalon/AvForm';
import { AvCta, Eyebrow, Icon, Section, SectionCta, SectionHead, goToForm } from '../components/avtosalon/AvUi';
import { AV_FORM_ID, SYSTEM_ID, expectations, form, hero, how, problems, system } from '../content/avtosalon';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal } from '../ui/Reveal';
import heroWide from '../assets/avtosalon/hero-1600.jpg';
import heroMid from '../assets/avtosalon/hero-960.jpg';
import detailImg from '../assets/avtosalon/detail-720.jpg';

const ease = [0.22, 1, 0.36, 1] as const;
/** 1×1 transparent GIF: each hero <picture> only downloads the photo for its own breakpoint. */
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* ───────── Header ───────── */
function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${solid ? 'border-b border-line bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent'}`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="shell flex h-14 items-center justify-between sm:h-16 lg:h-20">
        <span aria-label="FAZO Digital"><Logo /></span>
        {/* Mobile: the hero CTA is the primary action, so the header button appears only after scrolling. */}
        <a href={`#${AV_FORM_ID}`} onClick={(e) => { e.preventDefault(); goToForm('header'); }} data-cursor="hover"
          className={`${solid ? 'inline-flex' : 'hidden sm:inline-flex'} h-10 items-center rounded-full border border-line-strong px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:border-signal hover:text-signal sm:px-5`}>
          Ariza qoldirish
        </a>
      </div>
    </header>
  );
}

/* ───────── 1. Hero ───────── */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="av-hero" className="av-hero relative isolate overflow-hidden pt-14 sm:pt-16 lg:flex lg:min-h-[100svh] lg:items-end lg:pb-16 lg:pt-28">
      {/* Mobile / tablet visual: flexes to the space left after header + copy + CTA, so the CTA stays in the first screen */}
      <div aria-hidden className="av-hero-media relative -z-10 lg:hidden">
        <picture>
          <source media="(max-width: 1023.98px)" srcSet={heroMid} />
          <img src={BLANK} alt="" width={960} height={539} decoding="async" {...{ fetchpriority: 'high' }}
            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,rgba(5,5,5,0.35)_18%,rgba(5,5,5,0)_34%,rgba(5,5,5,0)_62%,#050505_100%)]" />
      </div>
      {/* Desktop visual: showroom on the right, fades into the page on the left */}
      <div aria-hidden className="absolute inset-y-0 left-[18%] right-0 -z-10 hidden lg:block">
        <picture>
          <source media="(min-width: 1024px)" srcSet={heroWide} />
          <img src={BLANK} alt="" width={1750} height={1125} decoding="async" {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover object-[30%_45%]" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.85)_18%,rgba(5,5,5,0.25)_45%,rgba(5,5,5,0)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />
      </div>

      <div className="av-hero-copy shell grid w-full items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-7">
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Eyebrow>{hero.audience}<span className="hidden sm:inline"> · {hero.region}</span></Eyebrow>
          </motion.div>
          <motion.h1 id="av-hero" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease }}
            className="av-hero-title mt-3 max-w-[16ch] font-bold leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-[3.4rem] lg:text-[3.5rem] xl:text-[4.2rem] 2xl:text-[4.8rem]">
            Avtosaloningiz uchun <span className="text-signal">marketing va sotuv</span> tizimini quramiz
          </motion.h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease }}
            className="mt-3 max-w-[52ch] text-[1rem] leading-snug text-bone/75 sm:mt-6 sm:text-[1.15rem] sm:leading-relaxed">
            <span className="sm:hidden">{hero.textShort}</span><span className="hidden sm:inline">{hero.text}</span>
          </motion.p>

          {/* System indicator */}
          <motion.ol initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
            aria-label="Tizim zanjiri" className="mt-8 hidden flex-wrap sm:flex items-center gap-x-1.5 gap-y-2">
            {hero.chain.map((c, i) => (
              <li key={c} className="flex items-center gap-1.5">
                <motion.span initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.09, ease }}
                  className={`inline-flex h-8 items-center rounded-full border px-3 font-mono text-[11px] uppercase tracking-[0.1em] backdrop-blur ${i === hero.chain.length - 1 ? 'border-signal/70 bg-signal/10 text-signal' : 'border-line-strong bg-ink/40 text-bone/85'}`}>
                  {c}
                </motion.span>
                {i < hero.chain.length - 1 && <span aria-hidden className="text-[11px] text-signal/70">→</span>}
              </li>
            ))}
          </motion.ol>

          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease }} className="mt-5 sm:mt-10">
            <AvCta location="hero" className="w-full sm:w-auto">{hero.cta}</AvCta>
            <p className="mt-4 hidden max-w-[46ch] sm:block text-[0.9rem] leading-snug text-mist">{hero.note}</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ───────── 2. Problems (4) ───────── */
const PROBLEM_ICONS = ['quality', 'chart', 'lost', 'team'];
function Problems() {
  return (
    <Section labelledBy="av-problems">
      <SectionHead index="01" eyebrow={problems.eyebrow} title={problems.title} id="av-problems" />
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4">
        {problems.cards.map((c, i) => (
          <Reveal as="li" key={c.t} delay={i * 0.06}
            className="group relative overflow-hidden rounded-[16px] border border-line bg-surface-1/70 p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-signal/40 sm:p-7">
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/0 to-transparent transition-colors duration-500 group-hover:via-signal/60" />
            <span className="absolute right-5 top-5 font-mono text-[11px] text-ash sm:right-7 sm:top-7">0{i + 1}</span>
            <div className="flex gap-4 sm:block">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-line-strong text-signal"><Icon name={PROBLEM_ICONS[i]} /></span>
              <div className="pr-6 sm:pr-0">
                <h3 className="text-[1.1rem] font-semibold uppercase leading-snug tracking-[0.01em] text-bone sm:mt-8 sm:text-[1.15rem]">{c.t}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-mist sm:mt-2">{c.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      <SectionCta label={problems.cta} location="problems" target={SYSTEM_ID} />
    </Section>
  );
}

/* ───────── 3. Marketing → Sotuv — one system (was: system flow + bridge + team) ───────── */
function FlowColumn({ title, items, tone }: { title: string; items: string[]; tone: 'marketing' | 'sales' }) {
  const reduce = useReducedMotion();
  const accent = tone === 'sales';
  return (
    <div className={`relative h-full rounded-[18px] border p-6 sm:p-8 ${accent ? 'border-signal/35 bg-[linear-gradient(160deg,rgba(245,195,59,0.08),rgba(11,11,13,0.9)_55%)]' : 'border-line-strong bg-surface-1/80'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-[1.6rem] font-bold uppercase tracking-[-0.03em] sm:text-[2rem]">{title}</h3>
        <span className="font-mono text-[11px] text-ash">{accent ? '02' : '01'}</span>
      </div>
      <ol className="relative mt-6">
        <span aria-hidden className={`absolute bottom-5 left-[15px] top-5 w-px ${accent ? 'bg-gradient-to-b from-signal/70 to-signal/15' : 'bg-gradient-to-b from-bone/30 to-line'}`} />
        {items.map((it, i) => (
          <motion.li key={it} initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.5, delay: i * 0.06, ease }} className="relative flex items-center gap-4 py-1.5">
            <span className={`relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border font-mono text-[10.5px] ${accent ? 'border-signal/70 bg-ink text-signal' : i === items.length - 1 ? 'border-signal bg-signal font-semibold text-ink' : 'border-line-strong bg-ink text-mist'}`}>{String(i + 1).padStart(2, '0')}</span>
            <span className="text-[1rem] font-medium text-bone/90 sm:text-[1.05rem]">{it}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function SystemSection() {
  const reduce = useReducedMotion();
  return (
    <Section id={SYSTEM_ID} labelledBy="av-system" className="scroll-mt-16">
      <SectionHead index="02" eyebrow={system.eyebrow} title={system.title} text={system.text} id="av-system" />
      <div className="mt-12 grid items-stretch gap-4 lg:mt-16 lg:grid-cols-[1fr_120px_1fr] lg:gap-0">
        <Reveal><FlowColumn title="Marketing" items={system.marketing} tone="marketing" /></Reveal>
        {/* Connector: Lead passes from marketing into sales */}
        <div aria-hidden className="relative flex h-20 items-center justify-center lg:h-auto">
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong lg:inset-x-0 lg:inset-y-auto lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:translate-x-0" />
          <motion.span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-signal lg:hidden"
            animate={reduce ? undefined : { y: [0, 56], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="absolute left-0 top-1/2 hidden h-px w-8 bg-signal lg:block"
            animate={reduce ? undefined : { x: [0, 88], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
          <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-signal bg-ink text-[1.1rem] text-signal shadow-[0_0_40px_-6px_rgba(245,195,59,0.5)] lg:h-16 lg:w-16">
            <span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span>
          </span>
        </div>
        <Reveal delay={0.1}><FlowColumn title="Sotuv" items={system.sales} tone="sales" /></Reveal>
      </div>
      <Reveal className="mt-10">
        <div className="rounded-[16px] border border-signal/30 bg-signal/[0.05] px-6 py-6 text-center sm:py-7">
          <p className="text-[1.2rem] font-semibold tracking-[-0.015em] text-bone sm:text-[1.5rem]">{system.statement}</p>
          <p className="mx-auto mt-2 max-w-[62ch] text-[0.9rem] leading-relaxed text-mist">{system.sub}</p>
        </div>
      </Reveal>
      <SectionCta label={system.cta} location="system" />
    </Section>
  );
}

/* ───────── 4. Expectations (4) ───────── */
const EXPECT_ICONS = ['quality', 'performance', 'crm', 'chart'];
function Expectations() {
  return (
    <Section labelledBy="av-expect">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead index="03" eyebrow={expectations.eyebrow} title={expectations.title} id="av-expect" />
            <Reveal delay={0.1}><p className="mt-6 text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] text-signal sm:text-[1.3rem]">{expectations.sub}</p></Reveal>
            <Reveal delay={0.15} className="mt-8 hidden lg:block">
              <div className="relative overflow-hidden rounded-[18px] border border-line">
                <img src={detailImg} alt="Avtosalon shourumidagi avtomobil detali" loading="lazy" decoding="async" width={720} height={900} className="aspect-[16/11] w-full object-cover object-[50%_40%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4">
            {expectations.cards.map((c, i) => (
              <Reveal as="li" key={c.t} delay={i * 0.06} className="group relative rounded-[16px] border border-line bg-surface-1/70 p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-signal/40 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-signal/50 text-signal"><Icon name={EXPECT_ICONS[i]} /></span>
                  <span className="font-mono text-[11px] text-ash">0{i + 1}</span>
                </div>
                <h3 className="mt-7 text-[1.15rem] font-semibold uppercase leading-snug tracking-[0.01em] text-bone">{c.t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-mist">{c.d}</p>
              </Reveal>
            ))}
          </ul>
          <SectionCta label={expectations.cta} location="expectations" />
        </div>
      </div>
    </Section>
  );
}

/* ───────── 5. How we work (4) ───────── */
function How() {
  return (
    <Section labelledBy="av-how">
      <SectionHead index="04" eyebrow={how.eyebrow} title={how.title} id="av-how" />
      <ol className="relative mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4">
        <span aria-hidden className="absolute left-[12%] right-[12%] top-[46px] hidden h-px bg-gradient-to-r from-signal/70 via-line-strong to-line-strong lg:block" />
        {how.steps.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 0.07} className="relative rounded-[16px] border border-line bg-surface-1/80 p-6 sm:p-7">
            <span className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full font-mono text-[12px] ${i === 0 ? 'bg-signal text-ink' : 'border border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-6 text-[1.1rem] font-semibold uppercase leading-snug tracking-[0.01em] text-bone">{s.t}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-mist">{s.d}</p>
          </Reveal>
        ))}
      </ol>
      <SectionCta label={how.cta} location="how" />
    </Section>
  );
}

/* ───────── Application ───────── */
function ApplicationSection() {
  return (
    <section id={AV_FORM_ID} aria-labelledby="av-form-title" className="relative scroll-mt-16 border-t border-line py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[80%] -translate-x-1/2 rounded-full bg-signal/[0.06] blur-[120px]" />
      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="05">{form.eyebrow}</Eyebrow>
            <h2 id="av-form-title" className="mt-6 text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3rem]">{form.title}</h2>
            <p className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-mist">{form.text}</p>
            <ul className="mt-8 hidden space-y-3 sm:block">
              {form.aside.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[0.93rem] leading-snug text-bone/80">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />{a}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-8">
          <AvForm />
        </div>
      </div>
    </section>
  );
}

/* ───────── Sticky mobile CTA ───────── */
function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const form = document.getElementById(AV_FORM_ID);
    let typing = false;
    const update = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.6;
      const formReached = form ? form.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/85 px-4 pt-3 backdrop-blur-xl transition-[transform,opacity] duration-400 md:hidden ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
      <AvCta location="sticky-mobile" className="w-full">Ariza qoldirish</AvCta>
    </div>
  );
}

/* ───────── Footer ───────── */
function MiniFooter() {
  return (
    <footer className="border-t border-line pb-28 pt-10 md:pb-10">
      <div className="shell flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ash sm:flex-row sm:items-center">
        <Logo className="text-[14px]" markClass="h-5" />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>FAZO Digital © 2026</span>
          <a href="/privacy" target="_blank" rel="noopener" className="transition-colors hover:text-bone">Maxfiylik siyosati</a>
        </div>
      </div>
    </footer>
  );
}

export default function AvtosalonPage() {
  useEffect(() => {
    captureAttribution();
    initPixel();
    track('ViewContent', { content_name: 'Avtosalon landing', content_category: 'avtosalon' }, { onceKey: 'av-view-content' });
  }, []);
  return (
    <div className="relative">
      <Header />
      <Hero />
      <Problems />
      <SystemSection />
      <Expectations />
      <How />
      <ApplicationSection />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
