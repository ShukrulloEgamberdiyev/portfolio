import { submitConfirmed, type Confirmation } from './confirmedSubmit';
import { QR_FINGERPRINT_FIELDS, leadFingerprint } from './leadFingerprint';
import { phoneForServer } from './phone';
import { APPLICATION_ENDPOINT, APPLICATION_TOKEN } from './submit';
import { normalizeLanding } from './attribution';
import { getAttribution, track } from './tracking';

export type QrData = {
  name: string; phone: string; company: string; region: string; city: string;
  stage: string; problem: string; problemOther: string; budget: string; contactTime: string;
};

/** Flattens the form into the keys the Apps Script expects for the "QURILISH LEADLAR" tab. */
export function buildQurilishPayload(d: QrData, guard: { hp: string; elapsed: number }, submissionId: string): Record<string, string> {
  const a = getAttribution();
  const lead = {
    name: d.name.trim(),
    phone: phoneForServer(d.phone),
    company: d.company.trim(),
    region: [d.region, d.city.trim()].filter(Boolean).join(' — '),
    stage: d.stage,
    problem: d.problem,
    problemOther: d.problem === 'Boshqa' ? d.problemOther.trim() : '',
  };
  return {
    formType: 'qurilish',
    ...lead,
    fingerprint: leadFingerprint(QR_FINGERPRINT_FIELDS, lead),
    budget: '', // no longer asked on the page (6-field form); the server accepts ''
    contactTime: '', // no longer asked on the page; '' is accepted by the server
    utm_source: a.utm_source ?? '',
    utm_medium: a.utm_medium ?? '',
    utm_campaign: a.utm_campaign ?? '',
    utm_content: a.utm_content ?? '',
    utm_term: a.utm_term ?? '',
    fbclid: a.fbclid ?? '',
    page: a.landing || (typeof location !== 'undefined' ? normalizeLanding(location.href) : ''),
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

/** Fingerprint of what the form currently holds — changes whenever the visitor edits an answer. */
export const qrFingerprint = (d: QrData) => buildQurilishPayload(d, { hp: '', elapsed: 0 }, '').fingerprint;

/**
 * Resolves only when the receiver confirms that this submission id holds exactly this data
 * (see confirmedSubmit.ts for the lost-reply rules).
 */
export function submitQurilish(o: { build: (id: string) => Record<string, string>; submissionId: string; earlier: string[]; onNewId?: (id: string) => void }): Promise<Confirmation> {
  return submitConfirmed({ endpoint: APPLICATION_ENDPOINT, newId: newQrSubmissionId, ...o });
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
