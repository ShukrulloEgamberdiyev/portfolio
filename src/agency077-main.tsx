import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-ext-700.css';
import '@fontsource/manrope/latin-ext-800.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import Agency077App from './agency077/App';
import './agency077/agency077.css';

// /077agency — 077agency landingi. FAZO Digital layout/header/footer ishlatilmaydi.
// Kanonik manzil oxirida "/" bo‘lmaydi; query parametrlari (UTM, fbclid) saqlanadi.
if (window.location.pathname.length > 1 && window.location.pathname.endsWith('/')) {
  window.history.replaceState(null, '', window.location.pathname.replace(/\/+$/, '') + window.location.search + window.location.hash);
}
document.documentElement.lang = 'uz';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Agency077App />
  </StrictMode>,
);
