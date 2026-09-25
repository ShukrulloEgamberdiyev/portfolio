import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

/**
 * /avtosalon is a standalone page (avtosalon.html → src/avtosalon-main.tsx). In dev and `vite preview`
 * serve it at the canonical /avtosalon, and 301 the trailing-slash variant while keeping the query —
 * the same behaviour vercel.json configures for production.
 */
function avtosalonRoute(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, res, next) => {
    const [path, query = ''] = (req.url ?? '').split('?');
    if (path === '/avtosalon/') {
      res.statusCode = 301;
      res.setHeader('Location', `/avtosalon${query ? `?${query}` : ''}`);
      res.end();
      return;
    }
    if (path === '/avtosalon') req.url = `/avtosalon.html${query ? `?${query}` : ''}`;
    next();
  };
  return {
    name: 'fazo-avtosalon-route',
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
}

// `--mode singlefile` inlines everything into one HTML (used for the hosted preview).
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), avtosalonRoute(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'singlefile' ? 'dist-preview' : 'dist',
    target: 'es2020',
    // the preview build must inline every asset into one HTML file
    assetsInlineLimit: mode === 'singlefile' ? 1024 * 1024 : 4096,
    ...(mode !== 'singlefile' && !isSsrBuild
      ? {
          rollupOptions: {
            input: {
              main: fileURLToPath(new URL('./index.html', import.meta.url)),
              avtosalon: fileURLToPath(new URL('./avtosalon.html', import.meta.url)),
            },
          },
        }
      : {}),
  },
}));
