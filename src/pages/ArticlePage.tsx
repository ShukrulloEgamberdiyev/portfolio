import { Link, Navigate, useParams } from 'react-router-dom';
import { useLang } from '../i18n';
import { ARTICLES } from '../content/articles';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Reveal } from '../ui/Reveal';
import { Arrow } from '../ui/Button';

export default function ArticlePage() {
  const { slug = '' } = useParams();
  const { lang, t, p } = useLang();
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return <Navigate to="/insights" replace />;
  const next = ARTICLES[(ARTICLES.indexOf(a) + 1) % ARTICLES.length];

  return (
    <>
      <PageHeader
        label={`${t.insights.items[ARTICLES.indexOf(a)]?.tag ?? a.tag} · ${a.minutes} ${p.insightsPage.minutes}`}
        title={[{ t: a.title, accent: true }]}
        intro={a.lead}
        back={{ to: '/insights', label: p.insightsPage.title }}
      />

      <article className="shell mt-16 lg:mt-24">
        {lang !== 'uz' && (
          <p className="mb-10 border-l border-violet pl-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">{p.insightsPage.langNote}</p>
        )}
        <div className="max-w-[68ch]">
          {a.body.map((block, i) => {
            if ('h' in block) return <Reveal key={i}><h2 className="mt-14 text-[1.5rem] font-bold tracking-[-0.03em] sm:text-[1.9rem]">{block.h}</h2></Reveal>;
            if ('p' in block) return <Reveal key={i}><p className="mt-5 text-[1.08rem] leading-[1.75] text-bone/85">{block.p}</p></Reveal>;
            if ('quote' in block) return (
              <Reveal key={i}>
                <blockquote className="my-12 border-l-2 border-violet py-2 pl-6 text-[1.35rem] font-medium leading-snug tracking-[-0.02em] sm:text-[1.6rem]">{block.quote}</blockquote>
              </Reveal>
            );
            return (
              <Reveal key={i}>
                <ul className="mt-6 space-y-3">
                  {block.list.map((it) => (
                    <li key={it} className="flex gap-4 border-b border-line pb-3 text-[1.05rem] leading-relaxed text-bone/85">
                      <span className="mt-[0.45em] h-1 w-1 shrink-0 bg-violet" />{it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Link to={`/insights/${next.slug}`} className="group mt-20 flex flex-col justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-end" data-cursor="hover">
          <span>
            <span className="eyebrow block">{p.common.readMore}</span>
            <span className="mt-4 block max-w-[40ch] text-[1.5rem] font-semibold leading-tight tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-2 sm:text-[2rem]">{next.title}</span>
          </span>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink"><Arrow /></span>
        </Link>
      </article>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
