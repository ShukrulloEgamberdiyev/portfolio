import { useRef } from 'react';
import Img from './Img';
import { hero, about } from './content';
import { useScrollFx } from './motion';

/**
 * INTRO — qoradan keskin iliq-oq bo'limga o'tish. Hero ustiga yumaloq yuqori burchak bilan chiqib keladi.
 * Markazda ofis rasmi "linza" (aylana niqob) ichida; atrofida orbitali chiziqlar, % belgisi, koordinatalar.
 * Orqada giant so'zlar (MARKETING / SMM / TARGET / KONTENT) scroll bilan qarama-qarshi tomonlarga suriladi.
 */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useScrollFx(ref, ({ gsap }) => {
    const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 };
    gsap.utils.toArray<HTMLElement>('[data-band]').forEach((el, i) => {
      gsap.fromTo(el, { xPercent: i % 2 ? -14 : 6 }, { xPercent: i % 2 ? 6 : -14, ease: 'none', scrollTrigger: st });
    });
    gsap.fromTo('[data-lens]', { scale: 0.72, rotate: -8 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: 0.8 } });
    gsap.fromTo('[data-lens-img]', { scale: 1.35 }, { scale: 1.05, ease: 'none', scrollTrigger: st });
    gsap.to('[data-orbit]', { rotate: 120, ease: 'none', scrollTrigger: st });
  });

  return (
    <section
      ref={ref}
      id="about"
      aria-label="Men haqimda"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[32px] bg-paper py-24 text-ink sm:-mt-14 sm:rounded-t-[48px] sm:py-32 lg:py-40"
    >
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [--grid-c:rgb(11_11_16/0.05)]" />

      {/* giant so'zlar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[2vw] overflow-hidden">
        {hero.bands.map((w, i) => (
          <p
            key={w}
            data-band
            className={`t-mega whitespace-nowrap text-[clamp(4.5rem,15vw,15rem)] ${i % 2 ? 'outline-text text-ink/15' : 'text-ink/[0.06]'} ${i % 2 ? 'self-end' : ''}`}
          >
            {w} · {w} · {w}
          </p>
        ))}
      </div>

      <div className="shell relative grid items-center gap-14 lg:grid-cols-12">
        {/* linza */}
        <div className="relative mx-auto w-[min(86vw,560px)] lg:order-2 lg:col-span-6 lg:col-start-7 lg:w-full">
          <div data-orbit aria-hidden className="absolute -inset-[7%]">
            <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
              <circle cx="100" cy="100" r="98" stroke="rgb(11 11 16 / 0.25)" strokeDasharray="1.5 4" />
              <circle cx="100" cy="2" r="3" fill="#7c3aed" />
              <circle cx="198" cy="100" r="2" fill="#0b0b10" />
              <circle cx="30" cy="170" r="2" fill="#0b0b10" />
            </svg>
          </div>
          <div data-lens className="relative aspect-square overflow-hidden rounded-full bg-mist shadow-[0_40px_80px_-40px_rgb(76_29_149/0.55)] ring-1 ring-ink/10">
            <Img
              data-lens-img
              src="/avazbek/images/office.jpg"
              alt="Avazbek Meliqoziyev ofisda"
              width={640}
              height={640}
              fill
              className="object-cover object-[46%_30%]"
            />
            <div aria-hidden className="absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgb(11_11_16/0.35)]" />
          </div>
          {/* marketing belgilari */}
          <span aria-hidden className="t-mega absolute -left-2 top-[8%] text-[clamp(3rem,6vw,5.5rem)] text-accent">%</span>
          <span aria-hidden className="absolute -right-1 bottom-[14%] rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper">
            CTR ↗
          </span>
          <span aria-hidden className="absolute bottom-[2%] left-[10%] font-mono text-[11px] uppercase tracking-[0.18em] text-graphite">
            Fig. 01 — Toshkent
          </span>
        </div>

        {/* matn */}
        <div className="relative lg:order-1 lg:col-span-5">
          <p data-reveal className="t-label flex items-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {about.title}
          </p>
          <p data-reveal className="t-lead mt-6 max-w-[24ch] text-ink">{about.lead}</p>
          <p data-reveal className="t-body mt-5 max-w-[42ch] text-graphite">{about.text}</p>
        </div>
      </div>
    </section>
  );
}
