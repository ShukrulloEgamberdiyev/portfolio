/** Copy and form options for the /avtosalon landing (Uzbek only). */

export const AV_FORM_ID = 'ariza';

export const hero = {
  eyebrow: 'Avtosalonlar uchun · Butun O‘zbekiston bo‘ylab',
  title: 'Avtosaloningiz uchun marketing va sotuv tizimini quramiz',
  text: 'Strategiya, kontent, target, leadlar, CRM va sotuv jarayonlarini bitta tizimga bog‘laymiz.',
  chain: ['Strategiya', 'Kontent', 'Target', 'Lead', 'CRM', 'Sotuv'],
  cta: 'Ariza qoldirish',
  note: 'Avtosaloningiz haqida qisqacha ma’lumot qoldiring — jamoamiz siz bilan bog‘lanadi.',
};

export const problems = {
  eyebrow: 'Muammo',
  title: 'Reklama ishlayapti. Lekin tizim ishlayaptimi?',
  cards: [
    { t: 'Sifatsiz leadlar', d: 'Murojaatlar keladi, lekin xaridga tayyor mijozlar kam.' },
    { t: 'Natija noaniq', d: 'Qaysi reklama va offer real natija berayotgani aniq ko‘rinmaydi.' },
    { t: 'Leadlar yo‘qoladi', d: 'Murojaat kelganidan keyingi jarayon yetarlicha nazorat qilinmaydi.' },
    { t: 'Sotuv nazoratsiz', d: 'Menejerlar, follow-up va mijoz bilan ishlash yagona tizimga tushmagan.' },
  ],
  cta: 'Yechimni ko‘rish',
};

/** One section instead of three: system flow + marketing/sales bridge + full team. */
export const SYSTEM_ID = 'tizim';
export const system = {
  eyebrow: 'Biz nima qilamiz',
  title: 'Marketingdan sotuvgacha — bitta tizim',
  text: 'Bizning ishimiz reklama ishga tushirish bilan tugamaydi. Lead kelishidan boshlab uni sotuv bo‘limida to‘g‘ri ishlashgacha bo‘lgan jarayonni tizimlashtiramiz.',
  marketing: ['Strategiya', 'Offer', 'Kontent', 'Kreativ', 'Target', 'Landing', 'Lead'],
  sales: ['CRM', 'Sotuv voronkasi', 'Skriptlar', 'Menejerlar', 'Follow-up', 'Nazorat', 'Analitika'],
  statement: 'Bularning barchasini bitta jamoa bilan yo‘lga qo‘yamiz.',
  sub: 'Strategiya, copywriting, dizayn, kontent, reklama va sotuv tizimi uchun alohida-alohida mutaxassis qidirishingiz shart emas.',
  cta: 'Loyihani muhokama qilish',
};

export const expectations = {
  eyebrow: 'Natija',
  title: 'FAZO Digital’dan nima kutishingiz mumkin?',
  sub: 'Raqamlarni va’da qilmaymiz. Ishlaydigan tizim qurishga e’tibor beramiz.',
  cards: [
    { t: 'Sifatli murojaatlar uchun tizim', d: 'Kerakli auditoriyani jalb qilishga yo‘naltirilgan marketing va reklama.' },
    { t: 'Marketing + sotuv bog‘lanishi', d: 'Reklamadan kelgan lead sotuv jarayonigacha kuzatiladigan tizim.' },
    { t: 'CRM va lead nazorati', d: 'Leadlar qayerda ekanini va ular bilan qanday ishlanayotganini nazorat qilish.' },
    { t: 'Doimiy optimizatsiya', d: 'Qaysi offer, kreativ va reklama yaxshiroq ishlayotganiga qarab marketingni rivojlantirish.' },
  ],
  cta: 'Ariza qoldirish',
};

export const how = {
  eyebrow: 'Jarayon',
  title: 'Qanday ishlaymiz?',
  steps: [
    { t: 'Ariza', d: 'Avtosaloningiz haqida qisqacha ma’lumot qoldirasiz.' },
    { t: 'Tahlil', d: 'Marketing va sotuvning hozirgi holatini o‘rganamiz.' },
    { t: 'Uchrashuv va strategiya', d: 'Vaziyatni muhokama qilib, sizga mos ishlash yo‘nalishini belgilaymiz.' },
    { t: 'Ishni boshlash', d: 'Kelishuvdan so‘ng marketing va sotuv tizimi ustida ish boshlaymiz.' },
  ],
  cta: 'Ariza qoldirish',
};

/* ───────── Form ───────── */

export const form = {
  eyebrow: 'Ariza',
  title: 'Avtosaloningiz haqida qisqacha ma’lumot qoldiring',
  text: 'Javoblaringiz orqali marketing va sotuv holatingizni oldindan tushunib, suhbatga tayyorlanamiz.',
  aside: [
    'Ariza 3–4 daqiqa oladi',
    'Xizmat narxi arizani ko‘rib chiqqach, individual muhokama qilinadi',
    'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi',
  ],
  steps: ['Avtosalon', 'Marketing', 'Sotuv', 'Maqsad'],
  next: 'Davom etish',
  back: 'Orqaga',
  submit: 'Arizani yuborish',
  sending: 'Yuborilmoqda…',
  required: 'Belgilangan maydonlarni to‘ldiring.',
  errors: {
    network: 'Ariza yuborilmadi: aloqa uzildi yoki server javob bermadi. Internetni tekshirib, qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    busy: 'Hozir arizalar juda ko‘p. Bir necha daqiqadan so‘ng qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    contact: 'Shu telefon yoki Telegram orqali yaqinda bir nechta ariza yuborilgan. Keyinroq qayta urinib ko‘ring yoki Telegram orqali yozing — ma’lumotlaringiz saqlanib qoldi.',
    invalid: 'Ariza qabul qilinmadi: ba’zi maydonlar to‘liq emas. Javoblarni tekshirib, qayta yuboring.',
    generic: 'Ariza yuborilmadi. Qayta urinib ko‘ring — kiritilgan ma’lumotlar saqlanib qoldi.',
  },
  retry: 'Qayta yuborish',
  errorAlt: 'Muammo takrorlansa, Telegram orqali yozing:',
  successTitle: 'Arizangiz qabul qilindi.',
  successText: 'Jamoamiz ma’lumotlaringizni ko‘rib chiqadi va siz bilan bog‘lanadi.',
  privacy: 'Arizani yuborish orqali ma’lumotlaringiz',
  privacyLink: 'maxfiylik siyosati',
  privacyTail: 'asosida qayta ishlanishiga rozilik bildirasiz.',
};

export const REGIONS = [
  'Toshkent shahri', 'Toshkent viloyati', 'Andijon viloyati', 'Buxoro viloyati', 'Farg‘ona viloyati', 'Jizzax viloyati',
  'Xorazm viloyati', 'Namangan viloyati', 'Navoiy viloyati', 'Qashqadaryo viloyati', 'Qoraqalpog‘iston Respublikasi',
  'Samarqand viloyati', 'Sirdaryo viloyati', 'Surxondaryo viloyati',
];

export const OPT = {
  carTypes: ['Yangi avtomobillar', 'Ishlatilgan avtomobillar', 'Elektromobil / gibrid', 'Premium segment', 'Tijorat transporti'],
  branches: ['1', '2', '3–5', '6+'],
  stock: ['0–9', '10–29', '30–49', '50–99', '100+'],
  marketingOwner: ['Ichki jamoa', 'Agentlik', 'Freelancer', 'O‘zimiz', 'Hozir hech kim', 'Boshqa'],
  targetStatus: ['Ha', 'Yo‘q', 'Vaqti-vaqti bilan'],
  budget: ['$2,000–3,000', '$3,000–5,000', '$5,000–7,000', '$7,000–10,000+'],
  monthlySales: ['0–9', '10–29', '30–49', '50–99', '100+'],
  salesStaff: ['Hozir yo‘q', '1–2', '3–5', '6–9', '10+'],
  rop: ['Ha', 'Yo‘q'],
  crm: ['Ha', 'Yo‘q', 'Bilmayman'],
  leadSystem: ['CRM', 'Google Sheets', 'Excel', 'Telegram', 'Tizim yo‘q', 'Boshqa'],
  goals: [
    'Sifatli murojaatlar sonini oshirish',
    'Marketingni to‘liq tizimlashtirish',
    'Target reklamani kuchaytirish',
    'Kontent va brend ko‘rinishini yaxshilash',
    'CRM va lead nazoratini yo‘lga qo‘yish',
    'Mavjud sotuv bo‘limini kuchaytirish',
    'Sotuv bo‘limini noldan qurish',
    'Marketing va sotuvni bitta tizimga bog‘lash',
    'Kompleks marketing va sotuv boshqaruvi',
    'Boshqa',
  ],
  positions: ['Asoschi / egasi', 'Direktor', 'Tijorat direktori', 'Marketing rahbari', 'Sotuv bo‘limi rahbari'],
};
