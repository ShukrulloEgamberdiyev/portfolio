import { useRef } from 'react';
import { StrategyVisual, AdsVisual, ContentVisual } from './MarketingVisuals';
import { creative, portfolio } from './content';
import { useScrollFx } from './motion';

/**
 * MARKETING & CREATIVE — iliq-oq bo'lim, 3 ta vizual blok. Har birida ulkan kontur raqam, bitta sarlavha,
 * bitta qisqa jumla va katta grafik panel (strategiya xaritasi / reklama kreativi / kontent + montaj).
 */
export default function Creative() {
  const ref = useRef<HTMLElement>(null);

  useScrollFx(ref, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('[data-cr-panel]').forEach((el) => {
      gsap.fromTo(el, { scale: 0.9, rotate: -1.5, y: 40 }, { scale: 1, rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center 60%', scrub: 0.8 } });
    });
    gsap.utils.toArray<HTMLElement>('[data-cr-no]').forEach((el) => {
      gsap.fromTo(el, { yPercent: 30 }, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });
  });

  return (
    <section ref={ref} id="creative" aria-labelledby="creative-title" className="section relative z-10 -mt-10 overflow-hidden rounded-t-[32px] bg-paper text-ink sm:-mt-14 sm:rounded-t-[48px]">
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [--grid-c:rgb(11_11_16/0.045)]" />

      <div className="shell relative">
        <p data-reveal className="t-label flex items-center gap-2 text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 01 — 03
        </p>
        <h2 id="creative-title" data-reveal className="t-mega mt-5 text-[clamp(3rem,9vw,9rem)]">
          Marketing <span className="outline-text text-ink">&amp;</span> <br className="sm:hidden" />
          Creative
        </h2>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28 lg:space-y-36">
          {creative.map((c, i) => {
            const visual = c.visual === 'strategy' ? <StrategyVisual /> : c.visual === 'ads' ? <AdsVisual /> : <ContentVisual />;
            const flip = i % 2 === 1;
            return (
              <article key={c.no} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <div className={`relative lg:col-span-4 ${flip ? 'lg:order-2 lg:col-start-9' : ''}`}>
                  <span data-cr-no aria-hidden className="t-mega outline-text pointer-events-none block text-[clamp(6rem,16vw,14rem)] leading-none text-ink/25">
                    {c.no}
                  </span>
                  <h3 data-reveal className="t-mega -mt-[0.35em] text-[clamp(2rem,1.4rem+2.4vw,3.75rem)]">{c.title}</h3>
                  <p data-reveal className="t-body mt-4 max-w-[34ch] text-graphite">{c.text}</p>
                </div>
                <div
                  data-cr-panel
                  className={`card relative aspect-[4/3] overflow-hidden !rounded-[24px] lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-6'}`}
                >
                  <div aria-hidden className="data-grid absolute inset-0 [--grid-c:rgb(11_11_16/0.05)] [background-size:48px_48px]" />
                  <div aria-hidden className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-[radial-gradient(circle,rgb(168_85_247/0.18),transparent_65%)]" />
                  <span aria-hidden className="absolute left-4 top-4 z-10 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40">
                    Fig. {c.no}
                  </span>
                  <div className="absolute inset-[6%]">{visual}</div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="sr-only">{portfolio.text}</p>
      </div>
    </section>
  );
}
