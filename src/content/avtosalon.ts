/** Copy and form options for the /avtosalon landing (Uzbek only). */

export const AV_FORM_ID = 'ariza';

export const hero = {
  eyebrow: 'Avtosalonlar uchun · Butun O‘zbekiston bo‘ylab',
  title: 'Avtosaloningiz uchun marketing va sotuv tizimini quramiz',
  text: 'Strategiyadan boshlab kontent, target reklama, leadlarni jalb qilish, CRM va sotuv bo‘limigacha — barchasini yagona tizimda yo‘lga qo‘yamiz.',
  chain: ['Target', 'Kontent', 'Lead', 'CRM', 'Sotuv', 'Nazorat'],
  cta: 'Avtosalonimni tahlil qilish',
  note: 'Avtosaloningiz haqida qisqacha ma’lumot qoldiring — jamoamiz siz bilan bog‘lanadi.',
};

export const problems = {
  eyebrow: 'Muammo',
  title: 'Reklama ishlayapti. Lekin tizim ishlayaptimi?',
  intro: 'Avtosalonlarda muammo har doim ham reklamada emas.',
  cards: [
    { t: 'Leadlar sifati past', d: 'Murojaatlar keladi, ammo xaridga tayyor auditoriya kam.' },
    { t: 'Reklama nazoratsiz', d: 'Budjet sarflanadi, lekin qaysi reklama real natija berayotgani aniq emas.' },
    { t: 'Kontent sotuv bilan bog‘lanmagan', d: 'Instagram yuritiladi, ammo kontent, offer va reklama alohida ishlaydi.' },
    { t: 'Leadlar yo‘qoladi', d: 'Murojaat kelganidan keyingi jarayon nazorat qilinmaydi.' },
    { t: 'Sotuv bo‘limida tizim yo‘q', d: 'Menejerlar, follow-up va mijoz bilan ishlash yagona standartga tushmagan.' },
    { t: 'Analitika yetishmaydi', d: 'Marketingdan sotuvgacha bo‘lgan natijani bitta joyda ko‘rish qiyin.' },
  ],
  cta: 'Yechimni muhokama qilish',
};

export const system = {
  eyebrow: 'Tizim',
  title: 'Biz faqat target reklama bilan cheklanmaymiz',
  text: 'Avtosalon marketingini bir-biridan ajralgan xizmatlar emas, bitta tizim sifatida quramiz.',
  stages: [
    { t: 'Strategiya', d: 'Maqsad, bozor va yo‘nalish' },
    { t: 'Offer & pozitsioning', d: 'Nega aynan sizdan olish kerak' },
    { t: 'Kontent & kreativ', d: 'Syomka, Reels, reklama dizayni' },
    { t: 'Target reklama', d: 'Meta Ads, test va optimizatsiya' },
    { t: 'Landing', d: 'Murojaatga aylantiradigan sahifa' },
    { t: 'Lead', d: 'Murojaatlarni yig‘ish va saralash' },
    { t: 'CRM', d: 'Har bir mijoz — bitta joyda' },
    { t: 'Sotuv bo‘limi', d: 'Menejerlar, skriptlar, follow-up' },
    { t: 'Analitika & optimizatsiya', d: 'Raqamlar asosida qaror' },
  ],
  groups: [
    { name: 'Marketing', from: 0, to: 4 },
    { name: 'Lead', from: 5, to: 6 },
    { name: 'Sotuv va nazorat', from: 7, to: 8 },
  ],
  cta: 'Ariza qoldirish',
};

export const bridge = {
  eyebrow: 'Marketing + sotuv',
  title: 'Marketing lead olib kelishi mumkin. Keyin nima bo‘ladi?',
  text: 'Bizning ishimiz murojaat kelishi bilan tugamaydi.',
  marketing: ['Strategiya', 'Pozitsioning va offer', 'Copywriting', 'Dizayn', 'Kontent', 'Syomka va montaj', 'Reklama kreativlari', 'Target', 'Landing', 'Lead generation'],
  sales: ['CRM', 'Sotuv voronkasi', 'Skriptlar', 'ROP va menejerlar', 'KPI va motivatsiya', 'Xodimlarni o‘qitish', 'Follow-up tizimi', 'Nazorat', 'Sotuv analitikasi'],
  joint: 'Lead',
  closing: 'Marketing va sotuv — bitta maqsad uchun ishlashi kerak.',
  cta: 'Tizimni tahlil qilish',
};

export const team = {
  eyebrow: 'Jamoa',
  title: 'Bitta xizmat emas. To‘liq marketing jamoasi.',
  text: 'Loyihangiz ustida marketing strategiyasidan boshlab reklama va sotuv tizimigacha bo‘lgan yo‘nalishlarda mutaxassislar ishlaydi.',
  cards: [
    { t: 'Strategiya & Analitika', d: 'Bozor, raqobatchilar va hozirgi holat tahlili. Maqsadlar va harakat rejasi.' },
    { t: 'Copywriting & Offer', d: 'Avtomobillar va auditoriyaga mos takliflar hamda kommunikatsiya.' },
    { t: 'Dizayn & Vizual', d: 'Brend ko‘rinishi, reklama dizaynlari va digital materiallar.' },
    { t: 'Kontent Production', d: 'Kontent strategiyasi, syomka, Reels, Stories va video montaj.' },
    { t: 'Performance Marketing', d: 'Target strategiyasi, reklama kampaniyalari, test va optimizatsiya.' },
    { t: 'Sales & CRM', d: 'CRM, sotuv voronkasi, menejerlar va nazorat tizimi.' },
  ],
  cta: 'Loyihani muhokama qilish',
};

export const strategy = {
  eyebrow: 'Yondashuv',
  title: 'Avval reklama emas — strategiya.',
  steps: [
    { t: 'Tahlil', d: 'Biznes, avtomobillar, raqobatchilar, marketing va sotuvning hozirgi holatini o‘rganamiz.' },
    { t: 'Maqsad', d: 'Biznes bilan birgalikda marketing va sotuv oldidagi aniq maqsadlarni belgilaymiz.' },
    { t: 'Strategiya', d: 'Marketing, kontent, reklama va sotuv bo‘yicha yagona harakat rejasini ishlab chiqamiz.' },
    { t: 'Roadmap', d: 'Nima, qachon va qanday amalga oshirilishini aniq rejalashtiramiz.' },
    { t: 'Amalga oshirish', d: 'Jamoamiz tasdiqlangan strategiya asosida ishni boshlaydi.' },
  ],
  cta: 'Avtosalonimni tahlil qilish',
};

export const expectations = {
  eyebrow: 'Natija',
  title: 'FAZO Digital’dan nima kutishingiz mumkin?',
  sub: 'Biz raqamlarni va’da qilmaymiz. Tizim quramiz.',
  items: [
    'Sifatli murojaatlarni jalb qilish uchun marketing tizimi',
    'Marketing va sotuvning bir-biriga bog‘langan jarayoni',
    'Professional kontent va reklama kreativlari',
    'Leadlarni yig‘ish va nazorat qilish tizimi',
    'CRM va tartibli sotuv voronkasi',
    'Menejerlar ishini nazorat qilish imkoniyati',
    'Qaysi model, offer va reklama yaxshiroq ishlayotganini aniqlash',
    'Natijalarga qarab marketingni optimallashtirish va masshtablash',
  ],
  highlight: 'Maqsad — reklama ko‘rsatkichlari emas, biznesning sotuv tizimiga xizmat qiladigan marketing yaratish.',
  cta: 'Ariza qoldirish',
};

export const salesDept = {
  eyebrow: 'Sotuv bo‘limi',
  title: 'Lead bor. Endi uni sotuvga olib boradigan tizim kerak.',
  text: 'Mavjud sotuv bo‘limingiz bo‘lsa — uni tartibga solish va nazorat tizimini qurishga yordam beramiz. Sotuv tizimi bo‘lmasa — uni noldan shakllantirishimiz mumkin.',
  modes: [
    { t: 'Sotuv bo‘limi bor', d: 'Tartibga solamiz, standartlashtiramiz, nazoratni yo‘lga qo‘yamiz.' },
    { t: 'Sotuv bo‘limi yo‘q', d: 'Strukturadan boshlab noldan shakllantiramiz.' },
  ],
  items: ['CRM', 'Sotuv voronkasi', 'ROP va menejerlar strukturasi', 'Xodimlarni topish', 'Skriptlar', 'KPI va motivatsiya', 'O‘qitish', 'Lead nazorati', 'Follow-up', 'Analitika'],
  cta: 'Sotuv tizimini muhokama qilish',
};

export const how = {
  eyebrow: 'Jarayon',
  title: 'Qanday ishlaymiz?',
  steps: ['Ariza qoldirasiz', 'Biznesingizni o‘rganamiz', 'Siz bilan bog‘lanamiz', 'Uchrashuv o‘tkazamiz', 'Sizga mos yechimni ishlab chiqamiz', 'Kelishuvdan so‘ng ishni boshlaymiz'],
  cta: 'Ariza qoldirish',
};

/* ───────── Form ───────── */

export const form = {
  eyebrow: 'Ariza',
  title: 'Avtosaloningiz haqida qisqacha ma’lumot qoldiring',
  text: 'Javoblaringiz orqali biznesingizning hozirgi marketing va sotuv holatini oldindan tushunib olamiz.',
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
