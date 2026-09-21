/** Language-independent content. Brand names, system vocabulary and contacts stay constant across UZ / RU / EN. */

export const CONTACT = {
  instagram: { handle: '@fazo_digital', url: 'https://instagram.com/fazo_digital' },
  telegram: { handle: '@fazo_digital', url: 'https://t.me/fazo_digital' },
  phone: { display: '+998 93 040 10 70', url: 'tel:+998930401070' },
  domain: 'fazodigital.uz',
};

export const STATS = { campaigns: 200, clients: 50, brands: 19 };

/** Replace `logo` with an imported monochrome SVG when brand files are available. */
export const CLIENTS: { name: string; logo?: string }[] = [
  { name: 'Fazilat Estate' }, { name: 'Rose Flowers' }, { name: 'Bliss' }, { name: 'WEST Tashkent' },
  { name: 'UZ Style Catering' }, { name: 'Boost Uzbekistan' }, { name: 'Alleya' }, { name: 'EXEED · Buxoro Autocity' },
  { name: 'Laminox Factory' }, { name: 'Aura Uzbekistan' }, { name: 'Meyfu' }, { name: 'IFAR Baklava' },
  { name: 'Tatneft 777' }, { name: 'ZK Academy' }, { name: 'Ezmok' }, { name: 'Rivojuz' },
  { name: 'Dilbar Restaurant' }, { name: 'ChefKatering' },
];

/** The growth system has nine stages. Stage names, outputs and descriptions live in the i18n dictionaries (t.system.steps). */
export const SYSTEM_STAGE_COUNT = 9;

export const EXPERTISE = [
  // Display names live in the i18n dictionaries (t.expertise.modules[i].name).
  { slug: 'growth-strategy', steps: [0, 1], cases: ['fazilat-estate', 'uz-style-catering'] },
  { slug: 'creative-content', steps: [2], cases: ['dilbar-restaurant', 'laminox-factory'] },
  { slug: 'performance-marketing', steps: [3, 4], cases: ['exeed-buxoro-autocity', 'zk-academy'] },
  { slug: 'sales-system', steps: [5, 6, 7], cases: ['fazilat-estate', 'uz-style-catering'] },
];

/** Process phase names live in the i18n dictionaries (t.process.phases). */

/** Case display names; copy lives in i18n. `media` accepts a poster image and/or a muted loop video. */
export const CASES: { slug: string; name: string; media?: { poster?: string; video?: string } }[] = [
  { slug: 'fazilat-estate', name: 'Fazilat Estate' },
  { slug: 'exeed-buxoro-autocity', name: 'EXEED · Buxoro Autocity' },
  { slug: 'laminox-factory', name: 'Laminox Factory' },
  { slug: 'uz-style-catering', name: 'UZ Style Catering' },
  { slug: 'zk-academy', name: 'ZK Academy' },
  { slug: 'dilbar-restaurant', name: 'Dilbar Restaurant' },
];

export const SIGNATURE = 'NATIJAGA ISHLAYMIZ. SIZ O‘SASIZ.';

export const SITE_URL = 'https://fazodigital.uz';

export const SECTION_IDS = {
  expertise: 'expertise', work: 'work', process: 'process', about: 'about', insights: 'insights', apply: 'apply', contact: 'contact',
} as const;
