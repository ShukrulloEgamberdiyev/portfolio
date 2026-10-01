/**
 * /card — FAZO Digital raqamli vizitkasi. Barcha matn shu yerda, sahifa va forma faqat ko‘rsatadi.
 * Variantlar docs/card-apps-script.gs dagi ruxsat etilgan qiymatlar bilan bir xil bo‘lishi shart.
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
};

export const CARD_OPT = {
  need: ['Marketing', 'SMM', 'Targeting', 'SMM + Targeting', 'Aniq bilmayman'],
  experience: ['Ha, hozir ham ishlayapmiz', 'Ha, oldin ishlaganmiz', 'Yo‘q'],
  currentSpend: ['Hozir sarflamaymiz', '$300 gacha', '$300–500', '$500–1,000', '$1,000–2,500', '$2,500+'],
  readyBudget: ['$500 gacha', '$500–1,000', '$1,000–2,500', '$2,500–5,000', '$5,000+'],
};

export const cardForm = {
  title: 'Hamkorlik arizasi',
  steps: ['BIZNESINGIZ', 'MARKETING HOLATI', 'HAMKORLIK'],
  labels: {
    name: 'Ismingiz',
    phone: 'Telefon raqamingiz',
    business: 'Biznesingiz qaysi yo‘nalishda?',
    link: 'Instagram yoki saytingiz',
    need: 'Sizga nima kerak?',
    experience: 'Oldin SMM yoki Targeting bilan ishlaganmisiz?',
    currentSpend: 'Hozir marketing va reklama uchun oyiga qancha sarflaysiz?',
    readyBudget: 'Marketing xizmatlariga oyiga qancha budjet ajratishga tayyorsiz?',
    problem: 'Hozirgi asosiy muammoingiz nima?',
  },
  placeholders: {
    business: 'Masalan: avtosalon, mebel, qurilish...',
    link: '@username yoki sayt manzili',
    problem: 'Masalan: lead kam, sotuv past, reklama ishlamayapti...',
  },
  errors: {
    name: 'Ismingizni kiriting',
    phone: 'Raqamni to‘liq kiriting: +998 XX XXX XX XX',
    business: 'Biznes yo‘nalishini yozing',
    link: 'Instagram (@username) yoki sayt manzilini to‘g‘ri kiriting',
    need: 'Kerakli xizmatni tanlang',
    experience: 'Variantlardan birini tanlang',
    currentSpend: 'Hozirgi sarf oralig‘ini tanlang',
    readyBudget: 'Budjet oralig‘ini tanlang',
    problem: 'Asosiy muammoni qisqacha yozing',
    step: 'Davom etish uchun belgilangan maydonlarni to‘ldiring.',
  },
  next: 'DAVOM ETISH',
  back: 'ORTGA',
  submit: 'ARIZANI YUBORISH',
  sending: 'YUBORILMOQDA…',
  sendError: 'Ariza yuborilmadi. Internet aloqasini tekshirib, qayta urinib ko‘ring — javoblaringiz saqlangan.',
  sendErrorAlt: 'Yoki to‘g‘ridan-to‘g‘ri yozing:',
  successTitle: 'Arizangiz qabul qilindi ✓',
  successText: 'Ma’lumotlaringizni ko‘rib chiqamiz va siz bilan bog‘lanamiz.',
  close: 'YOPISH',
  closeLabel: 'Formani yopish',
};
