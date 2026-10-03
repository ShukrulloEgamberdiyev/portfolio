import Img from './Img';
import { hero, site, videos } from './content';

/**
 * Hero — jurnal muqovasi kompozitsiyasi.
 * Desktop: o'ngda katta portret (yuqori qism, editorial crop), ism pastda bir marta — mix-blend-difference
 * tufayli oq fonda qora, kostyum ustida oq o'qiladi. Mobil: ism → portret → matn, hech narsa ustma-ust emas.
 */
export default function Hero() {
  const tags = hero.label.split('•').map((t) => t.trim());
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-16 lg:pt-[72px]">
      <div className="shell relative xl:flex xl:h-[calc(100svh-72px)] xl:max-h-[1000px] xl:min-h-[760px] xl:flex-col">
        <div aria-hidden className="gridlines pointer-events-none absolute inset-y-0 left-5 right-5 sm:left-8 sm:right-8 lg:left-12 lg:right-12" />

        {/* meta row */}
        <div className="hero-fade relative z-30 flex items-center justify-between gap-4 border-b border-ink/10 py-4">
          <p className="kicker text-ink">
            <span className="text-graphite">N°01</span>&nbsp;&nbsp;Personal portfolio
          </p>
          <ul className="kicker hidden gap-6 text-graphite md:flex">
            {tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="kicker hidden text-graphite sm:block">{site.location}</p>
        </div>

        <div className="relative grid flex-1 xl:grid-cols-12 xl:gap-8">
          {/* NAME — the only occurrence */}
          <h1
            className="relative z-20 order-1 pt-8 text-[clamp(36px,13.2vw,150px)] font-semibold uppercase leading-[0.84] tracking-[-0.065em] xl:pointer-events-none xl:absolute xl:bottom-10 xl:left-0 xl:right-0 xl:order-none xl:pt-0 xl:text-[clamp(64px,10.4vw,168px)] xl:text-white xl:mix-blend-difference"
          >
            <span className="line-mask"><span>Avazbek</span></span>
            <span className="line-mask"><span style={{ animationDelay: '0.12s' }}>Meliqoziyev</span></span>
          </h1>

          {/* portrait — editorial crop */}
          <figure className="hero-portrait relative order-2 mt-8 xl:order-none xl:col-span-6 xl:col-start-7 xl:mt-0 xl:h-full">
            <div className="grain relative aspect-[4/5] overflow-hidden bg-bone sm:aspect-[5/4] md:aspect-[4/3] xl:aspect-auto xl:h-full">
              <Img
                src="/avazbek/images/hero.jpg"
                alt="Avazbek Meliqoziyev — qora kostyumdagi portret"
                width={805}
                height={1073}
                priority
                fill
                className="object-cover object-[50%_0%] [filter:contrast(1.06)]"
              />
            </div>
            <figcaption className="kicker absolute right-3 top-3 text-ink/50 xl:right-4 xl:top-4">Fig. 01</figcaption>

            {/* small reel frame — links to video works */}
            <a
              href="#video"
              className="group absolute -left-3 bottom-[42%] hidden w-[112px] -rotate-3 overflow-hidden rounded-[14px] bg-ink p-1.5 shadow-2xl transition-transform duration-500 hover:rotate-0 xl:block"
              aria-label="Video ishlariga o‘tish"
            >
              <span className="relative block aspect-[9/16] overflow-hidden rounded-[10px]">
                <Img src={videos[0].poster} alt="" fill className="object-cover" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:scale-110">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="kicker block px-1 pb-0.5 pt-1.5 text-[9px] text-paper/70">Reels</span>
            </a>
          </figure>

          {/* statement + CTA */}
          <div className="relative z-20 order-3 pb-16 pt-10 xl:order-none xl:col-span-5 xl:col-start-1 xl:row-start-1 xl:pb-0 xl:pt-16">
            <p className="hero-fade max-w-[16ch] text-[32px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[44px] xl:text-[48px]">
              {hero.statement}
            </p>
            <p className="hero-fade mt-6 max-w-sm text-[16px] leading-relaxed text-graphite">{hero.subtitle}</p>
            <div className="hero-fade mt-9 flex flex-col gap-3 min-[400px]:flex-row">
              <a href="#portfolio" className="btn-dark group">
                Portfolio <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a href="#contact" className="btn-ghost">
                Bog‘lanish
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
