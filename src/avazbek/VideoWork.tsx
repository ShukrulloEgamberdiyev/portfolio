import type React from 'react';

import Img from "./Img";
import { useCallback, useEffect, useRef, useState } from "react";
import { videos } from "./content";

/** Video ishlari: poster ko'rsatiladi, video faqat bosilganda modalda yuklanadi. */
export default function VideoWork({ header }: { header?: React.ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((a) => (a === null ? a : (a + dir + videos.length) % videos.length)),
    []
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, video"));
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
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  const v = active !== null ? videos[active] : null;

  const open = (i: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    lastTrigger.current = e.currentTarget;
    setActive(i);
  };
  const Play = ({ big }: { big?: boolean }) => (
    <span
      className={`flex items-center justify-center rounded-full bg-paper text-ink shadow-xl transition-[transform,background-color,color] duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-ink ${
        big ? 'h-20 w-20' : 'h-12 w-12'
      }`}
    >
      <svg width={big ? 22 : 15} height={big ? 22 : 15} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
      </svg>
    </span>
  );
  const [featured, ...rest] = videos;

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
        {/* featured */}
        <div data-reveal="image" className="lg:col-span-5">
          <button type="button" onClick={open(0)} className="group block w-full text-left" aria-label={`${featured.title} videosini ko‘rish`}>
            <div className="grain grain-light relative aspect-[4/5] overflow-hidden rounded-[6px] bg-coal lg:aspect-[9/16]">
              <Img src={featured.poster} alt="" fill className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-ink/10" />
              <span className="absolute left-5 top-5 font-mono text-[11px] text-paper/70">01 — Featured</span>
              <span className="absolute inset-0 flex items-center justify-center"><Play big /></span>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="kicker text-paper/60">{featured.category}</p>
                <h4 className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.04em] text-paper sm:text-[40px]">{featured.title}</h4>
              </div>
            </div>
          </button>
        </div>

        {/* supporting */}
        <div className="lg:col-span-7">
          {header}
          <ul className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:mt-14">
            {rest.map((item, k) => {
              const i = k + 1;
              return (
                <li key={item.src} data-reveal style={{ ['--d' as string]: k }} className="w-[58%] shrink-0 snap-start sm:w-auto">
                  <button type="button" onClick={open(i)} className="group block w-full text-left" aria-label={`${item.title} videosini ko‘rish`}>
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[6px] bg-coal">
                      <Img src={item.poster} alt="" fill className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" />
                      <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-transparent to-transparent" />
                      <span className="absolute left-3 top-3 font-mono text-[11px] text-paper/70">{String(i + 1).padStart(2, '0')}</span>
                      <span className="absolute bottom-3 right-3"><Play /></span>
                    </div>
                    <p className="mt-3 text-[16px] font-medium tracking-[-0.02em] text-paper">{item.title}</p>
                    <p className="kicker mt-1 text-paper/45">{item.category}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {v ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={v.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
          style={{ animation: "fade .35s ease both" }}
          onClick={close}
        >
          <div className="relative flex w-full max-w-[min(92vw,calc(80svh*9/16))] flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between text-paper">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/55">{v.category}</p>
                <p className="text-[17px] font-medium tracking-[-0.02em]">{v.title}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-xl text-paper transition-colors hover:bg-paper hover:text-ink"
                aria-label="Yopish"
              >
                ×
              </button>
            </div>
            <video
              key={v.src}
              src={v.src}
              poster={v.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="aspect-[9/16] w-full rounded-2xl bg-black object-contain"
            />
            <div className="mt-3 flex justify-between">
              <button type="button" onClick={() => step(-1)} className="rounded-full px-4 py-2 text-[14px] text-paper/70 hover:text-paper">
                ← Oldingi
              </button>
              <button type="button" onClick={() => step(1)} className="rounded-full px-4 py-2 text-[14px] text-paper/70 hover:text-paper">
                Keyingi →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
