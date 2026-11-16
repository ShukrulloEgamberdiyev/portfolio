import mark from '../assets/fazo-mark.png';

/**
 * Short brand reveal on first load (≈1.1s, then it wipes away).
 * Pure CSS on purpose: the curtain lifts by itself even if JavaScript never runs, and it is
 * not rendered at all for people who ask for reduced motion (see `.loader` in index.css).
 */
export function Loader() {
  return (
    <div aria-hidden className="loader fixed inset-0 z-[100] flex items-center justify-center bg-ink">
      <div className="overflow-hidden">
        <p className="loader-word flex items-baseline gap-3 text-[2rem] font-bold uppercase tracking-[-0.04em]">
          <img src={mark} alt="" aria-hidden className="h-10 w-auto" />
          FAZO <span className="font-light text-mist">Digital</span>
        </p>
      </div>
      <span className="loader-bar absolute bottom-0 left-0 h-px bg-violet" />
    </div>
  );
}
