/**
 * Landing-page tracking: session-persistent UTM attribution and a config-ready Meta Pixel.
 *
 * UTM — the first set of UTM parameters seen in a browser session is kept in sessionStorage,
 * so a visitor who scrolls, reloads or follows an in-page anchor still submits with the
 * campaign that brought them. A later visit with *new* UTM parameters replaces it.
 *
 * Meta Pixel — loads only when VITE_META_PIXEL_ID is set at build time. Without it every
 * call is a no-op, so nothing breaks and no pixel is invented.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
const STORAGE_KEY = 'fazo.attribution';

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  landing?: string;
  referrer?: string;
};

function read(): Attribution {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') as Attribution; } catch { return {}; }
}

/** Call once when a landing page mounts. */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const q = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) fresh[k] = v.slice(0, 200);
  }
  const stored = read();
  const hasFresh = Object.keys(fresh).length > 0;
  const next: Attribution = hasFresh || !stored.landing
    ? { ...fresh, landing: window.location.origin + window.location.pathname + window.location.search, referrer: document.referrer.slice(0, 300) }
    : stored;
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  return next;
}

/** Attribution for the current session, falling back to the current URL. */
export function getAttribution(): Attribution {
  const stored = read();
  return stored.landing ? stored : captureAttribution();
}

/* ───────── Meta Pixel ───────── */

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

export const PIXEL_ID = ((import.meta.env.VITE_META_PIXEL_ID as string | undefined) || '').trim();
let initialised = false;

/** Loads the pixel once (only if configured) and records a PageView. Reuses an existing fbq if one is already on the page. */
export function initPixel() {
  if (typeof window === 'undefined' || initialised) return;
  initialised = true;
  // A pixel installed elsewhere (e.g. index.html) already sends its own PageView — don't double it.
  if (window.fbq) return;
  if (!/^\d{6,20}$/.test(PIXEL_ID)) return;
  const f = function (...args: unknown[]) {
    if (f.callMethod) f.callMethod(...args); else f.queue.push(args);
  } as Fbq;
  f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
  window.fbq = f; window._fbq = f;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  f('init', PIXEL_ID);
  f('track', 'PageView');
}

const sentOnce = new Set<string>();

/** Standard or custom event. `onceKey` prevents the same event firing twice in a page session. */
export function track(event: string, params: Record<string, unknown> = {}, opts: { custom?: boolean; onceKey?: string; eventID?: string } = {}) {
  if (typeof window === 'undefined') return;
  if (opts.onceKey) {
    if (sentOnce.has(opts.onceKey)) return;
    sentOnce.add(opts.onceKey);
  }
  if (!window.fbq) return;
  const extra = opts.eventID ? { eventID: opts.eventID } : undefined;
  window.fbq(opts.custom ? 'trackCustom' : 'track', event, params, extra);
}
