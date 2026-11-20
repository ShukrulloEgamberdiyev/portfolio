import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Img from './Img';
import { portfolio, videos } from './content';
import { useScrollFx } from './motion';

/**
 * VIDEO ISHLARI — qora bo'lim. 1 ta asosiy (katta) + 3 ta yordamchi video, turli o'lcham va balandlikda.
 * Hover: poster kattalashadi, qorayadi, play va nom chiqadi. Video faqat bosilganda modalda yuklanadi;
 * Escape / tashqariga bosish yopadi va videoni to'xtatadi.
 */
function Play({ big = false }: { big?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-white/95 text-accent shadow-[0_8px_30px_rgb(124_58_237/0.45)] transition-transform duration-500 group-hover:scale-110 ${big ? 'h-20 w-20' : 'h-14 w-14'}`}
    >
      <svg width={big ? 22 : 16} height={big ? 22 : 16} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="translate-x-[1.5px]">
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
      </svg>
    </span>
  );
}

/** joylashuv: asosiy video chapda katta, qolganlari o'ngda pog'onali */
const layout = [
  'col-span-2 lg:col-span-4 lg:col-start-2 lg:row-span-2',
  'lg:col-span-3 lg:col-start-7 lg:mt-24',
  'lg:col-span-3 lg:col-start-10',
  'col-span-2 mx-auto w-[min(100%,340px)] lg:col-span-3 lg:col-start-8 lg:-mt-24 lg:w-auto',
];

export default function VideoWork() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useScrollFx(ref, ({ gsap, isDesktop }) => {
    if (!isDesktop) return;
    gsap.utils.toArray<HTMLElement>('[data-vid]').forEach((el, i) => {
      gsap.fromTo(el, { y: 60 + i * 30, rotateX: 8, opacity: 0.4 }, {
        y: i % 2 ? -40 : 0, rotateX: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'center 45%', scrub: 0.8 },
      });
    });
    gsap.fromTo('[data-vid-title]', { xPercent: 4 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  });

  const stopVideo = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }
  };

  const close = useCallback(() => {
    stopVideo();
    setActive(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback((dir: 1 | -1) => {
    stopVideo();
    setActive((a) => (a === null ? a : (a + dir + videos.length) % videos.length));
  }, []);

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab' && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, video'));
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active, close, step]);

  const open = (i: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    lastTrigger.current = e.currentTarget;
    setActive(i);
  };

  const v = active !== null ? videos[active] : null;

  return (
    <section ref={ref} aria-labelledby="videos-title" className="section relative z-10 -mt-10 overflow-hidden rounded-t-[32px] bg-night text-paper sm:-mt-14 sm:rounded-t-[48px]">
      <div aria-hidden className="pointer-events-none absolute -left-[20%] top-[10%] h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle,rgb(124_58_237/0.28),transparent_65%)] blur-2xl" />
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="videos-title" data-vid-title className="t-mega text-[clamp(3.25rem,11vw,11rem)]">
            Video <span className="grad-text">ishlari</span>
          </h2>
          <p data-reveal className="t-small max-w-[30ch] text-muted lg:mb-4">{portfolio.worksText}</p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 [perspective:1200px] sm:gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-x-8">
          {videos.map((item, i) => (
            <li key={item.src} data-vid className={layout[i]}>
              <button
                type="button"
                onClick={open(i)}
                data-cursor="Play"
                className="group block w-full rounded-[var(--radius-card)] text-left"
                aria-label={`${item.title} — videoni ko‘rish`}
              >
                <span className="media relative block aspect-[9/16] bg-night-2 ring-1 ring-white/10">
                  <Img src={item.poster} alt="" fill className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
                  <span className="absolute inset-0 bg-linear-to-t from-night/85 via-night/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[0.18em] text-white/80">0{i + 1}</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Play big={i === 0} />
                  </span>
                  <span className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition-[transform,opacity] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span className="t-label block text-violet-4">{item.category}</span>
                    <span className={`t-mega mt-1 block text-white ${i === 0 ? 'text-[clamp(1.5rem,1rem+1.6vw,2.75rem)]' : 'text-[clamp(1.125rem,0.9rem+0.6vw,1.5rem)]'}`}>{item.title}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {v ? createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={v.title}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-night/85 p-4 sm:p-8"
          style={{ animation: 'fade .25s ease both' }}
          onClick={close}
        >
          <div className="relative w-full max-w-[min(92vw,calc(82svh*9/16))]" onClick={(e) => e.stopPropagation()}>
            <div className="media relative bg-black shadow-[0_24px_80px_-20px_rgb(124_58_237/0.45)] ring-1 ring-white/10">
              <video
                ref={videoRef}
                key={v.src}
                src={v.src}
                poster={v.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="block aspect-[9/16] max-h-[82svh] w-full object-contain"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_10px_rgb(0_0_0/0.3)] transition-colors hover:bg-accent hover:text-white"
                aria-label="Yopish"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button type="button" onClick={() => step(-1)} className="t-small min-h-[44px] rounded-full px-4 text-white/85 transition-colors hover:text-white">
                ← Oldingi
              </button>
              <span className="t-label text-muted">{v.title}</span>
              <button type="button" onClick={() => step(1)} className="t-small min-h-[44px] rounded-full px-4 text-white/85 transition-colors hover:text-white">
                Keyingi →
              </button>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </section>
  );
}
