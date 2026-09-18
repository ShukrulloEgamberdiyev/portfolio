import { useLang } from '../i18n';
import { SECTION_IDS } from '../data/site';
import { onAnchorClick } from '../lib/scroll';
import { Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

export function Engagement() {
  const { t } = useLang();
  return (
    <section aria-labelledby="engagement-title" className="relative overflow-hidden border-t border-line py-24 lg:py-40">
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, rgba(47,69,255,0.6), rgba(122,107,255,0.2) 60%, transparent)' }} />
      <div className="shell relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Label>{t.engagement.label}</Label>
          <Headline id="engagement-title" lines={t.engagement.title} className="display-lg mt-8" />
          <Reveal><p className="lead mt-10">{t.engagement.text}</p></Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:pl-10">
          <div className="border border-line-strong bg-ink/70 p-6 backdrop-blur-sm sm:p-10 lg:p-14">
            <p className="eyebrow">{t.engagement.startsFrom}</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-4 leading-none">
              <span className="tabular text-[4.2rem] font-light tracking-[-0.06em] sm:text-[6rem] lg:text-[7.5rem]">$2,500</span>
              <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-mist">{t.engagement.per}</span>
            </p>
            <p className="mt-8 border-t border-line pt-8 text-[1.1rem] leading-relaxed text-bone/85">{t.engagement.notJust}</p>
            <div className="mt-10">
              <Button href={`#${SECTION_IDS.apply}`} onClick={(e) => onAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, SECTION_IDS.apply)}>{t.engagement.cta}</Button>
            </div>
            <p className="mt-5 text-[0.9rem] text-ash">{t.engagement.qualifier}</p>
          </div>

          <div className="mt-px grid gap-px bg-line sm:grid-cols-2">
            {[{ label: t.engagement.fitLabel, items: t.engagement.fit, mark: '+' }, { label: t.engagement.notFitLabel, items: t.engagement.notFit, mark: '—' }].map((col) => (
              <div key={col.label} className="bg-ink p-6 sm:p-8">
                <p className="eyebrow">{col.label}</p>
                <ul className="mt-5 space-y-3">
                  {col.items.map((it) => (
                    <li key={it} className={`flex gap-3 text-[0.98rem] ${col.mark === '+' ? 'text-bone/90' : 'text-ash'}`}>
                      <span className={`font-mono ${col.mark === '+' ? 'text-violet' : ''}`}>{col.mark}</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
