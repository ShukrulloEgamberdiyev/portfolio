/**
 * Fingerprint of the lead's own data (not attribution). The Apps Script computes the same value
 * (icFingerprint in docs/apps-script.gs — keep both implementations identical; a test compares them).
 *
 * It lets one submission id stay stable across retries while proving *which* data was stored:
 *  - same id + same fingerprint  → idempotent retry, one row;
 *  - same id + other fingerprint → the stored row is corrected in place (never a silent success
 *    for the old data, never a second lead).
 */

export const IC_FINGERPRINT_FIELDS = ['name', 'phone', 'product', 'region', 'channel', 'budget', 'problem'] as const;

type Fields = Partial<Record<(typeof IC_FINGERPRINT_FIELDS)[number], unknown>>;

function canon(d: Fields) {
  return IC_FINGERPRINT_FIELDS.map((k) => {
    const v = d[k] == null ? '' : String(d[k]);
    return k === 'phone' ? v.replace(/\D/g, '').slice(-9) : v.trim().replace(/\s+/g, ' ');
  }).join('␟');
}

/** 64-bit FNV-1a (two 32-bit lanes) over UTF-16 code units → 16 hex chars. Deterministic in any JS runtime. */
export function icFingerprint(d: Fields): string {
  const s = canon(d);
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193 ^ 0x5bd1e995;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
  }
  return ('0000000' + h1.toString(16)).slice(-8) + ('0000000' + h2.toString(16)).slice(-8);
}
