import { Link } from 'react-router-dom';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';
import type { Line } from '../i18n/types';

type Props = { label: string; title: string | Line[]; intro?: string; meta?: { label: string; value: string }[]; back?: { to: string; label: string } };

export function PageHeader({ label, title, intro, meta, back }: Props) {
  const lines: Line[] = typeof title === 'string' ? [{ t: title, accent: true }] : title;
  return (
    <header className="relative overflow-hidden pt-32 lg:pt-44">
      <span aria-hidden className="pointer-events-none absolute -top-[30vh] left-1/2 h-[70vh] w-[100vw] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(91,77,255,0.5), transparent)' }} />
      <div className="shell relative">
        {back && (
          <Link to={back.to} className="mb-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist transition-colors hover:text-bone">
            ← {back.label}
          </Link>
        )}
        <Label>{label}</Label>
        <Headline lines={lines} as="h1" immediate className="display-lg mt-8" />
        {intro && <Reveal delay={0.15}><p className="lead mt-8 max-w-[52ch]">{intro}</p></Reveal>}
        {meta && (
          <dl className="mt-12 flex flex-wrap gap-x-16 gap-y-6 border-t border-line pt-8 lg:mt-16">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow">{m.label}</dt>
                <dd className="mt-2 text-[1.05rem]">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
