import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `--mode singlefile` inlines everything into one HTML (used for the hosted preview).
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'singlefile' ? 'dist-preview' : 'dist',
    target: 'es2020',
    // the preview build must inline every asset into one HTML file
    assetsInlineLimit: mode === 'singlefile' ? 1024 * 1024 : 4096,
  },
}));
