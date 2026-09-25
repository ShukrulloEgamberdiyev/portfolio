import { MotionConfig } from 'framer-motion';
import AvtosalonPage from './pages/AvtosalonPage';
import { Cursor } from './ui/Cursor';

/**
 * The /avtosalon landing as its own small app: rendered by its own entry (src/avtosalon-main.tsx)
 * and prerendered by scripts/prerender.mjs, so paid traffic doesn't download the rest of the site.
 */
export default function AvtosalonApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-ink text-bone">
        <Cursor />
        <main id="main" className="relative z-10">
          <AvtosalonPage />
        </main>
      </div>
    </MotionConfig>
  );
}
