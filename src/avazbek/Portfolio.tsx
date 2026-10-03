import Img from './Img';
import VideoWork from './VideoWork';
import Parallax from './Parallax';
import { StrategyVisual, AdsVisual, ContentVisual } from './MarketingVisuals';
import { brands, brandsCopy, creative, portfolio, trust } from './content';

export default function Portfolio() {
  const logos = brands.map((b) => ({ ...b, alt: b.name ?? 'Brand logo' }));

  return (
    <section id="portfolio" aria-labelledby="portfolio-title">
      {/* ── Opening: oversized typography transition (dark) ── */}
      <div className="relative overflow-hidden bg-ink text-paper">
        <div aria-hidden className="gridlines-dark pointer-events-none absolute inset-0" />
        <div className="shell relative pb-14 pt-24 sm:pt-32 lg:pb-20 lg:pt-40">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-paper/15 pb-6">
            <p data-reveal className="kicker text-paper/50">Selected work</p>
          </div>
          <h2
            id="portfolio-title"
            data-reveal
            className="mt-8 text-[clamp(64px,20vw,300px)] font-semibold leading-[0.78] tracking-[-0.075em]"
          >
            Portfolio
          </h2>
          <p data-reveal className="mt-8 max-w-md text-[17px] leading-relaxed text-paper/60 lg:ml-auto lg:text-right">
            {portfolio.text}
          </p>
        </div>
      </div>

      {/* ── A) Brands trust wall (warm light) ── */}
      <div id="brands" className="scroll-mt-16 bg-bone py-24 sm:py-32">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <header className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h3 data-reveal className="text-[42px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[56px]">
                  {brandsCopy.title}
                </h3>
                <p data-reveal className="mt-5 max-w-xs text-[15px] leading-relaxed text-graphite">{brandsCopy.text}</p>
              </div>
            </header>

            <ul className="grid grid-flow-dense grid-cols-2 gap-px overflow-hidden rounded-[6px] bg-ink/10 sm:grid-cols-4 lg:col-span-8 lg:grid-cols-4">
              {logos.map((b, i) => (
                <li
                  key={b.logo}
                  data-reveal
                  style={{ ['--d' as string]: i % 4 }}
                  className={`group relative flex items-center justify-center bg-bone transition-colors duration-500 hover:bg-paper ${
                    b.featured ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                  }`}
                >
                  <Img
                    src={b.logo}
                    alt={b.alt}
                    width={300}
                    height={300}
                    className={`object-contain transition-[filter,opacity,transform] duration-500 group-hover:scale-[1.05] [@media(hover:hover)]:opacity-80 [@media(hover:hover)]:grayscale group-hover:opacity-100 group-hover:grayscale-0 ${
                      b.featured ? 'h-[46%] w-[58%]' : 'h-[56%] w-[68%]'
                    }`}
                  />
                  {b.name && b.featured ? (
                    <span className="kicker absolute bottom-4 left-4 text-ink/45">{b.name}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── B) Video works (dark) ── */}
      <div id="video" className="scroll-mt-16 bg-ink py-24 text-paper sm:py-32 lg:py-40">
        <div className="shell">
          <VideoWork
            header={
              <div>
                <h3 data-reveal className="text-[46px] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-[72px] lg:text-[96px]">
                  {portfolio.videoTitle}
                </h3>
                <p data-reveal className="mt-5 max-w-sm text-[16px] leading-relaxed text-paper/55">{portfolio.videoText}</p>
              </div>
            }
          />
        </div>
      </div>

      {/* ── C) Marketing & Creative (light, alternating visual blocks) ── */}
      <div id="creative" className="relative scroll-mt-16 overflow-hidden bg-paper py-24 sm:py-32 lg:py-40">
        <div aria-hidden className="gridlines pointer-events-none absolute inset-0" />
        <div className="shell relative">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-6">
            <h3 data-reveal className="text-[42px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[64px]">
              {portfolio.creativeTitle}
            </h3>
          </div>

          <div className="divide-y divide-ink/15">
            {creative.map((c, i) => {
              const visual = c.visual === 'strategy' ? <StrategyVisual /> : c.visual === 'ads' ? <AdsVisual /> : <ContentVisual />;
              const dark = c.visual === 'ads';
              const flip = i % 2 === 1;
              return (
                <article key={c.no} className="grid items-center gap-8 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
                  <div className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
                    <p data-reveal className="text-[96px] font-semibold leading-[0.8] tracking-[-0.07em] text-ink/10 sm:text-[140px]">
                      {c.no}
                    </p>
                    <h4 data-reveal className="mt-4 text-[34px] font-semibold leading-none tracking-[-0.045em] sm:text-[48px]">
                      {c.title}
                    </h4>
                    <p data-reveal className="mt-5 max-w-sm text-[17px] leading-relaxed text-graphite">{c.text}</p>
                  </div>
                  <div
                    data-reveal="image"
                    className={`relative aspect-[4/3] overflow-hidden rounded-[6px] lg:col-span-7 ${dark ? 'bg-ink' : 'bg-bone'} ${
                      flip ? 'lg:order-1 lg:col-start-1' : ''
                    }`}
                  >
                    <Parallax strength={14} className="h-full">
                      {visual}
                    </Parallax>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="kicker mt-4 text-ink/35">Grafikalar illyustratsiya — real kabinet ma’lumoti emas.</p>
        </div>
      </div>

      {/* ── D) Trust: 19+ + logo marquee (dark) ── */}
      <div id="results" className="scroll-mt-16 overflow-hidden bg-coal py-20 text-paper sm:py-28">
        <div className="shell grid items-end gap-8 lg:grid-cols-12">
          <p data-reveal className="text-[clamp(120px,30vw,320px)] font-semibold leading-[0.75] tracking-[-0.08em] lg:col-span-7">
            {trust.value.replace('+', '')}
            <span className="text-accent">+</span>
          </p>
          <div data-reveal className="lg:col-span-5 lg:pb-6">
            <p className="kicker text-paper/50">{trust.label}</p>
            <p className="mt-4 max-w-md text-[22px] font-medium leading-snug tracking-[-0.02em] sm:text-[26px]">{trust.text}</p>
          </div>
        </div>
        <div className="marquee-mask mt-16 sm:mt-20" aria-hidden>
          <div className="marquee items-center gap-4">
            {[...logos, ...logos].map((b, i) => (
              <span key={i} className="flex h-20 w-28 shrink-0 items-center justify-center rounded-[6px] bg-paper/[0.06] sm:h-24 sm:w-36">
                <Img src={b.logo} alt="" width={120} height={120} className="h-[60%] w-[70%] object-contain opacity-90" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
