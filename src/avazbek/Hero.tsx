import Img from "./Img";
import { hero, site } from "./content";

export default function Hero() {
  const tags = hero.label.split("•").map((t) => t.trim());
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-16 lg:pt-[72px]">
      <div className="shell relative">
        <div aria-hidden className="gridlines pointer-events-none absolute inset-y-0 left-5 right-5 sm:left-8 sm:right-8 lg:left-12 lg:right-12" />

        {/* meta row */}
        <div className="hero-fade relative flex items-center justify-between border-b border-ink/10 py-4">
          <p className="kicker flex items-center gap-2 text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Personal portfolio
          </p>
          <p className="kicker hidden text-graphite sm:block">{site.location}</p>
        </div>

        <h1 className="sr-only">{site.name}</h1>

        {/* AVAZBEK — full width */}
        <p
          aria-hidden
          className="line-mask relative pt-6 text-[21vw] font-semibold uppercase leading-[0.8] tracking-[-0.075em] sm:pt-8 xl:text-[19.6vw] min-[1440px]:text-[282px]"
        >
          <span>Avazbek</span>
        </p>
        {/* mobil: familiya darhol ism ostida (rasm bilan ustma-ust tushmaydi) */}
        <p
          aria-hidden
          className="line-mask relative text-[13.6vw] font-semibold uppercase leading-[0.84] tracking-[-0.07em] xl:hidden"
        >
          <span style={{ animationDelay: "0.12s" }}>Meliqoziyev</span>
        </p>

        <div className="relative grid xl:grid-cols-12 xl:gap-8">
          {/* left column: positioning */}
          <div className="relative z-20 order-2 pb-14 pt-8 xl:order-1 xl:pb-0 xl:col-span-4 xl:pt-14">
            <ul className="hero-fade flex flex-wrap gap-x-4 gap-y-1 kicker text-graphite">
              {tags.map((t, i) => (
                <li key={t}>
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {t}
                </li>
              ))}
            </ul>
            <p className="hero-fade mt-8 text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[44px] xl:text-[46px]">
              Marketingni biznes <span className="em text-[1.08em]">natijasiga</span> bog‘layman.
            </p>
            <p className="hero-fade mt-5 max-w-sm text-[16px] leading-relaxed text-graphite">{hero.subtitle}</p>
            <div className="hero-fade mt-8 flex flex-col gap-3 min-[400px]:flex-row">
              <a href="#portfolio" className="btn-dark">
                Portfolio <span aria-hidden>→</span>
              </a>
              <a href="#contact" className="btn-ghost">
                Bog‘lanish
              </a>
            </div>
          </div>

          {/* portrait */}
          <div className="hero-portrait relative z-10 order-1 mx-auto mt-4 w-[86%] max-w-[480px] mix-blend-multiply sm:w-[60%] xl:order-2 xl:col-span-4 xl:col-start-6 xl:mt-[-1vw] xl:w-full xl:max-w-none">
            <Img
              src="/avazbek/images/hero.jpg"
              alt="Avazbek Meliqoziyev — qora kostyumdagi portret"
              width={805}
              height={1073}
              priority
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 86vw"
              className="h-auto w-full"
            />
          </div>

          {/* right column: index */}
          <div className="relative order-3 hidden xl:col-span-2 xl:col-start-11 xl:flex xl:flex-col xl:pt-14">
            <p className="kicker text-graphite">Index</p>
            <ol className="mt-4 space-y-2 text-[15px]">
              {[
                ["Portfolio", "#portfolio"],
                ["Resume", "#resume"],
                ["Men haqimda", "#about"],
              ].map(([l, h], i) => (
                <li key={h}>
                  <a href={h} className="group flex items-baseline justify-between border-b border-ink/10 pb-2 hover:text-accent">
                    {l}
                    <span className="font-mono text-[11px] text-graphite group-hover:text-accent">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* MELIQOZIYEV — desktop: portret asosiga tushadi (portret multiply bilan ustida) */}
        <div className="hidden xl:block">
          <p
            aria-hidden
            className="line-mask relative -mt-[9.5vw] pb-12 text-right text-[12.6vw] font-semibold uppercase leading-[0.8] tracking-[-0.07em] min-[1440px]:text-[181px]"
          >
            <span style={{ animationDelay: "0.12s" }}>Meliqoziyev</span>
          </p>
        </div>
      </div>
    </section>
  );
}
