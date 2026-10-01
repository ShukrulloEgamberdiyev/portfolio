import { MotionConfig } from 'framer-motion';
import CardPage from './pages/CardPage';
import { Cursor } from './ui/Cursor';

/**
 * /card — FAZO Digital raqamli vizitkasi. Landinglar kabi o‘z entry'si (src/card-main.tsx) bilan alohida kichik ilova:
 * Instagram bio / QR orqali kelgan tashrif butun saytni yuklamaydi. scripts/prerender.mjs uni statik HTML qilib chiqaradi.
 */
export default function CardApp() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-ink text-bone">
        <Cursor />
        <main id="main" className="relative z-10">
          <CardPage />
        </main>
      </div>
    </MotionConfig>
  );
}
