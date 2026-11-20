import { useRef } from 'react';
import { brands, brandsCopy, trust } from './content';
import { useScrollFx } from './motion';

/**
 * 19+ BRENDLAR — qora bo'lim. Ulkan gradient "19+" va turli o'lchamdagi logotip devori.
 * Sichqonchali qurilmalarda logotiplar kulrang, hover'da o'z rangiga qaytadi; sensorli ekranda doim rangli.
 */
const big = new Set([0, 7]); // 2×2 kataklar: 16 kichik + 2 katta = 24 katak (6/4/3 ustunga teng bo'linadi)

export default function Brands() {
  const ref = useRef<HTMLElement>(null);

  useScrollFx(ref, ({ gsap }) => {
    gsap.fromTo('[data-brand-num]', { yPercent: 20, scale: 0.9 }, { yPercent: -10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: 0.8 } });
    gsap.from('[data-brand]', {
      y: 40, opacity: 0, rotateX: -20, stagger: { each: 0.04, from: 'random' }, ease: 'power2.out', duration: 0.8,
      scrollTrigger: { trigger: '[data-brand-grid]', start: 'top 85%' },
    });
  });

  return (
    <section ref={ref} id="brands" aria-labelledby="brands-title" className="section relative z-10 -mt-10 overflow-hidden rounded-t-[32px] bg-night text-paper sm:-mt-14 sm:rounded-t-[48px]">
      <div aria-hidden className="pointer-events-none absolute right-[-10%] top-0 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgb(124_58_237/0.3),transparent_65%)] blur-2xl" />
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0" />

      <div className="shell relative">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-brand-num aria-hidden className="t-mega grad-text text-[clamp(7rem,26vw,22rem)] leading-[0.8]">
              {trust.value}
            </p>
          </div>
          <div className="lg:col-span-5 lg:pb-6">
            <p data-reveal className="t-label text-violet-4">{trust.label}</p>
            <h2 id="brands-title" data-reveal className="t-mega mt-3 text-[clamp(2.25rem,1.6rem+3vw,4.5rem)]">
              <span className="sr-only">{trust.value} </span>
              {brandsCopy.title}
            </h2>
            <p data-reveal className="t-body mt-4 max-w-[40ch] text-muted">{brandsCopy.text}</p>
          </div>
        </div>

        <ul data-brand-grid className="mt-14 grid grid-flow-dense grid-cols-3 gap-2.5 [perspective:1000px] sm:grid-cols-4 sm:gap-3 lg:mt-20 lg:grid-cols-6 lg:gap-4">
          {brands.map((b, i) => (
            <li
              key={b.logo}
              data-brand
              className={`group relative flex aspect-square items-center justify-center overflow-hidden rounded-[14px] bg-paper sm:rounded-[18px] ${big.has(i) ? 'col-span-2 row-span-2' : ''}`}
            >
              <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgb(168_85_247/0.22),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex h-full w-full items-center justify-center" style={{ transform: `scale(${b.scale})` }}>
              <img
                src={b.logo}
                alt={b.name ?? 'Brand logo'}
                loading="lazy"
                decoding="async"
                className={`relative object-contain transition-[filter,transform] duration-500 group-hover:scale-[1.08] [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0 ${big.has(i) ? 'max-h-[56%] max-w-[64%]' : 'max-h-[60%] max-w-[70%]'}`}
              />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
