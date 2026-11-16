/**
 * Uzbek mobile numbers, shared by every lead form.
 *
 * The field shows a fixed "+998" prefix, so the state holds only the national part.
 * Nothing the visitor types is thrown away silently: extra digits stay visible and are
 * reported as an error, instead of the number being cut to nine digits and accepted.
 */

/** Longest value kept in the field (9 expected + room to show what is wrong). */
const MAX_DIGITS = 14;

/** Digits of the national number. A full "+998 XX XXX XX XX" paste or autofill loses its country code. */
export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('998')) digits = digits.slice(3);
  return digits.slice(0, MAX_DIGITS);
}

/** "901234567" → "90 123 45 67"; anything beyond nine digits is shown as a trailing group. */
export function formatPhone(digits: string): string {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9), digits.slice(9)].filter(Boolean).join(' ');
}

export const isPhone = (value: string) => /^[1-9]\d{8}$/.test(phoneDigits(value));

/** Empty string when the number is valid, otherwise a message that says what to fix. */
export function phoneError(value: string): string {
  const digits = phoneDigits(value);
  if (!digits) return 'Telefon raqamingizni kiriting';
  if (digits.length < 9) return 'Raqam to‘liq emas: +998 dan keyin 9 ta raqam bo‘lishi kerak';
  if (digits.length > 9) return 'Raqamda ortiqcha belgi bor: +998 dan keyin 9 ta raqam bo‘lishi kerak';
  if (digits.startsWith('0')) return 'Raqamni tekshiring: operator kodi 0 bilan boshlanmaydi';
  return '';
}

/** Canonical form sent to the server: "+998 90 123 45 67". Call only after validation. */
export function phoneForServer(value: string): string {
  const d = phoneDigits(value);
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}
