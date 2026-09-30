/** Copy and form options for the /qurilish landing (residential developers, Uzbek only). */

export const QR_FORM_ID = 'loyiha';

/** One CTA label everywhere: every primary button leads to the same form. */
export const CTA = 'Loyiham uchun yechim olish';

export const hero = {
  brandNote: 'Qurilish loyihalari uchun marketing',
  eyebrow: 'Qurilish kompaniyalari uchun',
  title: 'Uylar bor. Endi ularga xaridor kerak.',
  text: 'Meta Ads va Google Ads orqali potensial xaridorlarni olib kelamiz va murojaatlarni sotuv bo‘limigacha bog‘laymiz.',
  context: 'O‘zbekiston bo‘ylab turar joy loyihalari bilan ishlaymiz.',
  imageAlt: 'Kunduzgi yorug‘likdagi yangi turar joy majmuasi hovlisi: rangli ko‘p qavatli binolar, yashil maysazor va sport maydonchasi',
};

export const problem = {
  title: 'Qurilish bor, lekin sotuv sustmi?',
  cards: [
    { t: 'Murojaatlar kam', d: 'Potensial xaridorlar yetarli kelmayapti.' },
    { t: 'Reklama ishlayapti, natija qoniqtirmaydi', d: 'Budjet sarflanadi, lekin kerakli auditoriyadan murojaat kam.' },
    { t: 'Murojaatlar yo‘qolmoqda', d: 'CRM, tezkor aloqa yoki follow-up tizimi yetarli emas.' },
  ],
  solutionLabel: 'FAZO Digital nima qiladi?',
  solution: 'Potensial xaridorlarni olib kelamiz va murojaatlarni sotuv bo‘limigacha bog‘laymiz.',
};

export const process = {
  title: 'Jarayon oddiy.',
  steps: ['Meta Ads + Google Ads', 'Landing', 'Murojaat', 'CRM', 'Sotuv bo‘limi'],
  note: 'Reklamadan kelgan har bir murojaat nazoratli jarayonga tushadi.',
  items: [
    { t: 'Strategiya', d: 'Loyiha uchun offer va reklama yo‘nalishi.' },
    { t: 'Reklama', d: 'Meta Ads + Google Ads.' },
    { t: 'Landing + CRM', d: 'Murojaatlarni yig‘ish va nazorat qilish.' },
    { t: 'Sotuv tizimi', d: 'Kerak bo‘lsa sotuv bo‘limini noldan quramiz.' },
  ],
};

export const offer = {
  title: 'Loyihangiz uchun yechim kerakmi?',
  text: 'Loyihangiz haqida qisqacha ma’lumot qoldiring. Jamoamiz uni ko‘rib chiqib, siz bilan bog‘lanadi.',
  priceLabel: 'FAZO Digital xizmati',
  price: '$5,000–$7,000',
  per: '/ oy',
  adBudget: 'Meta Ads va Google Ads reklama budjeti alohida.',
};

/* ───────── Form ───────── */

export const form = {
  submit: 'Loyihamni tahlil qilish',
  sending: 'Yuborilmoqda…',
  required: 'Belgilangan maydonlarni to‘ldiring.',
  errors: {
    network: 'Ariza yuborilmadi: aloqa uzildi yoki server javob bermadi. Internetni tekshirib, qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    busy: 'Hozir arizalar juda ko‘p. Bir necha daqiqadan so‘ng qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    contact: 'Shu telefon raqamidan yaqinda bir nechta ariza yuborilgan. Keyinroq qayta urinib ko‘ring yoki Telegram orqali yozing.',
    invalid: 'Ariza qabul qilinmadi: ba’zi maydonlar to‘liq emas. Javoblarni tekshirib, qayta yuboring.',
    generic: 'Ariza yuborilmadi. Qayta urinib ko‘ring — kiritilgan ma’lumotlar saqlanib qoldi.',
  },
  retry: 'Qayta yuborish',
  errorAlt: 'Muammo takrorlansa, Telegram orqali yozing:',
  successTitle: 'Loyihangiz qabul qilindi.',
  successText: 'Jamoamiz loyihangizni ko‘rib chiqadi va siz bilan bog‘lanadi.',
  privacy: 'Yuborish orqali ma’lumotlaringiz',
  privacyLink: 'maxfiylik siyosati',
  privacyTail: 'asosida qayta ishlanishiga rozilik bildirasiz.',
};

export const REGIONS = [
  'Toshkent shahri', 'Toshkent viloyati', 'Andijon viloyati', 'Buxoro viloyati', 'Farg‘ona viloyati', 'Jizzax viloyati',
  'Xorazm viloyati', 'Namangan viloyati', 'Navoiy viloyati', 'Qashqadaryo viloyati', 'Qoraqalpog‘iston Respublikasi',
  'Samarqand viloyati', 'Sirdaryo viloyati', 'Surxondaryo viloyati',
];

export const OPT = {
  stage: ['Qurilish jarayonida', 'Sotuv boshlangan', 'Qurilish tugagan, sotuv davom etmoqda', 'Yangi loyiha'],
  problem: [
    'Murojaatlar kam',
    'Murojaatlar sifati past',
    'Sotuv sust',
    'Marketing tizimi yo‘q',
    'Sotuv bo‘limi yo‘q',
    'Boshqa',
  ],
  /** Not asked on the page any more (6-field form); the server still accepts them when sent. */
  budget: ['$1,000 gacha', '$1,000–$3,000', '$3,000–$5,000', '$5,000+'],
  contactTime: ['Imkon qadar tezroq', 'Ertalab (9:00–12:00)', 'Tushdan keyin (12:00–18:00)', 'Kechqurun (18:00–20:00)'],
};
