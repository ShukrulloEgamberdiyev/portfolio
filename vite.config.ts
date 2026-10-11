import { defineConfig, type Connect, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

/** Standalone Uzbek-only landings, each with its own HTML entry (e.g. qurilish.html → src/qurilish-main.tsx). */
const LANDINGS = ['avtosalon', 'qurilish', 'ishlab-chiqarish', 'card', 'avazbek', '077agency'] as const;

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

/**
 * /api/077agency/lead — dev va `vite preview` uchun. Productionda xuddi shu handler
 * api/077agency/lead.ts (Vercel Function) orqali ishlaydi.
 */
function agency077Api(): Plugin {
  const mount = (mw: Connect.Server): void => {
    mw.use('/api/077agency/lead', async (req, res) => {
      const { handleLead, handleStatus } = await import('./src/agency077/server/handler.ts');
      const env = { AGENCY077_SHEETS_URL: process.env.AGENCY077_SHEETS_URL, AGENCY077_SHEETS_SECRET: process.env.AGENCY077_SHEETS_SECRET };
      let response: Response;
      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
        response = await handleLead(new Request('http://local/api/077agency/lead', { method: 'POST', headers, body: Buffer.concat(chunks) }), env);
      } else if (req.method === 'GET') {
        response = handleStatus(env);
      } else {
        response = new Response('{"ok":false}', { status: 405 });
      }
      res.statusCode = response.status;
      response.headers.forEach((v, k) => res.setHeader(k, v));
      res.end(await response.text());
    });
  };
  return {
    name: 'agency077-local-api',
    configureServer(server) { mount(server.middlewares); },
    configurePreviewServer(server) { mount(server.middlewares); },
  };
}

// `--mode singlefile` inlines everything into one HTML (used for the hosted preview).
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), landingRoutes(), agency077Api(), previewPrerendered(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
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
              card: fileURLToPath(new URL('./card.html', import.meta.url)),
              avazbek: fileURLToPath(new URL('./avazbek.html', import.meta.url)),
              '077agency': fileURLToPath(new URL('./077agency.html', import.meta.url)),
            },
          },
        }
      : {}),
  },
}));
