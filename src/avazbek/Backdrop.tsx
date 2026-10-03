/**
 * Nozik marketing fon naqshi (SVG, statik): auditoriya nuqtalari, bog‘langan tugunlar, abstrakt o‘sish chizig‘i.
 * Raqam yoki real ma’lumot yo‘q; matn ostida juda past kontrastda turadi.
 */
type Props = { tone?: 'light' | 'dark'; className?: string };

const NODES: [number, number][] = [
  [80, 120], [210, 70], [340, 160], [470, 90], [620, 190], [760, 110], [900, 220], [1040, 140],
  [150, 300], [300, 380], [520, 330], [700, 420], [880, 360], [1080, 300], [260, 520], [610, 560], [960, 520],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [0, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13],
  [2, 10], [4, 11], [6, 12], [9, 14], [11, 15], [12, 16],
];

export default function Backdrop({ tone = 'light', className = '' }: Props) {
  const stroke = tone === 'light' ? 'rgb(23 35 52 / 0.08)' : 'rgb(243 239 231 / 0.08)';
  const dot = tone === 'light' ? 'rgb(23 35 52 / 0.16)' : 'rgb(243 239 231 / 0.16)';
  return (
    <svg
      aria-hidden
      viewBox="0 0 1160 640"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
    >
      {LINKS.map(([a, b], i) => (
        <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={stroke} />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 4 : 2.5} fill={dot} />
      ))}
      <path d="M0 600 C 220 590, 380 520, 560 470 S 900 320, 1160 230" stroke="#b89a63" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="1160" cy="230" r="5" fill="#b89a63" fillOpacity="0.5" />
    </svg>
  );
}
