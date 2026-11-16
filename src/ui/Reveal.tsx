import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Entrance motion that can never hide content.
 *
 * The prerendered HTML is always fully visible: nothing starts at opacity 0 waiting for JavaScript.
 * Only after the page has booted does an element that is still *below the fold* get tucked away, to
 * rise when it scrolls into view. So a slow connection, a script error, a blocked bundle or
 * "reduce motion" all leave a complete, readable page.
 */

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type RevealState = 'static' | 'hidden' | 'shown';

/** `settleMs` — how long the entrance takes; afterwards the element drops back to its own CSS transitions (hover etc.). */
export function useReveal<T extends HTMLElement>(settleMs = 1100, margin = '0px 0px -8% 0px') {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>('static');

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Already on screen (or above it, after a reload mid-page): leave it exactly as rendered.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState('hidden');
    let settle = 0;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setState('shown');
      settle = window.setTimeout(() => setState('static'), settleMs);
    }, { rootMargin: margin });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(settle); };
  }, [settleMs, margin]);

  return { ref, state, attr: state === 'static' ? undefined : state } as const;
}

export function Reveal({ children, delay = 0, y = 28, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'p' | 'span' }) {
  const { ref, attr } = useReveal<HTMLElement>(900 + delay * 1000 + 100);
  return (
    <Tag ref={ref as never} data-reveal={attr} className={`reveal ${className}`}
      style={{ '--reveal-d': `${delay}s`, '--reveal-y': `${y}px` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Style variables for the CSS `.rise` entrance (above-the-fold content; pure CSS, no JavaScript involved). */
export const riseStyle = (delay = 0, y = 20, duration = 0.9): CSSProperties =>
  ({ '--rise-d': `${delay}s`, '--rise-y': `${y}px`, '--rise-t': `${duration}s` } as CSSProperties);
