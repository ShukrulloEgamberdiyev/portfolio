import { Link, Navigate, useParams } from 'react-router-dom';
import { useLang } from '../i18n';
import { CASES, EXPERTISE } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import { Arrow } from '../ui/Button';

export default function ExpertiseDetail() {
  const { slug = '' } = useParams();
  const { t, p } = useLang();
  const i = EXPERTISE.findIndex((e) => e.slug === slug);
  if (i < 0) return <Navigate to="/expertise" replace />;

  const m = EXPERTISE[i];
  const copy = p.expertiseDetail.modules[i];
  const d = p.expertiseDetail;
  const related = m.cases.map((cs) => {
    const k = CASES.findIndex((c) => c.slug === cs);
    return { meta: CASES[k], copy: t.work.cases[k] };
  });

  return (
    <>
      <PageHeader
        label={t.expertise.label}
        title={[{ t: t.expertise.modules[i].name[0] }, { t: t.expertise.modules[i].name[1], outline: true, accent: true }]}
        intro={copy.lead}
        back={{ to: '/expertise', label: p.expertise.title }}
        meta={[{ label: d.inSystem, value: m.steps.map((s) => `${String(s + 1).padStart(2, '0')} ${t.system.steps[s].name}`).join('  ·  ') }]}
      />

      <section className="shell mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Label>{d.howLabel}</Label>
          <div className="mt-8 border-t border-line">
            {copy.sections.map((s, k) => (
              <Reveal key={s.h} delay={k * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-x-5 border-b border-line py-8">
                <span className="font-mono text-[11px] text-ash tabular">{String(k + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="text-[1.45rem] font-bold tracking-[-0.03em] sm:text-[1.8rem]">{s.h}</h2>
                  <p className="mt-3 max-w-[54ch] leading-relaxed text-mist">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal className="border border-line-strong bg-surface-1/70 p-6 sm:p-9">
            <Label>{d.deliverables}</Label>
            <ul className="mt-6 space-y-3">
              {copy.deliverables.map((it) => (
                <li key={it} className="flex gap-3 border-b border-line pb-3 text-[1.02rem] last:border-0 last:pb-0">
                  <span className="text-violet">+</span>{it}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-10">
            <Label>{d.relatedLabel}</Label>
            <ul className="mt-5">
              {related.map((r) => (
                <li key={r.meta.slug}>
                  <Link to={`/work/${r.meta.slug}`} className="group flex items-center justify-between gap-4 border-b border-line py-5" data-cursor="hover">
                    <span>
                      <span className="block text-[1.15rem] font-semibold tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1">{r.meta.name}</span>
                      <span className="mt-1 block text-[0.95rem] text-mist">{r.copy.headline}</span>
                    </span>
                    <Arrow className="-rotate-45 text-ash transition-colors group-hover:text-bone" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
