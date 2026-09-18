import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { CASES, CLIENTS } from '../data/site';
import { PageHeader } from '../components/PageHeader';
import { CtaBlock } from '../components/CtaBlock';
import { Arrow } from '../ui/Button';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

const LIGHTS = ['20% 25%', '80% 20%', '70% 80%', '25% 75%', '50% 15%', '85% 60%'];

export default function WorkIndex() {
  const { t, p } = useLang();
  const featured = new Set(CASES.map((c) => c.slug));
  const others = CLIENTS.filter((c) => !CASES.some((k) => k.name === c.name));

  return (
    <>
      <PageHeader label={t.work.label} title={p.work.title} intro={p.work.intro} />

      <section aria-label={p.work.featured} className="shell mt-20 lg:mt-28">
        <Label>{p.work.featured}</Label>
        <div className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:gap-x-16">
          {t.work.cases.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 2) * 0.06}>
              <Link to={`/work/${c.slug}`} className="group block" data-cursor="hover">
                <div className="relative aspect-[5/4] overflow-hidden bg-surface-2">
                  <span aria-hidden className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                    style={{ background: `radial-gradient(60% 55% at ${LIGHTS[i]}, rgba(91,77,255,0.26), transparent 78%)` }} />
                  <span aria-hidden className="absolute inset-0 opacity-50"
                    style={{ backgroundImage: 'linear-gradient(rgba(245,245,245,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.045) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
                  <span className="absolute left-6 top-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist">{c.industry}</span>
                  <p aria-hidden className="absolute inset-x-6 bottom-6 text-[2.2rem] font-bold uppercase leading-[0.9] tracking-[-0.05em] sm:text-[3rem]">
                    {CASES[i].name.split(' · ').map((part, k) => <span key={k} className={`block ${k ? 'outline-text' : ''}`}>{part}</span>)}
                  </p>
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <p className="max-w-[34ch] text-[1.15rem] font-medium leading-snug tracking-[-0.02em]">{c.headline}</p>
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-line-strong transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-ink"><Arrow className="-rotate-45" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label={p.work.other} className="shell mt-24 lg:mt-36">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <Label>{p.work.other}</Label>
          <p className="max-w-[46ch] text-[0.95rem] text-ash">{p.work.otherNote}</p>
        </div>
        <ul className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <li key={c.name} className="border-b border-line py-5 text-[1.15rem] font-medium text-bone/85 sm:pr-8">{c.name}</li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">{featured.size + others.length}+ {t.stats.brands}</p>
      </section>

      <div className="mt-24 lg:mt-36"><CtaBlock /></div>
    </>
  );
}
