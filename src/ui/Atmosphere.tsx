import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/** Fixed atmospheric light. Two soft sources drift slowly and shift with scroll; the page stays black. */
export function Atmosphere() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '60%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-40%']);
  const o = useTransform(scrollYProgress, [0, 0.15, 0.5, 1], [1, 0.55, 0.4, 0.7]);

  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity: o }}>
      <motion.div style={{ y: y1 }} className="absolute -top-[25vh] right-[-20vw] h-[85vh] w-[85vw]">
        <div className="h-full w-full rounded-full opacity-[0.22] blur-[120px] [animation:drift-a_22s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(closest-side, #5b4dff, rgba(47,69,255,0.35) 55%, transparent)' }} />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[45vh] -left-[30vw] h-[70vh] w-[70vw]">
        <div className="h-full w-full rounded-full opacity-[0.12] blur-[140px] [animation:drift-b_28s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(closest-side, #2f45ff, rgba(122,107,255,0.25) 60%, transparent)' }} />
      </motion.div>
    </motion.div>
  );
}
