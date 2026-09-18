import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import { langFromPath, langPrefix } from './i18n';
import './index.css';

const lang = langFromPath(window.location.pathname);
const basename = langPrefix(lang) || '/';
const root = document.getElementById('root')!;

// The single-file preview build is served from an arbitrary path, so it routes in memory.
const preview = import.meta.env.MODE === 'singlefile';
const Router = preview ? MemoryRouter : BrowserRouter;
const routerProps = preview ? {} : { basename };

const tree = (
  <StrictMode>
    <Router {...routerProps}>
      <App initialLang={lang} />
    </Router>
  </StrictMode>
);

// Prerendered pages are hydrated; the dev server and the preview render fresh.
if (root.dataset.prerendered === 'true' && root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);
