import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

/** Standalone Uzbek-only landings, each with its own HTML entry (e.g. qurilish.html → src/qurilish-main.tsx). */
const LANDINGS = ['avtosalon', 'qurilish'] as const;

/**
 * In dev and `vite preview` serve each landing at its canonical /<name>, and 301 the trailing-slash
 * variant while keeping the query — the same behaviour vercel.json configures for production.
 */
function landingRoutes(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, res, next) => {
    const [path, query = ''] = (req.url ?? '').split('?');
    for (const name of LANDINGS) {
      if (path === `/${name}/`) {
        res.statusCode = 301;
        res.setHeader('Location', `/${name}${query ? `?${query}` : ''}`);
        res.end();
        return;
      }
      if (path === `/${name}`) req.url = `/${name}.html${query ? `?${query}` : ''}`;
    }
    next();
  };
  return {
    name: 'fazo-landing-routes',
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
}

// `--mode singlefile` inlines everything into one HTML (used for the hosted preview).
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), landingRoutes(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
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
              qurilish: fileURLToPath(new URL('./qurilish.html', import.meta.url)),
            },
          },
        }
      : {}),
  },
}));
