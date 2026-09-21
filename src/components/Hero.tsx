import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { SECTION_IDS } from '../data/site';
import { onAnchorClick } from '../lib/scroll';
import { Button } from '../ui/Button';
import { Headline } from '../ui/Headline';

const ease = [0.22, 1, 0.36, 1] as const;

/** Mono readout cycling through the growth system — tells the visitor in one glance this isn't "just SMM". */
function SystemReadout({ steps }: { steps: { name: string }[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % steps.length), 1400);
    return () => clearInterval(id);
  }, [reduce, steps.length]);
  return (
    <ol className="space-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em]" aria-label="FAZO growth system">
      {steps.map((s, k) => (
        <li key={s.name} className={`flex items-center gap-3 transition-colors duration-500 ${k === i ? 'text-bone' : k < i ? 'text-mist/60' : 'text-ash/60'}`}>
          <span className="tabular w-5">{String(k + 1).padStart(2, '0')}</span>
          <span className={`h-px transition-all duration-700 ${k === i ? 'w-8 bg-violet' : 'w-3 bg-line-strong'}`} />
          {s.name}
        </li>
      ))}
    </ol>
  );
}

export function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.15]);

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      {/* Hero-local light: sits behind the solid words */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[18%] h-[60vh] w-[90vw] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
        style={{ background: 'radial-gradient(closest-side, rgba(91,77,255,0.55), rgba(47,69,255,0.15) 60%, transparent)' }} />

      <motion.div style={{ y, opacity: fade }} className="shell relative">
        <div className="flex items-start justify-between gap-8">
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.35 }}>
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-violet [animation:pulse-dot_2.4s_ease-in-out_infinite]" />
            {t.hero.eyebrow}
          </motion.p>
          <motion.div className="absolute right-14 top-16 hidden xl:block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 1.1, ease }}>
            <SystemReadout steps={t.system.steps} />
          </motion.div>
        </div>

        <Headline key={lang} as="h1" immediate delay={0.2} lines={t.hero.lines} className="display-xl mt-6 lg:mt-10" />

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <motion.p className="lead lg:col-span-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9, ease }}>
            {t.hero.sub}
          </motion.p>
          <motion.div className="lg:col-span-7 lg:justify-self-end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.05, ease }}>
            <div className="flex flex-wrap items-center gap-3">
              <Button href={`#${SECTION_IDS.apply}`} onClick={(e) => onAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, SECTION_IDS.apply)}>{t.hero.ctaPrimary}</Button>
              <Button variant="ghost" arrow={false} href={`#${SECTION_IDS.work}`} onClick={(e) => onAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, SECTION_IDS.work)}>{t.hero.ctaSecondary}</Button>
            </div>
            <p className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
              <span aria-hidden className="h-px w-6 bg-line-strong" />{t.hero.qualifier}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
