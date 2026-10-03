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
        <Backdrop tone="dark" />
        <div className="shell relative flex flex-col gap-6 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p data-reveal className="kicker flex items-center gap-2.5 text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden />
              {portfolio.kicker}
            </p>
            <h2 id="portfolio-title" data-reveal className="mt-4 text-[clamp(48px,9vw,104px)] font-semibold leading-[0.9] tracking-[-0.06em]">
              {portfolio.title}
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-[16px] leading-relaxed text-paper/65 lg:pb-2 lg:text-right">{portfolio.text}</p>
        </div>
      </div>

      {/* ── Brendlar: bir xil o‘lchamdagi tartibli kataklar ── */}
      <div id="brands" className="scroll-mt-16 bg-bone py-20 sm:py-24">
        <div className="shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 data-reveal className="text-[38px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[52px]">
                {brandsCopy.title}
              </h3>
              <p data-reveal className="mt-3 text-[17px] font-medium text-ink">{trust.title}</p>
            </div>
            <p data-reveal className="max-w-md text-[15px] leading-relaxed text-graphite lg:text-right">{trust.text}</p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6 lg:gap-4">
            {brands.map((b, i) => (
              <li
                key={b.logo}
                data-reveal
                style={{ ['--d' as string]: i % 6 }}
                className="flex aspect-[4/3] items-center justify-center rounded-[4px] border border-line bg-paper p-4 transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-[0_12px_30px_-18px_rgb(20_36_59/0.35)]"
              >
                <Img src={b.logo} alt={b.name ?? 'Brand logo'} width={300} height={300} className="h-full max-h-[78px] w-full object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Videolar / ishlar (to‘q ko‘k) ── */}
      <div id="video" className="relative scroll-mt-16 overflow-hidden bg-coal py-20 text-paper sm:py-28">
        <div className="shell relative">
          <VideoWork />
        </div>
      </div>

      {/* ── Yo‘nalishlar (krem) ── */}
      <div id="creative" className="relative scroll-mt-16 overflow-hidden bg-paper py-20 sm:py-28">
        <div className="shell relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 data-reveal className="text-[38px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[52px]">
              {portfolio.creativeTitle}
            </h3>
            <p data-reveal className="text-[14px] text-graphite">Grafikalar illyustratsiya — real kabinet ma’lumoti emas.</p>
          </div>

          <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {creative.map((c, i) => {
              const visual = c.visual === 'strategy' ? <StrategyVisual /> : c.visual === 'ads' ? <AdsVisual /> : <ContentVisual />;
              const dark = c.visual === 'ads';
              return (
                <article key={c.no} data-reveal style={{ ['--d' as string]: i }} className="flex flex-col">
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-[4px] ${dark ? 'bg-coal' : 'bg-bone'}`}>{visual}</div>
                  <div className="mt-6 flex items-start gap-5">
                    <span className="text-[44px] font-semibold leading-[0.8] tracking-[-0.06em] text-accent">{c.no}</span>
                    <div>
                      <h4 className="text-[24px] font-semibold leading-tight tracking-[-0.03em]">{c.title}</h4>
                      <p className="mt-2 text-[15px] leading-relaxed text-graphite">{c.text}</p>
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
