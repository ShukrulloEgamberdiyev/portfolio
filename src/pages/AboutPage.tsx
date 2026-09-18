import { useLang } from '../i18n';
import { SIGNATURE, STATS } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { CountUp } from '../ui/CountUp';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

export default function AboutPage() {
  const { t, p } = useLang();
  const a = p.about;
  return (
    <>
      <PageHeader label={t.why.label} title={a.title} intro={a.lead} />

      <section className="shell mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {a.story.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.05} className="border-t border-line py-8">
              <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] sm:text-[1.9rem]">{s.h}</h2>
              <p className="mt-4 max-w-[58ch] leading-relaxed text-mist">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal className="border border-line-strong bg-surface-1/70 p-6 sm:p-9">
            <Label>{a.numbersTitle}</Label>
            <dl className="mt-6 space-y-6">
              {[
                { v: STATS.campaigns, l: t.stats.campaigns },
                { v: STATS.clients, l: t.stats.clients },
                { v: STATS.brands, l: t.stats.brands },
              ].map((n) => (
                <div key={n.l} className="flex items-baseline justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">{n.l}</dt>
                  <dd className="text-[2.2rem] font-bold leading-none tracking-[-0.05em]"><CountUp to={n.v} suffix="+" /></dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="mt-8">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ash">{SIGNATURE}</p>
          </Reveal>
        </div>
      </section>

      <section className="shell mt-24 lg:mt-36">
        <Label>{a.principlesTitle}</Label>
        <div className="mt-10 grid gap-px bg-line sm:grid-cols-2">
          {a.principles.map((pr, i) => (
            <Reveal key={pr.h} delay={i * 0.05} className="bg-ink p-6 sm:p-10">
              <span className="font-mono text-[11px] text-ash tabular">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 text-[1.4rem] font-bold uppercase tracking-[-0.035em] sm:text-[1.8rem]">{pr.h}</h3>
              <p className="mt-3 max-w-[44ch] leading-relaxed text-mist">{pr.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell mt-24 lg:mt-36">
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4"><Label>{a.teamTitle}</Label></div>
          <p className="max-w-[56ch] text-[1.3rem] leading-snug tracking-[-0.02em] lg:col-span-8 sm:text-[1.6rem]">{a.teamText}</p>
        </div>
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
