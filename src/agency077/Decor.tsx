import { useId } from 'react';

// Hajmli dekorativ marketing elementlari (faqat bezak: aria-hidden, matnsiz, raqamsiz).

export function Target3D({ className }: { className?: string }) {
  const u = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none">
      <defs>
        <radialGradient id={`a077-t-body-${u}`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#2a2a33" />
          <stop offset="0.6" stopColor="#15151b" />
          <stop offset="1" stopColor="#09090c" />
        </radialGradient>
        <radialGradient id={`a077-t-red-${u}`} cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ff6b73" />
          <stop offset="0.45" stopColor="#e3212d" />
          <stop offset="1" stopColor="#7a0d14" />
        </radialGradient>
        <linearGradient id={`a077-t-rim-${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <ellipse cx="104" cy="186" rx="62" ry="9" fill="#000" opacity="0.55" />
      <circle cx="100" cy="96" r="84" fill={`url(#a077-t-body-${u})`} stroke={`url(#a077-t-rim-${u})`} strokeWidth="1.5" />
      <circle cx="100" cy="96" r="62" fill={`url(#a077-t-red-${u})`} />
      <circle cx="100" cy="96" r="44" fill={`url(#a077-t-body-${u})`} />
      <circle cx="100" cy="96" r="24" fill={`url(#a077-t-red-${u})`} />
      <ellipse cx="86" cy="80" rx="22" ry="12" fill="#fff" opacity="0.10" transform="rotate(-30 86 80)" />
      {/* nayza */}
      <path d="M100 96 L170 30" stroke="#f5f5f7" strokeWidth="5" strokeLinecap="round" />
      <path d="M163 20 L186 14 L180 37 Z" fill="#e3212d" />
      <circle cx="100" cy="96" r="5" fill="#f5f5f7" />
    </svg>
  );
}

export function Cursor3D({ className }: { className?: string }) {
  const u = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={`a077-c-body-${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9b9c4" />
        </linearGradient>
        <radialGradient id={`a077-c-glow-${u}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e3212d" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e3212d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="52" cy="52" r="48" fill={`url(#a077-c-glow-${u})`} />
      <circle cx="52" cy="52" r="20" stroke="#e3212d" strokeWidth="3" opacity="0.9" />
      <circle cx="52" cy="52" r="32" stroke="#e3212d" strokeWidth="1.5" opacity="0.4" />
      <path d="M58 60 L64 132 L82 112 L104 146 L118 138 L96 104 L124 100 Z" fill="#000" opacity="0.35" transform="translate(5 6)" />
      <path
        d="M58 60 L64 132 L82 112 L104 146 L118 138 L96 104 L124 100 Z"
        fill={`url(#a077-c-body-${u})`}
        stroke="#0b0b0f"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
