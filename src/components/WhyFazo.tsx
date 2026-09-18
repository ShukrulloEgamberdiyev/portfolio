import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '../i18n';
import { SECTION_IDS, SIGNATURE } from '../data/site';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

// Scattered positions (left%, top%, drift x px, drift y px, rotation)
const SCATTER = [
  [4, 6, -18, -10, -3], [52, 2, 22, -14, 2], [30, 36, -8, 12, 4], [2, 66, -20, 16, 2], [56, 60, 24, 14, -4],
] as const;

function Fragment({ label, i, p }: { label: string; i: number; p: MotionValue<number> }) {
  const [l, tp, dx, dy, r] = SCATTER[i];
  const x = useTransform(p, [0, 1], [0, dx * 2]);
  const y = useTransform(p, [0, 1], [0, dy * 2]);
  const rotate = useTransform(p, [0, 1], [0, r * 1.6]);
  return (
    <motion.span style={{ left: `${l}%`, top: `${tp}%`, x, y, rotate }}
      className="absolute whitespace-nowrap border border-dashed border-line-strong bg-ink px-3 py-2 text-[0.85rem] text-mist sm:px-4 sm:py-3 sm:text-[1.05rem]">
      {label}
    </motion.span>
  );
}

export function WhyFazo() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] });
  const p = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 1]);
  const gap = useTransform(p, [0, 1], [18, 0]);
  const systemScale = useTransform(p, [0.5, 1], [0.94, 1]);
  const systemOpacity = useTransform(p, [0.3, 1], [reduce ? 1 : 0.35, 1]);
  const pillars = ['Strategy', 'Creative', 'Media', 'Sales'];

  return (
    <section id={SECTION_IDS.about} aria-labelledby="why-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>{t.why.label}</Label>
            <Headline id="why-title" lines={t.why.title} className="display-lg mt-8" />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9"><p className="lead">{t.why.intro}</p></Reveal>
        </div>

        <div ref={ref} className="mt-16 grid gap-px bg-line lg:mt-24 lg:grid-cols-2">
          {/* fragmented */}
          <div className="flex flex-col bg-ink p-6 sm:p-10 lg:p-14">
            <p className="eyebrow">{t.why.fragmentedLabel}</p>
            <div className="relative mt-10 h-[300px] overflow-hidden sm:h-[340px] sm:overflow-visible">
              {t.why.fragmented.map((f, i) => <Fragment key={f} label={f} i={i} p={p} />)}
            </div>
            <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
              <span className="font-mono text-ash">↓</span>
              <p className="text-[1.5rem] font-semibold uppercase tracking-[-0.03em] text-ash line-through decoration-1 sm:text-[2rem]">{t.why.fragmentedResult}</p>
            </div>
          </div>

          {/* integrated */}
          <div className="relative flex flex-col overflow-hidden bg-surface-1 p-6 sm:p-10 lg:p-14">
            <span aria-hidden className="pointer-events-none absolute -right-1/3 -top-1/3 h-[120%] w-[120%] rounded-full opacity-25 blur-[100px]"
              style={{ background: 'radial-gradient(closest-side, rgba(91,77,255,0.5), transparent)' }} />
            <p className="eyebrow relative">{t.why.fazoLabel}</p>
            <motion.ul style={{ gap }} className="relative mt-10 flex h-[300px] flex-col justify-center sm:h-[340px]">
              {pillars.map((name, i) => (
                <li key={name} className="flex items-center justify-between border border-line-strong bg-ink/60 px-5 py-4 backdrop-blur">
                  <span className="text-[1.3rem] font-bold uppercase tracking-[-0.03em] sm:text-[1.6rem]">{name}</span>
                  <span className="font-mono text-[11px] text-ash">{i < pillars.length - 1 ? '+' : '='}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div style={{ scale: systemScale, opacity: systemOpacity }} className="relative mt-10 flex items-center gap-4 bg-bone px-5 py-5 text-ink">
              <span className="font-mono">↓</span>
              <p className="text-[1.5rem] font-bold uppercase tracking-[-0.035em] sm:text-[2rem]">{t.why.fazoResult}</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            {t.why.closing.map((line, i) => (
              <Reveal key={line} delay={i * 0.1}>
                <p className={`text-[2rem] font-bold uppercase leading-[1] tracking-[-0.045em] sm:text-[3rem] lg:text-[4rem] ${i === 2 ? '' : 'outline-text'}`}>{line}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="lg:col-span-4 lg:text-right"><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist">{SIGNATURE}</p></Reveal>
        </div>
      </div>
    </section>
  );
}
