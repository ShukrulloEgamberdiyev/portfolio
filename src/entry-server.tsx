import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import type { Lang } from './i18n/types';
import { ROUTES } from './lib/routes';
export { seoFor } from './lib/seo';
export const routes = ROUTES;

export function render(path: string, lang: Lang) {
  return renderToString(
    <StaticRouter location={path}>
      <App initialLang={lang} />
    </StaticRouter>,
  );
}
