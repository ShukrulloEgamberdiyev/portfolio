import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '../i18n';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

export function Problem() {
  const { t, lang } = useLang();
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="problem-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Label>{t.problem.label}</Label>
            <Headline id="problem-title" key={lang} lines={t.problem.title} className="display-md mt-8" />
            <Reveal delay={0.2}><p className="lead mt-8">{t.problem.intro}</p></Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:pl-10">
          <ul className="border-t border-line">
            {t.problem.rows.map((row, i) => (
              <motion.li key={`${lang}-${i}`}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-line py-6 sm:grid-cols-[3rem_1fr_1fr] lg:py-8"
                initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}>
                <span className="font-mono text-[11px] text-ash tabular">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[1.35rem] font-semibold tracking-[-0.02em] lg:text-[1.75rem]">{row.has}</span>
                <span className="relative col-start-2 text-[1.05rem] text-mist sm:col-start-3 lg:text-[1.25rem]">
                  <span className="relative">
                    — {row.gap}
                    <motion.span aria-hidden className="absolute left-0 top-[55%] h-px w-full origin-left bg-violet/70"
                      initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }} />
                  </span>
                </span>
              </motion.li>
            ))}
          </ul>
          <Reveal delay={0.1}>
            <p className="mt-16 text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[2.6rem] lg:mt-24 lg:text-[3.2rem]">
              {t.problem.transition}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
