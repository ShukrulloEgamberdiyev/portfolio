import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  let raf = 0;
  const loop = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); lenis?.destroy(); lenis = null; };
}

/** Scroll to a section id, respecting the sticky header. Works with or without Lenis. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === 'top' ? 0 : -72;
  if (lenis) lenis.scrollTo(el, { offset });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
}

export function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  scrollToId(id);
  history.replaceState(null, '', `#${id}`);
}

/**
 * Link props for pages that live outside the homepage (case studies, insights, privacy).
 * In the single-file preview build those routes don't exist, so clicks are neutralised.
 */
export function pageLink(path: string) {
  const preview = import.meta.env.MODE === 'singlefile';
  return {
    href: path,
    ...(preview ? { onClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => e.preventDefault() } : {}),
  };
}
