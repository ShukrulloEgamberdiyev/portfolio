import { DeliveryError, deliverApplication } from './applicationTransport';
import { normalizeLanding } from './attribution';
import { getAttribution } from './tracking';

export type Application = Record<string, string>;

/**
 * Sends an application to the endpoint in VITE_APPLICATION_ENDPOINT — the Apps Script
 * web app bound to the "Targeting Xizmat" spreadsheet (see docs/apps-script.gs).
 * A configured endpoint and an explicit successful server response are required.
 *
 * Sent as text/plain on purpose: Apps Script web apps reject the CORS preflight that
 * an application/json POST triggers.
 */
export const APPLICATION_ENDPOINT = (import.meta.env.VITE_APPLICATION_ENDPOINT as string | undefined)
  || 'https://script.google.com/macros/s/AKfycbzBvnC8i5tglLCg_7ZX2op1BuAQ79c2mRHAYtX__XJfQa4aD3htuXs9lUYWWam_mylr1Q/exec';
// Public identifier, not a secret: the Apps Script validates and limits writes.
export const APPLICATION_TOKEN = import.meta.env.VITE_APPLICATION_TOKEN || 'fazo-2026-maxfiy';

/** One id per logical application; the receiver echoes it so the browser knows the answer belongs to this request. */
export function newSiteSubmissionId() {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    : (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 10);
  return `SA-${Date.now().toString(36).toUpperCase()}-${rand.toUpperCase()}`;
}

/**
 * "Telefon yoki Telegram": a phone number (9–15 digits; an Uzbek +998 number must be complete)
 * or a Telegram username written as @name or t.me/name. A bare word is not a way to reach someone.
 */
export function isContact(value: string): boolean {
  const s = value.trim();
  if (/^(@|(https?:\/\/)?t\.me\/)[A-Za-z][A-Za-z0-9_]{4,31}\/?$/.test(s)) return true;
  if (!/^\+?[\d\s().-]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, '');
  if (digits.startsWith('998')) return digits.length === 12;
  return digits.length >= 9 && digits.length <= 15;
}

/** Flattens the general application into the keys the Apps Script expects for the "Sayt arizalari" tab. */
export function buildSitePayload(data: Application, lang: string, guard: { hp: string; elapsed: number }, submissionId: string): Record<string, string> {
  // Session attribution: the campaign that brought the visitor, even if they opened other pages before applying.
  const a = getAttribution();
  const trimmed: Application = {};
  for (const k of Object.keys(data)) trimmed[k] = String(data[k] ?? '').trim();
  return {
    ...trimmed,
    utm_source: a.utm_source ?? '',
    utm_medium: a.utm_medium ?? '',
    utm_campaign: a.utm_campaign ?? '',
    utm_content: a.utm_content ?? '',
    utm_term: a.utm_term ?? '',
    fbclid: a.fbclid ?? '',
    referrer: a.referrer ?? '',
    lang,
    hp: guard.hp,
    elapsed: String(guard.elapsed),
    submittedAt: new Date().toISOString(),
    source: 'fazodigital.uz',
    page: a.landing || (typeof location !== 'undefined' ? normalizeLanding(location.href) : ''),
    submissionId,
    token: APPLICATION_TOKEN,
  };
}

/**
 * Resolves only when the receiver accepted the application. A receiver that reports `saved`
 * (current docs/apps-script.gs) must confirm this very submission id; the bare {ok:true} of an
 * older deployment is still accepted, because it is only ever returned after the row was appended.
 */
export async function submitApplication(data: Application, lang = 'uz', guard: { hp: string; elapsed: number } = { hp: '', elapsed: 0 }, submissionId = newSiteSubmissionId()): Promise<void> {
  const payload = buildSitePayload(data, lang, guard, submissionId);
  const result = await deliverApplication(APPLICATION_ENDPOINT, payload, 25000);
  if (!isSiteConfirmation(result, submissionId)) {
    throw new DeliveryError('bad_response', '', 'Receiver did not confirm this submission');
  }
}

/**
 * The receiver's answer confirms THIS application: the current script returns `saved` and echoes the id;
 * an older deployment returns a bare {ok:true} only after appending the row. The health-check answer
 * (doGet / a POST that ended up there: {ok:true, status}) never confirms anything.
 */
export function isSiteConfirmation(result: Record<string, unknown>, submissionId: string): boolean {
  if ('saved' in result) return result.saved === true && result.submissionId === submissionId;
  return !('status' in result);
}
