import { DeliveryError, deliverApplication } from './applicationTransport';
import { normalizeLanding } from './attribution';
import { getAttribution } from './tracking';

/**
 * /card arizalari ALOHIDA Google Sheet'ga ("FAZO Digital Card Leads") yoziladi — sayt, /avtosalon,
 * /qurilish va /ishlab-chiqarish ishlatadigan "Targeting Xizmat" endpointiga emas.
 * Qabul qiluvchi: docs/card-apps-script.gs (shu jadvalning o‘ziga bog‘langan Apps Script web app).
 *
 * Standart qiymat — "FAZO Card Leads Receiver" deployment (2026-10-02, faqat shu jadvalga yozadi).
 * VITE_CARD_ENDPOINT faqat boshqa deployment'ga o‘tkazish uchun. Eski lid jadvallariga hech qanday yo‘l yo‘q.
 */
export const CARD_ENDPOINT = ((import.meta.env.VITE_CARD_ENDPOINT as string | undefined)
  || 'https://script.google.com/macros/s/AKfycbzP5dn7y1OtlEaEbDF4t7PYF_DRO9ic_fda_yP-d32Wkinoc6CUcw1wYzxzdlcXDfwQ/exec').trim();
/** Ochiq identifikator (brauzer buildida ko‘rinadi), maxfiy kalit emas. Apps Script dagi CARD_TOKEN bilan bir xil. */
export const CARD_TOKEN = ((import.meta.env.VITE_CARD_TOKEN as string | undefined) || 'fazo-card-2026').trim();

export type CardData = {
  name: string; phone: string; business: string; link: string;
  need: string; experience: string; currentSpend: string;
  readyBudget: string; problem: string;
};

export const EMPTY_CARD: CardData = {
  name: '', phone: '', business: '', link: '', need: '', experience: '', currentSpend: '', readyBudget: '', problem: '',
};

export function formatUzPhone(digits9: string) {
  const d = digits9.replace(/\D/g, '').slice(-9);
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}

/** Bitta mantiqiy ariza uchun bitta ID: qayta urinishlar (timeout, ikki marta bosish) shu ID bilan ketadi — jadvalda dublikat bo‘lmaydi. */
export function newCardSubmissionId() {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    : (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 10);
  return `FC-${Date.now().toString(36).toUpperCase()}-${rand.toUpperCase()}`;
}

export function buildCardPayload(d: CardData, guard: { hp: string; elapsed: number }, submissionId: string): Record<string, string> {
  const a = getAttribution();
  return {
    formType: 'card',
    name: d.name.trim(),
    phone: formatUzPhone(d.phone),
    business: d.business.trim(),
    link: d.link.trim(),
    need: d.need,
    experience: d.experience,
    currentSpend: d.currentSpend,
    readyBudget: d.readyBudget,
    problem: d.problem.trim(),
    utm_source: a.utm_source ?? '',
    utm_medium: a.utm_medium ?? '',
    utm_campaign: a.utm_campaign ?? '',
    page: a.landing || (typeof location !== 'undefined' ? normalizeLanding(location.href) : ''),
    submissionId,
    hp: guard.hp,
    elapsed: String(guard.elapsed),
    token: CARD_TOKEN,
  };
}

/** Faqat server aynan SHU ariza ID saqlanganini tasdiqlasa muvaffaqiyat. Aks holda xato — muvaffaqiyat ekrani chiqmaydi. */
export async function submitCard(payload: Record<string, string>): Promise<{ duplicate: boolean }> {
  const result = await deliverApplication(CARD_ENDPOINT, payload, 25000);
  if (result.saved !== true || result.submissionId !== payload.submissionId) {
    throw new DeliveryError('bad_response', '', 'Receiver did not confirm this submission');
  }
  return { duplicate: result.duplicate === true };
}
