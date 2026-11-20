import { useRef } from 'react';
import Img from './Img';
import { approach, network } from './content';
import { useScrollFx } from './motion';

/**
 * YONDASHUV + PROFESSIONAL MUHIT — qora bo'lim.
 * Biznes → Auditoriya → Offer → Kontent → Reklama → Natija: chiziq scroll bilan chiziladi, bosqichlar ketma-ket yonadi.
 * So'ng to'liq kenglikdagi kinematografik jamoaviy rasm minimal yozuv bilan.
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);

  useScrollFx(ref, ({ gsap }) => {
    const st = { trigger: '[data-flow]', start: 'top 75%', end: 'bottom 45%', scrub: 0.6 };
    gsap.fromTo('[data-flow-line]', { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: st });
    gsap.fromTo('[data-flow-step]', { opacity: 0.18 }, { opacity: 1, stagger: 0.5, ease: 'none', scrollTrigger: st });
    gsap.fromTo('[data-corp-img]', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-corp]', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } });
    gsap.fromTo('[data-corp]', { clipPath: 'inset(8% 6% 8% 6% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '[data-corp]', start: 'top bottom', end: 'center center', scrub: 0.8 } });
  });

  return (
    <section ref={ref} aria-labelledby="approach-title" className="relative z-10 -mt-10 overflow-hidden rounded-t-[32px] bg-night pt-[clamp(5rem,3.4rem+6vw,9rem)] text-paper sm:-mt-14 sm:rounded-t-[48px]">
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" />

      <div className="shell relative">
        <p data-reveal className="t-label flex items-center gap-2 text-violet-4">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-3" /> Biznes → Natija
        </p>
        <h2 id="approach-title" data-reveal className="t-mega mt-5 text-[clamp(3rem,9vw,9rem)]">
          Ishlash <span className="grad-text">yondashuvim</span>
        </h2>

        <ol data-flow className="relative mt-14 grid gap-0 lg:mt-20 lg:grid-cols-6">
          {/* chiziq: desktopda gorizontal, mobilda vertikal */}
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-white/12 lg:block" />
          <span aria-hidden data-flow-line className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-linear-to-r from-violet-1 via-violet-3 to-violet-4 lg:block" />
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-white/12 lg:hidden" />
          <span aria-hidden data-flow-line className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-linear-to-b from-violet-1 via-violet-3 to-violet-4 lg:hidden" />
          {approach.steps.map((s, i) => {
            const last = i === approach.steps.length - 1;
            return (
              <li key={s} data-flow-step className="relative flex items-baseline gap-5 py-4 pl-8 lg:block lg:py-0 lg:pl-0 lg:pr-4">
                <span aria-hidden className={`absolute left-0 top-[1.55rem] h-[15px] w-[15px] rounded-full border-2 lg:static lg:block ${last ? 'border-violet-4 bg-violet-3 shadow-[0_0_20px_rgb(168_85_247/0.8)]' : 'border-violet-4 bg-night'}`} />
                <span className="font-mono text-[11px] tracking-[0.16em] text-muted lg:mt-6 lg:block">{String(i + 1).padStart(2, '0')}</span>
                <span className={`t-mega block text-[clamp(2rem,1.4rem+1.8vw,3.25rem)] lg:mt-2 ${last ? 'grad-text' : 'text-paper'}`}>{s}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* professional muhit */}
      <figure data-corp className="relative mt-24 h-[78svh] min-h-[420px] overflow-hidden bg-night-2 lg:mt-36 lg:h-[100svh]">
        <Img
          data-corp-img
          src="/avazbek/images/corporate.jpg"
          srcSet="/avazbek/images/corporate-960.jpg 960w, /avazbek/images/corporate.jpg 1920w"
          sizes="100vw"
          width={1920}
          height={1440}
          alt="Avazbek Meliqoziyev hamkasblar va jamoa bilan"
          fill
          className="object-cover object-[50%_45%]"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night via-night/30 to-night/10" />
        <div aria-hidden className="absolute inset-x-5 inset-y-6 crop-marks sm:inset-x-8 lg:inset-x-12 lg:inset-y-10" />
        <figcaption className="shell absolute inset-x-0 bottom-0 pb-10 lg:pb-16">
          <span className="t-mega block text-[clamp(2.75rem,8vw,8rem)] text-paper">{network.title}</span>
          <span className="t-body mt-4 block max-w-[52ch] text-paper/80">{network.text}</span>
        </figcaption>
      </figure>
    </section>
  );
}
