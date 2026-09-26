import { MotionConfig } from 'framer-motion';
import IshlabPage from './pages/IshlabPage';
import { Cursor } from './ui/Cursor';

/**
 * The /ishlab-chiqarish landing (manufacturers) as its own small app: rendered by its own entry
 * (src/ishlab-chiqarish-main.tsx) and prerendered by scripts/prerender.mjs, so paid traffic doesn't download the rest of the site.
 */
export default function IshlabApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-ink text-bone">
        <Cursor />
        <main id="main" className="relative z-10">
          <IshlabPage />
        </main>
      </div>
    </MotionConfig>
  );
}
