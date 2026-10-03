import Img from './Img';
import Backdrop from './Backdrop';
import { hero, site, videos } from './content';

/**
 * Hero — chapda ism, yo‘nalish, asosiy xabar va tugmalar; o‘ngda portret.
 * Portret oq foni `mix-blend-multiply` bilan krem fonga va uning ortidagi panelga tabiiy qo‘shiladi
 * (kesish/niqob yo‘q — kontur, yuz va kiyim o‘zgarmaydi). Bosh va yelka panel ramkasidan tashqariga chiqadi.
 * Ism hech qachon portret, matn yoki tugmalar ustiga chiqmaydi.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-16 lg:pt-[72px]">
      <Backdrop variant="network" className="hidden lg:block" />

      <div className="shell relative">
        <div className="grid gap-y-12 pb-12 pt-10 sm:pt-14 lg:min-h-[min(calc(100svh-72px),880px)] lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:pb-0 lg:pt-0">
          {/* matn */}
          <div className="relative z-10 lg:col-span-7 lg:self-center lg:pb-10">
            <p className="hero-fade t-label flex items-center gap-2.5 text-graphite">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {hero.label}
            </p>

            <h1 className="t-display mt-6 text-ink">
              <span className="line-mask"><span>Avazbek</span></span>{' '}
              <span className="line-mask"><span style={{ animationDelay: '0.08s' }}>Meliqoziyev</span></span>
            </h1>

            <div className="hero-fade mt-8 max-w-[34rem] border-l border-accent/70 pl-5 sm:mt-10 sm:pl-6">
              <p className="t-lead max-w-[20ch] text-ink">{hero.statement}</p>
              <p className="t-body mt-4 max-w-[40ch] text-graphite">{hero.subtitle}</p>
            </div>

            <div className="hero-fade mt-8 flex flex-col gap-3 min-[420px]:flex-row sm:mt-10">
              <a href="#portfolio" className="btn-gold group">
                Ishlarimni ko‘rish <span aria-hidden className="btn-arrow">→</span>
              </a>
              <a href="#contact" className="btn-ghost">
                Bog‘lanish
              </a>
            </div>
          </div>

          {/* portret: panel ramka + multiply */}
          <figure className="relative mx-auto w-full max-w-[400px] sm:max-w-[440px] lg:col-span-5 lg:mx-0 lg:ml-auto lg:w-[min(100%,calc((100svh_-_96px)*0.6886))] lg:max-w-[590px]">
            <span
              aria-hidden
              className="hero-fade absolute inset-x-[6%] bottom-0 top-[27%] rounded-t-[6px] border border-b-0 border-accent/45 bg-bone"
            />
            <Img
              src="/avazbek/images/hero-portrait.jpg"
              alt={`${site.name} — qora kostyumdagi portret`}
              width={805}
              height={1169}
              priority
              className="hero-portrait relative block h-auto w-full mix-blend-multiply"
            />

            {/* Reels — panelning pastki chap burchagiga bog‘langan kichik kadr */}
            <a
              href="#video"
              className="group absolute bottom-6 left-0 hidden w-[92px] -translate-x-1/2 lg:block"
              aria-label="Videolarga o‘tish"
            >
              <span className="media relative block aspect-[9/16] border border-paper bg-coal shadow-[0_18px_40px_-24px_rgb(20_36_59/0.55)]">
                <Img src={videos[0].poster} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-coal">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="t-label mt-2 block text-center text-[10px] text-graphite group-hover:text-ink">Reels</span>
            </a>
          </figure>
        </div>
      </div>
      {/* pol chizig‘i: bo‘lim tagida ingichka chiziq */}
      <div className="shell relative" aria-hidden>
        <div className="h-px bg-ink/12" />
      </div>
    </section>
  );
}
