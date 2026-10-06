import Img from './Img';
import Backdrop from './Backdrop';
import { hero, site, videos } from './content';

/**
 * Hero — desktopda ikki ustun (matn | portret), mobilda: ism → asosiy xabar → tugmalar → portret.
 * Qat'iy 100vh yo'q: balandlik kontentdan kelib chiqadi.
 * Portretning oq foni `mix-blend-multiply` bilan och panelga tabiiy qo'shiladi (kesish yo'q, qiyofa o'zgarmaydi).
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-16 lg:pt-[72px]">
      <Backdrop variant="network" className="hidden lg:block" />

      <div className="shell relative grid gap-y-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-12 lg:items-end lg:gap-x-10 lg:pb-0 lg:pt-10">
        {/* matn */}
        <div className="relative z-10 lg:col-span-7 lg:self-center lg:pb-16">
          <p className="hero-fade t-label eyebrow text-graphite">{hero.label}</p>

          <h1 className="t-display mt-5 uppercase text-ink">
            <span className="line-mask"><span>Avazbek</span></span>{' '}
            <span className="line-mask"><span style={{ animationDelay: '0.08s' }}>Meliqoziyev</span></span>
          </h1>

          <p className="hero-fade t-lead mt-6 max-w-[22ch] text-ink sm:mt-8">{hero.statement}</p>
          <p className="hero-fade t-body mt-4 max-w-[42ch] text-graphite">{hero.subtitle}</p>

          <div className="hero-fade mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <a href="#portfolio" className="btn-primary">
              Ishlarimni ko‘rish <span aria-hidden className="btn-arrow">→</span>
            </a>
            <a href="#contact" className="btn-secondary">
              Bog‘lanish
            </a>
          </div>
        </div>

        {/* portret */}
        <figure className="relative mx-auto w-full max-w-[380px] sm:max-w-[420px] lg:col-span-5 lg:mr-0 lg:max-w-[460px]">
          <span
            aria-hidden
            className="hero-fade absolute inset-x-[5%] bottom-0 top-[26%] rounded-t-[var(--radius-card)] border border-b-0 border-line bg-mist"
          />
          <span aria-hidden className="hero-fade absolute right-[9%] top-[30%] h-2 w-2 rounded-full bg-accent" />
          <Img
            src="/avazbek/images/hero-portrait.jpg"
            alt={`${site.name} — qora kostyumdagi portret`}
            width={805}
            height={1169}
            priority
            className="hero-portrait relative block h-auto w-full mix-blend-multiply"
          />

          {/* Reels — videolarga qisqa yo'l */}
          <a
            href="#video"
            className="group absolute bottom-8 left-0 hidden w-[88px] -translate-x-1/2 lg:block"
            aria-label="Videolarga o‘tish"
          >
            <span className="relative block aspect-[9/16] overflow-hidden rounded-[14px] border-2 border-card bg-mist shadow-[var(--shadow-lift)]">
              <Img src={videos[0].poster} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-accent shadow-[0_2px_8px_rgb(34_50_74/0.25)]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="translate-x-[1px]">
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                  </svg>
                </span>
              </span>
            </span>
          </a>
        </figure>
      </div>
      <div className="shell relative" aria-hidden>
        <div className="h-px bg-line" />
      </div>
    </section>
  );
}
