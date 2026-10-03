import Img from './Img';
import Backdrop from './Backdrop';
import { hero, site, videos } from './content';

/**
 * Hero: chapda ism, yo‘nalish, asosiy xabar va tugmalar; o‘ngda portret.
 * Ism hech qachon portret, matn yoki tugmalar ustiga chiqmaydi. Mobil: matn va tugmalar birinchi, portret keyin.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-16 lg:pt-[72px]">
      <Backdrop tone="light" className="opacity-80" />
      <div className="shell relative grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:min-h-[calc(100svh-72px)] lg:grid-cols-12 lg:gap-8 lg:py-12">
        {/* text */}
        <div className="relative z-10 lg:col-span-7">
          <p className="hero-fade kicker flex items-center gap-2.5 text-graphite">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {hero.label}
          </p>
          <h1 className="mt-5 text-[clamp(38px,12.4vw,64px)] font-semibold uppercase leading-[0.88] tracking-[-0.055em] text-ink lg:text-[clamp(64px,8.2vw,120px)]">
            <span className="line-mask"><span>Avazbek</span></span>{' '}
            <span className="line-mask"><span style={{ animationDelay: '0.1s' }}>Meliqoziyev</span></span>
          </h1>
          <span aria-hidden className="hero-fade mt-6 block h-px w-24 bg-accent" />
          <p className="hero-fade mt-6 max-w-[18ch] text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[36px] lg:text-[40px]">
            {hero.statement}
          </p>
          <p className="hero-fade mt-4 max-w-md text-[16px] leading-relaxed text-graphite">{hero.subtitle}</p>
          <div className="hero-fade mt-8 flex flex-col gap-3 min-[400px]:flex-row">
            <a href="#portfolio" className="btn-gold group">
              Ishlarimni ko‘rish <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href="#contact" className="btn-ghost">
              Bog‘lanish
            </a>
          </div>
        </div>

        {/* portrait */}
        <figure className="hero-portrait relative lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] max-w-[520px] overflow-hidden rounded-[4px] bg-white shadow-[0_30px_60px_-30px_rgb(20_36_59/0.35)]">
            <Img
              src="/avazbek/images/hero.jpg"
              alt={`${site.name} — qora kostyumdagi portret`}
              width={805}
              height={1073}
              priority
              fill
              className="object-cover object-[50%_0%]"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-accent" />
          </div>
          <a
            href="#video"
            className="group absolute -left-4 bottom-10 hidden w-[104px] -rotate-3 overflow-hidden rounded-[14px] bg-coal p-1.5 shadow-2xl transition-transform duration-500 hover:rotate-0 lg:block"
            aria-label="Videolarga o‘tish"
          >
            <span className="relative block aspect-[9/16] overflow-hidden rounded-[10px]">
              <Img src={videos[0].poster} alt="" fill className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-coal transition-transform duration-500 group-hover:scale-110">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                  </svg>
                </span>
              </span>
            </span>
            <span className="kicker block px-1 pb-0.5 pt-1.5 text-[9px] text-paper/70">Reels</span>
          </a>
        </figure>
      </div>
    </section>
  );
}
