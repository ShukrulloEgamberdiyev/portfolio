/**
 * Name, phone and Telegram for every lead form — one set of rules in the browser and on the server.
 * No imports: shared by Vite, the Vercel Function and the tests.
 *
 * Phone:
 *  - Uzbek numbers in any common shape are understood: "90 123 45 67", "+998 (90) 123-45-67",
 *    "998901234567", "00998 90 1234567", "tel:+998901234567", "8 90 123 45 67" (old trunk prefix).
 *    Stored as "+998901234567".
 *  - A number of another country is accepted only with an explicit "+" or "00" prefix and 8–15 digits,
 *    stored as "+<digits>". Without a prefix a non-Uzbek length is an error that says what to fix.
 *  - Nothing is cut silently: extra or missing digits are reported.
 */

export type PhoneResult = { ok: true; e164: string; display: string; foreign: boolean } | { ok: false; error: string };

export const PHONE_ERRORS = {
  empty: 'Telefon raqamingizni kiriting',
  short: 'Raqam to‘liq emas: +998 dan keyin 9 ta raqam bo‘lişi kerak',
  long: 'Raqamda ortiqcha raqam bor: +998 dan keyin 9 ta raqam bo‘lişi kerak',
  zero: 'Operator kodi 0 bilan boşlanmaydi — raqamni tekşiring',
  letters: 'Raqamda faqat raqamlar, bo‘ş joy, +, - va qavslar bo‘lişi mumkin',
  foreign: 'Xorijiy raqamni + va mamlakat kodi bilan yozing (masalan, +7…, +1…)',
} as const;

export function normalizePhone(raw: string): PhoneResult {
  let s = String(raw ?? '').trim().replace(/^tel:/i, '');
  if (!s) return { ok: false, error: PHONE_ERRORS.empty };
  if (!/^[+\d\s().\- ]+$/.test(s)) return { ok: false, error: PHONE_ERRORS.letters };
  const plus = s.startsWith('+');
  let digits = s.replace(/\D/g, '');
  let international = plus;
  if (!plus && digits.startsWith('00')) { digits = digits.slice(2); international = true; }

  if (digits.startsWith('998') && (international || digits.length >= 12)) {
    return uzbek(digits.slice(3));
  }
  if (international) {
    if (digits.length < 8 || digits.length > 15) return { ok: false, error: PHONE_ERRORS.foreign };
    return { ok: true, e164: `+${digits}`, display: `+${digits}`, foreign: true };
  }
  // Local writing: 9 digits, or the old "8 90 …" trunk prefix.
  if (digits.length === 10 && digits.startsWith('8')) digits = digits.slice(1);
  if (digits.length > 9 && digits.length <= 15) return { ok: false, error: digits.length === 12 ? PHONE_ERRORS.long : PHONE_ERRORS.foreign };
  return uzbek(digits);
}

function uzbek(national: string): PhoneResult {
  if (national.length < 9) return { ok: false, error: PHONE_ERRORS.short };
  if (national.length > 9) return { ok: false, error: PHONE_ERRORS.long };
  if (national.startsWith('0')) return { ok: false, error: PHONE_ERRORS.zero };
  const d = national;
  return { ok: true, e164: `+998${d}`, display: `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`, foreign: false };
}

/** As-you-type mask for the national part after the fixed "+998" prefix; keeps extra digits visible. */
export function maskUzPhone(value: string): string {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length >= 12 && digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 12);
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9), digits.slice(9)].filter(Boolean).join(' ');
}

export type TelegramResult = { ok: true; value: string } | { ok: false; error: string };

export const TELEGRAM_ERROR = 'Telegram username 5–32 ta lotin harfi, raqam yoki _ dan iborat bo‘ladi (masalan, @fazo_digital)';

/** Optional Telegram username: "@name", "name", "t.me/name", "https://t.me/name" → "@name". Empty is fine. */
export function normalizeTelegram(raw: string): TelegramResult {
  const s = String(raw ?? '').trim();
  if (!s) return { ok: true, value: '' };
  const m = s.match(/^(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([^/?#\s]+)\/?$/i) || s.match(/^@?([^\s/]+)$/);
  const name = m ? m[1] : '';
  if (!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(name) || name.endsWith('_')) return { ok: false, error: TELEGRAM_ERROR };
  return { ok: true, value: `@${name}` };
}

export const NAME_ERROR = 'Ismingizni kiriting (2–60 belgi)';

export function normalizeName(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  const v = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (v.length < 2 || v.length > 60 || /[<>{}]/.test(v) || !/\p{L}/u.test(v)) return { ok: false, error: NAME_ERROR };
  return { ok: true, value: v };
}
