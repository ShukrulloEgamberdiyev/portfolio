import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import AvazbekApp from './avazbek/App';
import './avazbek/avazbek.css';

// Kanonik manzil oxirida "/" bo‘lmaydi; query parametrlari (UTM, fbclid) saqlanadi.
if (window.location.pathname.length > 1 && window.location.pathname.endsWith('/')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/\/+$/, '') + window.location.search + window.location.hash);
}
document.documentElement.lang = 'uz';
// Scroll-reveal animatsiyalari faqat JS ishlaganda yoqiladi.
document.documentElement.classList.add('js');

const root = document.getElementById('root')!;
const tree = <StrictMode><AvazbekApp /></StrictMode>;
if (root.dataset.prerendered === 'true' && root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);
