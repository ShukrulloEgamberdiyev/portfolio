/**
 * Nozik marketing fon elementlari (statik SVG). Har bo‘lim o‘z variantiga ega — bir naqsh takrorlanmaydi.
 *  - network: auditoriya tugunlari va o‘sish chizig‘i — hero pastki tasmasida, matn ostiga tushmaydi
 *  - frames:  9:16 kontent kadrlarini eslatuvchi ingichka geometrik ramkalar (portfolio kirishi)
 *  - rings:   auditoriya qatlamlarini eslatuvchi konsentrik halqalar va yo‘nalish chizig‘i (aloqa bo‘limi)
 * Raqam, dashboard yoki natija grafigi yo‘q; doimiy harakat yo‘q.
 */
type Props = { variant: 'network' | 'frames' | 'rings'; tone?: 'light' | 'dark'; className?: string };

export default function Backdrop({ variant, tone = 'light', className = '' }: Props) {
  const ink = tone === 'light' ? '23 35 52' : '243 239 231';
  const line = `rgb(${ink} / ${tone === 'light' ? 0.07 : 0.09})`;
  const dot = `rgb(${ink} / ${tone === 'light' ? 0.18 : 0.2})`;
  const gold = '#b89a63';

  if (variant === 'network') {
    // Pastki tasma: auditoriya tugunlari chapdan portret tomon ko‘tarilib boradi — matn ostiga tushmaydi.
    const nodes: [number, number, number][] = [
      [40, 170, 1.6], [130, 140, 2], [220, 158, 1.6], [300, 118, 2.4], [390, 132, 1.6],
      [470, 96, 1.6], [560, 104, 2], [640, 70, 1.6], [180, 196, 1.4], [350, 184, 1.4], [520, 160, 1.4],
    ];
    const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [1, 8], [8, 2], [3, 9], [9, 4], [5, 10], [10, 6]];
    return (
      <svg
        aria-hidden
        viewBox="0 0 720 220"
        preserveAspectRatio="xMinYMax meet"
        className={`pointer-events-none absolute bottom-0 left-0 h-[30%] max-h-[240px] w-[58%] [mask-image:linear-gradient(90deg,transparent_0%,#000_12%,#000_70%,transparent_100%)] ${className}`}
        fill="none"
      >
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={line} strokeWidth="1" />
        ))}
        {nodes.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={dot} />
        ))}
        <circle cx="300" cy="118" r="7" stroke={gold} strokeOpacity="0.55" />
        <path d="M0 214 C 180 208, 330 190, 450 150 S 640 70, 720 40" stroke={gold} strokeOpacity="0.4" strokeWidth="1.25" />
      </svg>
    );
  }

  if (variant === 'frames') {
    // 9:16 kadr ramkalari — o‘ng tomonda, pastga qarab so‘nadi
    const frames = [
      { x: 820, y: 40, w: 90 },
      { x: 930, y: 90, w: 120 },
      { x: 1070, y: 20, w: 90 },
      { x: 1180, y: 110, w: 70 },
    ];
    return (
      <svg
        aria-hidden
        viewBox="0 0 1280 420"
        preserveAspectRatio="xMaxYMid slice"
        className={`pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(180deg,#000_30%,transparent_100%)] ${className}`}
        fill="none"
      >
        {frames.map((f, i) => (
          <rect key={i} x={f.x} y={f.y} width={f.w} height={(f.w * 16) / 9} rx="6" stroke={line} strokeWidth="1" />
        ))}
        <line x1="780" y1="380" x2="1280" y2="380" stroke={line} />
        <circle cx="990" cy="196" r="3" fill={gold} fillOpacity="0.7" />
      </svg>
    );
  }

  // rings
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 600"
      preserveAspectRatio="xMaxYMid meet"
      className={`pointer-events-none absolute inset-y-0 right-0 h-full w-auto max-w-full ${className}`}
      fill="none"
    >
      {[260, 200, 140, 80].map((r, i) => (
        <circle key={r} cx="420" cy="300" r={r} stroke={line} strokeDasharray={i === 0 ? '2 7' : undefined} />
      ))}
      {[[250, 180], [560, 220], [470, 470], [330, 420], [600, 360]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={dot} />
      ))}
      <circle cx="420" cy="300" r="5" fill={gold} fillOpacity="0.8" />
    </svg>
  );
}
