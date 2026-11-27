import { useEffect } from 'react';
import mark from '../assets/fazo-mark.png';
import { CONTACT } from '../data/site';
import { CTA, TL_FORM_ID, doList, gets, hero, problem, process, register } from '../content/talim';
import { LeadForm } from '../forms/LeadForm';
import { ctaClick } from '../lib/analytics';
import { scrollToId } from '../lib/scroll';
import { captureAttribution, initPixel, track } from '../lib/tracking';
import { Reveal, riseStyle } from '../ui/Reveal';

/** /talim — ad landing for education centres. No site navigation: one goal (the application). */

function Cta({ location, className = '' }: { location: string; className?: string }) {
  return (
    <a href={`#${TL_FORM_ID}`} data-cursor="hover"
      onClick={(e) => { e.preventDefault(); ctaClick(`talim-${location}`); scrollToId(TL_FORM_ID, 16); }}
      className={`group inline-flex min-h-14 items-center justify-center gap-3 bg-violet px-7 font-mono text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#4a6dff] ${className}`}>
      {CTA}<span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}

const H2 = 'text-[1.8rem] font-bold leading-[1.06] tracking-[-0.035em] sm:text-[2.4rem] lg:text-[2.8rem]';

/** Enrolment path drawn as a track: each stage is a station, CRM is where the track is watched. */
function Track({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-10 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6" aria-label="Murojaatdan qabulgacha">
      {steps.map((s, i) => (
        <li key={s} className={`rise relative bg-ink px-4 py-5 ${s === 'CRM' ? 'bg-violet/15' : ''}`} style={riseStyle(0.5 + i * 0.07, 10, 0.7)}>
          <span className="font-mono text-[11px] text-violet">{String(i + 1).padStart(2, '0')}</span>
          <p className="mt-2 text-[1.05rem] font-semibold">{s}</p>
          {i < steps.length - 1 && <span aria-hidden className="absolute right-2 top-5 hidden text-mist lg:block">→</span>}
        </li>
      ))}
    </ol>
  );
}

export default function TalimPage() {
  useEffect(() => {
    captureAttribution();
    initPixel();
    track('ViewContent', { content_name: 'Talim landing', content_category: 'talim' }, { onceKey: 'tl-view-content' });
  }, []);

  return (
    <div className="relative">
      <section aria-labelledby="tl-hero" className="relative isolate overflow-hidden pb-14 pt-8 sm:pt-12 lg:pb-20">
        <div aria-hidden className="pointer-events-none absolute -top-[20vh] left-1/2 -z-10 h-[70vh] w-[110vw] -translate-x-1/2 rounded-full opacity-35 blur-[120px]"
          style={{ background: 'radial-gradient(closest-side, rgba(50,91,255,0.55), transparent)' }} />
        <div className="shell">
          <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-bone/85">
            <img src={mark} alt="" aria-hidden className="h-[18px] w-auto" />FAZO Digital <span className="text-violet">·</span> {hero.label}
          </p>
          <h1 id="tl-hero" className="rise mt-10 max-w-[20ch] text-[2.1rem] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[3.2rem] lg:mt-16 lg:text-[4.4rem]" style={riseStyle(0.1, 16, 0.8)}>
            {hero.title}
          </h1>
          <p className="rise mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-mist sm:text-[1.15rem]" style={riseStyle(0.25, 16, 0.8)}>{hero.text}</p>
          <div className="rise mt-8" style={riseStyle(0.35, 16, 0.8)}><Cta location="hero" className="w-full sm:w-auto" /></div>
          <Track steps={hero.chain} />
        </div>
      </section>

      <section aria-labelledby="tl-problem" className="border-t border-line py-14 sm:py-20">
        <div className="shell">
          <Reveal><h2 id="tl-problem" className={`${H2} max-w-[22ch]`}>{problem.title}</h2></Reveal>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {problem.points.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 0.06} className="border-t border-line-strong pt-5">
                <p className="text-[1.15rem] font-semibold leading-snug">{p.t}</p>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-mist">{p.d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="tl-do" className="border-t border-line py-14 sm:py-20">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><h2 id="tl-do" className={H2}>{doList.title}</h2></Reveal>
            <ol className="mt-8">
              {doList.items.map((d, i) => (
                <Reveal as="li" key={d.t} delay={i * 0.05} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-line py-5">
                  <span className="font-mono text-[12px] text-violet">0{i + 1}</span>
                  <div><p className="text-[1.1rem] font-semibold">{d.t}</p><p className="mt-1.5 text-[0.95rem] leading-relaxed text-mist">{d.d}</p></div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={0.1} className="self-start border border-line-strong bg-surface-1/80 p-6 sm:p-8 lg:col-span-5">
            <h2 className="text-[1.4rem] font-bold tracking-[-0.02em]">{gets.title}</h2>
            <ul className="mt-5 space-y-3 text-[0.98rem] leading-snug text-bone/90">
              {gets.items.map((g) => <li key={g} className="flex gap-2.5"><span aria-hidden className="text-violet">✓</span>{g}</li>)}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-[0.9rem] leading-relaxed text-mist">{gets.note}</p>
            <Cta location="offer" className="mt-6 w-full" />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="tl-process" className="border-t border-line py-14 sm:py-20">
        <div className="shell">
          <Reveal><h2 id="tl-process" className={H2}>{process.title}</h2></Reveal>
          <ol className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {process.steps.map((s, i) => (
              <Reveal as="li" key={s.t} delay={i * 0.05} className="bg-ink p-5">
                <span className="font-mono text-[12px] text-violet">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-3 text-[1.1rem] font-semibold">{s.t}</p>
                <p className="mt-2 text-[0.93rem] leading-relaxed text-mist">{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id={TL_FORM_ID} aria-labelledby="tl-form" className="scroll-mt-4 border-t border-line pb-24 pt-14 sm:py-20">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 id="tl-form" className={H2}>{register.title}</h2>
            <p className="mt-4 max-w-[40ch] text-[1rem] leading-relaxed text-mist">{register.text}</p>
          </div>
          <div className="border border-line-strong bg-surface-1/70 p-5 sm:p-8 lg:col-span-8">
            <LeadForm formId="talim" />
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="shell flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ash">
          <span>FAZO Digital © 2026</span>
          <span className="flex gap-5">
            <a className="tap hover:text-bone" href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer">Telegram</a>
            <a className="tap hover:text-bone" href={CONTACT.phone.url}>{CONTACT.phone.display}</a>
            <a className="tap hover:text-bone" href="/privacy">Maxfiylik</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
