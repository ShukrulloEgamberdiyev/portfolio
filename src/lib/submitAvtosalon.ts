import { DeliveryError, deliverApplication, type DeliveryResult } from './applicationTransport';
import { APPLICATION_ENDPOINT, APPLICATION_TOKEN } from './submit';
import { normalizeLanding } from './attribution';
import { getAttribution, track } from './tracking';

export type AvData = {
  dealer: string; region: string; city: string; instagram: string; website: string;
  carTypes: string[]; carBrands: string; branches: string; stock: string;
  marketingOwner: string; targetStatus: string; budget: string; monthlyLeads: string; leadsUnknown: boolean;
  monthlySales: string; salesStaff: string; rop: string; crm: string; leadSystem: string;
  goals: string[]; goalsOther: string; problem: string;
  name: string; position: string; phone: string; telegram: string;
};

/** Flattens the form into the column keys the Apps Script expects for the "AVTOSALON LEADLAR" tab. */
export function buildAvtosalonPayload(d: AvData, guard: { hp: string; elapsed: number }, submissionId: string): Record<string, string> {
  const a = getAttribution();
  const digits = d.phone.replace(/\D/g, '').slice(-9);
  return {
    formType: 'avtosalon',
    dealer: d.dealer.trim(),
    region: [d.region, d.city.trim()].filter(Boolean).join(' — '),
    instagram: d.instagram.trim(),
    website: d.website.trim(),
    carTypes: [d.carTypes.join(', '), d.carBrands.trim() && `Brendlar: ${d.carBrands.trim()}`].filter(Boolean).join(' · '),
    branches: d.branches,
    stock: d.stock,
    marketingOwner: d.marketingOwner,
    targetStatus: d.targetStatus,
    budget: d.budget,
    monthlyLeads: d.leadsUnknown ? 'Aniq bilmayman' : d.monthlyLeads.trim(),
    monthlySales: d.monthlySales,
    salesStaff: d.salesStaff,
    rop: d.rop,
    crm: d.crm,
    leadSystem: d.leadSystem,
    goals: d.goals.join('; '),
    goalsOther: d.goals.includes('Boshqa') ? d.goalsOther.trim() : '',
    problem: d.problem.trim(),
    name: d.name.trim(),
    position: d.position.trim(),
    phone: `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`,
    telegram: d.telegram.trim(),
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
    source: 'fazodigital.uz/avtosalon',
    token: APPLICATION_TOKEN,
  };
}

/** One id per logical application; every retry (timeout, network error, double click, reload) reuses it. */
export function newSubmissionId() {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    : (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 10);
  return `AV-${Date.now().toString(36).toUpperCase()}-${rand.toUpperCase()}`;
}

/**
 * Resolves only after the Apps Script explicitly accepts the lead ({ok:true}, possibly duplicate:true when an
 * earlier attempt with identical content was already stored). Rejects with DeliveryError otherwise.
 * Apps Script cold starts can be slow, hence the longer timeout; a retry after a timeout is de-duplicated server-side.
 */
export async function submitAvtosalon(payload: Record<string, string>): Promise<DeliveryResult> {
  const result = await deliverApplication(APPLICATION_ENDPOINT, payload, 25000);
  // A bare {ok:true} (e.g. the endpoint's health answer) is not proof of a saved row.
  if (result.saved !== true || result.submissionId !== payload.submissionId) {
    throw new DeliveryError('bad_response', '', 'Receiver did not confirm this submission');
  }
  return result;
}

/** Valid ids look like AV-<time36>-<random>; the server rejects anything else. */
export const isSubmissionId = (id: string) => /^AV-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(id);

const LEAD_KEY = 'fazo.avtosalon.leads';
/**
 * Meta `Lead` fires at most once per submission id — across retries, duplicate responses and reloads.
 * The id doubles as Meta's eventID so a future Conversions API event de-duplicates against it.
 */
export function trackLeadOnce(submissionId: string) {
  let sent: string[] = [];
  try { sent = JSON.parse(localStorage.getItem(LEAD_KEY) || '[]') as string[]; } catch { /* storage unavailable */ }
  if (sent.includes(submissionId)) return false;
  track('Lead', { content_name: 'Avtosalon ariza', content_category: 'avtosalon' }, { onceKey: `av-lead-${submissionId}`, eventID: submissionId });
  try { localStorage.setItem(LEAD_KEY, JSON.stringify([...sent, submissionId].slice(-20))); } catch { /* storage unavailable */ }
  return true;
}
