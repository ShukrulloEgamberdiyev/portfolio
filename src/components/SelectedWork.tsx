import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import type { CaseCopy } from '../i18n/types';
import { CASES, SECTION_IDS } from '../data/site';
import { useMedia } from '../lib/useMedia';
import { Link } from 'react-router-dom';
import { Arrow, Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

const ease = [0.22, 1, 0.36, 1] as const;
// Light positions per card so the grid doesn't read as copies of one tile.
const LIGHTS = ['20% 25%', '80% 20%', '70% 80%', '25% 75%', '50% 15%', '85% 60%'];
const STAGE_MS = 1900;

function CaseVisual({ i, name, industry, playing }: { i: number; name: string; industry: string; playing: boolean }) {
  const media = CASES[i].media;
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface-2">
      {media?.video ? (
        <video className="h-full w-full object-cover opacity-70 grayscale transition duration-1000 group-hover:grayscale-0" src={media.video} poster={media.poster} muted loop playsInline autoPlay preload="none" />
      ) : media?.poster ? (
        <img className="h-full w-full object-cover opacity-70 grayscale transition duration-1000 group-hover:grayscale-0" src={media.poster} alt="" loading="lazy" />
      ) : (
        <>
          <div aria-hidden className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
            style={{ background: `radial-gradient(60% 55% at ${LIGHTS[i]}, rgba(91,77,255,0.28), rgba(47,69,255,0.08) 55%, transparent 80%)` }} />
          <div aria-hidden className="absolute inset-0 opacity-[0.5]"
            style={{ backgroundImage: 'linear-gradient(rgba(245,245,245,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.045) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
          <p aria-hidden className={`absolute inset-x-5 bottom-5 select-none text-[2.6rem] font-bold uppercase leading-[0.88] tracking-[-0.05em] transition-all duration-700 sm:inset-x-7 sm:bottom-7 sm:text-[3.6rem] lg:text-[4.4rem] ${playing ? 'translate-y-4 opacity-0' : 'opacity-100'}`}>
            {name.split(' · ').map((part, k) => <span key={k} className={`block ${k === 0 ? '' : 'outline-text'}`}>{part}</span>)}
          </p>
        </>
      )}
      <div className="absolute left-5 top-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist sm:left-7 sm:top-7">{industry}</div>
    </div>
  );
}

function CaseCard({ c, i }: { c: CaseCopy; i: number }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [hover, setHover] = useState(false);
  const [stage, setStage] = useState(0);
  const playing = fine ? hover : inView;
  const name = CASES[i].name;

  useEffect(() => {
    if (!playing) { setStage(0); return; }
    if (reduce) return;
    const id = setInterval(() => setStage((s) => Math.min(s + 1, 2)), STAGE_MS);
    return () => clearInterval(id);
  }, [playing, reduce]);

  const stages = [
    { label: t.work.challenge, body: <p className="text-[1.15rem] leading-snug sm:text-[1.35rem]">{c.challenge}</p> },
    { label: t.work.system, body: <ul className="flex flex-wrap gap-2">{c.work.map((w) => <li key={w} className="border border-line-strong px-3 py-1.5 text-[0.85rem]">{w}</li>)}</ul> },
    { label: t.work.result, body: <ul className="space-y-1.5">{c.result.map((r) => <li key={r} className="flex gap-3 text-[1rem] sm:text-[1.1rem]"><span className="text-violet">↗</span>{r}</li>)}</ul> },
  ];

  return (
    <article ref={ref} className="group" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <Link to={`/work/${c.slug}`} className="block" aria-label={`${name} — ${t.work.openCase}`} data-cursor="hover">
        <div className="relative aspect-[4/5] w-full max-w-full overflow-hidden sm:aspect-[5/5.4]">
          <CaseVisual i={i} name={name} industry={c.industry} playing={playing} />

          {/* story progress: challenge → system → result */}
          <div className="absolute inset-x-5 top-12 flex gap-1.5 sm:inset-x-7 sm:top-14" aria-hidden>
            {stages.map((_, k) => (
              <span key={k} className="relative h-px flex-1 overflow-hidden bg-bone/15">
                <motion.span className="absolute inset-0 origin-left bg-bone"
                  initial={false}
                  animate={{ scaleX: !playing ? 0 : k < stage ? 1 : k === stage ? 1 : 0 }}
                  transition={{ duration: k === stage && playing && !reduce ? STAGE_MS / 1000 : 0.3, ease: 'linear' }} />
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {playing && (
              <motion.div key={stage} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-5 pt-24 sm:p-7 sm:pt-28"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
                <p className="eyebrow mb-4 text-violet!">{stages[stage].label}</p>
                {stages[stage].body}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="eyebrow">{name}</h3>
            <p className="mt-3 text-[1.25rem] font-medium leading-snug tracking-[-0.02em] sm:text-[1.45rem]">{c.headline}</p>
          </div>
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
            <Arrow className="-rotate-45" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function SelectedWork() {
  const { t } = useLang();
  return (
    <section id={SECTION_IDS.work} aria-labelledby="work-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="shell">
        <Label>{t.work.label}</Label>
        <Headline id="work-title" lines={t.work.title} className="display-md mt-8" />

        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:mt-24 lg:gap-x-16 lg:gap-y-24">
          {t.work.cases.map((c, i) => (
            <Reveal key={c.slug} className={i % 2 === 1 ? 'md:mt-40' : ''}>
              <CaseCard c={c} i={i} />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex justify-center lg:mt-28">
          <Button variant="ghost" to="/work">{t.work.viewAll}</Button>
        </div>
      </div>
    </section>
  );
}
