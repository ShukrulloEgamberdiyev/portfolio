import { useRef } from 'react';
import Img from './Img';
import { brands, portfolio, videos } from './content';
import { useScrollFx } from './motion';

/**
 * LOYIHALAR OLAMI — markazdagi portret atrofida aylanib suzuvchi 3D kartochkalar (real posterlar, logotiplar, fotolar).
 * Kartochkalar elliptik orbitada: oldinga kelganda kattalashib portret oldidan, orqaga ketganda kichrayib uning ortidan o'tadi.
 * Desktopda bo'lim scroll paytida "pin" bo'ladi va orbita scroll bilan aylanadi; mobilda pin yo'q, orbita kichikroq.
 */
type Card =
  | { kind: 'video'; src: string }
  | { kind: 'logo'; src: string; name: string | null; scale: number }
  | { kind: 'photo'; src: string; pos: string };

const cards: Card[] = [
  { kind: 'video', src: videos[0].poster },
  { kind: 'logo', src: brands[7].logo, name: brands[7].name, scale: brands[7].scale },
  { kind: 'photo', src: '/avazbek/images/corporate-960.jpg', pos: '50% 40%' },
  { kind: 'logo', src: brands[0].logo, name: brands[0].name, scale: brands[0].scale },
  { kind: 'video', src: videos[1].poster },
  { kind: 'logo', src: brands[16].logo, name: brands[16].name, scale: brands[16].scale },
  { kind: 'video', src: videos[2].poster },
  { kind: 'logo', src: brands[13].logo, name: brands[13].name, scale: brands[13].scale },
  { kind: 'photo', src: '/avazbek/images/office.jpg', pos: '50% 30%' },
  { kind: 'logo', src: brands[5].logo, name: brands[5].name, scale: brands[5].scale },
  { kind: 'video', src: videos[3].poster },
  { kind: 'logo', src: brands[11].logo, name: brands[11].name, scale: brands[11].scale },
];

/** har bir kartochkaning vertikal joyi (sahna balandligiga nisbatan, %) — ritm uchun turlicha */
const lift = [-18, 10, -30, 22, -6, -26, 16, -14, 26, -22, 4, 18];
const N = cards.length;

/** orbitadagi holat: p — 0..1 aylanish, w — sahna eni (px) */
function place(i: number, turn: number, w: number) {
  const a = ((i / N) * 360 + 15 + turn) * (Math.PI / 180);
  const rx = Math.min(w * 0.44, 640);
  const rz = Math.min(w * 0.26, 360);
  const x = Math.sin(a) * rx;
  const z = Math.cos(a) * rz;
  const depth = (z + rz) / (2 * rz); // 0 orqa … 1 old
  return {
    transform: `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${lift[i] * 0.01 * Math.min(w, 900) * 0.5}px, ${z.toFixed(1)}px) rotateY(${(Math.sin(a) * -22).toFixed(1)}deg)`,
    zIndex: z > 0 ? 30 + Math.round(depth * 20) : Math.round(depth * 10),
    opacity: (0.35 + depth * 0.65).toFixed(2),
    filter: depth < 0.35 ? `blur(${((0.35 - depth) * 6).toFixed(1)}px)` : 'none',
  };
}

function CardFace({ c }: { c: Card }) {
  if (c.kind === 'video') {
    return (
      <span className="relative block aspect-[9/16] w-[clamp(96px,13vw,190px)] overflow-hidden rounded-[14px] bg-night shadow-[0_30px_60px_-24px_rgb(11_11_16/0.55)] ring-1 ring-ink/10">
        <Img src={c.src} alt="" fill className="object-cover" />
        <span className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-accent">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="translate-x-px"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" /></svg>
        </span>
      </span>
    );
  }
  if (c.kind === 'logo') {
    return (
      <span className="flex aspect-square w-[clamp(84px,10vw,150px)] items-center justify-center rounded-[14px] bg-card p-[16%] shadow-[0_24px_50px_-24px_rgb(11_11_16/0.4)] ring-1 ring-ink/10">
        <img src={c.src} alt="" loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" style={{ transform: `scale(${c.scale})` }} />
      </span>
    );
  }
  return (
    <span className="relative block aspect-[4/5] w-[clamp(96px,12vw,180px)] overflow-hidden rounded-[14px] bg-mist shadow-[0_30px_60px_-24px_rgb(11_11_16/0.5)] ring-1 ring-ink/10">
      <Img src={c.src} alt="" fill className="object-cover" style={{ objectPosition: c.pos }} />
    </span>
  );
}

export default function ProjectWorld() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useScrollFx(ref, ({ gsap, isDesktop }) => {
    const stage = stageRef.current;
    if (!stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>('[data-orbit-card]'));
    const state = { turn: 0 };
    const render = () => {
      const w = stage.clientWidth;
      els.forEach((el, i) => Object.assign(el.style, place(i, state.turn, w)));
    };
    render();
    gsap.to(state, {
      turn: -300,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: isDesktop
        ? { trigger: ref.current, start: 'top top', end: '+=170%', pin: true, scrub: 0.9, onRefresh: render }
        : { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.9, onRefresh: render },
    });
    gsap.fromTo('[data-world-title]', { scale: 0.86, opacity: 0.4 }, {
      scale: 1.06, opacity: 1, ease: 'none',
      scrollTrigger: isDesktop
        ? { trigger: ref.current, start: 'top top', end: '+=170%', scrub: 0.9 }
        : { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
    });
    gsap.from('[data-world-person]', { yPercent: 12, opacity: 0, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'top 20%', scrub: 0.8 } });
  });

  // SSR va JS-siz holat uchun boshlang'ich joylashuv (1200px sahna taxmini)
  const initial = cards.map((_, i) => place(i, 0, 1200));

  return (
    <section
      ref={ref}
      id="portfolio"
      aria-labelledby="world-title"
      className="relative overflow-hidden bg-paper text-ink lg:h-[100svh]"
    >
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [--grid-c:rgb(11_11_16/0.05)] [mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_80%)]" />

      <div className="shell relative z-[60] flex items-start justify-between pt-20 lg:pt-24">
        <p className="t-label flex items-center gap-2 text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {portfolio.kicker}
        </p>
        <p className="t-label hidden text-graphite sm:block">( {String(N).padStart(2, '0')} )</p>
      </div>

      {/* sarlavha — orbitaning ortida */}
      <div className="pointer-events-none relative z-[20] mt-6 text-center lg:absolute lg:inset-x-0 lg:top-[24%] lg:mt-0">
        <h2 id="world-title" data-world-title className="t-mega text-[clamp(3.5rem,13vw,13rem)] text-ink">
          {portfolio.title}
        </h2>
        <p className="t-body mx-auto mt-4 max-w-[36ch] px-5 text-graphite">{portfolio.worldText}</p>
      </div>

      {/* sahna */}
      <div
        ref={stageRef}
        aria-hidden
        className="relative mx-auto h-[min(118vw,560px)] w-full [perspective:1700px] lg:absolute lg:inset-0 lg:h-auto"
      >
        {cards.map((c, i) => (
          <span key={i} data-orbit-card className="absolute left-1/2 top-[58%] block will-change-transform" style={initial[i]}>
            <CardFace c={c} />
          </span>
        ))}

        {/* markazdagi portret */}
        <div data-world-person className="absolute bottom-0 left-1/2 z-[25] w-[min(52vw,300px)] -translate-x-1/2 lg:w-auto">
          <img
            src="/avazbek/images/portrait-cutout.webp"
            alt=""
            width={626}
            height={1073}
            loading="lazy"
            decoding="async"
            className="mx-auto block h-auto w-full lg:h-[min(62svh,620px)] lg:w-auto"
          />
        </div>
      </div>

      <p aria-hidden className="shell relative z-[60] flex justify-between pb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-graphite lg:absolute lg:inset-x-0 lg:bottom-0">
        <span>Brendlar · Video · Kreativ</span>
        <span className="hidden sm:inline">Scroll ↓</span>
      </p>
    </section>
  );
}
