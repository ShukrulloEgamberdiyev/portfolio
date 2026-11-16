import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to `to` when scrolled into view.
 *
 * The prerendered HTML and the first client render always show the final number, so the figure is
 * correct without JavaScript, with "reduce motion", and hydration never mismatches. Only a counter that
 * is still below the fold after the page has booted is reset to 0 and counted up when it appears.
 */
export function CountUp({ to, suffix = '', duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [value, setValue] = useState(to);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave the real number
    setValue(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => { controls.stop(); setValue(to); };
  }, [armed, inView, to, duration]);

  return (
    <span ref={ref} className="tabular" aria-label={`${to}${suffix}`}>
      <span aria-hidden>{value}{suffix}</span>
    </span>
  );
}
