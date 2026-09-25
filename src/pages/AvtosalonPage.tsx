import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { AvForm } from '../components/avtosalon/AvForm';
import { AvCta, Eyebrow, Icon, Section, SectionCta, SectionHead, goToForm } from '../components/avtosalon/AvUi';
import { AV_FORM_ID, bridge, expectations, form, hero, how, problems, salesDept, strategy, system, team } from '../content/avtosalon';
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
      <div className="shell flex h-16 items-center justify-between lg:h-20">
        <span aria-label="FAZO Digital"><Logo /></span>
        <a href={`#${AV_FORM_ID}`} onClick={(e) => { e.preventDefault(); goToForm('header'); }} data-cursor="hover"
          className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:border-signal hover:text-signal sm:px-5">
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
    <section aria-labelledby="av-hero" className="relative isolate overflow-hidden pb-14 pt-16 sm:pb-20 lg:flex lg:min-h-[100svh] lg:items-end lg:pb-16 lg:pt-28">
      {/* Mobile / tablet visual: full car in frame, text flows below */}
      <div aria-hidden className="relative -z-10 lg:hidden">
        <picture>
          <source media="(max-width: 1023.98px)" srcSet={heroMid} />
          <img src={BLANK} alt="" width={960} height={539} decoding="async" {...{ fetchpriority: 'high' }}
            className="aspect-[16/10] w-full object-cover object-center sm:aspect-[16/8]" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.6)_0%,rgba(5,5,5,0)_28%,rgba(5,5,5,0)_60%,#050505_100%)]" />
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

      <div className="shell grid w-full items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-7">
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1 id="av-hero" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease }}
            className="mt-6 max-w-[16ch] text-[2.35rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem] lg:text-[3.5rem] xl:text-[4.2rem] 2xl:text-[4.8rem]">
            Avtosaloningiz uchun <span className="text-signal">marketing va sotuv</span> tizimini quramiz
          </motion.h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease }}
            className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-bone/75 sm:text-[1.15rem]">
            {hero.text}
          </motion.p>

          {/* System indicator */}
          <motion.ol initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
            aria-label="Tizim zanjiri" className="mt-8 flex flex-wrap items-center gap-x-1.5 gap-y-2">
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

          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease }} className="mt-10">
            <AvCta location="hero" className="w-full sm:w-auto">{hero.cta}</AvCta>
            <p className="mt-4 max-w-[46ch] text-[0.9rem] leading-snug text-mist">{hero.note}</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ───────── 2. Problems ───────── */
const PROBLEM_ICONS = ['quality', 'budget', 'content', 'lost', 'team', 'chart'];
function Problems() {
  return (
    <Section labelledBy="av-problems">
      <SectionHead index="01" eyebrow={problems.eyebrow} title={problems.title} text={problems.intro} id="av-problems" />
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-4">
        {problems.cards.map((c, i) => (
          <Reveal as="li" key={c.t} delay={(i % 3) * 0.06}
            className="group relative overflow-hidden rounded-[16px] border border-line bg-surface-1/70 p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-7">
            <span className="absolute right-5 top-5 font-mono text-[11px] text-ash sm:right-7 sm:top-7">0{i + 1}</span>
            <div className="flex gap-4 sm:block">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-line-strong text-signal"><Icon name={PROBLEM_ICONS[i]} /></span>
              <div className="pr-6 sm:pr-0">
                <h3 className="text-[1.1rem] font-semibold leading-snug tracking-[-0.015em] text-bone sm:mt-6 sm:text-[1.2rem]">{c.t}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-mist sm:mt-2">{c.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      <SectionCta label={problems.cta} location="problems" />
    </Section>
  );
}

/* ───────── 3. System flow ───────── */
function SystemFlow() {
  const reduce = useReducedMotion();
  const groupOf = (i: number) => system.groups.findIndex((g) => i >= g.from && i <= g.to);
  return (
    <Section labelledBy="av-system" className="overflow-hidden">
      <SectionHead index="02" eyebrow={system.eyebrow} title={system.title} text={system.text} id="av-system" />

      {/* Desktop: one horizontal track in three groups */}
      <div className="mt-16 hidden xl:block">
        <div className="grid grid-cols-9 gap-3">
          {system.groups.map((g) => (
            <div key={g.name} style={{ gridColumn: `${g.from + 1} / ${g.to + 2}` }} className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist">
              <span className="whitespace-nowrap">{g.name}</span><span className="h-px flex-1 bg-line-strong" />
            </div>
          ))}
        </div>
        <div className="relative mt-6">
          <div className="absolute left-[5.5%] right-[5.5%] top-[22px] h-px bg-line-strong" />
          <motion.div aria-hidden className="absolute left-[5.5%] right-[5.5%] top-[22px] h-px origin-left bg-gradient-to-r from-signal via-signal to-signal/40"
            initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }} />
          <ol className="relative grid grid-cols-9 gap-3">
            {system.stages.map((s, i) => (
              <motion.li key={s.t} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.2, ease }} className="flex flex-col items-center text-center">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[12px] ${i === 5 ? 'border-signal bg-signal text-ink' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
                <div className="mt-5 flex h-full w-full flex-col rounded-[14px] border border-line bg-surface-1/70 px-3 py-4">
                  <h3 className="break-words text-[0.92rem] font-semibold leading-tight tracking-[-0.01em] text-bone [hyphens:auto] 2xl:text-[1rem]">{s.t}</h3>
                  <p className="mt-2 text-[0.8rem] leading-snug text-ash">{s.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile / tablet: vertical timeline grouped */}
      <ol className="relative mt-12 max-w-[720px] space-y-2.5 xl:hidden">
        <span aria-hidden className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-signal via-line-strong to-signal/40" />
        {system.stages.map((s, i) => {
          const g = groupOf(i);
          const first = system.groups[g].from === i;
          return (
            <li key={s.t} className="relative">
              {first && <p className={`pl-14 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist ${i === 0 ? '' : 'pt-4'} pb-2`}>{system.groups[g].name}</p>}
              <Reveal y={14} className="flex items-center gap-4">
                <span className={`relative z-10 flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full border font-mono text-[12px] ${i === 5 ? 'border-signal bg-signal text-ink' : 'border-line-strong bg-ink text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1 rounded-[12px] border border-line bg-surface-1/70 px-4 py-3">
                  <h3 className="text-[0.98rem] font-semibold uppercase tracking-[0.01em] text-bone">{s.t}</h3>
                  <p className="mt-0.5 text-[0.85rem] text-ash">{s.d}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
      <SectionCta label={system.cta} location="system" />
    </Section>
  );
}

/* ───────── 4. Marketing + Sales bridge ───────── */
function Bridge() {
  const reduce = useReducedMotion();
  const Panel = ({ title, items, tone }: { title: string; items: string[]; tone: 'a' | 'b' }) => (
    <div className="relative h-full rounded-[18px] border border-line-strong bg-surface-1/80 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[1.6rem] font-bold uppercase tracking-[-0.03em] sm:text-[2rem]">{title}</h3>
        <span className="font-mono text-[11px] text-ash">{tone === 'a' ? '01' : '02'}</span>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-2">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2.5 rounded-[10px] border border-line bg-ink/40 px-3 py-2.5 text-[0.86rem] leading-snug text-bone/90 sm:gap-3 sm:px-3.5 sm:text-[0.95rem]">
            <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'a' ? 'bg-bone/60' : 'bg-signal'}`} />{it}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Section labelledBy="av-bridge">
      <SectionHead index="03" eyebrow={bridge.eyebrow} title={bridge.title} text={bridge.text} id="av-bridge" />
      <div className="mt-12 grid items-stretch gap-4 lg:mt-16 lg:grid-cols-[1fr_120px_1fr] lg:gap-0">
        <Reveal><Panel title="Marketing" items={bridge.marketing} tone="a" /></Reveal>
        {/* Connector */}
        <div aria-hidden className="relative flex h-24 items-center justify-center lg:h-auto">
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong lg:inset-x-0 lg:inset-y-auto lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:translate-x-0" />
          <motion.span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-signal lg:hidden"
            animate={reduce ? undefined : { y: [0, 72], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.span className="absolute left-0 top-1/2 hidden h-px w-8 bg-signal lg:block"
            animate={reduce ? undefined : { x: [0, 88], opacity: [0, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
          <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-signal bg-ink font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-signal shadow-[0_0_40px_-6px_rgba(245,195,59,0.5)]">{bridge.joint}</span>
        </div>
        <Reveal delay={0.1}><Panel title="Sotuv" items={bridge.sales} tone="b" /></Reveal>
      </div>
      <Reveal className="mt-10">
        <p className="rounded-[16px] border border-signal/30 bg-signal/[0.05] px-6 py-6 text-center text-[1.2rem] font-semibold tracking-[-0.015em] text-bone sm:text-[1.5rem]">{bridge.closing}</p>
      </Reveal>
      <SectionCta label={bridge.cta} location="bridge" />
    </Section>
  );
}

/* ───────── 5. Team capabilities ───────── */
const TEAM_ICONS = ['strategy', 'copy', 'design', 'video', 'performance', 'crm'];
function Team() {
  return (
    <Section labelledBy="av-team">
      <SectionHead index="04" eyebrow={team.eyebrow} title={team.title} text={team.text} id="av-team" />
      <ul className="mt-12 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {team.cards.map((c, i) => (
          <Reveal as="li" key={c.t} delay={(i % 3) * 0.06} className="group relative bg-ink p-5 transition-colors duration-500 hover:bg-surface-1 sm:p-8">
            <div className="flex items-center gap-4 sm:block">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-strong text-bone transition-colors duration-500 group-hover:border-signal group-hover:text-signal"><Icon name={TEAM_ICONS[i]} /></span>
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-bone sm:mt-8 sm:text-[1.25rem]">{c.t}</h3>
            </div>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-mist sm:mt-2">{c.d}</p>
          </Reveal>
        ))}
      </ul>
      <SectionCta label={team.cta} location="team" />
    </Section>
  );
}

/* ───────── 6. Strategy first ───────── */
function StrategyFirst() {
  return (
    <Section labelledBy="av-strategy">
      <SectionHead index="05" eyebrow={strategy.eyebrow} title={strategy.title} id="av-strategy" />
      <ol className="mt-12 grid gap-3 lg:mt-16 lg:grid-cols-5 lg:gap-4">
        {strategy.steps.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 0.07} className="relative flex gap-5 rounded-[16px] border border-line bg-surface-1/70 p-6 lg:flex-col lg:gap-0 lg:p-6">
            <span className={`font-mono text-[2rem] font-medium leading-none tracking-[-0.04em] lg:text-[2.6rem] ${i === 4 ? 'text-signal' : 'text-bone/25'}`}>{String(i + 1).padStart(2, '0')}</span>
            <div className="lg:mt-10">
              <h3 className="text-[1.15rem] font-semibold tracking-[-0.015em] text-bone">{s.t}</h3>
              <p className="mt-2 text-[0.93rem] leading-relaxed text-mist">{s.d}</p>
            </div>
            {i < 4 && <span aria-hidden className="absolute -right-[11px] top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink text-[10px] text-signal lg:flex">→</span>}
          </Reveal>
        ))}
      </ol>
      <SectionCta label={strategy.cta} location="strategy" />
    </Section>
  );
}

/* ───────── 7. Expectations ───────── */
function Expectations() {
  return (
    <Section labelledBy="av-expect">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead index="06" eyebrow={expectations.eyebrow} title={expectations.title} id="av-expect" />
            <Reveal delay={0.1}><p className="mt-6 text-[1.25rem] font-semibold tracking-[-0.015em] text-signal sm:text-[1.4rem]">{expectations.sub}</p></Reveal>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ul className="divide-y divide-line border-y border-line">
            {expectations.items.map((it, i) => (
              <Reveal as="li" key={it} delay={0.03 * i} className="flex items-start gap-5 py-5 sm:py-6">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-signal/60 text-signal">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="m2 6.3 2.6 2.5L10 3.2" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
                </span>
                <span className="text-[1.08rem] leading-snug text-bone sm:text-[1.2rem]">{it}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8">
            <div className="relative overflow-hidden rounded-[16px] border border-signal/40 bg-[linear-gradient(135deg,rgba(245,195,59,0.12),rgba(245,195,59,0.02)_60%)] p-6 sm:p-8">
              <p className="text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] text-bone sm:text-[1.35rem]">{expectations.highlight}</p>
            </div>
          </Reveal>
          <SectionCta label={expectations.cta} location="expectations" />
        </div>
      </div>
    </Section>
  );
}

/* ───────── 8. Sales department ───────── */
function SalesDept() {
  return (
    <Section labelledBy="av-sales">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface-1/70">
            <img src={detailImg} alt="Avtosalon shourumidagi avtomobil detali" loading="lazy" decoding="async" width={720} height={900}
              className="aspect-[4/5] w-full object-cover max-lg:aspect-[16/10]" />
            <div className="absolute inset-x-0 top-0 aspect-[16/10] bg-gradient-to-t from-ink/80 via-transparent to-transparent lg:inset-0 lg:aspect-auto lg:from-ink lg:via-ink/10" />
            <div className="grid grid-cols-2 gap-2 p-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-5">
              {salesDept.modes.map((m) => (
                <div key={m.t} className="rounded-[12px] border border-line-strong bg-ink/70 p-3.5 backdrop-blur-md sm:p-4">
                  <h3 className="text-[0.95rem] font-semibold text-bone">{m.t}</h3>
                  <p className="mt-1 text-[0.8rem] leading-snug text-mist">{m.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <div className="order-1 lg:order-2 lg:col-span-7">
          <SectionHead index="07" eyebrow={salesDept.eyebrow} title={salesDept.title} text={salesDept.text} id="av-sales" />
          <Reveal delay={0.1}>
            <ul className="mt-10 flex flex-wrap gap-2">
              {salesDept.items.map((it) => (
                <li key={it} className="rounded-full border border-line-strong bg-surface-1/60 px-4 py-2.5 text-[0.93rem] text-bone/90">{it}</li>
              ))}
            </ul>
          </Reveal>
          <SectionCta label={salesDept.cta} location="sales" />
        </div>
      </div>
    </Section>
  );
}

/* ───────── 9. How we work ───────── */
function How() {
  return (
    <Section labelledBy="av-how">
      <SectionHead index="08" eyebrow={how.eyebrow} title={how.title} id="av-how" />
      <ol className="mt-12 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 min-[480px]:gap-3 lg:mt-16 lg:grid-cols-3 xl:grid-cols-6">
        {how.steps.map((s, i) => (
          <Reveal as="li" key={s} delay={i * 0.05} className="relative flex items-center gap-4 rounded-[16px] border border-line bg-surface-1/70 p-4 min-[480px]:block sm:p-6">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[12px] ${i === 0 ? 'bg-signal text-ink' : 'border border-line-strong text-bone'}`}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-bone min-[480px]:mt-6 sm:text-[1.05rem]">{s}</h3>
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
            <Eyebrow index="09">{form.eyebrow}</Eyebrow>
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
      <SystemFlow />
      <Bridge />
      <Team />
      <StrategyFirst />
      <Expectations />
      <SalesDept />
      <How />
      <ApplicationSection />
      <MiniFooter />
      <StickyCta />
    </div>
  );
}
