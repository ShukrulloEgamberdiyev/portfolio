import { Link, Navigate, useParams } from 'react-router-dom';
import { useLang } from '../i18n';
import { CASES, EXPERTISE } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import { Arrow } from '../ui/Button';

export default function CaseStudy() {
  const { slug = '' } = useParams();
  const { t, p } = useLang();
  const index = CASES.findIndex((c) => c.slug === slug);
  if (index < 0) return <Navigate to="/work" replace />;

  const meta = CASES[index];
  const c = t.work.cases[index];
  const d = p.caseDetail;
  const next = CASES[(index + 1) % CASES.length];
  const nextCopy = t.work.cases[(index + 1) % CASES.length];
  const stages = EXPERTISE.filter((e) => e.cases.includes(slug)).flatMap((e) => e.steps);
  const usedStages = [...new Set(stages)].sort((a, b) => a - b);

  return (
    <>
      <PageHeader
        label={t.work.label}
        title={[{ t: meta.name.split(' · ')[0] }, ...(meta.name.includes(' · ') ? [{ t: meta.name.split(' · ')[1], outline: true }] : [])]}
        intro={c.headline}
        back={{ to: '/work', label: d.back }}
        meta={[{ label: d.industry, value: c.industry }]}
      />

      <section className="shell mt-16 lg:mt-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
          {meta.media?.video ? (
            <video className="h-full w-full object-cover" src={meta.media.video} poster={meta.media.poster} muted loop playsInline autoPlay />
          ) : meta.media?.poster ? (
            <img className="h-full w-full object-cover" src={meta.media.poster} alt={meta.name} />
          ) : (
            <>
              <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(55% 60% at 30% 30%, rgba(91,77,255,0.28), transparent 75%)' }} />
              <span aria-hidden className="absolute inset-0 opacity-50"
                style={{ backgroundImage: 'linear-gradient(rgba(245,245,245,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.045) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
              <span className="absolute bottom-6 left-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">{d.mediaNote}</span>
            </>
          )}
        </div>
      </section>

      <section className="shell mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Label>{d.challenge}</Label>
            <p className="mt-6 text-[1.4rem] leading-snug tracking-[-0.02em] sm:text-[1.7rem]">{c.challenge}</p>
          </Reveal>
          <Reveal className="mt-14">
            <Label>{d.approach}</Label>
            <p className="mt-6 text-[1.1rem] leading-relaxed text-mist">{d.approaches[slug]}</p>
          </Reveal>
          <Reveal className="mt-14">
            <Label>{d.work}</Label>
            <ul className="mt-6 flex flex-wrap gap-2">
              {c.work.map((w) => <li key={w} className="border border-line-strong px-4 py-2 text-[0.95rem]">{w}</li>)}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal className="border border-line-strong bg-surface-1/70 p-6 sm:p-9">
            <Label>{d.result}</Label>
            <ul className="mt-6 space-y-4">
              {c.result.map((r) => (
                <li key={r} className="flex gap-3 border-b border-line pb-4 text-[1.05rem] last:border-0 last:pb-0">
                  <span className="text-violet">↗</span>{r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.82rem] leading-relaxed text-ash">{d.disclaimer}</p>
          </Reveal>

          {usedStages.length > 0 && (
            <Reveal className="mt-10">
              <Label>{d.systemUsed}</Label>
              <ol className="mt-5 space-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
                {usedStages.map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="tabular text-ash">{String(s + 1).padStart(2, '0')}</span>
                    <span className="h-px w-6 bg-violet" />{t.system.steps[s].name}
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
        </div>
      </section>

      <section className="shell mt-24 lg:mt-36">
        <Link to={`/work/${next.slug}`} className="group flex flex-col justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-end" data-cursor="hover">
          <div>
            <p className="eyebrow">{d.next}</p>
            <p className="mt-4 text-[2rem] font-bold uppercase leading-none tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-2 sm:text-[3rem]">{next.name}</p>
            <p className="mt-3 text-mist">{nextCopy.headline}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink"><Arrow /></span>
        </Link>
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
