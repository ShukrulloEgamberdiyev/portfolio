
import { useEffect, useState } from "react";
import { nav, site } from "./content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-ink/10 bg-paper/95 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <nav className="shell flex h-16 items-center justify-between lg:h-[72px]" aria-label="Asosiy menyu">
          <a href="#top" className="inline-flex min-h-[44px] items-center text-[17px] font-semibold tracking-[-0.03em]" onClick={() => setOpen(false)}>
            {site.shortName.replace(".", "")}
            <span className="text-accent">.</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative inline-flex min-h-[44px] items-center text-[14px] font-medium text-ink/70 transition-colors hover:text-ink"
                >
                  {n.label}
                  <span className="absolute bottom-2.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#contact" className="btn-dark hidden !min-h-[44px] !px-5 !text-[14px] sm:inline-flex">
              Bog‘lanish <span aria-hidden>↗</span>
            </a>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`absolute h-px w-[18px] bg-ink transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-px w-[18px] bg-ink transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-paper transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="shell flex h-full flex-col justify-between pb-10 pt-24">
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li
                key={n.href}
                className="transition-[transform,opacity] duration-500"
                style={{
                  transitionDelay: open ? `${80 + i * 50}ms` : "0ms",
                  transform: open ? "none" : "translateY(16px)",
                  opacity: open ? 1 : 0,
                }}
              >
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between border-b border-ink/12 py-4 text-[clamp(28px,8vw,36px)] font-semibold tracking-[-0.035em]"
                >
                  {n.label}
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" onClick={() => setOpen(false)} className="btn-dark w-full">
            Bog‘lanish <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
