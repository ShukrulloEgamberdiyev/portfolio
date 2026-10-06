import Img from './Img';
import VideoWork from './VideoWork';
import Backdrop from './Backdrop';
import { StrategyVisual, AdsVisual, ContentVisual } from './MarketingVisuals';
import { brands, brandsCopy, creative, portfolio, trust } from './content';

export default function Portfolio() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title">
      {/* ── Kirish + brendlar (ikkinchi fon) ── */}
      <div className="section relative overflow-hidden bg-mist">
        <Backdrop variant="frames" className="!bottom-auto hidden !h-[300px] md:block" />
        <div className="shell relative">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p data-reveal className="t-label eyebrow text-graphite">{portfolio.kicker}</p>
              <h2 id="portfolio-title" data-reveal className="t-h2 mt-4">
                {portfolio.title}
              </h2>
            </div>
            <p data-reveal className="t-body max-w-[40ch] text-graphite lg:col-span-5 lg:justify-self-end lg:text-right">
              {portfolio.text}
            </p>
          </div>

          {/* brendlar */}
          <div id="brands" className="card mt-12 scroll-mt-24 p-5 sm:p-8 lg:mt-14 lg:p-10">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
              <div className="lg:col-span-7">
                <h3 data-reveal className="t-h3">{brandsCopy.title}</h3>
                <p data-reveal className="t-body mt-2 font-medium text-ink">{trust.title}</p>
              </div>
              <p data-reveal className="t-small max-w-[46ch] text-graphite lg:col-span-5 lg:justify-self-end lg:text-right">
                {trust.text}
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 [--logo-h:42px] sm:grid-cols-3 sm:[--logo-h:50px] lg:mt-10 lg:grid-cols-6 lg:gap-4 lg:[--logo-h:52px]">
              {brands.map((b, i) => (
                <li
                  key={b.logo}
                  data-reveal
                  style={{ ['--d' as string]: i % 6 }}
                  className="flex aspect-[4/3] items-center justify-center rounded-[14px] border border-line bg-paper px-3 transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#c7d3e6] hover:bg-card hover:shadow-[var(--shadow-soft)]"
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
      </div>

      {/* ── Videolar (asosiy fon) ── */}
      <div id="video" className="section scroll-mt-16 bg-paper">
        <div className="shell">
          <VideoWork />
        </div>
      </div>

      {/* ── Yo‘nalishlar (ikkinchi fon) ── */}
      <div id="creative" className="section scroll-mt-16 bg-mist">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h3 data-reveal className="t-h2">{portfolio.creativeTitle}</h3>
            <p data-reveal className="t-small text-graphite">Grafikalar illyustratsiya — real kabinet ma’lumoti emas.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {creative.map((c, i) => {
              const visual = c.visual === 'strategy' ? <StrategyVisual /> : c.visual === 'ads' ? <AdsVisual /> : <ContentVisual />;
              return (
                <article key={c.no} data-reveal style={{ ['--d' as string]: i }} className="card flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] border-b border-line bg-paper">{visual}</div>
                  <div className="flex gap-4 p-6">
                    <span className="t-label pt-1.5 text-accent">{c.no}</span>
                    <div>
                      <h4 className="t-h4">{c.title}</h4>
                      <p className="t-small mt-2 text-graphite">{c.text}</p>
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
