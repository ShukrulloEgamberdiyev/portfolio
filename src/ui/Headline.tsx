import { motion, useReducedMotion } from 'framer-motion';
import type { Line } from '../i18n/types';

type Props = {
  lines: Line[];
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
  delay?: number;
  id?: string;
};

/** Editorial headline: each line rises out of a mask. Outline lines use stroked type; `accent` ends with a violet full stop. */
export function Headline({ lines, as = 'h2', className = '', immediate = false, delay = 0, id }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } };

  return (
    <Tag id={id} className={className} initial={reduce ? false : 'hide'} {...trigger}
      variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className={`block ${line.outline ? 'outline-text' : ''}`}
            variants={{ hide: { y: '108%' }, show: { y: '0%', transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] } } }}>
            {i > 0 && ' '}{line.t}
            {line.accent && <span className="text-violet" style={{ WebkitTextStroke: 0 }}>.</span>}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
