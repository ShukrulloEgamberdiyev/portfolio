import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { LangProvider } from './i18n';
import type { Lang } from './i18n/types';
import { initSmoothScroll } from './lib/scroll';
import { AppRoutes } from './AppRoutes';
import { Atmosphere } from './ui/Atmosphere';
import { Cursor } from './ui/Cursor';
import { Loader } from './components/Loader';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ScrollToTop, Seo } from './components/Seo';
import { useLang } from './i18n';

function SkipLink() {
  const { t } = useLang();
  return <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">{t.nav.skip}</a>;
}

export default function App({ initialLang }: { initialLang?: Lang }) {
  useEffect(() => initSmoothScroll(), []);
  return (
    <LangProvider initialLang={initialLang}>
      <MotionConfig reducedMotion="user">
        <Seo />
        <ScrollToTop />
        <div className="grain relative min-h-screen bg-ink text-bone">
          <SkipLink />
          <Loader />
          <Atmosphere />
          <Cursor />
          <Nav />
          <main id="main" className="relative z-10">
            <AppRoutes />
          </main>
          <div className="relative z-10"><Footer /></div>
        </div>
      </MotionConfig>
    </LangProvider>
  );
}
