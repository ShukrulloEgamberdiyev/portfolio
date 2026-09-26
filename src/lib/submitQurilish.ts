import { DeliveryError, deliverApplication, type DeliveryResult } from './applicationTransport';
import { APPLICATION_ENDPOINT, APPLICATION_TOKEN } from './submit';
import { getAttribution, track } from './tracking';

export type QrData = {
  name: string; phone: string; company: string; region: string; city: string;
  stage: string; problem: string; problemOther: string; budget: string; contactTime: string;
};

/** Flattens the form into the keys the Apps Script expects for the "QURILISH LEADLAR" tab. */
export function buildQurilishPayload(d: QrData, guard: { hp: string; elapsed: number }, submissionId: string): Record<string, string> {
  const a = getAttribution();
  const digits = d.phone.replace(/\D/g, '').slice(-9);
  return {
    formType: 'qurilish',
    name: d.name.trim(),
    phone: `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`,
    company: d.company.trim(),
    region: [d.region, d.city.trim()].filter(Boolean).join(' — '),
    stage: d.stage,
    problem: d.problem,
    problemOther: d.problem === 'Boshqa' ? d.problemOther.trim() : '',
    budget: d.budget,
    contactTime: d.contactTime,
    utm_source: a.utm_source ?? '',
    utm_medium: a.utm_medium ?? '',
    utm_campaign: a.utm_campaign ?? '',
    utm_content: a.utm_content ?? '',
    utm_term: a.utm_term ?? '',
    fbclid: a.fbclid ?? '',
    page: a.landing || (typeof location !== 'undefined' ? location.href : ''),
    referrer: a.referrer ?? '',
    submissionId,
    lang: 'uz',
    hp: guard.hp,
    elapsed: String(guard.elapsed),
    submittedAt: new Date().toISOString(),
    source: 'fazodigital.uz/qurilish',
    token: APPLICATION_TOKEN,
  };
}

/** One id per logical application; every retry (timeout, network error, double click, reload) reuses it. */
export function newQrSubmissionId() {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    : (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 10);
  return `QR-${Date.now().toString(36).toUpperCase()}-${rand.toUpperCase()}`;
}

export const isQrSubmissionId = (id: string) => /^QR-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(id);

/** Resolves only when the Apps Script confirms this exact submission was stored. */
export async function submitQurilish(payload: Record<string, string>): Promise<DeliveryResult> {
  const result = await deliverApplication(APPLICATION_ENDPOINT, payload, 25000);
  if (result.saved !== true || result.submissionId !== payload.submissionId) {
    throw new DeliveryError('bad_response', '', 'Receiver did not confirm this submission');
  }
  return result;
}

const LEAD_KEY = 'fazo.qurilish.leads';
/** Meta `Lead` at most once per submission id (the id doubles as eventID for future CAPI de-duplication). */
export function trackQrLeadOnce(submissionId: string) {
  let sent: string[] = [];
  try { sent = JSON.parse(localStorage.getItem(LEAD_KEY) || '[]') as string[]; } catch { /* storage unavailable */ }
  if (sent.includes(submissionId)) return false;
  track('Lead', { content_name: 'Qurilish ariza', content_category: 'qurilish' }, { onceKey: `qr-lead-${submissionId}`, eventID: submissionId });
  try { localStorage.setItem(LEAD_KEY, JSON.stringify([...sent, submissionId].slice(-20))); } catch { /* storage unavailable */ }
  return true;
}
