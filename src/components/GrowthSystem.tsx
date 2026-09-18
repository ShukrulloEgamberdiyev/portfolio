import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { SYSTEM_STEPS } from '../data/site';
import { useMedia } from '../lib/useMedia';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

const pad = (n: number) => String(n + 1).padStart(2, '0');

function StepCard({ i, desc, outputLabel, active }: { i: number; desc: string; outputLabel: string; active: boolean }) {
  const s = SYSTEM_STEPS[i];
  return (
    <article className={`relative flex h-full flex-col justify-between border-l border-line px-6 py-8 transition-colors duration-700 lg:px-10 lg:py-10 ${active ? 'bg-surface-1/80' : ''}`}>
      <div>
        <p className={`font-bold leading-none tracking-[-0.06em] transition-all duration-700 text-[5rem] lg:text-[8.5rem] ${active ? 'text-bone' : 'outline-text-faint'}`}>{pad(i)}</p>
        <h3 className="mt-6 text-[1.8rem] font-bold uppercase tracking-[-0.035em] lg:mt-10 lg:text-[2.6rem]">{s.name}</h3>
        <p className="mt-3 max-w-[30ch] text-[1.02rem] leading-relaxed text-mist lg:text-[1.1rem]">{desc}</p>
      </div>
      <p className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
        <span className={`h-1.5 w-1.5 transition-colors duration-700 ${active ? 'bg-violet' : 'bg-line-strong'}`} />
        {outputLabel}: <span className={active ? 'text-bone' : ''}>{s.output}</span>
      </p>
    </article>
  );
}

function DesktopPipeline() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => { if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth)); };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(reduce ? scrollYProgress : smooth, (v) => -v * distance);
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(8, Math.floor(v * 9))));

  return (
    <section ref={section} id="system" aria-labelledby="system-title" className="relative h-[420vh] border-t border-line">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-28">
        <div className="shell flex items-end justify-between gap-10">
          <div>
            <Label>{t.system.label}</Label>
            <Headline id="system-title" lines={t.system.title} className="display-md mt-6" />
          </div>
          <div className="max-w-sm pb-2">
            <p className="text-[1.05rem] leading-relaxed text-mist">{t.system.intro}</p>
            <div className="mt-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
              <span className="tabular text-bone">{pad(active)}</span>
              <span className="relative h-px w-40 bg-line-strong"><motion.span className="absolute inset-y-0 left-0 bg-bone" style={{ width: fill }} /></span>
              <span className="tabular">09</span>
            </div>
          </div>
        </div>

        <div className="relative mt-10 flex-1 pb-10">
          <motion.div ref={track} style={{ x }} className="flex h-full w-max pl-[56px] pr-[20vw] will-change-transform">
            {t.system.steps.map((s, i) => (
              <div key={i} className="relative h-full w-[30vw] min-w-[340px] max-w-[460px]">
                {/* connector: node + arrow between stages */}
                <span aria-hidden className={`absolute -left-[5px] top-0 z-10 h-[9px] w-[9px] border transition-colors duration-700 ${i <= active ? 'border-violet bg-violet' : 'border-line-strong bg-ink'}`} />
                <StepCard i={i} desc={s.desc} outputLabel={t.system.outputLabel} active={i === active} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MobilePipeline() {
  const { t } = useLang();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 60%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section id="system" aria-labelledby="system-title" className="relative border-t border-line py-24">
      <div className="shell">
        <Label>{t.system.label}</Label>
        <Headline id="system-title" lines={t.system.title} className="display-md mt-6" />
        <Reveal><p className="lead mt-6">{t.system.intro}</p></Reveal>
        <ol ref={list} className="relative mt-14">
          <span aria-hidden className="absolute bottom-0 left-[4px] top-0 w-px bg-line" />
          <motion.span aria-hidden style={{ scaleY }} className="absolute bottom-0 left-[4px] top-0 w-px origin-top bg-violet" />
          {t.system.steps.map((s, i) => (
            <Reveal as="li" key={i} className="relative pb-10 pl-10 last:pb-0">
              <span aria-hidden className="absolute left-0 top-2 h-[9px] w-[9px] border border-violet bg-ink" />
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-ash tabular">{pad(i)}</span>
                <h3 className="text-[1.7rem] font-bold uppercase tracking-[-0.035em]">{SYSTEM_STEPS[i].name}</h3>
              </div>
              <p className="mt-2 text-mist">{s.desc}</p>
              <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">{t.system.outputLabel}: <span className="text-mist">{SYSTEM_STEPS[i].output}</span></p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function GrowthSystem() {
  const desktop = useMedia('(min-width: 1024px) and (min-height: 700px)');
  return desktop ? <DesktopPipeline /> : <MobilePipeline />;
}
