/** Copy and form options for the /qurilish landing (residential developers, Uzbek only). */

export const QR_FORM_ID = 'loyiha';

export const nav = [
  { id: 'tizim', label: 'Tizim' },
  { id: 'yonalishlar', label: 'Yo‘nalishlar' },
  { id: 'hamkorlik', label: 'Hamkorlik' },
];

export const hero = {
  eyebrow: 'Turar joy quruvchilari uchun · O‘zbekiston bo‘ylab',
  title: 'Qurayotgan uylaringiz uchun potensial xaridorlar oqimini yo‘lga qo‘yamiz.',
  text: 'Marketing, Meta Ads, Google Ads, landing, CRM va sotuv bo‘limini yagona tizimga bog‘laymiz.',
  context: 'O‘zbekiston bo‘ylab yangi qurilayotgan va sotuvdagi turar joy loyihalari bilan ishlaymiz.',
  cta: 'Loyiham uchun strategiya olish',
  callouts: [
    { k: 'Talab', v: 'Meta Ads · Google Ads' },
    { k: 'Murojaat', v: 'Landing · Ariza' },
    { k: 'Nazorat', v: 'CRM · Sotuv bo‘limi' },
  ],
};

export const problem = {
  eyebrow: 'Muammo',
  title: 'Reklama bor. Lekin xaridor oqimi tizimli emasmi?',
  cards: [
    { t: 'Murojaatlar kam yoki qimmat', d: 'Reklamaga budjet sarflanadi, ammo kerakli auditoriyadan yetarli murojaat kelmaydi.' },
    { t: 'Raqobatchilardan farq sezilmaydi', d: 'Bir hududdagi ko‘plab qurilish loyihalari deyarli bir xil taklif bilan reklama qilinadi.' },
    { t: 'Murojaatlar yo‘qoladi', d: 'Murojaat keladi, ammo CRM, tezkor aloqa va follow-up tizimi yetarli emas.' },
    { t: 'Marketing va sotuv alohida ishlaydi', d: 'Marketing murojaat olib keladi, ammo sotuv bo‘limidagi keyingi jarayon to‘liq nazorat qilinmaydi.' },
  ],
  statement: 'Muammoni faqat ko‘proq reklama yoqish bilan hal qilib bo‘lmaydi.',
};

export const system = {
  eyebrow: 'FAZO tizimi',
  title: 'FAZO Digital marketingdan sotuv bo‘limigacha bo‘lgan tizimni birlashtiradi.',
  text: 'Maqsadimiz reklamada ko‘p ko‘rish olish emas. Loyihangizga qiziqayotgan potensial xaridorlarning murojaatlarini olib kelish va ularni keyingi bosqichlarda yo‘qotmaslik uchun tizim qurish.',
  stages: [
    { t: 'Strategiya', d: 'Bozor, raqobat va maqsad' },
    { t: 'Offer + kontent', d: 'Nima uchun aynan shu loyiha' },
    { t: 'Meta Ads + Google Ads', d: 'Talabni shakllantirish va ushlash' },
    { t: 'Landing', d: 'Obyektni ko‘rsatish, murojaat olish' },
    { t: 'Potensial mijoz', d: 'Qiziqqan xaridor murojaati' },
    { t: 'CRM', d: 'Har bir murojaat nazoratda' },
    { t: 'Sotuv bo‘limi', d: 'Tezkor aloqa va uchrashuv' },
    { t: 'Follow-up', d: 'Qaror qabul qilguncha aloqa' },
  ],
  focus: 4,
  groups: [
    { name: 'Marketing', from: 0, to: 3 },
    { name: 'Murojaat', from: 4, to: 4 },
    { name: 'Sotuv', from: 5, to: 7 },
  ],
  loop: 'Analitika va optimizatsiya — natijalar asosida tizim doimiy yaxshilanadi',
};

export const pillars = {
  eyebrow: 'Nimani quramiz',
  title: 'Bitta agentlik. To‘rtta yo‘nalish. Bitta tizim.',
  items: [
    { t: 'Marketing strategiyasi', role: 'Yo‘nalishni belgilaydi', list: ['Bozor va raqobatchilar tahlili', 'Pozitsioning', 'Offer', 'Sotuv takliflari', 'Marketing strategiyasi'] },
    { t: 'Mijoz jalb qilish', role: 'Talabni yaratadi', list: ['Meta Ads', 'Google Ads', 'Kontent va kreativlar', 'Syomka / production'] },
    { t: 'Digital infratuzilma', role: 'Murojaatni ushlaydi', list: ['Landing', 'Murojaat formalari', 'CRM', 'Tracking', 'Analitika'] },
    { t: 'Sotuv tizimi', role: 'Murojaatni sotuv jarayoniga olib boradi', list: ['Sotuv strukturasi', 'Skriptlar', 'KPI', 'Follow-up', 'Menejerlarni o‘qitish', 'Nazorat'] },
  ],
  statement: 'Sotuv bo‘limingiz yo‘q bo‘lsa — uni ham noldan qurib beramiz.',
};

export const journey = {
  eyebrow: 'Xaridor yo‘li',
  title: 'Potensial xaridorni topishdan menejergacha.',
  sources: [
    { n: '01', t: 'Meta Ads', d: 'Loyihaga mos auditoriyaga chiqamiz va talabni shakllantiramiz.' },
    { n: '02', t: 'Google Ads', d: 'Uy qidirayotgan mavjud talabni ushlaymiz.' },
  ],
  steps: [
    { n: '03', t: 'Landing', d: 'Obyekt, lokatsiya, afzalliklar va taklif bilan tanishtiramiz.' },
    { n: '04', t: 'Ariza', d: 'Qiziqqan potensial mijoz ma’lumotlarini qoldiradi.' },
    { n: '05', t: 'CRM', d: 'Murojaat avtomatik CRM tizimiga tushadi va nazoratga olinadi.' },
    { n: '06', t: 'Sotuv bo‘limi', d: 'Menejer mijoz bilan aloqa qiladi va keyingi jarayonni olib boradi.' },
  ],
};

export const promise = {
  eyebrow: 'Mas’uliyat',
  title: 'Biz nimani va’da qilamiz?',
  statement: 'Potensial mijoz olib keladigan marketing tizimini qurishni.',
  text: 'Marketing, reklama, landing, CRM va sotuv jarayonini bir tizimga bog‘laymiz.',
  honestTitle: 'Biz “falon dona kvartira sotib beramiz” deb va’da bermaymiz.',
  honestText: 'Yakuniy sotuv natijasi obyektning narxi, lokatsiyasi, taklifi, to‘lov shartlari va sotuv bo‘limining ishlashiga ham bog‘liq.',
  factors: ['Narx', 'Lokatsiya', 'Taklif', 'To‘lov shartlari', 'Sotuv bo‘limi'],
  ours: 'Bizning mas’uliyatimiz',
  oursList: ['Strategiya va offer', 'Reklama va kreativlar', 'Landing va tracking', 'CRM va murojaatlar nazorati', 'Sotuv jarayonini tizimlash'],
};

/** `result` is optional and must only hold verified, documented outcomes. */
export type ProofCase = { label: string; task: string; did: string[]; ads: string[]; result?: string[] };

export const proof = {
  eyebrow: 'Tajriba',
  title: 'Ko‘chmas mulk auditoriyasi bilan ishlash tajribamiz bor.',
  text: 'Uy va ko‘chmas mulk sotuviga oid loyihalarda auditoriya bilan ishlaganmiz va potensial xaridorlardan murojaatlar olib kelganmiz. Mijozlarimiz nomi kelishuvga ko‘ra oshkor qilinmaydi.',
  steps: ['Vazifa', 'Nima qildik', 'Strategiya / reklama'],
  /**
   * Anonymous cases: task and work done only, no client names.
   * Add a `result` list ONLY with verified, documented figures — never estimates or unconfirmed claims.
   */
  cases: ([
    {
      label: 'Ko‘chmas mulk · Kvartiralar sotuvi',
      task: 'Kvartira izlayotgan auditoriyadan maqsadli murojaatlar oqimini shakllantirish.',
      did: ['Marketing strategiyasi', 'Kontent', 'Sotuv voronkasi'],
      ads: ['Maqsadli reklama', 'SMM'],
    },
  ] as ProofCase[]),
  note: 'Natija ko‘rsatkichlari faqat tasdiqlangan ma’lumotlar va mijoz roziligi bilan e’lon qilinadi.',
};

export const pricing = {
  eyebrow: 'Hamkorlik',
  title: 'Bu oddiy SMM paketi emas.',
  text: 'FAZO Digital qurilish loyihangizning marketing va sotuv infratuzilmasi ustida ishlaydi.',
  price: '$5,000 – $7,000',
  per: '/ oy',
  priceNote: 'Yakuniy narx loyiha hajmi va kerakli tizimga qarab belgilanadi.',
  adBudget: 'Meta Ads va Google Ads reklama budjeti xizmat narxiga kirmaydi va alohida ajratiladi.',
  qualify: 'O‘zbekiston bo‘ylab marketing va sotuviga jiddiy investitsiya qilishga tayyor qurilish loyihalari bilan ishlaymiz.',
  includes: ['Strategiya va pozitsioning', 'Kontent va kreativlar', 'Meta Ads va Google Ads boshqaruvi', 'Landing, CRM va tracking', 'Sotuv tizimi va nazorat', 'Muntazam hisobot va optimizatsiya'],
};

export const finalCta = {
  eyebrow: 'Loyihani muhokama qilish',
  title: 'Qurilish loyihangiz uchun qanday tizim kerakligini birga aniqlaymiz.',
  text: 'Loyihangiz haqida qisqacha ma’lumot qoldiring. Jamoamiz ma’lumotlarni ko‘rib chiqib, siz bilan bog‘lanadi.',
  cta: 'Loyihani muhokama qilish',
  aside: ['Ariza 1–2 daqiqa oladi', 'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi'],
};

/* ───────── Form ───────── */

export const form = {
  submit: 'Loyihani yuborish',
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
  successText: 'Jamoamiz ma’lumotlarni ko‘rib chiqadi va siz tanlagan vaqtga moslab bog‘lanadi.',
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
  contactTime: ['Imkon qadar tezroq', 'Ertalab (9:00–12:00)', 'Tushdan keyin (12:00–18:00)', 'Kechqurun (18:00–20:00)'],
};
