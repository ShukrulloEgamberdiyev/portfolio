import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { portfolio, videos } from './content';

/**
 * Video galereyasi: har bir kartochkada faqat poster va play tugmasi (nom aria-label'da).
 * Ustunlar: telefon 1 (≤340px, markazda) · planshet/kichik desktop 2 · keng desktop 4.
 * Video faqat bosilganda modalda yuklanadi; modal yopilganda video to'xtatiladi.
 */
function Play() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card/95 text-accent shadow-[0_4px_14px_rgb(34_50_74/0.28)] ring-1 ring-ink/5 transition-transform duration-300 group-hover:scale-105">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="translate-x-[1.5px]">
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
      </svg>
    </span>
  );
}

export default function VideoWork() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

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
    <>
      <h3 data-reveal className="t-h2">{portfolio.worksTitle}</h3>

      <ul className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:mx-auto sm:max-w-[720px] sm:grid-cols-2 sm:justify-items-stretch lg:mt-12 xl:max-w-none xl:grid-cols-4">
        {videos.map((item, i) => (
          <li key={item.src} data-reveal style={{ ['--d' as string]: i }} className="w-full max-w-[340px] sm:max-w-none">
            <button
              type="button"
              onClick={open(i)}
              className="group block w-full rounded-[var(--radius-card)]"
              aria-label={`${item.title} — videoni ko‘rish`}
            >
              <span className="media relative block aspect-[9/16] bg-mist shadow-[var(--shadow-soft)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-lift)]">
                <Img
                  src={item.poster}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <Play />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {v ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={v.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-[2px] sm:p-8"
          style={{ animation: 'fade .25s ease both' }}
          onClick={close}
        >
          <div className="relative w-full max-w-[min(92vw,calc(82svh*9/16))]" onClick={(e) => e.stopPropagation()}>
            <div className="media relative bg-black shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)]">
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
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-card text-ink shadow-[0_2px_10px_rgb(0_0_0/0.3)] transition-colors hover:bg-accent hover:text-white"
                aria-label="Yopish"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex justify-between">
              <button type="button" onClick={() => step(-1)} className="t-small min-h-[44px] rounded-full px-4 text-white/85 transition-colors hover:text-white">
                ← Oldingi
              </button>
              <button type="button" onClick={() => step(1)} className="t-small min-h-[44px] rounded-full px-4 text-white/85 transition-colors hover:text-white">
                Keyingi →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
