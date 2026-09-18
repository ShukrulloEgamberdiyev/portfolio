import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { ARTICLES } from '../content/articles';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Arrow } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export default function InsightsIndex() {
  const { p } = useLang();
  return (
    <>
      <PageHeader label="Insights" title={p.insightsPage.title} intro={p.insightsPage.intro} />

      <section className="shell mt-16 lg:mt-24">
        <ul className="border-t border-line">
          {ARTICLES.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 0.05}>
              <Link to={`/insights/${a.slug}`} data-cursor="hover"
                className="group grid gap-4 border-b border-line py-8 transition-colors duration-500 hover:bg-surface-1 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-10 sm:px-4 lg:py-12">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">{a.tag}</span>
                <span>
                  <span className="block text-[1.4rem] font-semibold leading-tight tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-2 sm:text-[1.9rem]">{a.title}</span>
                  <span className="mt-3 block max-w-[62ch] text-mist">{a.lead}</span>
                  <span className="mt-3 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">{a.minutes} {p.insightsPage.minutes}</span>
                </span>
                <span className="hidden h-11 w-11 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink sm:flex"><Arrow className="-rotate-45" /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
