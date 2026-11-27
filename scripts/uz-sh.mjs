/**
 * Site writing style for Uzbek text: sh → ş, Sh → Ş, SH → Ş — and nothing else.
 * (A style chosen for this site only; it is not a claim about the official alphabet.)
 *
 * Rewrites string literals and JSX text in the given Uzbek-only source files. It leaves alone:
 * module paths, identifiers/slugs/URLs (no spaces, lowercase/ASCII-only), class lists, JSX attributes
 * other than human-readable ones, and words in KEEP (brand and English words such as "Google Sheets").
 *
 *   node scripts/uz-sh.mjs --check  <files…>   list what would change (exit 1 if anything would)
 *   node scripts/uz-sh.mjs --write  <files…>   apply
 */
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

export const KEEP = /^(Sheets?|Shorts|[Ss]howroom|[Dd]ashboard|Shukrullo|[Pp]ush|Shopify|English|[Cc]ash|[Ff]ashion|[Ww]ashington)$/;
const ID_KEYS = new Set(['id', 'kind', 'slug', 'key', 'value', 'type', 'formId', 'to', 'href', 'src', 'path', 'serviceFrom', 'location', 'content_category']);
const TEXT_ATTRS = new Set(['aria-label', 'alt', 'title', 'placeholder', 'content', 'label']);
const CLASSY = /(^|\s)(!?-?(?:shadow|shrink|font|text|bg|border|px|py|pt|pb|pl|pr|mt|mb|ml|mr|mx|my|h|w|min|max|flex|grid|gap|rounded|tracking|leading|inset|top|left|right|bottom|z|opacity|transition|duration|ease|translate|scale|rotate|origin|overflow|items|justify|self|col|row|space|ring|outline|fill|stroke|sr|peer|group|lg|sm|md|xl|hover|focus|disabled|data|aria)[-:[])/;

export function shWord(word) {
  if (KEEP.test(word.replace(/[’'‘ʼ].*$/u, '').replace(/[^\p{L}]/gu, ''))) return word;
  return word.replace(/SH/g, 'Ş').replace(/Sh/g, 'Ş').replace(/sh/g, 'ş');
}

/** Converts free text word by word; URLs, @handles, emails and paths inside the text are kept. */
export function shText(text) {
  return text.replace(/[^\s]+/g, (tok) => (/[/@]|\.\w{2,}|_/.test(tok) || /^https?:/.test(tok) ? tok : shWord(tok)));
}

function convertible(value) {
  if (!/sh/i.test(value)) return false;
  if (!/\s/.test(value) && /^[a-z0-9_\-./:@#?=&%]+$/.test(value) && /[0-9_\-./:@#?=&%]/.test(value)) return false; // slug, path, url
  if (CLASSY.test(value)) return false; // Tailwind class list
  if (/^[A-Za-z]+[A-Z][A-Za-z]*$/.test(value)) return false; // PascalCase / camelCase identifier (event names)
  return true;
}

/** Values passed to analytics calls are API data, not page text. */
const API_CALLS = /^(track|ctaClick|formOpen|formError|formSuccess|fbq)$/;
function insideCall(node, sf) {
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isCallExpression(n)) return API_CALLS.test(n.expression.getText(sf));
    if (ts.isBlock(n) || ts.isSourceFile(n)) return false;
  }
  return false;
}

export function transform(source, fileName) {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  const visit = (node) => {
    const p = node.parent;
    const isLit = ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node);
    if (isLit) {
      const skip = ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || (ts.isPropertyAssignment(p) && p.name === node)
        || (ts.isPropertyAssignment(p) && ID_KEYS.has(p.name.getText(sf)))
        || ts.isLiteralTypeNode(p) || ts.isElementAccessExpression(p) || insideCall(node, sf)
        || (ts.isJsxAttribute(p) && !TEXT_ATTRS.has(p.name.getText(sf)));
      const text = node.text;
      if (!skip && convertible(text)) {
        const out = shText(text);
        if (out !== text) {
          const start = node.getStart(sf);
          const raw = source.slice(start, node.end);
          const rawOut = raw.replace(/[^\s'"`${}\\]+/g, (tok) => (/sh/i.test(tok) ? (/[/@]|\.\w{2,}|_/.test(tok) || /^https?:/.test(tok) ? tok : shWord(tok)) : tok));
          if (rawOut !== raw) edits.push({ start, end: node.end, out: rawOut, before: text, after: out });
        }
      }
    } else if (ts.isJsxText(node)) {
      const text = node.getText(sf);
      if (/sh/i.test(text)) {
        const out = shText(text);
        if (out !== text) edits.push({ start: node.getStart(sf), end: node.end, out, before: text.trim(), after: out.trim() });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  let out = source;
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.out + out.slice(e.end);
  return { out, edits };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [mode, ...files] = process.argv.slice(2);
  let changed = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const { out, edits } = transform(src, f);
    if (!edits.length) continue;
    changed += edits.length;
    if (mode === '--write') writeFileSync(f, out);
    else for (const e of edits) console.log(`${f}: ${e.before.slice(0, 90)}\n   → ${e.after.slice(0, 90)}`);
  }
  console.error(`${changed} string(s) ${mode === '--write' ? 'converted' : 'to convert'}`);
  if (mode !== '--write' && changed) process.exit(1);
}
