import { DeliveryError, deliverApplication, type DeliveryResult } from './applicationTransport';
import { APPLICATION_ENDPOINT, APPLICATION_TOKEN } from './submit';
import { normalizeLanding } from './attribution';
import { icFingerprint } from './leadFingerprint';
import { getAttribution, track } from './tracking';

export type IcData = {
  name: string; phone: string; product: string; region: string; channel: string; budget: string; problem: string;
};

/** Flattens the form into the keys the Apps Script expects for the "ISHLAB CHIQARISH LEADLAR" tab. */
export function buildIshlabPayload(d: IcData, guard: { hp: string; elapsed: number }, submissionId: string): Record<string, string> {
  const a = getAttribution();
  const digits = d.phone.replace(/\D/g, '').slice(-9);
  return {
    formType: 'ishlab_chiqarish',
    name: d.name.trim(),
    phone: `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`,
    product: d.product.trim(),
    region: d.region.trim(),
    channel: d.channel,
    budget: d.budget,
    problem: d.problem.trim(),
    utm_source: a.utm_source ?? '',
    utm_medium: a.utm_medium ?? '',
    utm_campaign: a.utm_campaign ?? '',
    utm_content: a.utm_content ?? '',
    utm_term: a.utm_term ?? '',
    fbclid: a.fbclid ?? '',
    page: a.landing || (typeof location !== 'undefined' ? normalizeLanding(location.href) : ''),
    referrer: a.referrer ?? '',
    submissionId,
    fingerprint: icFingerprint(d),
    lang: 'uz',
    hp: guard.hp,
    elapsed: String(guard.elapsed),
    submittedAt: new Date().toISOString(),
    source: 'fazodigital.uz/ishlab-chiqarish',
    token: APPLICATION_TOKEN,
  };
}

/** One id per logical application; every retry (timeout, network error, double click, reload) reuses it. */
export function newIcSubmissionId() {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    : (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 10);
  return `IC-${Date.now().toString(36).toUpperCase()}-${rand.toUpperCase()}`;
}

export const isIcSubmissionId = (id: string) => /^IC-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(id);

export type IcConfirmation = { submissionId: string; fingerprint: string; duplicate: boolean; updated: boolean };

/**
 * Resolves only when the Apps Script confirms that THIS submission id now holds THIS exact data
 * (its fingerprint). A reply for the same id with other data is never treated as success.
 */
export async function submitIshlab(payload: Record<string, string>): Promise<IcConfirmation> {
  const result: DeliveryResult = await deliverApplication(APPLICATION_ENDPOINT, payload, 25000);
  if (result.saved !== true || result.submissionId !== payload.submissionId) {
    throw new DeliveryError('bad_response', '', 'Receiver did not confirm this submission');
  }
  if (result.fingerprint !== payload.fingerprint) {
    throw new DeliveryError('bad_response', 'fingerprint_mismatch', 'Receiver stored different data for this submission');
  }
  return { submissionId: payload.submissionId, fingerprint: payload.fingerprint, duplicate: result.duplicate === true, updated: result.updated === true };
}

const LEAD_KEY = 'fazo.ishlab.leads';
/** Meta `Lead` at most once per submission id (the id doubles as eventID for future CAPI de-duplication). */
export function trackIcLeadOnce(submissionId: string) {
  let sent: string[] = [];
  try { sent = JSON.parse(localStorage.getItem(LEAD_KEY) || '[]') as string[]; } catch { /* storage unavailable */ }
  if (sent.includes(submissionId)) return false;
  track('Lead', { content_name: 'Ishlab chiqarish ariza', content_category: 'ishlab-chiqarish' }, { onceKey: `ic-lead-${submissionId}`, eventID: submissionId });
  try { localStorage.setItem(LEAD_KEY, JSON.stringify([...sent, submissionId].slice(-20))); } catch { /* storage unavailable */ }
  return true;
}
