import { MotionConfig } from 'framer-motion';
import QurilishPage from './pages/QurilishPage';
import { Cursor } from './ui/Cursor';

/**
 * The /qurilish landing (residential developers) as its own small app: rendered by its own entry
 * (src/qurilish-main.tsx) and prerendered by scripts/prerender.mjs, so paid traffic doesn't download the rest of the site.
 */
export default function QurilishApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-ink text-bone">
        <Cursor />
        <main id="main" className="relative z-10">
          <QurilishPage />
        </main>
      </div>
    </MotionConfig>
  );
}
