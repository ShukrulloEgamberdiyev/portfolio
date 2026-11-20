import { useEffect, type RefObject } from 'react';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger';

export type FxApi = { gsap: typeof GsapType; ScrollTrigger: typeof STType; isDesktop: boolean };

/**
 * GSAP + ScrollTrigger'ni faqat brauzerda, kerak bo'lganda yuklaydi (alohida chunk).
 * prefers-reduced-motion yoqilgan bo'lsa animatsiyalar umuman o'rnatilmaydi — kontent statik ko'rinadi.
 * `setup` ichida yaratilgan barcha tween/trigger'lar komponent yopilganda avtomatik tozalanadi.
 */
export function useScrollFx(ref: RefObject<HTMLElement | null>, setup: (api: FxApi) => void, deps: unknown[] = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      if (cancelled) return;
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        setup({ gsap, ScrollTrigger, isDesktop: window.matchMedia('(min-width: 1024px)').matches });
      }, el);
      // rasm/shrift yuklangach o'lchamlarni yangilash
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
