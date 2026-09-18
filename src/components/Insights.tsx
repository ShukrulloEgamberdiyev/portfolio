import { useLang } from '../i18n';
import { SECTION_IDS } from '../data/site';
import { Link } from 'react-router-dom';
import { ARTICLES } from '../content/articles';
import { Arrow, Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

export function Insights() {
  const { t } = useLang();
  return (
    <section id={SECTION_IDS.insights} aria-labelledby="insights-title" className="relative border-t border-line py-24 lg:py-36">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Label>{t.insights.label}</Label>
            <Headline id="insights-title" lines={t.insights.title} className="display-md mt-8" />
          </div>
          <Button variant="ghost" to="/insights" className="self-start md:self-auto">{t.insights.cta}</Button>
        </div>
        <ul className="mt-14 border-t border-line lg:mt-20">
          {t.insights.items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.06}>
              <Link to={`/insights/${ARTICLES[i].slug}`} data-cursor="hover" className="group grid grid-cols-1 items-center gap-3 border-b border-line py-8 transition-colors duration-500 hover:bg-surface-1 sm:grid-cols-[160px_1fr_auto] sm:gap-10 sm:px-4 lg:py-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet">{it.tag}</span>
                <span className="text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-2 sm:text-[1.8rem] lg:text-[2.2rem]">{it.title}</span>
                <span className="hidden h-11 w-11 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink sm:flex"><Arrow className="-rotate-45" /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
