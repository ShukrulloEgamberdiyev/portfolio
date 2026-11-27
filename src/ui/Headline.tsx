import type { CSSProperties } from 'react';
import type { Line } from '../i18n/types';
import { useReveal } from './Reveal';

type Props = {
  lines: Line[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Animate on load (hero) instead of when scrolled into view. */
  immediate?: boolean;
  delay?: number;
  id?: string;
};

/**
 * Editorial headline: each line rises out of a mask. Outline lines use stroked type; `accent` ends with a violet full stop.
 * The text is in the HTML at its final position — the rise is a CSS animation (hero) or is armed only after
 * the page has booted (below the fold), so the headline is readable without JavaScript or motion.
 */
export function Headline({ lines, as: Tag = 'h2', className = '', immediate = false, delay = 0, id }: Props) {
  const { ref, attr } = useReveal<HTMLHeadingElement>(1100 + (delay + lines.length * 0.09) * 1000, '0px 0px -12% 0px');
  return (
    <Tag ref={ref} id={id} className={className} data-reveal={immediate ? undefined : attr}>
      {lines.map((line, i) => {
        // A line that already ends in ? / ! / . gets that mark coloured instead of a second full stop ("bo‘ladi?.").
        const ownMark = line.accent && /[?!.…]$/.test(line.t);
        const body = ownMark ? line.t.slice(0, -1) : line.t;
        const mark = ownMark ? line.t.slice(-1) : '.';
        return (
          <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <span className={`hl-line block ${immediate ? 'hl-rise' : ''} ${line.outline ? 'outline-text' : ''}`}
              style={{ '--hl-d': `${delay + i * 0.09}s` } as CSSProperties}>
              {i > 0 && ' '}{body}
              {line.accent && <span className="text-violet" style={{ WebkitTextStroke: 0 }}>{mark}</span>}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
