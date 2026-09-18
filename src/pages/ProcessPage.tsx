import { useLang } from '../i18n';
import { PHASES } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

export default function ProcessPage() {
  const { t, p } = useLang();
  const d = p.processPage;
  return (
    <>
      <PageHeader label={t.process.label} title={d.title} intro={d.intro} />

      <section className="shell mt-16 lg:mt-24">
        <ol className="border-t border-line">
          {PHASES.map((phase, i) => (
            <Reveal as="li" key={phase} delay={0.04 * i} className="grid gap-x-10 gap-y-6 border-b border-line py-10 lg:grid-cols-12 lg:py-16">
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-5">
                  <span className="text-[3.5rem] font-bold leading-none tracking-[-0.06em] outline-text-faint sm:text-[5rem]">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-[1.8rem] font-bold uppercase tracking-[-0.04em] sm:text-[2.4rem]">{phase}</h2>
                </div>
                <p className="mt-5 max-w-[40ch] text-[1.05rem] text-mist">{t.process.phases[i].desc}</p>
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow">{d.insideLabel}</p>
                <ul className="mt-4 space-y-2.5">
                  {d.inside[i].map((it) => (
                    <li key={it} className="flex gap-3 text-[0.98rem] text-bone/85"><span className="text-ash">—</span>{it}</li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3">
                <p className="eyebrow">{d.outputLabel}</p>
                <p className="mt-4 border-l border-violet pl-4 text-[1.02rem]">{d.outputs[i]}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="shell mt-24 lg:mt-36">
        <Label>{d.ninetyTitle}</Label>
        <ol className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {d.ninety.map((n, i) => (
            <Reveal as="li" key={n.when} delay={i * 0.06} className="bg-ink p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">{n.when}</p>
              <p className="mt-4 leading-relaxed text-bone/85">{n.what}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
