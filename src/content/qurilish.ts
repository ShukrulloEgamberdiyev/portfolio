/** Copy and form options for the /qurilish landing (residential developers, Uzbek only). */

export const QR_FORM_ID = 'loyiha';

export const nav = [
  { id: 'jarayon', label: 'Jarayon' },
  { id: 'hamkorlik', label: 'Hamkorlik' },
];

/** One CTA label everywhere: every primary button leads to the same form. */
export const CTA = 'Loyiham uchun yechim olish';

export const hero = {
  eyebrow: 'Turar joy quruvchilari uchun',
  title: 'Uylar qurilyapti. Xaridorlarni olib kelishni bizga qo‘ying.',
  text: 'Qurilish loyihalari uchun Meta Ads, Google Ads va sotuv tizimini birlashtirib, potensial mijozlar oqimini yo‘lga qo‘yamiz.',
  context: 'O‘zbekiston bo‘ylab yangi qurilayotgan va sotuvdagi turar joy loyihalari bilan ishlaymiz.',
  imageAlt: 'Kunduzgi yorug‘likdagi zamonaviy ko‘p qavatli turar joy binosi',
};

export const problem = {
  eyebrow: 'Muammo',
  title: 'Qurilish bor, lekin sotuv sustmi?',
  cards: [
    { t: 'Murojaatlar kam', d: 'Potensial xaridorlar muntazam kelmaydi.' },
    { t: 'Reklama bor, lekin sifatli mijoz kam', d: 'Budjet sarflanadi, kerakli auditoriyadan foydali murojaat kam.' },
    { t: 'Murojaatlar sotuv jarayonida yo‘qoladi', d: 'CRM, tezkor javob yoki follow-up yetarli emas.' },
  ],
};

export const process = {
  eyebrow: 'Jarayon',
  title: 'Potensial xaridor qanday keladi?',
  steps: [
    { t: 'Meta Ads + Google Ads', d: 'Uy qidirayotgan va loyihaga mos auditoriya' },
    { t: 'Landing', d: 'Obyekt, lokatsiya va taklif' },
    { t: 'Murojaat', d: 'Qiziqqan mijoz ma’lumot qoldiradi' },
    { t: 'CRM', d: 'Har bir murojaat nazoratda' },
    { t: 'Sotuv bo‘limi', d: 'Menejer tezda bog‘lanadi' },
  ],
  statement: 'Bizning asosiy vazifamiz — loyihangizga potensial xaridorlarni olib kelish va murojaatlar yo‘qolmaydigan tizim qurish.',
};

export const handle = {
  eyebrow: 'Mas’uliyatimiz',
  title: 'Nimani o‘zimiz qilamiz?',
  items: [
    { t: 'Strategiya + offer', d: 'Loyiha, bozor va auditoriyaga mos marketing yo‘nalishini ishlab chiqamiz.' },
    { t: 'Reklama + kreativ', d: 'Meta Ads, Google Ads va reklama kreativlarini boshqaramiz.' },
    { t: 'Landing + CRM', d: 'Murojaat olish va uni nazorat qilish tizimini quramiz.' },
    { t: 'Sotuv tizimi', d: 'Kerak bo‘lsa, sotuv bo‘limini ham noldan qurib beramiz.' },
  ],
};

export const pricing = {
  eyebrow: 'Hamkorlik',
  title: 'Bu oddiy SMM paketi emas.',
  price: '$5,000 – $7,000',
  per: '/ oy',
  priceNote: 'Yakuniy narx loyiha hajmi va quriladigan tizimga qarab belgilanadi.',
  adBudget: 'Meta Ads va Google Ads reklama budjeti xizmat narxiga kirmaydi va alohida ajratiladi.',
  honest: 'Biz potensial mijozlar oqimi va uni qabul qiladigan tizim uchun javob beramiz. Yakuniy sotuv obyekt, narx, lokatsiya, to‘lov shartlari va sotuv bo‘limining ishiga ham bog‘liq.',
};

export const finalCta = {
  eyebrow: 'Ariza',
  title: 'Loyihangizni ko‘rib chiqamiz.',
  text: 'Qisqacha ma’lumot qoldiring. Jamoamiz loyihangizni ko‘rib chiqib, siz bilan bog‘lanadi.',
  aside: ['7 ta savol, 1 daqiqa', 'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi'],
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
  stage: ['Qurilish jarayonida', 'Sotuv boshlangan', 'Qurilish tugagan / sotuv davom etmoqda', 'Yangi loyiha'],
  problem: [
    'Murojaatlar kam',
    'Murojaatlar sifati past',
    'Sotuv sust',
    'Marketing tizimi yo‘q',
    'Sotuv bo‘limi yo‘q',
    'Reklama ishlayapti, lekin natija qoniqtirmaydi',
    'Boshqa',
  ],
  budget: ['$1,000 gacha', '$1,000–$3,000', '$3,000–$5,000', '$5,000+'],
  /** No longer asked on the page (shorter form); kept so the server contract and older drafts stay valid. */
  contactTime: ['Imkon qadar tezroq', 'Ertalab (9:00–12:00)', 'Tushdan keyin (12:00–18:00)', 'Kechqurun (18:00–20:00)'],
};
