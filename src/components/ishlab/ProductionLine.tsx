import { memo, type ReactNode } from 'react';

/**
 * Hero visual for /ishlab-chiqarish: a production hall drawn as a technical line drawing (SVG, no photo weight).
 * Raw material → CNC cell → conveyor carrying different finished goods (furniture, door, mattress, textile, metal)
 * → a violet signal line rising out of the line: the demand/lead layer FAZO builds on top of production.
 * Pure CSS animation (belt, rollers, cutting head) — identical markup on the server and the client.
 */

const S = { fill: '#0e0e12', stroke: '#f5f5f5', strokeOpacity: 0.34, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' as const };
const T = { fill: 'none', stroke: '#f5f5f5', strokeOpacity: 0.22, strokeWidth: 1, vectorEffect: 'non-scaling-stroke' as const };

/* Finished goods, each drawn standing on y = 0 and extending upwards. */
const GOODS: { w: number; el: ReactNode }[] = [
  { w: 96, el: (<g>{/* bed */}
    <rect x="0" y="-64" width="9" height="64" {...S} />
    <rect x="9" y="-26" width="86" height="14" {...S} />
    <rect x="11" y="-40" width="82" height="14" rx="4" {...S} />
    <path d="M22 -40v14M40 -40v14M58 -40v14M76 -40v14" {...T} />
    <path d="M13 -12v12M91 -12v12" {...T} strokeOpacity={0.4} />
  </g>) },
  { w: 58, el: (<g>{/* wardrobe */}
    <rect x="0" y="-86" width="58" height="82" {...S} />
    <path d="M29 -86v82M0 -4h58" {...T} />
    <path d="M24 -50v10M34 -50v10" stroke="#f5f5f5" strokeOpacity="0.6" />
    <path d="M4 -4v4M54 -4v4" {...T} strokeOpacity={0.4} />
  </g>) },
  { w: 44, el: (<g>{/* door */}
    <rect x="0" y="-90" width="44" height="90" {...S} />
    <rect x="7" y="-82" width="30" height="34" {...T} />
    <rect x="7" y="-42" width="30" height="34" {...T} />
    <circle cx="36" cy="-46" r="2" fill="#ff9447" fillOpacity="0.9" />
  </g>) },
  { w: 92, el: (<g>{/* mattress */}
    <rect x="0" y="-24" width="92" height="24" rx="6" {...S} />
    <path d="M6 -12h80" {...T} />
    <path d="M18 -24v24M36 -24v24M56 -24v24M74 -24v24" {...T} strokeDasharray="2 3" />
  </g>) },
  { w: 76, el: (<g>{/* kitchen module */}
    <rect x="-2" y="-50" width="80" height="6" {...S} />
    <rect x="0" y="-44" width="76" height="44" {...S} />
    <path d="M38 -44v44M0 -30h38M0 -15h38" {...T} />
    <path d="M14 -37h10M14 -23h10M14 -8h10M60 -26v8" stroke="#f5f5f5" strokeOpacity="0.55" />
  </g>) },
  { w: 70, el: (<g>{/* textile roll */}
    <rect x="10" y="-36" width="50" height="36" {...S} />
    <ellipse cx="10" cy="-18" rx="10" ry="18" {...S} />
    <ellipse cx="60" cy="-18" rx="10" ry="18" {...S} />
    <ellipse cx="60" cy="-18" rx="3" ry="6" {...T} />
    <path d="M20 -30h36M20 -6h36" {...T} strokeDasharray="1 4" />
  </g>) },
  { w: 64, el: (<g>{/* metal profiles */}
    {[[14, -12], [34, -12], [54, -12], [24, -32], [44, -32]].map(([cx, cy]) => (
      <g key={`${cx}${cy}`}><circle cx={cx} cy={cy} r="10" {...S} /><circle cx={cx} cy={cy} r="5" {...T} /></g>
    ))}
  </g>) },
  { w: 60, el: (<g>{/* palletised order */}
    <rect x="0" y="-6" width="60" height="6" {...S} />
    <rect x="2" y="-36" width="28" height="30" {...S} />
    <rect x="30" y="-36" width="28" height="30" {...S} />
    <rect x="12" y="-62" width="36" height="26" {...S} />
    <path d="M16 -36v30M44 -36v30M30 -62v26" {...T} />
  </g>) },
];

const GAP = 46;
const CYCLE = GOODS.reduce((s, g) => s + g.w + GAP, 0);
let acc = 0;
const PLACED = GOODS.map((g) => { const x = acc; acc += g.w + GAP; return { ...g, x }; });

const FLOOR = 560;
const BELT_Y = 470;
const BELT_X0 = 330;
const BELT_X1 = 790;

function ProductionLineSvg({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 620" role="img" aria-label="Ishlab chiqarish sexi: xomashyo, stanok va tayyor mahsulotlar konveyeri" preserveAspectRatio="xMidYMax meet">
      <defs>
        <pattern id="ic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0v40" fill="none" stroke="#f5f5f5" strokeOpacity="0.045" strokeWidth="1" />
        </pattern>
        <linearGradient id="ic-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050505" stopOpacity="0" />
          <stop offset="1" stopColor="#0f0f14" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="ic-heat" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9447" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9447" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ic-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f5f5" stopOpacity="0.07" />
          <stop offset="1" stopColor="#f5f5f5" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ic-demand" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7a6bff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7a6bff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ic-belt-clip"><rect x={BELT_X0} y="330" width={BELT_X1 - BELT_X0} height={BELT_Y - 330} /></clipPath>
      </defs>

      <rect width="800" height="620" fill="url(#ic-grid)" />
      <rect width="800" height="620" fill="url(#ic-fade)" />
      <ellipse cx="640" cy="170" rx="220" ry="160" fill="url(#ic-demand)" />

      {/* roof truss + pendant lights */}
      <path d="M0 64H800M0 96H800" {...T} strokeOpacity={0.16} />
      <path d={Array.from({ length: 20 }, (_, i) => `M${i * 40} 96L${i * 40 + 20} 64L${i * 40 + 40} 96`).join('')} {...T} strokeOpacity={0.1} />
      {[150, 420, 690].map((x) => (
        <g key={x}>
          <path d={`M${x} 96V150`} {...T} />
          <path d={`M${x - 14} 160h28l-6 -10h-16z`} {...S} />
          <path d={`M${x - 14} 160L${x - 90} ${FLOOR}H${x + 90}L${x + 14} 160z`} fill="url(#ic-cone)" />
        </g>
      ))}

      {/* raw material: board stack + coil */}
      <g>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={24 + (i % 2) * 3} y={FLOOR - 12 - i * 11} width="112" height="9" {...S} />
        ))}
        <rect x="18" y={FLOOR - 6} width="126" height="6" {...S} />
        <circle cx="80" cy={FLOOR - 146} r="30" {...S} />
        <circle cx="80" cy={FLOOR - 146} r="20" {...T} />
        <circle cx="80" cy={FLOOR - 146} r="9" {...T} />
      </g>

      {/* CNC cell */}
      <g>
        <rect x="160" y="438" width="170" height="16" {...S} />
        <rect x="170" y="454" width="10" height={FLOOR - 454} {...S} />
        <rect x="310" y="454" width="10" height={FLOOR - 454} {...S} />
        <rect x="182" y="480" width="126" height="44" {...S} />
        <path d="M190 494h40M190 506h40" {...T} />
        <circle cx="290" cy="500" r="6" fill="#ff9447" fillOpacity="0.8" />
        {/* sheet being cut */}
        <rect x="176" y="430" width="138" height="8" {...S} fill="#16161b" />
        <path d="M196 434h26M238 434h36" stroke="#ff9447" strokeOpacity="0.55" strokeDasharray="3 3" />
        {/* gantry */}
        <rect x="160" y="330" width="10" height="108" {...S} />
        <rect x="320" y="330" width="10" height="108" {...S} />
        <rect x="154" y="318" width="182" height="14" {...S} />
        <g className="ic-head">
          <rect x="178" y="332" width="26" height="36" {...S} />
          <rect x="186" y="368" width="10" height="16" {...S} />
          <path d="M191 384V428" stroke="#ff9447" strokeWidth="1.5" strokeOpacity="0.95" />
          <circle cx="191" cy="430" r="14" fill="url(#ic-heat)" />
        </g>
      </g>

      {/* conveyor */}
      <g>
        <g clipPath="url(#ic-belt-clip)">
          <g className="ic-belt" style={{ ['--ic-cycle' as string]: `${CYCLE}px` }}>
            {[0, 1].map((rep) => PLACED.map((g, i) => (
              <g key={`${rep}-${i}`} transform={`translate(${BELT_X0 - CYCLE + rep * CYCLE + g.x} ${BELT_Y})`}>{g.el}</g>
            )))}
          </g>
        </g>
        <rect x={BELT_X0} y={BELT_Y} width={BELT_X1 - BELT_X0} height="12" {...S} fill="#141419" />
        {Array.from({ length: 12 }, (_, i) => {
          const cx = BELT_X0 + 18 + i * 38.5;
          return (
            <g key={i} className="ic-roll" style={{ transformOrigin: `${cx}px ${BELT_Y + 20}px` }}>
              <circle cx={cx} cy={BELT_Y + 20} r="7" {...S} />
              <path d={`M${cx - 7} ${BELT_Y + 20}h14`} {...T} strokeOpacity={0.4} />
            </g>
          );
        })}
        <rect x={BELT_X0} y={BELT_Y + 28} width={BELT_X1 - BELT_X0} height="6" {...S} />
        {[BELT_X0 + 10, BELT_X0 + 160, BELT_X0 + 310, BELT_X1 - 20].map((x) => (
          <rect key={x} x={x} y={BELT_Y + 34} width="8" height={FLOOR - BELT_Y - 34} {...S} />
        ))}
      </g>

      {/* demand / lead layer rising from the line */}
      <path className="ic-draw" d={`M${BELT_X1 - 40} ${BELT_Y - 110} V210 H470 V150`} fill="none" stroke="#7a6bff" strokeOpacity="0.75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" pathLength={1} />
      {[[BELT_X1 - 40, 330], [BELT_X1 - 40, 210], [470, 150]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#7a6bff" fillOpacity="0.14" className="ic-pulse" style={{ animationDelay: `${i * 0.6}s` }} />
          <circle cx={x} cy={y} r="3.5" fill="#050505" stroke="#7a6bff" strokeWidth="1.2" />
        </g>
      ))}

      {/* floor + dimension line */}
      <line x1="0" x2="800" y1={FLOOR} y2={FLOOR} stroke="#f5f5f5" strokeOpacity="0.25" />
      <line x1="24" x2="776" y1={FLOOR + 24} y2={FLOOR + 24} stroke="#ff9447" strokeOpacity="0.55" />
      {[24, 776].map((x) => <line key={x} x1={x} x2={x} y1={FLOOR + 18} y2={FLOOR + 30} stroke="#ff9447" strokeOpacity="0.55" />)}
      {[160, 330].map((x) => <line key={x} x1={x} x2={x} y1={FLOOR + 20} y2={FLOOR + 28} stroke="#ff9447" strokeOpacity="0.4" />)}
    </svg>
  );
}

export const ProductionLine = memo(ProductionLineSvg);
