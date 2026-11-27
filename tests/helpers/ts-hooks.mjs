// Lets node:test import the TypeScript sources directly (Node strips types itself): a relative
// "./x.js" import resolves to "./x.ts" when only the .ts file exists — the same rule Vite and Vercel use.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

registerHooks({
  resolve(specifier, context, next) {
    if (/^\.{1,2}\//.test(specifier) && specifier.endsWith('.js') && context.parentURL?.startsWith('file:')) {
      const ts = new URL(specifier.replace(/\.js$/, '.ts'), context.parentURL);
      if (existsSync(fileURLToPath(ts))) return next(ts.href, context);
    }
    if (/^\.{1,2}\//.test(specifier) && !/\.[a-z]+$/.test(specifier) && context.parentURL?.startsWith('file:')) {
      for (const ext of ['.ts', '.tsx']) {
        const u = new URL(specifier + ext, context.parentURL);
        if (existsSync(fileURLToPath(u))) return next(u.href, context);
      }
    }
    return next(specifier, context);
  },
});
