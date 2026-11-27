/**
 * Browser side of /api/lead: one id per application (kept across retries), a typed answer, and the
 * per-form draft that keeps answers when sending fails or the page reloads.
 */
import { getAttribution } from '../lib/tracking';
import type { FormId } from './defs';

export type Draft = {
  answers: Record<string, string>;
  step: number;
  name: string;
  phone: string;
  telegram: string;
  /** Set at the first send attempt and reused for every retry of the same application. */
  id?: string;
  createdAt?: string;
};

export const emptyDraft = (): Draft => ({ answers: {}, step: 0, name: '', phone: '', telegram: '' });

const key = (storageKey: string) => `fazo.lead.${storageKey}`;

export function loadDraft(storageKey: string): Draft {
  try {
    const d = JSON.parse(sessionStorage.getItem(key(storageKey)) || 'null') as Draft | null;
    if (d && typeof d === 'object' && d.answers && typeof d.answers === 'object') return { ...emptyDraft(), ...d };
  } catch { /* storage unavailable or corrupt */ }
  return emptyDraft();
}

export function saveDraft(storageKey: string, d: Draft) {
  try { sessionStorage.setItem(key(storageKey), JSON.stringify(d)); } catch { /* private mode */ }
}

export function clearDraft(storageKey: string) {
  try { sessionStorage.removeItem(key(storageKey)); } catch { /* ignore */ }
}

export function newLeadId(): string {
  const rand = typeof crypto !== 'undefined' && 'getRandomValues' in crypto
    ? Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => (b % 36).toString(36)).join('')
    : Math.random().toString(36).slice(2, 10);
  return `FD-${Date.now().toString(36).toUpperCase()}-${rand.toUpperCase().padEnd(8, '0').slice(0, 12)}`;
}

export type SendOutcome =
  | { ok: true; status: 'saved' | 'queued'; id: string }
  | { ok: false; error: 'network' | 'timeout' | 'invalid' | 'rate_limited' | 'too_fast' | 'unavailable' | 'unknown'; field?: string };

export const LEAD_ENDPOINT = '/api/lead';

export async function sendLead(
  p: { formId: FormId; id: string; createdAt: string; answers: Record<string, string>; name: string; phone: string; telegram: string; website: string; elapsedMs: number },
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 30_000,
): Promise<SendOutcome> {
  const a = getAttribution();
  const body = {
    ...p,
    page: a.landing || (typeof location !== 'undefined' ? location.origin + location.pathname : ''),
    referrer: a.referrer ?? '',
    utm: { utm_source: a.utm_source, utm_medium: a.utm_medium, utm_campaign: a.utm_campaign, utm_content: a.utm_content, utm_term: a.utm_term, fbclid: a.fbclid },
  };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetchImpl(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch {
    clearTimeout(timer);
    return { ok: false, error: ctrl.signal.aborted ? 'timeout' : 'network' };
  }
  let data: Record<string, unknown> = {};
  try { data = await res.json(); } catch { /* not JSON (proxy error page) */ } finally { clearTimeout(timer); }
  // Success only when the server confirms THIS application was stored.
  if (res.ok && data.ok === true && data.id === p.id && (data.status === 'saved' || data.status === 'queued')) {
    return { ok: true, status: data.status, id: p.id };
  }
  const e = typeof data.error === 'string' ? data.error : '';
  const known = ['invalid', 'rate_limited', 'too_fast', 'unavailable'] as const;
  const error = (known as readonly string[]).includes(e) ? (e as (typeof known)[number]) : res.status >= 500 ? 'unavailable' : 'unknown';
  return { ok: false, error, ...(typeof data.field === 'string' ? { field: data.field } : {}) };
}
