import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Quiet desktop cursor: a small dot with a trailing ring that opens over interactive elements. */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    setEnabled(mq.matches && !reduce);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY); setVisible(true);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest('a,button,[data-cursor="hover"],input,textarea,label'));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave); };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }} />
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-bone/40 mix-blend-difference"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
        animate={{ width: hover ? 56 : 30, height: hover ? 56 : 30, borderColor: hover ? 'rgba(245,245,245,0.8)' : 'rgba(245,245,245,0.35)' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />
    </>
  );
}
