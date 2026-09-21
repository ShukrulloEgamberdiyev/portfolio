import { useLang } from '../i18n';
import { EXPERTISE, SECTION_IDS } from '../data/site';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

export function Expertise() {
  const { t } = useLang();

  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section id={SECTION_IDS.expertise} aria-labelledby="expertise-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Label>{t.expertise.label}</Label>
            <Headline id="expertise-title" lines={t.expertise.title} className="display-lg mt-8" />
          </div>
          <Reveal className="lg:col-span-4"><p className="lead">{t.expertise.intro}</p></Reveal>
        </div>

        <div className="mt-16 grid border-l border-t border-line md:grid-cols-2 lg:mt-24">
          {t.expertise.modules.map((m, i) => (
            <Reveal key={i} delay={i * 0.06} className="h-full">
              <article onPointerMove={track}
                className="group relative flex h-full flex-col overflow-hidden border-b border-r border-line p-6 sm:p-10 lg:min-h-[560px] lg:p-14">
                <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(122,107,255,0.10), transparent 70%)' }} />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="font-mono text-[11px] text-ash tabular">{String(i + 1).padStart(2, '0')} / 04</span>
                  <span className="text-right font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">
                    {t.expertise.inSystem}: <span className="text-mist">{EXPERTISE[i].steps.map((s) => t.system.steps[s].name).join(' · ')}</span>
                  </span>
                </div>
                <h3 className="relative mt-14 text-[2.3rem] font-bold uppercase leading-[0.92] tracking-[-0.045em] sm:text-[3rem] lg:mt-20 lg:text-[3.6rem]">
                  <span className="block">{m.name[0]}</span>
                  <span className="block outline-text transition-colors duration-700 group-hover:text-bone">{m.name[1]}</span>
                </h3>
                <p className="relative mt-6 max-w-[34ch] text-[1.08rem] text-mist">{m.summary}</p>
                <ul className="relative mt-auto grid grid-cols-1 pt-12 sm:grid-cols-2 sm:gap-x-8">
                  {m.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 border-t border-line py-3 text-[0.95rem] text-bone/85">
                      <span aria-hidden className="h-1 w-1 bg-ash transition-colors duration-500 group-hover:bg-violet" />{it}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
