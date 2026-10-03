import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { portfolio, videos } from './content';

/** 3 ta asosiy ish kartochkasi + "Ish jarayonidan" videosi. Video faqat bosilganda modalda yuklanadi. */
const MAIN = [0, 1, 3];
const EXTRA = 2;

function Play({ big }: { big?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-accent text-coal shadow-xl transition-transform duration-500 group-hover:scale-110 ${
        big ? 'h-16 w-16' : 'h-11 w-11'
      }`}
    >
      <svg width={big ? 18 : 13} height={big ? 18 : 13} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
      </svg>
    </span>
  );
}

export default function VideoWork() {
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
  const extra = videos[EXTRA];

  return (
    <>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* header + extra BTS video */}
        <div className="lg:col-span-3">
          <h3 data-reveal className="text-[40px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[56px]">
            {portfolio.worksTitle}
          </h3>
          <p data-reveal className="mt-4 max-w-xs text-[15px] leading-relaxed text-paper/60">{portfolio.worksText}</p>

          <button
            type="button"
            onClick={open(EXTRA)}
            className="group mt-10 hidden w-full items-center gap-4 text-left lg:flex"
            aria-label={`${extra.title} videosini ko‘rish`}
          >
            <span className="relative aspect-[9/16] w-20 shrink-0 overflow-hidden rounded-[4px] bg-paper/10">
              <Img src={extra.poster} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-coal">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                  </svg>
                </span>
              </span>
            </span>
            <span>
              <span className="kicker block text-paper/45">{extra.category}</span>
              <span className="mt-1 block text-[16px] font-medium text-paper">{extra.title}</span>
            </span>
          </button>
        </div>

        {/* 3 work cards */}
        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-5 lg:col-span-9 lg:gap-6">
          {MAIN.map((i, k) => {
            const item = videos[i];
            const rows = [
              item.client ? { k: 'Brend', v: item.client } : null,
              item.task ? { k: 'Vazifa', v: item.task } : null,
              item.role ? { k: 'Bajarilgan ish', v: item.role } : null,
              item.result ? { k: 'Natija', v: item.result } : null,
            ].filter(Boolean) as { k: string; v: string }[];
            return (
              <li key={item.src} data-reveal style={{ ['--d' as string]: k }} className={k === 1 ? 'sm:mt-12' : ''}>
                <button type="button" onClick={open(i)} className="group block w-full text-left" aria-label={`${item.title} videosini ko‘rish`}>
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[4px] bg-paper/10 sm:aspect-[9/16]">
                    <Img src={item.poster} alt="" fill className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
                    <span className="absolute inset-0 bg-linear-to-t from-coal/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 font-mono text-[11px] text-paper/80">0{k + 1}</span>
                    <span className="absolute bottom-4 right-4"><Play big={k === 0} /></span>
                  </span>
                </button>
                <p className="kicker mt-5 text-accent">{item.category}</p>
                <h4 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.03em] text-paper">{item.title}</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/65">{item.seen}</p>
                {rows.length ? (
                  <dl className="mt-4 space-y-2 border-t border-paper/15 pt-4 text-[14px]">
                    {rows.map((r) => (
                      <div key={r.k} className="flex gap-3">
                        <dt className="w-28 shrink-0 text-paper/45">{r.k}</dt>
                        <dd className="text-paper/85">{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* mobile/tablet: extra video */}
        <button type="button" onClick={open(EXTRA)} className="group flex items-center gap-4 text-left lg:hidden" aria-label={`${extra.title} videosini ko‘rish`}>
          <span className="relative aspect-[9/16] w-16 shrink-0 overflow-hidden rounded-[4px] bg-paper/10">
            <Img src={extra.poster} alt="" fill className="object-cover" />
          </span>
          <span>
            <span className="kicker block text-paper/45">{extra.category}</span>
            <span className="mt-1 block text-[16px] font-medium text-paper">{extra.title} ▸</span>
          </span>
        </button>
      </div>

      {v ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={v.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-coal/95 p-4 backdrop-blur-md sm:p-8"
          style={{ animation: 'fade .3s ease both' }}
          onClick={close}
        >
          <div className="relative flex w-full max-w-[min(92vw,calc(78svh*9/16))] flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4 text-paper">
              <div className="min-w-0">
                <p className="kicker text-paper/55">{v.category}</p>
                <p className="truncate text-[17px] font-medium tracking-[-0.02em]">{v.title}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/25 text-xl text-paper transition-colors hover:bg-paper hover:text-coal"
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
              className="aspect-[9/16] max-h-[78svh] w-full rounded-[6px] bg-black object-contain"
            />
            <div className="mt-3 flex justify-between">
              <button type="button" onClick={() => step(-1)} className="min-h-[44px] rounded-full px-4 text-[14px] text-paper/70 hover:text-paper">
                ← Oldingi
              </button>
              <button type="button" onClick={() => step(1)} className="min-h-[44px] rounded-full px-4 text-[14px] text-paper/70 hover:text-paper">
                Keyingi →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
