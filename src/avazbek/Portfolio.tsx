import Img from "./Img";
import VideoWork from "./VideoWork";
import Parallax from "./Parallax";
import { IntroVisual, FlowVisual, AdsVisual, ContentVisual } from "./MarketingVisuals";
import { brands, brandsCopy, creative, highlights, portfolio, videos } from "./content";

function SubHead({
  no,
  title,
  text,
  dark,
  aside,
}: {
  no: string;
  title: React.ReactNode;
  text?: string;
  dark?: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <header className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
      <div className="lg:col-span-8">
        <p data-reveal className={`kicker ${dark ? "text-paper/50" : "text-graphite"}`}>
          <span className="text-accent">({no})</span> Portfolio
        </p>
        <h3
          data-reveal
          className="mt-5 text-balance text-[44px] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-[64px] lg:text-[84px]"
        >
          {title}
        </h3>
      </div>
      {text || aside ? (
        <div data-reveal style={{ ["--d" as string]: 1 }} className="lg:col-span-4 lg:pb-2">
          {text ? <p className={`max-w-sm text-[16px] leading-relaxed ${dark ? "text-paper/60" : "text-graphite"}`}>{text}</p> : null}
          {aside}
        </div>
      ) : null}
    </header>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" aria-label="Portfolio">
      {/* ── Intro (dark) ───────────────────────────── */}
      <div className="relative overflow-hidden bg-ink py-24 text-paper sm:py-32 lg:py-40">
        <div aria-hidden className="gridlines-dark pointer-events-none absolute inset-0" />
        <div className="shell relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p data-reveal className="kicker text-paper/50">
              <span className="text-accent">●</span> Selected work
            </p>
            <h2
              data-reveal
              className="mt-6 text-[19vw] font-semibold leading-[0.8] tracking-[-0.07em] sm:text-[15vw] lg:text-[10.4vw] min-[1440px]:text-[150px]"
            >
              Port<span className="em">folio</span>
            </h2>
            <p data-reveal className="mt-8 max-w-md text-[17px] leading-relaxed text-paper/65">
              {portfolio.text}
            </p>
            <ol data-reveal className="mt-12 border-t border-paper/15">
              {portfolio.parts.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="group flex items-center justify-between border-b border-paper/15 py-4 text-[18px] transition-colors hover:text-accent sm:text-[20px]"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="font-mono text-[11px] text-paper/40 group-hover:text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.label}
                    </span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Parallax strength={28}>
              <IntroVisual />
            </Parallax>
          </div>
        </div>
      </div>

      {/* ── A) Brands trust wall (light) ───────────── */}
      <div id="brands" className="scroll-mt-16 bg-paper py-24 sm:py-32">
        <div className="shell">
          <SubHead
            no="A"
            title={
              <>
                Ishlagan <span className="em">brendlarim</span>
              </>
            }
            text={brandsCopy.text}
          />
          <ul className="mt-14 grid grid-cols-2 border-l border-t border-ink/10 sm:grid-cols-3 md:grid-cols-4 lg:mt-20 lg:grid-cols-6">
            {brands.map((b, i) => (
              <li
                key={b.logo}
                data-reveal
                style={{ ["--d" as string]: i % 6 }}
                className="group relative flex aspect-square items-center justify-center border-b border-r border-ink/10 transition-colors duration-500 hover:bg-white"
              >
                <span className="absolute left-3 top-3 font-mono text-[10px] text-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Img
                  src={b.logo}
                  alt={b.name ?? "Client brand"}
                  width={300}
                  height={300}
                  loading="lazy"
                  sizes="(min-width: 1024px) 200px, 45vw"
                  className="h-[54%] w-[70%] object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── B) Video showcase (dark) ───────────────── */}
      <div id="video" className="scroll-mt-16 bg-ink py-24 text-paper sm:py-32 lg:pb-40">
        <div className="shell">
          <SubHead
            no="B"
            dark
            title={
              <>
                Video <span className="em">ishlari</span>
              </>
            }
            text={portfolio.videoText}
            aside={<p className="kicker mt-4 text-paper/40">{videos.length} ta Reels • 9:16</p>}
          />
          <div className="mt-14 lg:mt-20">
            <VideoWork />
          </div>
        </div>
      </div>

      {/* ── C) Marketing & Creative (light) ────────── */}
      <div id="creative" className="relative scroll-mt-16 overflow-hidden bg-paper py-24 sm:py-32 lg:py-40">
        <div aria-hidden className="gridlines pointer-events-none absolute inset-0" />
        <div className="shell relative">
          <SubHead
            no="C"
            title={
              <>
                Marketing <span className="em">&amp;</span> Creative
              </>
            }
          />
          <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
            {creative.map((c, i) => {
              const layout = [
                "lg:col-span-7",
                "lg:col-span-5 lg:mt-24",
                "lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-stretch",
              ][i];
              const visual =
                c.visual === "flow" ? (
                  <FlowVisual steps={c.tags} />
                ) : c.visual === "ads" ? (
                  <AdsVisual />
                ) : (
                  <ContentVisual />
                );
              const wide = i === 2;
              return (
                <article
                  key={c.no}
                  data-reveal
                  style={{ ["--d" as string]: i }}
                  className={`overflow-hidden rounded-[28px] bg-bone ${layout}`}
                >
                  <div
                    className={`relative ${wide ? "aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[420px] lg:bg-ink/[0.03]" : "aspect-[4/3]"}`}
                  >
                    <Parallax strength={12} className="h-full">
                      {visual}
                    </Parallax>
                  </div>
                  <div className={`flex flex-col justify-between gap-6 border-t border-ink/10 p-6 sm:p-8 ${wide ? "lg:col-span-7 lg:border-l lg:border-t-0 lg:p-12" : ""}`}>
                    <div className="flex items-start justify-between gap-6">
                      <h4 className="text-[30px] font-semibold leading-none tracking-[-0.045em] sm:text-[38px] lg:text-[44px]">
                        {c.title}
                      </h4>
                      <span className="em text-[56px] leading-[0.7] text-ink/20 sm:text-[72px]">{c.no}</span>
                    </div>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-graphite">
                      {c.tags.map((t) => (
                        <li key={t} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="kicker mt-8 text-ink/40">Vizual kompozitsiyalar — illyustratsiya, real kabinet ma’lumoti emas.</p>
        </div>
      </div>

      {/* ── D) Results / trust block (dark) ───────── */}
      <div id="results" className="scroll-mt-16 bg-ink text-paper">
        <div className="shell">
          <dl className="grid grid-cols-2 border-paper/15 lg:grid-cols-4">
            {highlights.map((h, i) => (
              <div
                key={h.label}
                data-reveal
                style={{ ["--d" as string]: i }}
                className={`flex flex-col justify-between gap-10 border-paper/15 py-10 sm:py-14 ${
                  i % 2 === 1 ? "border-l pl-5 sm:pl-8" : "pr-5"
                } ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""}`}
              >
                <dt className="order-2 text-[14px] text-paper/55 sm:text-[15px]">{h.label}</dt>
                <dd className="order-1 text-[40px] font-semibold leading-[0.85] tracking-[-0.06em] sm:text-[56px] lg:text-[64px]">
                  {h.value.endsWith("+") ? (
                    <>
                      {h.value.slice(0, -1)}
                      <span className="text-accent">+</span>
                    </>
                  ) : (
                    <span className="text-[0.62em] tracking-[-0.04em]">{h.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
