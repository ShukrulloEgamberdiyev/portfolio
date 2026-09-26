import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import IshlabApp from './IshlabApp';
import { initSmoothScroll } from './lib/scroll';
import './index.css';

// Canonical address has no trailing slash; keep every query parameter (UTM, fbclid).
if (window.location.pathname.length > 1 && window.location.pathname.endsWith('/')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/\/+$/, '') + window.location.search + window.location.hash);
}
document.documentElement.lang = 'uz';
initSmoothScroll();

const root = document.getElementById('root')!;
const tree = <StrictMode><IshlabApp /></StrictMode>;
if (root.dataset.prerendered === 'true' && root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);
