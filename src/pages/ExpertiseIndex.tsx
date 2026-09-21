import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { EXPERTISE } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Arrow } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export default function ExpertiseIndex() {
  const { t, p } = useLang();
  return (
    <>
      <PageHeader label={t.expertise.label} title={p.expertise.title} intro={p.expertise.intro} />

      <section className="shell mt-16 grid border-l border-t border-line md:grid-cols-2 lg:mt-24">
        {EXPERTISE.map((m, i) => (
          <Reveal key={m.slug} delay={i * 0.05} className="h-full">
            <Link to={`/expertise/${m.slug}`} data-cursor="hover"
              className="group relative flex h-full flex-col border-b border-r border-line p-6 transition-colors duration-500 hover:bg-surface-1 sm:p-10 lg:min-h-[460px] lg:p-14">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] text-ash tabular">{String(i + 1).padStart(2, '0')} / 04</span>
                <span className="text-right font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">
                  {t.expertise.inSystem}: <span className="text-mist">{m.steps.map((s) => t.system.steps[s].name).join(' · ')}</span>
                </span>
              </div>
              <h2 className="mt-12 text-[2.2rem] font-bold uppercase leading-[0.92] tracking-[-0.045em] sm:text-[2.8rem] lg:mt-16 lg:text-[3.4rem]">
                <span className="block">{t.expertise.modules[i].name[0]}</span>
                <span className="block outline-text transition-colors duration-700 group-hover:text-bone">{t.expertise.modules[i].name[1]}</span>
              </h2>
              <p className="mt-6 max-w-[38ch] text-[1.05rem] leading-relaxed text-mist">{p.expertiseDetail.modules[i].lead}</p>
              <span className="mt-auto flex items-center gap-4 pt-10 font-mono text-[11px] uppercase tracking-[0.14em]">
                {p.expertise.open}
                <span className="flex h-10 w-10 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink"><Arrow /></span>
              </span>
            </Link>
          </Reveal>
        ))}
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
