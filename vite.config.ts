import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

/** Standalone Uzbek-only landings, each with its own HTML entry (e.g. qurilish.html → src/qurilish-main.tsx). */
const LANDINGS = ['avtosalon', 'qurilish', 'ishlab-chiqarish'] as const;

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

/**
 * `vite preview` only: serve the prerendered HTML the way Vercel does (cleanUrls + trailingSlash:false).
 * Without this, extension-less paths such as /about or /ru/work fall back to dist/index.html (the home page),
 * which then fails hydration. Order of lookup for GET/HEAD page requests:
 *   /x/ → 308 to /x (query kept) · dist/x.html · dist/x/index.html · otherwise dist/404.html with status 404.
 * Files with an extension (assets, sitemap.xml, og images) are left to the static server.
 */
function previewPrerendered(): Plugin {
  return {
    name: 'fazo-preview-prerendered',
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const [rawPath, query = ''] = (req.url ?? '/').split('?');
        let path: string;
        try { path = decodeURIComponent(rawPath); } catch { return next(); }
        if (path === '/' || extname(path)) return next();
        if (path.endsWith('/')) {
          res.statusCode = 308;
          res.setHeader('Location', `${path.replace(/\/+$/, '') || '/'}${query ? `?${query}` : ''}`);
          res.end();
          return;
        }
        const safe = normalize(path).replace(/^([/\\])+/, '');
        if (safe.startsWith('..')) return next();
        const candidates = [join(dist, `${safe}.html`), join(dist, safe, 'index.html')];
        const hit = candidates.find((f) => existsSync(f) && statSync(f).isFile());
        const file = hit ?? join(dist, '404.html');
        if (!existsSync(file)) return next();
        res.statusCode = hit ? 200 : 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
      });
    },
  };
}

// `--mode singlefile` inlines everything into one HTML (used for the hosted preview).
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), landingRoutes(), previewPrerendered(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
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
              'ishlab-chiqarish': fileURLToPath(new URL('./ishlab-chiqarish.html', import.meta.url)),
            },
          },
        }
      : {}),
  },
}));
