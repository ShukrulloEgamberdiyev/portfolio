import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import AvtosalonApp from './AvtosalonApp';
import QurilishApp from './QurilishApp';
import IshlabApp from './IshlabApp';
import type { Lang } from './i18n/types';
import { ROUTES, UZ_ONLY_ROUTES } from './lib/routes';
export { seoFor } from './lib/seo';
export { dictionaries } from './i18n';
export const routes = ROUTES;
export const uzOnlyRoutes = UZ_ONLY_ROUTES;

export function render(path: string, lang: Lang) {
  return renderToString(
    <StaticRouter location={path}>
      <App initialLang={lang} />
    </StaticRouter>,
  );
}

/** Prerender for the standalone /avtosalon landing (its own client entry: src/avtosalon-main.tsx). */
export function renderAvtosalon() {
  return renderToString(<AvtosalonApp />);
}

/** Prerender for the standalone /qurilish landing (its own client entry: src/qurilish-main.tsx). */
export function renderQurilish() {
  return renderToString(<QurilishApp />);
}

/** Prerender for the standalone /ishlab-chiqarish landing (its own client entry: src/ishlab-chiqarish-main.tsx). */
export function renderIshlab() {
  return renderToString(<IshlabApp />);
}
