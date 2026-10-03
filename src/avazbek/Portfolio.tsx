import Img from './Img';
import VideoWork from './VideoWork';
import Backdrop from './Backdrop';
import { StrategyVisual, AdsVisual, ContentVisual } from './MarketingVisuals';
import { brands, brandsCopy, creative, portfolio, trust } from './content';

export default function Portfolio() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title">
      {/* ── Kirish (to‘q ko‘k, ixcham) ── */}
      <div className="relative overflow-hidden bg-coal text-paper">
        <Backdrop variant="frames" tone="dark" />
        <div className="shell section-tight relative grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p data-reveal className="eyebrow t-label text-accent">{portfolio.kicker}</p>
            <h2 id="portfolio-title" data-reveal className="t-h2 mt-5 text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)]">
              {portfolio.title}
            </h2>
          </div>
          <p data-reveal className="t-body max-w-[38ch] text-paper/70 lg:col-span-4 lg:col-start-9 lg:justify-self-end lg:pb-2">
            {portfolio.text}
          </p>
        </div>
      </div>

      {/* ── Brendlar ── */}
      <div id="brands" className="section scroll-mt-16 bg-bone">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h3 data-reveal className="t-h2">{brandsCopy.title}</h3>
              <p data-reveal className="t-h4 mt-4 font-medium text-ink">{trust.title}</p>
            </div>
            <p data-reveal className="t-small max-w-[44ch] text-graphite lg:col-span-4 lg:col-start-9 lg:justify-self-end">
              {trust.text}
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-2.5 [--logo-h:44px] sm:grid-cols-3 sm:gap-3 sm:[--logo-h:54px] lg:mt-14 lg:grid-cols-6 lg:[--logo-h:62px]">
            {brands.map((b, i) => (
              <li
                key={b.logo}
                data-reveal
                style={{ ['--d' as string]: i % 6 }}
                className="flex aspect-[4/3] items-center justify-center rounded-[6px] border border-line/80 bg-paper px-4 transition-[border-color,background-color] duration-300 hover:border-accent/70 hover:bg-[#f7f4ee]"
              >
                <Img
                  src={b.logo}
                  alt={b.name ?? 'Brand logo'}
                  width={Math.round(300 * b.ratio)}
                  height={300}
                  className="block w-auto max-w-[84%] object-contain"
                  style={{ height: `calc(var(--logo-h) * ${b.scale})` }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Videolar (to‘q ko‘k) ── */}
      <div id="video" className="section relative scroll-mt-16 bg-coal text-paper">
        <div className="shell relative">
          <VideoWork />
        </div>
      </div>

      {/* ── Yo‘nalishlar (krem) ── */}
      <div id="creative" className="section relative scroll-mt-16 bg-paper">
        <div className="shell relative">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h3 data-reveal className="t-h2">{portfolio.creativeTitle}</h3>
            <p data-reveal className="t-small text-graphite">Grafikalar illyustratsiya — real kabinet ma’lumoti emas.</p>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {creative.map((c, i) => {
              const visual = c.visual === 'strategy' ? <StrategyVisual /> : c.visual === 'ads' ? <AdsVisual /> : <ContentVisual />;
              const dark = c.visual === 'ads';
              return (
                <article key={c.no} data-reveal style={{ ['--d' as string]: i }} className="flex flex-col">
                  <div className={`media relative aspect-[4/3] border ${dark ? 'border-coal bg-coal' : 'border-line/80 bg-bone'}`}>{visual}</div>
                  <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 border-t border-ink/12 pt-5">
                    <span className="t-label pt-1.5 text-accent-ink">{c.no}</span>
                    <div>
                      <h4 className="t-h4">{c.title}</h4>
                      <p className="t-small mt-2 max-w-[36ch] text-graphite">{c.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
