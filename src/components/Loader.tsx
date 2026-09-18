import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import mark from '../assets/fazo-mark.png';

/** Short brand reveal on first load (≈1.1s). Skipped for reduced motion. */
export function Loader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(!reduce);
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(id);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div aria-hidden className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
          <div className="overflow-hidden">
            <motion.p initial={{ y: '110%' }} animate={{ y: '0%' }} exit={{ y: '-110%' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-3 text-[2rem] font-bold uppercase tracking-[-0.04em]">
              <img src={mark} alt="" aria-hidden className="h-10 w-auto" />
              FAZO <span className="font-light text-mist">Digital</span>
            </motion.p>
          </div>
          <motion.span className="absolute bottom-0 left-0 h-px bg-violet" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
