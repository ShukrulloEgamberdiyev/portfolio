// 077agency logotipi: Instagram avatari (@077agency) — qora doira ichida oq "077".
import logo077 from './assets/logo-077.png';

// The 077 signature: drawn glyphs, not a font. The "0" is a loop with a
// signal travelling around it — the system that keeps bringing clients back.
interface Props {
  className?: string;
  animated?: boolean;
  strokeWidth?: number;
}

export function Mark077({ className, animated = true, strokeWidth = 2 }: Props) {
  const zero = 'M90 20 a70 70 0 0 1 70 70 v120 a70 70 0 0 1 -140 0 v-120 a70 70 0 0 1 70 -70 z';
  return (
    <svg viewBox="0 0 560 300" className={className} aria-hidden="true" fill="none">
      <path
        d={zero}
        stroke="#F5F5F7"
        strokeOpacity="0.85"
        strokeWidth={strokeWidth}
        className={animated ? 'mark-stroke' : undefined}
      />
      <path
        d="M205 20 H355 L262 280"
        stroke="#F5F5F7"
        strokeOpacity="0.55"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        className={animated ? 'mark-stroke d2' : undefined}
      />
      <path
        d="M390 20 H540 L447 280"
        stroke="#E3212D"
        strokeWidth={strokeWidth + 0.5}
        strokeLinejoin="round"
        className={animated ? 'mark-stroke d3' : undefined}
      />
      {animated && (
        <g className="orbit">
          <circle r="14" fill="#E3212D" opacity="0.18">
            <animateMotion dur="7s" repeatCount="indefinite" path={zero} />
          </circle>
          <circle r="4.5" fill="#FF8A90">
            <animateMotion dur="7s" repeatCount="indefinite" path={zero} />
          </circle>
        </g>
      )}
    </svg>
  );
}

export function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="077agency — bosh sahifa">
      <img
        src={logo077}
        alt=""
        width={256}
        height={256}
        decoding="async"
        draggable={false}
        className="block aspect-square h-11 w-11 shrink-0 rounded-full object-contain sm:h-12 sm:w-12"
      />
      <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted transition group-hover:text-fg">
        Agency
      </span>
    </a>
  );
}
