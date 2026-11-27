/**
 * /card — FAZO Digital raqamli vizitkasi. Barcha matn shu yerda, sahifa va forma faqat ko‘rsatadi.
* Forma savollari: src/forms/defs.ts (FORMS.card).
 */

export const identity = {
  name: 'FAZO DIGITAL',
  services: ['MARKETING', 'SMM', 'TARGETING'],
  positioning: 'Biznesingiz uchun marketingni tizimlashtiramiz va uni sotuv bilan bog‘laymiz.',
  siteLabel: 'FAZO DIGITAL SAYTI',
  siteUrl: 'https://www.fazodigital.uz/',
};

export const servicesBlock = {
  heading: 'BIZ NIMA QILAMIZ?',
  tabs: [
    {
      id: 'marketing',
      label: 'MARKETING',
      text: 'Biznesingiz uchun marketing strategiyasini ishlab chiqamiz va mijoz jalb qilish jarayonini tizimlashtiramiz. Marketing, reklama va sotuv jarayonlarini bir-biriga bog‘lab ishlaymiz.',
    },
    {
      id: 'smm',
      label: 'SMM',
      text: 'Ijtimoiy tarmoqlardagi brendingizni professional shakllantiramiz. Kontent strategiyasi, syomka, montaj, dizayn va sahifalarni yuritish jarayonlarini boshqaramiz.',
    },
    {
      id: 'targeting',
      label: 'TARGETING',
      text: 'Mahsulot yoki xizmatingizni kerakli auditoriyaga Meta reklamalari orqali olib chiqamiz. Reklama strategiyasi, kreativlar, kampaniyalar va natijalarni optimizatsiya qilamiz.',
    },
  ],
} as const;

export const contactBlock = {
  heading: 'BIZ BILAN BOG‘LANING',
  register: 'RO‘YXATDAN O‘TISH',
  instagram: 'INSTAGRAM',
  telegram: 'TELEGRAM',
  call: 'QO‘NG‘IROQ QILISH',
  formTitle: 'Ro‘yxatdan o‘tish',
  close: 'Yopish',
};
