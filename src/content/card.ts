/**
 * /card — FAZO Digital raqamli vizitkasi. Barcha matn shu yerda, sahifa va forma faqat ko‘rsatadi.
* Forma savollari: src/forms/defs.ts (FORMS.card).
 */

export const identity = {
  name: 'FAZO DIGITAL',
  services: ['MARKETING', 'SMM', 'TARGETING'],
  positioning: 'Biznesingiz uchun marketingni tizimlaştiramiz va uni sotuv bilan bog‘laymiz.',
  siteLabel: 'FAZO DIGITAL SAYTI',
  siteUrl: 'https://www.fazodigital.uz/',
};

export const servicesBlock = {
  heading: 'BIZ NIMA QILAMIZ?',
  tabs: [
    {
      id: 'marketing',
      label: 'MARKETING',
      text: 'Biznesingiz uchun marketing strategiyasini işlab chiqamiz va mijoz jalb qiliş jarayonini tizimlaştiramiz. Marketing, reklama va sotuv jarayonlarini bir-biriga bog‘lab işlaymiz.',
    },
    {
      id: 'smm',
      label: 'SMM',
      text: 'Ijtimoiy tarmoqlardagi brendingizni professional şakllantiramiz. Kontent strategiyasi, syomka, montaj, dizayn va sahifalarni yuritiş jarayonlarini boşqaramiz.',
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
  register: 'RO‘YXATDAN O‘TIŞ',
  instagram: 'INSTAGRAM',
  telegram: 'TELEGRAM',
  call: 'QO‘NG‘IROQ QILIŞ',
  formTitle: 'Ro‘yxatdan o‘tiş',
  close: 'Yopiş',
};
