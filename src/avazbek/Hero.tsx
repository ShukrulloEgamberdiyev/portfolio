import { useRef } from 'react';
import Img from './Img';
import { hero, site } from './content';
import { useScrollFx } from './motion';

/** To'rt qirrali binafsha yulduzcha (reference'dagi kabi) */
export function Spark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0Z" />
    </svg>
  );
}

/**
 * HERO — qora fon, ulkan binafsha "PORTFOLIO" orqada, kesib olingan portret uning oldida.
 * Ochilishda harflar yorug'lik bilan ketma-ket chiqadi; scroll qilganda PORTFOLIO kattalashib so'nadi,
 * portret parallaks bilan pastroq siljiydi, kichik yozuvlar yuqoriga chiqib yo'qoladi.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const word = hero.backdropWord.toUpperCase();

  useScrollFx(ref, ({ gsap, isDesktop }) => {
    // 1) ochilish: harflar + yozuvlar
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-letter]', { yPercent: 18, opacity: 0, filter: 'brightness(2.4) blur(6px)', duration: 0.9, stagger: 0.07 })
      .from('[data-portrait]', { y: 60, opacity: 0, duration: 1.1 }, 0.35)
      .from('[data-hero-in]', { y: 18, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.7);

    // 2) scroll: PORTFOLIO kattalashadi va so'nadi, portret parallaks, yozuvlar chiqib ketadi
    const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 };
    gsap.to('[data-word]', { scale: 1.14, yPercent: -10, opacity: 0.25, ease: 'none', scrollTrigger: st });
    gsap.to('[data-portrait]', { yPercent: 10, scale: 1.04, ease: 'none', scrollTrigger: st });
    if (isDesktop) gsap.to('[data-hero-out]', { y: -70, opacity: 0, ease: 'none', stagger: 0.04, scrollTrigger: { ...st, end: '60% top' } });
    gsap.to('[data-glow]', { scale: 1.3, opacity: 0.4, ease: 'none', scrollTrigger: st });
  });

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-night pb-10 pt-16 text-paper lg:pb-0 lg:pt-[72px]"
    >
      {/* fon: ma'lumot to'ri + koordinatalar + kesish belgilar */}
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-5 inset-y-20 crop-marks sm:inset-x-8 lg:inset-x-12 lg:inset-y-24" />
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_58_237/0.42)_0%,rgb(76_29_149/0.18)_45%,transparent_70%)] blur-2xl"
      />

      {/* yuqori detallar */}
      <div className="shell relative z-20 flex items-start justify-between pt-6 lg:pt-8">
        <div data-hero-out className="t-small font-semibold uppercase leading-tight tracking-wide">
          <p data-hero-in className="text-violet-4">{hero.topLeft[0]}</p>
          <p data-hero-in className="text-paper">{hero.topLeft[1]}</p>
        </div>
        <p data-hero-out data-hero-in className="hidden items-center gap-2.5 text-sm font-semibold uppercase tracking-wide sm:flex">
          {hero.topRight}
          <Spark className="h-5 w-5 text-violet-3" />
        </p>
      </div>

      {/* PORTFOLIO — orqada */}
      <div className="relative z-0 mt-6 lg:absolute lg:inset-x-0 lg:top-[17%] lg:mt-0">
        <p
          data-word
          aria-hidden
          className="t-mega relative mx-auto w-fit whitespace-nowrap text-center text-[clamp(3.5rem,23.5vw,22rem)] will-change-transform"
        >
          {word.split('').map((ch, i) => (
            <span key={i} data-letter className="hero-letter grad-text">
              {ch}
            </span>
          ))}
          <span className="shine-layer absolute inset-0">{word}</span>
        </p>
      </div>

      {/* portret — PORTFOLIO oldida */}
      <div
        data-portrait
        className="relative z-10 mx-auto -mt-[16vw] w-[min(78vw,420px)] lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:w-auto lg:-translate-x-1/2"
      >
        <Img
          src="/avazbek/images/portrait-cutout.webp"
          alt={`${site.name} — qora kostyumdagi portret`}
          width={626}
          height={1073}
          priority
          className="mx-auto block h-auto w-full [filter:drop-shadow(0_0_1px_rgb(192_132_252/0.75))_drop-shadow(0_0_24px_rgb(124_58_237/0.35))] lg:h-[min(82svh,860px)] lg:w-auto"
        />
      </div>

      {/* chap: ism bloki */}
      <div className="shell relative z-20 mt-8 lg:absolute lg:inset-x-0 lg:bottom-[11%] lg:mt-0">
        <div className="grid gap-10 lg:grid-cols-12">
          <div data-hero-out className="lg:col-span-4">
            <p data-hero-in className="text-lg italic text-paper/90 sm:text-xl">{hero.hello}</p>
            <h1 data-hero-in className="t-mega mt-2 text-[clamp(3rem,2rem+3.6vw,5.5rem)] text-paper">
              Avazbek <br />
              Meliqoziyev
            </h1>
            <p data-hero-in className="t-mega mt-3 text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] text-violet-3">{hero.roleLine}</p>
            <p data-hero-in className="t-small mt-3 max-w-[30ch] text-muted">{hero.short}</p>
            <a data-hero-in href="#portfolio" className="btn-primary mt-6">
              Ishlarimni ko‘rish <span aria-hidden className="btn-arrow">→</span>
            </a>
          </div>

          {/* o'ng: ko'rsatkichlar */}
          <dl data-hero-out className="grid grid-cols-3 gap-4 lg:col-span-3 lg:col-start-10 lg:grid-cols-1 lg:gap-0 lg:self-end">
            {hero.stats.map((s) => (
              <div data-hero-in key={s.label} className="border-t border-paper/15 pt-3 lg:flex lg:items-baseline lg:justify-between lg:gap-4 lg:py-3 lg:last:border-b">
                <dt className="sr-only">{s.label}</dt>
                <dd className="t-mega text-[clamp(1.75rem,1.4rem+1.2vw,2.75rem)] text-paper">{s.value}</dd>
                <dd className="t-small mt-1 text-muted lg:mt-0 lg:text-right">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* pastki detallar */}
      <div className="shell relative z-20 mt-10 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted lg:absolute lg:inset-x-0 lg:bottom-5 lg:mt-0">
        <span data-hero-out>{hero.bottomLeft}</span>
        <span data-hero-out className="hidden md:inline">{hero.coords}</span>
        <span data-hero-out>{hero.bottomRight}</span>
      </div>
    </section>
  );
}
