import { memo } from 'react';

/**
 * Architectural elevation of a residential complex, drawn in SVG (no photo weight, crisp at every size).
 * Lit windows fade in one by one — the building "comes alive" as enquiries arrive.
 * Layout is deterministic (seeded PRNG) so the prerendered markup and the hydrated markup match.
 */

type Tower = { x: number; w: number; floors: number; cols: number; balcony?: boolean; crown?: 'flat' | 'step' | 'frame' };

const GROUND = 572;
const FLOOR = 21;
const TOWERS: Tower[] = [
  { x: 64, w: 118, floors: 12, cols: 4, balcony: true, crown: 'flat' },
  { x: 204, w: 150, floors: 22, cols: 5, crown: 'frame' },
  { x: 378, w: 138, floors: 17, cols: 5, balcony: true, crown: 'step' },
  { x: 540, w: 112, floors: 20, cols: 4, crown: 'frame' },
  { x: 672, w: 96, floors: 9, cols: 3, balcony: true, crown: 'flat' },
];

function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Win = { x: number; y: number; w: number; h: number; lit: boolean; delay: number; warm: number };

function build() {
  const rnd = prng(20260926);
  const wins: Win[] = [];
  let litIndex = 0;
  TOWERS.forEach((t) => {
    const pad = 12;
    const gap = 7;
    const ww = (t.w - pad * 2 - gap * (t.cols - 1)) / t.cols;
    for (let f = 0; f < t.floors; f++) {
      const y = GROUND - 26 - (f + 1) * FLOOR + 5;
      for (let c = 0; c < t.cols; c++) {
        const lit = rnd() < 0.2;
        wins.push({
          x: t.x + pad + c * (ww + gap), y, w: ww, h: FLOOR - 9, lit,
          delay: lit ? 0.6 + (litIndex++ % 60) * 0.07 + rnd() * 0.4 : 0,
          warm: 0.55 + rnd() * 0.45,
        });
      }
    }
  });
  return wins;
}

const WINDOWS = build();

function SkylineSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 620" role="img" aria-label="Zamonaviy turar joy majmuasining arxitektura chizmasi" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="qr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050505" stopOpacity="0" />
          <stop offset="1" stopColor="#101018" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="qr-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#111116" />
          <stop offset="0.55" stopColor="#0c0c10" />
          <stop offset="1" stopColor="#08080b" />
        </linearGradient>
        <radialGradient id="qr-glow" cx="0.5" cy="1" r="0.7">
          <stop offset="0" stopColor="#7a6bff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#7a6bff" stopOpacity="0" />
        </radialGradient>
        <pattern id="qr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0v40" fill="none" stroke="#f5f5f5" strokeOpacity="0.045" strokeWidth="1" />
        </pattern>
      </defs>

      {/* blueprint field */}
      <rect width="800" height="620" fill="url(#qr-grid)" />
      <rect width="800" height="620" fill="url(#qr-sky)" />
      <ellipse cx="400" cy={GROUND} rx="420" ry="180" fill="url(#qr-glow)" />

      {/* towers */}
      {TOWERS.map((t, i) => {
        const top = GROUND - 26 - t.floors * FLOOR - 6;
        return (
          <g key={i}>
            <rect x={t.x} y={top} width={t.w} height={GROUND - top} fill="url(#qr-body)" stroke="#f5f5f5" strokeOpacity="0.16" />
            {/* podium / entrance */}
            <rect x={t.x} y={GROUND - 26} width={t.w} height={26} fill="#0a0a0d" stroke="#f5f5f5" strokeOpacity="0.1" />
            <rect x={t.x + t.w / 2 - 12} y={GROUND - 18} width={24} height={18} fill="#e8b86a" fillOpacity="0.16" />
            {/* floor slabs */}
            {Array.from({ length: t.floors }, (_, f) => (
              <line key={f} x1={t.balcony ? t.x - 4 : t.x} x2={t.balcony ? t.x + t.w + 4 : t.x + t.w}
                y1={GROUND - 26 - (f + 1) * FLOOR + 1} y2={GROUND - 26 - (f + 1) * FLOOR + 1}
                stroke="#f5f5f5" strokeOpacity={t.balcony ? 0.14 : 0.06} />
            ))}
            {/* crown */}
            {t.crown === 'frame' && <rect x={t.x + 10} y={top - 14} width={t.w - 20} height={14} fill="none" stroke="#f5f5f5" strokeOpacity="0.14" />}
            {t.crown === 'step' && <rect x={t.x + t.w * 0.3} y={top - 18} width={t.w * 0.4} height={18} fill="#0c0c10" stroke="#f5f5f5" strokeOpacity="0.14" />}
          </g>
        );
      })}

      {/* windows */}
      {WINDOWS.map((w, i) => (
        w.lit
          ? <rect key={i} className="qr-lamp" x={w.x} y={w.y} width={w.w} height={w.h} fill="#e8b86a" style={{ ['--qr-o' as string]: w.warm.toFixed(2), animationDelay: `${w.delay.toFixed(2)}s` }} />
          : <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill="#f5f5f5" fillOpacity="0.035" />
      ))}

      {/* ground + dimension line */}
      <line x1="0" x2="800" y1={GROUND} y2={GROUND} stroke="#f5f5f5" strokeOpacity="0.25" />
      <line className="qr-draw" x1="24" x2="776" y1={GROUND + 22} y2={GROUND + 22} stroke="#7a6bff" strokeOpacity="0.7" strokeWidth="1" pathLength={1} />
      {[24, 776].map((x) => <line key={x} x1={x} x2={x} y1={GROUND + 16} y2={GROUND + 28} stroke="#7a6bff" strokeOpacity="0.7" />)}
      {/* trees / landscaping */}
      {[40, 190, 364, 528, 660, 784].map((x, i) => (
        <g key={x} opacity="0.5">
          <line x1={x} x2={x} y1={GROUND} y2={GROUND - 10 - (i % 2) * 4} stroke="#f5f5f5" strokeOpacity="0.3" />
          <circle cx={x} cy={GROUND - 16 - (i % 2) * 4} r={8 + (i % 3)} fill="#0f0f13" stroke="#f5f5f5" strokeOpacity="0.18" />
        </g>
      ))}
    </svg>
  );
}

export const Skyline = memo(SkylineSvg);
