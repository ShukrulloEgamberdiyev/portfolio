
import Img from "./Img";
import { useCallback, useEffect, useRef, useState } from "react";
import { videos } from "./content";

/** Video ishlari: poster ko'rsatiladi, video faqat bosilganda modalda yuklanadi. */
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

  return (
    <>
      <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 xl:grid-cols-4 xl:items-start xl:gap-6">
        {videos.map((item, i) => (
          <li
            key={item.src}
            data-reveal
            style={{ ["--d" as string]: i }}
            className={`w-[72%] shrink-0 snap-start sm:w-auto ${i % 2 === 1 ? "xl:mt-16" : ""}`}
          >
            <button
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setActive(i);
              }}
              className="group block w-full rounded-[22px] text-left"
              aria-label={`${item.title} videosini ko‘rish`}
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-paper/5 ring-1 ring-paper/10">
                <Img
                  src={item.poster}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 72vw"
                  className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/5 to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-[11px] text-paper/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper text-ink shadow-xl transition-[transform,opacity,background-color,color] duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white [@media(hover:hover)]:scale-90 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
                    </svg>
                  </span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-paper sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/60 sm:text-[11px]">{item.category}</p>
                  <h4 className="mt-1 text-[18px] font-semibold leading-tight tracking-[-0.03em] sm:text-[22px]">{item.title}</h4>
                </div>
              </div>
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
