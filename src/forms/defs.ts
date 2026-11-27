/**
 * Every lead form on fazodigital.uz, as data. The browser renders them and the server (/api/lead)
 * validates against the very same definitions, so a question the visitor did not see can't be
 * smuggled in, and an option label is stored exactly as it was shown.
 *
 * Conditional flow: a question with `showIf` is asked only when an earlier answer matches.
 * The contact step (name, phone, optional Telegram) always comes last and lives outside `questions`.
 *
 * No imports on purpose: this file is loaded by Vite (browser), by the Vercel Function and by the tests.
 */

export type ChoiceQuestion = {
  id: string;
  kind: 'choice';
  label: string;
  hint?: string;
  options: string[];
  /** Ask only when every listed earlier answer is one of the given options. */
  showIf?: Record<string, string[]>;
};

export type TextQuestion = {
  id: string;
  kind: 'text';
  label: string;
  hint?: string;
  placeholder?: string;
  optional?: boolean;
  max?: number;
  showIf?: Record<string, string[]>;
};

export type Question = ChoiceQuestion | TextQuestion;

export type FormDef = {
  /** Stable id stored in the sheet ("Forma" column) and used for analytics. */
  id: FormId;
  /** Service / direction written to the sheet when no answer narrows it down. */
  service: string;
  /** Question whose answer is the service/direction (overrides `service`). */
  serviceFrom?: string;
  questions: Question[];
};

export type FormId = 'sayt' | 'card' | 'qurilish' | 'avtosalon' | 'talim' | 'ishlab-chiqarish';

const INSTAGRAM_Q = (id = 'instagram'): ChoiceQuestion => ({
  id,
  kind: 'choice',
  label: 'Biznesingizning Instagram sahifasi bormi?',
  options: ['Ha', 'Yo‘q'],
});

const INSTAGRAM_LINK_Q = (from = 'instagram'): TextQuestion => ({
  id: `${from}Link`,
  kind: 'text',
  label: 'Instagram sahifangiz',
  placeholder: '@sahifa yoki havola',
  optional: true,
  max: 120,
  showIf: { [from]: ['Ha'] },
});

/** Ad budget is paid to the ad platform; it is not FAZO's fee. "Not decided yet" is always offered. */
const BUDGET_OPTIONS = ['$500 gacha', '$500–1,500', '$1,500–5,000', '$5,000 dan ko‘p', 'Hali aniqlamaganman'];

const BUDGET_Q = (showIf?: Record<string, string[]>): ChoiceQuestion => ({
  id: 'adBudget',
  kind: 'choice',
  label: 'Oylik reklama budjeti qancha bo‘lişi mumkin?',
  hint: 'Bu summa reklama platformasiga to‘lanadi va xizmat haqiga kirmaydi.',
  options: BUDGET_OPTIONS,
  ...(showIf ? { showIf } : {}),
});

const LEADS_WHERE_Q = (showIf?: Record<string, string[]>): ChoiceQuestion => ({
  id: 'leadsWhere',
  kind: 'choice',
  label: 'Murojaatlar hozir qayerda yuritiladi?',
  options: ['CRM tizimida', 'Excel yoki Google Sheets’da', 'Telegram yoki daftarda', 'Hech qayerda yozilmaydi'],
  ...(showIf ? { showIf } : {}),
});

const OTHER_TEXT_Q = (from: string, label = 'Qisqacha yozing'): TextQuestion => ({
  id: `${from}Other`,
  kind: 'text',
  label,
  max: 200,
  showIf: { [from]: ['Boşqa'] },
});

const SITE_SERVICES = [
  'Reklamadan sotuvgacha — kompleks',
  'Marketing strategiyasi va tahlil',
  'SMM, kontent va Reels',
  'Target reklama',
  'Landing sahifa',
  'CRM va sotuv jarayoni',
  'Hali aniq bilmayman',
];

const ADS_SERVICES = ['Reklamadan sotuvgacha — kompleks', 'Target reklama', 'Landing sahifa', 'Hali aniq bilmayman'];
const CRM_SERVICES = ['Reklamadan sotuvgacha — kompleks', 'CRM va sotuv jarayoni'];

export const FORMS: Record<FormId, FormDef> = {
  sayt: {
    id: 'sayt',
    service: 'Umumiy',
    serviceFrom: 'service',
    questions: [
      { id: 'service', kind: 'choice', label: 'Sizga qaysi yo‘nalişda yordam kerak?', options: SITE_SERVICES },
      {
        id: 'industry', kind: 'choice', label: 'Biznesingiz qaysi sohada?',
        options: ['Quriliş va ko‘chmas mulk', 'Avtosalon', 'Ta’lim', 'Işlab chiqariş', 'Savdo yoki xizmat ko‘rsatiş', 'Boşqa'],
      },
      OTHER_TEXT_Q('industry', 'Sohangizni qisqacha yozing'),
      INSTAGRAM_Q(),
      INSTAGRAM_LINK_Q(),
      BUDGET_Q({ service: ADS_SERVICES }),
      LEADS_WHERE_Q({ service: CRM_SERVICES }),
    ],
  },
  card: {
    id: 'card',
    service: 'Vizitka',
    serviceFrom: 'need',
    questions: [
      { id: 'need', kind: 'choice', label: 'Sizga nima kerak?', options: ['Marketing', 'SMM', 'Targeting', 'Hammasi birga', 'Hali aniq bilmayman'] },
      INSTAGRAM_Q(),
      INSTAGRAM_LINK_Q(),
      BUDGET_Q({ need: ['Targeting', 'Hammasi birga'] }),
    ],
  },
  qurilish: {
    id: 'qurilish',
    service: 'Quriliş',
    questions: [
      {
        id: 'stage', kind: 'choice', label: 'Loyihangiz qaysi bosqichda?',
        options: ['Yangi loyiha, sotuv hali boşlanmagan', 'Quriliş jarayonida, sotuv boşlangan', 'Quriliş tugagan, sotuv davom etmoqda'],
      },
      {
        id: 'problem', kind: 'choice', label: 'Hozir eng ko‘p nima qiynayapti?',
        options: ['Murojaatlar kam', 'Murojaatlar ko‘p, lekin sifati past', 'Murojaatlar sotuvgacha yetmayapti', 'Reklama natijasini sotuv bilan soliştira olmaymiz', 'Boşqa'],
      },
      OTHER_TEXT_Q('problem'),
      { id: 'salesTeam', kind: 'choice', label: 'Sotuv bo‘limingiz bormi?', options: ['Ha, menejerlar bor', 'Yo‘q, sotuvni o‘zimiz qilamiz'] },
      LEADS_WHERE_Q({ salesTeam: ['Ha, menejerlar bor'] }),
      INSTAGRAM_Q(),
      INSTAGRAM_LINK_Q(),
      BUDGET_Q(),
      { id: 'company', kind: 'text', label: 'Kompaniya yoki turar joy majmuasi nomi', max: 120 },
    ],
  },
  avtosalon: {
    id: 'avtosalon',
    service: 'Avtosalon',
    questions: [
      { id: 'cars', kind: 'choice', label: 'Qanday avtomobillar sotasiz?', options: ['Yangi avtomobillar', 'Işlatilgan avtomobillar', 'Ikkalasi ham'] },
      { id: 'adsNow', kind: 'choice', label: 'Hozir reklama berasizmi?', options: ['Ha, o‘zimiz yuritamiz', 'Ha, agentlik yoki mutaxassis yuritadi', 'Yo‘q'] },
      {
        id: 'monthlyLeads', kind: 'choice', label: 'Oyiga taxminan nechta murojaat keladi?',
        options: ['50 tagacha', '50–200', '200 dan ko‘p', 'Aniq bilmayman'],
        showIf: { adsNow: ['Ha, o‘zimiz yuritamiz', 'Ha, agentlik yoki mutaxassis yuritadi'] },
      },
      LEADS_WHERE_Q(),
      {
        id: 'problem', kind: 'choice', label: 'Qaysi masala birinchi navbatda hal bo‘lişi kerak?',
        options: ['Test-drayv va taşrif kam', 'Murojaatlarga kech javob beriladi', 'Qaysi reklama sotuv berayotgani noma’lum', 'Boşqa'],
      },
      OTHER_TEXT_Q('problem'),
      INSTAGRAM_Q(),
      INSTAGRAM_LINK_Q(),
      BUDGET_Q(),
      { id: 'company', kind: 'text', label: 'Avtosalon nomi va şahar', max: 120 },
    ],
  },
  talim: {
    id: 'talim',
    service: 'Ta’lim',
    questions: [
      {
        id: 'type', kind: 'choice', label: 'Ta’lim muassasangiz turi',
        options: ['O‘quv markazi yoki kurslar', 'Xususiy maktab yoki bog‘cha', 'Onlayn kurs', 'Boşqa'],
      },
      OTHER_TEXT_Q('type'),
      {
        id: 'goal', kind: 'choice', label: 'Asosiy maqsadingiz qaysi?',
        options: ['Yangi o‘quvchilar qabulini oşiriş', 'Murojaatlar javobsiz qolmasligi', 'Qaysi reklama o‘quvchi olib kelayotganini biliş', 'Brendni tanitiş'],
      },
      { id: 'branches', kind: 'choice', label: 'Nechta filialingiz bor?', options: ['1 ta', '2–3 ta', '4 ta va undan ko‘p', 'Faqat onlayn'] },
      {
        id: 'whoAnswers', kind: 'choice', label: 'Murojaatlarga kim javob beradi?',
        options: ['Administrator', 'Alohida sotuv menejeri', 'Rahbarning o‘zi', 'Aniq belgilanmagan'],
      },
      INSTAGRAM_Q(),
      INSTAGRAM_LINK_Q(),
      BUDGET_Q(),
      { id: 'company', kind: 'text', label: 'Muassasa nomi va şahar', max: 120 },
    ],
  },
  'ishlab-chiqarish': {
    id: 'ishlab-chiqarish',
    service: 'Işlab chiqariş',
    questions: [
      {
        id: 'product', kind: 'choice', label: 'Nima işlab chiqarasiz?',
        options: ['Quriliş materiallari', 'Mebel', 'Oziq-ovqat', 'To‘qimachilik', 'Boşqa'],
      },
      OTHER_TEXT_Q('product', 'Mahsulotingizni qisqacha yozing'),
      { id: 'buyers', kind: 'choice', label: 'Asosan kimga sotasiz?', options: ['Diler va ulgurji xaridorlarga', 'To‘g‘ridan-to‘g‘ri iste’molchiga', 'Ikkalasiga ham'] },
      {
        id: 'problem', kind: 'choice', label: 'Qaysi masala birinchi navbatda hal bo‘lişi kerak?',
        options: ['Yangi diler va hamkorlar kam', 'Murojaatlar kam', 'Murojaatlar kuzatilmaydi', 'Brend bozorda tanilmagan'],
      },
      LEADS_WHERE_Q(),
      INSTAGRAM_Q(),
      INSTAGRAM_LINK_Q(),
      BUDGET_Q(),
      { id: 'company', kind: 'text', label: 'Korxona nomi', max: 120 },
    ],
  },
};

/** Questions to ask right now, given the answers so far (order preserved). */
export function visibleQuestions(def: FormDef, answers: Record<string, string>): Question[] {
  const shown: Question[] = [];
  const shownIds = new Set<string>();
  for (const q of def.questions) {
    if (q.showIf) {
      const ok = Object.entries(q.showIf).every(([dep, values]) => shownIds.has(dep) && values.includes(answers[dep] ?? ''));
      if (!ok) continue;
    }
    shown.push(q);
    shownIds.add(q.id);
  }
  return shown;
}

/** Service / direction value for the sheet. */
export function serviceOf(def: FormDef, answers: Record<string, string>): string {
  const v = def.serviceFrom ? answers[def.serviceFrom] : '';
  return v || def.service;
}

export const FORM_IDS = Object.keys(FORMS) as FormId[];
