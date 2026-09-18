import mark from '../assets/fazo-mark.png';

export function Logo({ className = '', markClass = 'h-6' }: { className?: string; markClass?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-sans text-[15px] font-bold uppercase tracking-[-0.02em] ${className}`}>
      <img src={mark} alt="" aria-hidden className={`${markClass} w-auto`} />
      <span className="flex items-baseline gap-[0.35em]">
        FAZO<span className="font-light tracking-[0.02em] text-mist">Digital</span>
      </span>
    </span>
  );
}
