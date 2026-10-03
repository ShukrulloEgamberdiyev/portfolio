import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { portfolio, videos } from './content';

/** 3 ta asosiy ish kartochkasi + "Ish jarayonidan" videosi. Video faqat bosilganda modalda yuklanadi. */
const MAIN = [0, 1, 3];
const EXTRA = 2;

function Play({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-12 w-12';
  const icon = size === 'sm' ? 10 : 14;
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-accent text-coal ring-1 ring-coal/10 transition-transform duration-300 group-hover:scale-105 ${box}`}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="translate-x-[1px]">
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
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* sarlavha + qo‘shimcha video */}
        <div className="lg:col-span-3">
          <h3 data-reveal className="t-h2">{portfolio.worksTitle}</h3>
          <p data-reveal className="t-small mt-4 max-w-[34ch] text-paper/65">{portfolio.worksText}</p>

          <button
            type="button"
            onClick={open(EXTRA)}
            className="group mt-8 flex w-full max-w-[320px] items-center gap-4 rounded-[6px] border border-paper/15 p-2.5 pr-4 text-left transition-colors duration-300 hover:border-accent/60 lg:mt-12"
            aria-label={`${extra.title} videosini ko‘rish`}
          >
            <span className="media relative aspect-[9/16] w-14 shrink-0 bg-paper/10">
              <Img src={extra.poster} alt="" fill className="object-cover object-[50%_35%]" />
              <span className="absolute inset-0 flex items-center justify-center"><Play size="sm" /></span>
            </span>
            <span className="min-w-0">
              <span className="t-label block text-accent">{extra.category}</span>
              <span className="mt-1.5 block text-[15px] font-medium leading-snug text-paper">{extra.title}</span>
            </span>
          </button>
        </div>

        {/* 3 ta ish kartochkasi — mobil: surib ko‘riladigan qator; sm+: 3 ustun */}
        <ol className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:col-span-8 lg:col-start-5 lg:gap-6">
          {MAIN.map((i, k) => {
            const item = videos[i];
            const rows = [
              item.client ? { k: 'Brend', v: item.client } : null,
              item.task ? { k: 'Vazifa', v: item.task } : null,
              item.role ? { k: 'Bajarilgan ish', v: item.role } : null,
              item.result ? { k: 'Natija', v: item.result } : null,
            ].filter(Boolean) as { k: string; v: string }[];
            return (
              <li
                key={item.src}
                data-reveal
                style={{ ['--d' as string]: k }}
                className={`w-[74%] shrink-0 snap-start min-[480px]:w-[46%] sm:w-auto ${k === 1 ? 'sm:mt-14' : ''}`}
              >
                <button type="button" onClick={open(i)} className="group block w-full text-left" aria-label={`${item.title} videosini ko‘rish`}>
                  <span className="media relative block aspect-[9/16] bg-paper/10">
                    <Img src={item.poster} alt="" fill className="object-cover object-[50%_35%] transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                    <span className="absolute left-3 top-3 rounded-full bg-coal/70 px-2.5 py-1 font-mono text-[11px] leading-none text-paper/90">0{k + 1}</span>
                    <span className="absolute bottom-3 right-3"><Play /></span>
                  </span>
                </button>
                <div className="mt-5 border-t border-paper/15 pt-4">
                  <p className="t-label text-accent">{item.category}</p>
                  <h4 className="t-h4 mt-2 text-paper">{item.title}</h4>
                  <p className="t-small mt-2 text-paper/65">{item.seen}</p>
                  {rows.length ? (
                    <dl className="t-small mt-4 space-y-2 border-t border-paper/15 pt-4">
                      {rows.map((r) => (
                        <div key={r.k} className="flex gap-3">
                          <dt className="w-28 shrink-0 text-paper/50">{r.k}</dt>
                          <dd className="text-paper/85">{r.v}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {v ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={v.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-coal/[0.97] p-4 sm:p-8"
          style={{ animation: 'fade .3s ease both' }}
          onClick={close}
        >
          <div className="relative flex w-full max-w-[min(92vw,calc(76svh*9/16))] flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4 text-paper">
              <div className="min-w-0">
                <p className="t-label text-accent">{v.category}</p>
                <p className="t-h4 mt-1 truncate">{v.title}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:border-accent hover:bg-accent hover:text-coal"
                aria-label="Yopish"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
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
              className="aspect-[9/16] max-h-[76svh] w-full rounded-[6px] border border-paper/10 bg-black object-contain"
            />
            <div className="mt-3 flex justify-between border-t border-paper/10 pt-2">
              <button type="button" onClick={() => step(-1)} className="t-small min-h-[44px] rounded-full px-3 text-paper/70 transition-colors hover:text-accent">
                ← Oldingi
              </button>
              <button type="button" onClick={() => step(1)} className="t-small min-h-[44px] rounded-full px-3 text-paper/70 transition-colors hover:text-accent">
                Keyingi →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
