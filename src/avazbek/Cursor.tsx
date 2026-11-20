import { useEffect, useRef, useState } from 'react';

/**
 * Faqat sichqonchali desktop uchun yengil kursor: oddiy holatda kichik binafsha nuqta,
 * [data-cursor] ustida "PLAY"/"VIEW" yozuvli doiraga aylanadi. Tizim kursori yashirilmaydi — qulaylik saqlanadi.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setOn(true);
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(t ? t.dataset.cursor ?? null : null);
    };
    const tick = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!on) return null;
  return (
    <div ref={ref} aria-hidden className="cursor-dot">
      <span
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-[width,height,background-color] duration-300 ${
          label ? 'h-20 w-20 bg-violet-2/90' : 'h-2.5 w-2.5 bg-violet-3'
        }`}
      >
        {label ? label : null}
      </span>
    </div>
  );
}
