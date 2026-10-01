import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import CardApp from './CardApp';
import './index.css';

// Kanonik manzil oxirida "/" bo‘lmaydi; barcha query parametrlari (UTM, fbclid) saqlanadi.
if (window.location.pathname.length > 1 && window.location.pathname.endsWith('/')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/\/+$/, '') + window.location.search + window.location.hash);
}
document.documentElement.lang = 'uz';
// Vizitka qisqa sahifa: Lenis smooth-scroll ulanmaydi (modal ichidagi skrol bilan to‘qnashmasligi uchun).

const root = document.getElementById('root')!;
const tree = <StrictMode><CardApp /></StrictMode>;
if (root.dataset.prerendered === 'true' && root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);
