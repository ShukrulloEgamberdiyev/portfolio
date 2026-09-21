import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Magnetic } from './Magnetic';

type Props = {
  children: ReactNode;
  /** Internal route (react-router). Takes precedence over href. */
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  variant?: 'solid' | 'ghost' | 'text';
  arrow?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  magnetic?: boolean;
  className?: string;
  external?: boolean;
};

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const styles = {
  solid: 'bg-bone text-ink hover:bg-white',
  ghost: 'border border-line-strong text-bone hover:border-bone/60',
  text: 'text-bone px-0! h-auto!',
};

export function Button({ children, to, href, onClick, variant = 'solid', arrow = true, type = 'button', disabled, magnetic = true, className = '', external }: Props) {
  const cls = `group relative inline-flex min-h-14 items-center gap-4 overflow-hidden px-7 py-3 text-left leading-snug font-mono text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 disabled:opacity-40 ${styles[variant]} ${className}`;
  const inner = (
    <>
      {variant !== 'text' && (
        <span aria-hidden className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100 ${variant === 'solid' ? 'bg-violet' : 'bg-bone/[0.06]'}`} />
      )}
      <span className={`relative transition-colors duration-300 ${variant === 'solid' ? 'group-hover:text-white' : ''}`}>{children}</span>
      {arrow && (
        <span className={`relative inline-flex overflow-hidden ${variant === 'solid' ? 'group-hover:text-white' : ''}`}>
          <Arrow className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[140%]" />
          <Arrow className="absolute -translate-x-[140%] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
        </span>
      )}
    </>
  );
  const el = to ? (
    <Link to={to} onClick={onClick} className={cls} data-cursor="hover">{inner}</Link>
  ) : href ? (
    <a href={href} onClick={onClick} className={cls} data-cursor="hover" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} data-cursor="hover">{inner}</button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
