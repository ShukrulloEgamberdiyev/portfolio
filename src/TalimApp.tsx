import { MotionConfig } from 'framer-motion';
import TalimPage from './pages/TalimPage';
import { Cursor } from './ui/Cursor';

/**
 * The /talim landing (education centres) as its own small app: rendered by its own entry
 * (src/talim-main.tsx) and prerendered by scripts/prerender.mjs, so paid traffic doesn't download the rest of the site.
 */
export default function TalimApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-ink text-bone">
        <Cursor />
        <main id="main" className="relative z-10">
          <TalimPage />
        </main>
      </div>
    </MotionConfig>
  );
}
