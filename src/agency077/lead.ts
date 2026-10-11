// Shared lead schema + validation. Used by the browser form AND the server
// handler, so both sides enforce exactly the same rules.

export const CATEGORIES = [
  { id: 'ishlab-chiqarish', label: 'Ishlab chiqarish', tab: 'Ishlab chiqarish' },
  { id: 'qurilish', label: 'Qurilish', tab: 'Qurilish' },
  { id: 'avtosalon', label: 'Avtosalon', tab: 'Avtosalon' },
  { id: 'talim', label: 'Ta’lim sohasi', tab: 'Ta’lim' },
  { id: 'tekstil', label: 'To‘qimachilik (tekstil)', tab: 'Tekstil' },
  { id: 'boshqa', label: 'Boshqa', tab: 'Boshqa' },
] as const;

export const SERVICES = [
  { id: 'target', label: 'Target reklama' },
  { id: 'smm', label: 'SMM va kontent' },
  { id: 'kompleks', label: 'Kompleks marketing' },
  { id: 'maslahat', label: 'Maslahat kerak' },
] as const;

export const BUDGETS = [
  { id: '1-2k', label: '$1 000 – $2 000' },
  { id: '2-5k', label: '$2 000 – $5 000' },
  { id: '5k+', label: '$5 000+' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export type ServiceId = (typeof SERVICES)[number]['id'];
export type BudgetId = (typeof BUDGETS)[number]['id'];

export interface LeadInput {
  submissionId: string;
  category: CategoryId | '';
  customCategory: string;
  service: ServiceId | '';
  budget: BudgetId | '';
  name: string;
  phone: string; // 9 national digits, e.g. 901234567
  source: string;
  website?: string; // honeypot — must stay empty
}

export type LeadErrors = Partial<Record<'category' | 'customCategory' | 'service' | 'budget' | 'name' | 'phone', string>>;

// Uzbekistan mobile + Tashkent landline operator codes
const UZ_CODES = new Set([
  '20', '33', '50', '55', '61', '62', '65', '66', '67', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
  '88', '90', '91', '93', '94', '95', '97', '98', '99',
]);

export const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');

/** Normalises anything the user typed into the 9 national digits. */
export function normalisePhone(raw: string): string {
  let d = onlyDigits(raw);
  if (d.startsWith('998') && d.length > 9) d = d.slice(3);
  return d.slice(0, 9);
}

export function formatPhone(digits: string): string {
  const d = digits.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(' ');
}

export function isValidPhone(digits: string): boolean {
  return /^\d{9}$/.test(digits) && UZ_CODES.has(digits.slice(0, 2));
}

const clean = (s: unknown, max: number) =>
  String(s ?? '')
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export function validateLead(input: Partial<LeadInput>): LeadErrors {
  const e: LeadErrors = {};
  if (!CATEGORIES.some((c) => c.id === input.category)) e.category = 'Biznes yo‘nalishini tanlang.';
  if (input.category === 'boshqa' && clean(input.customCategory, 60).length < 2)
    e.customCategory = 'Biznesingiz yo‘nalishini qisqacha yozing.';
  if (!SERVICES.some((s) => s.id === input.service)) e.service = 'Kerakli xizmatni tanlang.';
  if (!BUDGETS.some((b) => b.id === input.budget)) e.budget = 'Oylik reklama budjetini tanlang.';
  const name = clean(input.name, 60);
  if (name.length < 2) e.name = 'Ismingizni kiriting (kamida 2 ta harf).';
  else if (!/^[\p{L}\s'’‘ʻʼ.-]+$/u.test(name)) e.name = 'Ismda faqat harflardan foydalaning.';
  const phone = normalisePhone(input.phone ?? '');
  if (phone.length < 9) e.phone = 'Telefon raqamini to‘liq kiriting: +998 XX XXX XX XX.';
  else if (!isValidPhone(phone)) e.phone = 'Operator kodi noto‘g‘ri. Masalan: +998 90 123 45 67.';
  return e;
}

export interface SheetRow {
  submissionId: string;
  tab: string;
  category: string;
  service: string;
  budget: string;
  name: string;
  phone: string;
  source: string;
  status: 'Yangi lead';
}

/** Server-side: turns validated input into the exact row written to Sheets. */
export function toSheetRow(input: LeadInput): SheetRow {
  const cat = CATEGORIES.find((c) => c.id === input.category)!;
  return {
    submissionId: clean(input.submissionId, 64),
    tab: cat.tab,
    category: cat.id === 'boshqa' ? `Boshqa: ${clean(input.customCategory, 60)}` : cat.label,
    service: SERVICES.find((s) => s.id === input.service)!.label,
    budget: BUDGETS.find((b) => b.id === input.budget)!.label,
    name: clean(input.name, 60),
    phone: '+998 ' + formatPhone(normalisePhone(input.phone)),
    source: clean(input.source, 80) || 'Sayt',
    status: 'Yangi lead',
  };
}
