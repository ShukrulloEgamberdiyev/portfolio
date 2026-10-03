
import { useEffect } from "react";

/**
 * [data-reveal] elementlarini ekranga kirganda ko'rsatadi.
 * Scroll/resize/hashchange'da getBoundingClientRect bilan tekshiradi — anchor orqali
 * sakrash, tez scroll va preview muhitlarida ham element yashirin qolib ketmaydi.
 */
export default function RevealObserver() {
  useEffect(() => {
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let raf = 0;

    const check = () => {
      raf = 0;
      const limit = window.innerHeight * 0.94;
      pending = pending.filter((el) => {
        const r = el.getBoundingClientRect();
        // ekranda yoki allaqachon tepada qolgan elementlar ko'rsatiladi
        if (r.top < limit) {
          el.classList.add("is-in");
          return false;
        }
        return true;
      });
      if (!pending.length) detach();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    const detach = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    check();
    const t = window.setTimeout(check, 400);

    return () => {
      detach();
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
