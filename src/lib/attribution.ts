/**
 * Pure helpers that keep attribution data within the limits the Apps Script accepts.
 * Attribution is auxiliary: it must never make a valid lead fail validation, so every value
 * is normalised and capped here (and the server truncates again instead of rejecting).
 *
 * Limits mirror MAX_LEN in docs/apps-script.gs: utm_* 200, fbclid 500, page 1000, referrer 500.
 */

export const ATTR_LIMITS = { utm: 200, fbclid: 500, page: 1000, referrer: 500 } as const;

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];

export type Attribution = Partial<Record<UtmKey, string>> & { landing?: string; referrer?: string };

/** Query parameters worth keeping in the stored landing URL, in priority order. */
const LANDING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Landing URL = origin + path + only the tracking parameters (other query noise is dropped).
 * If it is still too long, lower-priority parameters are dropped first (fbclid, then gclid —
 * both are kept in their own fields anyway), and as a last resort the URL is cut.
 */
export function normalizeLanding(href: string, max: number = ATTR_LIMITS.page): string {
  let url: URL;
  try { url = new URL(href); } catch { return clip(href, max); }
  const base = url.origin + url.pathname;
  const kept: [string, string][] = [];
  for (const k of LANDING_PARAMS) {
    const v = url.searchParams.get(k);
    if (v) kept.push([k, v.slice(0, k === 'fbclid' || k === 'gclid' ? ATTR_LIMITS.fbclid : ATTR_LIMITS.utm)]);
  }
  const build = (pairs: [string, string][]) => {
    const q = new URLSearchParams(pairs).toString();
    return q ? `${base}?${q}` : base;
  };
  let out = build(kept);
  while (out.length > max && kept.length) {
    kept.pop();
    out = build(kept);
  }
  return out.slice(0, max);
}

/** Referrer: origin + path only (query strings of other sites are not needed), capped. */
export function normalizeReferrer(ref: string, max: number = ATTR_LIMITS.referrer): string {
  if (!ref) return '';
  try {
    const u = new URL(ref);
    return (u.origin + u.pathname).slice(0, max);
  } catch {
    return clip(ref, max);
  }
}

/** Normalises a whole attribution record (also used on values restored from older sessions). */
export function clampAttribution(a: Attribution): Attribution {
  const out: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = clip(a[k], k === 'fbclid' ? ATTR_LIMITS.fbclid : ATTR_LIMITS.utm);
    if (v) out[k] = v;
  }
  if (a.landing) out.landing = normalizeLanding(a.landing);
  if (a.referrer) out.referrer = normalizeReferrer(a.referrer);
  return out;
}

/** Reads the tracking parameters of a query string, already capped. */
export function utmFromSearch(search: string): Attribution {
  const q = new URLSearchParams(search);
  const out: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) out[k] = v.trim().slice(0, k === 'fbclid' ? ATTR_LIMITS.fbclid : ATTR_LIMITS.utm);
  }
  return out;
}
