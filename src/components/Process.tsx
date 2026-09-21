import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { SECTION_IDS } from '../data/site';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';

function Phase({ i, name, desc, onActive, active }: { i: number; name: string; desc: string; onActive: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => { if (inView) onActive(i); }, [inView, i, onActive]);
  return (
    <li ref={ref} className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-10 sm:gap-x-10 lg:py-14">
      <span className={`font-bold leading-[0.8] tracking-[-0.06em] transition-all duration-700 text-[4.5rem] sm:text-[6.5rem] lg:text-[8rem] ${active ? 'text-bone' : 'outline-text-faint'}`}>
        {String(i + 1).padStart(2, '0')}
      </span>
      <div className={`transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-45'}`}>
        <h3 className="text-[1.3rem] font-bold uppercase leading-tight tracking-[-0.035em] [overflow-wrap:anywhere] sm:text-[2rem] lg:text-[2.4rem]">{name}</h3>
        <p className="mt-3 max-w-[38ch] text-[1.05rem] text-mist lg:text-[1.15rem]">{desc}</p>
      </div>
    </li>
  );
}

export function Process() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 55%', 'end 55%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id={SECTION_IDS.process} aria-labelledby="process-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Label>{t.process.label}</Label>
            <Headline id="process-title" lines={t.process.title} className="display-lg mt-8" />
            <p className="mt-10 hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ash lg:flex">
              <span className="tabular text-bone">{String(active + 1).padStart(2, '0')}</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="text-mist">{t.process.phases[active].name}</span>
            </p>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <span aria-hidden className="absolute -left-6 bottom-0 top-0 hidden w-px bg-line lg:block" />
          <motion.span aria-hidden style={{ scaleY }} className="absolute -left-6 bottom-0 top-0 hidden w-px origin-top bg-violet lg:block" />
          <ol ref={list} className="border-b border-line">
            {t.process.phases.map((p, i) => <Phase key={i} i={i} name={p.name} desc={p.desc} active={active === i} onActive={setActive} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}
