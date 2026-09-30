/** Copy and form options for the /qurilish landing (residential developers, Uzbek only). */

export const QR_FORM_ID = 'loyiha';

/** One CTA label everywhere: every primary button leads to the same registration form. */
export const CTA = 'Ro‘yxatdan o‘tish';

export const hero = {
  label: 'Qurilish',
  title: 'Qurayotgan uylaringizga potensial xaridorlarni olib kelamiz.',
  text: 'Meta Ads va Google Ads orqali murojaatlar oqimini yo‘lga qo‘yib, ularni CRM va sotuv bo‘limiga bog‘laymiz.',
  system: [
    { k: 'Mijoz oqimi', v: 'Meta Ads + Google Ads' },
    { k: 'Tizim', v: 'Landing → CRM → Sotuv' },
  ],
  imageAlt: 'Kunduzgi yorug‘likda qurilayotgan zamonaviy turar joy majmuasi: ko‘p qavatli binolar va minorali kran',
};

export const problem = {
  title: 'Qurilish bor. Sotuv sustmi?',
  points: ['Murojaatlar kam', 'Reklama ishlayapti, natija qoniqtirmaydi', 'Murojaatlar sotuv jarayonida yo‘qoladi'],
};

export const system = {
  title: 'Biz jarayonni bitta tizimga bog‘laymiz.',
  steps: ['Meta + Google', 'Landing', 'Murojaat', 'CRM', 'Sotuv'],
};

export const offer = {
  label: 'FAZO Digital xizmati',
  price: '$5,000–$7,000',
  per: '/ oy',
  adBudget: 'Reklama budjeti alohida ajratiladi.',
};

export const register = {
  title: 'Ro‘yxatdan o‘tish',
  text: 'Loyihangiz haqida qisqacha ma’lumot qoldiring. Jamoamiz siz bilan bog‘lanadi.',
};

/* ───────── Form ───────── */

export const form = {
  submit: 'Ro‘yxatdan o‘tish',
  sending: 'Yuborilmoqda…',
  required: 'Belgilangan maydonlarni to‘ldiring.',
  errors: {
    network: 'Yuborilmadi: aloqa uzildi yoki server javob bermadi. Internetni tekshirib, qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    busy: 'Hozir so‘rovlar juda ko‘p. Bir necha daqiqadan so‘ng qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    contact: 'Shu telefon raqami bilan yaqinda bir necha marta ro‘yxatdan o‘tilgan. Keyinroq qayta urinib ko‘ring yoki Telegram orqali yozing.',
    invalid: 'Qabul qilinmadi: ba’zi maydonlar to‘liq emas. Javoblarni tekshirib, qayta yuboring.',
    generic: 'Yuborilmadi. Qayta urinib ko‘ring — kiritilgan ma’lumotlar saqlanib qoldi.',
  },
  retry: 'Qayta yuborish',
  errorAlt: 'Muammo takrorlansa, Telegram orqali yozing:',
  successTitle: 'Ro‘yxatdan o‘tdingiz.',
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
