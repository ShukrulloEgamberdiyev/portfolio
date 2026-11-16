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

/** Fields that identify a /qurilish lead (payload keys). Mirrors QURILISH_EDITABLE in docs/apps-script.gs. */
export const QR_FINGERPRINT_FIELDS = ['name', 'phone', 'company', 'region', 'stage', 'problem', 'problemOther'] as const;

/** Fields that identify an /avtosalon lead (payload keys). Mirrors AVTOSALON_EDITABLE in docs/apps-script.gs. */
export const AV_FINGERPRINT_FIELDS = ['dealer', 'region', 'instagram', 'website', 'carTypes', 'branches', 'stock', 'marketingOwner', 'targetStatus',
  'budget', 'monthlyLeads', 'monthlySales', 'salesStaff', 'rop', 'crm', 'leadSystem', 'goals', 'goalsOther', 'problem', 'name',
  'position', 'phone', 'telegram'] as const;

/**
 * 64-bit FNV-1a (two 32-bit lanes) over UTF-16 code units → 16 hex chars. Deterministic in any JS runtime.
 * Same algorithm as leadFingerprint() in docs/apps-script.gs.
 */
export function leadFingerprint(keys: readonly string[], d: Record<string, unknown>): string {
  const s = keys.map((k) => {
    const v = d[k] == null ? '' : String(d[k]);
    return k === 'phone' ? v.replace(/\D/g, '').slice(-9) : v.trim().replace(/\s+/g, ' ');
  }).join('␟');
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193 ^ 0x5bd1e995;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
  }
  return ('0000000' + h1.toString(16)).slice(-8) + ('0000000' + h2.toString(16)).slice(-8);
}

export function icFingerprint(d: Fields): string {
  return leadFingerprint(IC_FINGERPRINT_FIELDS, d as Record<string, unknown>);
}
