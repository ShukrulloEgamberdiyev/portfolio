/** Copy and form options for the /avtosalon landing (Uzbek only). */

export const AV_FORM_ID = 'ariza';

export const hero = {
  eyebrow: 'Avtosalonlar uchun · Butun O‘zbekiston bo‘ylab',
  audience: 'Avtosalonlar uchun',
  region: 'Butun O‘zbekiston bo‘ylab',
  title: 'Avtosaloningiz uchun marketing va sotuv tizimini quramiz',
  text: 'Strategiya, kontent, target reklama, murojaatlar, CRM va sotuv jarayonlarini bitta tizimga bog‘laymiz.',
  /** Mobile hero: shorter line so the CTA fits the first screen (Instagram in-app browser). */
  textShort: 'Strategiya, reklama, murojaat, CRM va sotuvni bitta tizimga bog‘laymiz.',
  chain: ['Strategiya', 'Kontent', 'Reklama', 'Murojaat', 'CRM', 'Sotuv'],
  cta: 'Ariza qoldiriş',
  note: 'Avtosaloningiz haqida qisqacha ma’lumot qoldiring — jamoamiz siz bilan bog‘lanadi.',
};

export const problems = {
  eyebrow: 'Muammo',
  title: 'Reklama işlayapti. Murojaat sotuvgacha yetib boryaptimi?',
  text: 'Mijoz yo‘li: reklama → murojaat → operator → savdo. Ko‘p avtosalonlarda mijoz şu zanjirning bir bo‘g‘inida yo‘qoladi — reklama aybdor bo‘lmasa ham.',
  cards: [
    { at: 'Reklama → murojaat', t: 'Murojaat manbasi noma’lum', d: 'Qaysi reklama, qaysi taklif va qaysi kanaldan kelgan mijoz avtomobil sotib olganini hech kim ko‘rmaydi. Budjet taxmin bilan taqsimlanadi.' },
    { at: 'Murojaat → operator', t: 'Javob kechikadi', d: 'Murojaat Direct, Telegram yoki telefonga tuşadi, lekin unga darhol javob beradigan aniq mas’ul yo‘q. Mijoz kutib turmaydi — boşqa salonga yozadi.' },
    { at: 'Operator → savdo', t: 'Qayta qo‘ng‘iroq qilinmaydi', d: 'Birinchi suhbatdan keyin mijoz “o‘ylab ko‘raman” deydi va unga qayta qo‘ng‘iroq qiliş hech qayerda belgilanmaydi.' },
    { at: 'Savdo', t: 'Menejer işi ko‘rinmaydi', d: 'Kim nechta mijoz bilan gaplaşdi, kim qayerda to‘xtadi — rahbar buni faqat menejerning so‘zidan biladi.' },
  ],
  cta: 'Yechimni ko‘riş',
};

/** One section instead of three: system flow + marketing/sales bridge + full team. */
export const SYSTEM_ID = 'tizim';
export const system = {
  eyebrow: 'Biz nima qilamiz',
  title: 'Marketingdan sotuvgacha — bitta tizim',
  text: 'Bizning işimiz reklama işga tuşiriş bilan tugamaydi. Murojaat kelişidan boşlab sotuv bo‘limi u bilan to‘g‘ri işlaşigacha bo‘lgan jarayonni tizimlaştiramiz.',
  marketing: ['Strategiya', 'Taklif', 'Kontent', 'Reklama materiallari', 'Target reklama', 'Sahifa', 'Murojaat'],
  sales: ['CRM', 'Sotuv bosqichlari', 'Suhbat skriptlari', 'Menejerlar', 'Qayta aloqa', 'Nazorat', 'Analitika'],
  statement: 'Bularning barchasini bitta jamoa bilan yo‘lga qo‘yamiz.',
  sub: 'Strategiya, reklama matnlari, dizayn, kontent, reklama va sotuv tizimi uchun alohida-alohida mutaxassis qidirişingiz şart emas.',
  cta: 'Loyihani muhokama qiliş',
};

export const expectations = {
  eyebrow: 'Natija',
  title: 'FAZO Digital’dan nima kutişingiz mumkin?',
  sub: 'Raqamlarni va’da qilmaymiz. Işlaydigan tizim qurişga e’tibor beramiz.',
  cards: [
    { t: 'Sifatli murojaatlar uchun tizim', d: 'Kerakli auditoriyani jalb qilişga yo‘naltirilgan marketing va reklama.' },
    { t: 'Marketing + sotuv bog‘lanişi', d: 'Reklamadan kelgan murojaat sotuv jarayonigacha kuzatiladigan tizim.' },
    { t: 'CRM va murojaatlar nazorati', d: 'Har bir murojaat qayerda ekanini va u bilan qanday işlanayotganini nazorat qiliş.' },
    { t: 'Doimiy optimizatsiya', d: 'Qaysi taklif, reklama materiali va kanal yaxşiroq işlayotganiga qarab marketingni rivojlantiriş.' },
  ],
  cta: 'Ariza qoldiriş',
};

export const how = {
  eyebrow: 'Jarayon',
  title: 'Qanday işlaymiz?',
  steps: [
    { t: 'Ariza', d: 'Avtosaloningiz haqida qisqacha ma’lumot qoldirasiz.' },
    { t: 'Tahlil', d: 'Marketing va sotuvning hozirgi holatini o‘rganamiz.' },
    { t: 'Uchraşuv va strategiya', d: 'Vaziyatni muhokama qilib, sizga mos işlaş yo‘nalişini belgilaymiz.' },
    { t: 'Işni boşlaş', d: 'Kelişuvdan so‘ng marketing va sotuv tizimi ustida iş boşlaymiz.' },
  ],
  cta: 'Ariza qoldiriş',
};

/* ───────── Form ───────── */

export const form = {
  eyebrow: 'Ariza',
  title: 'Avtosaloningiz haqida qisqacha ma’lumot qoldiring',
  text: 'Javoblaringiz orqali marketing va sotuv holatingizni oldindan tuşunib, suhbatga tayyorlanamiz.',
  aside: [
    'Ariza 1–2 daqiqa oladi',
    'Xizmat narxi arizani ko‘rib chiqqach, individual muhokama qilinadi',
    'Ma’lumotlaringiz faqat siz bilan bog‘laniş uchun işlatiladi',
  ],
  steps: ['Avtosalon', 'Marketing', 'Sotuv', 'Maqsad'],
  next: 'Davom etiş',
  back: 'Orqaga',
  submit: 'Arizani yuboriş',
  sending: 'Yuborilmoqda…',
  required: 'Belgilangan maydonlarni to‘ldiring.',
  errors: {
    network: 'Ariza yuborilmadi: aloqa uzildi yoki server javob bermadi. Internetni tekşirib, qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    busy: 'Hozir arizalar juda ko‘p. Bir necha daqiqadan so‘ng qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    contact: 'Şu telefon yoki Telegram orqali yaqinda bir nechta ariza yuborilgan. Keyinroq qayta urinib ko‘ring yoki Telegram orqali yozing — ma’lumotlaringiz saqlanib qoldi.',
    invalid: 'Ariza qabul qilinmadi: ba’zi maydonlar to‘liq emas. Javoblarni tekşirib, qayta yuboring.',
    generic: 'Ariza yuborilmadi. Qayta urinib ko‘ring — kiritilgan ma’lumotlar saqlanib qoldi.',
    corrections: 'Bu ariza juda ko‘p marta o‘zgartirildi. Qo‘şimcha o‘zgarişlarni Telegram orqali yozing.',
  },
  retry: 'Qayta yuboriş',
  errorAlt: 'Muammo takrorlansa, Telegram orqali yozing:',
  successTitle: 'Arizangiz qabul qilindi.',
  successText: 'Jamoamiz ma’lumotlaringizni ko‘rib chiqadi va siz bilan bog‘lanadi.',
  privacy: 'Arizani yuboriş orqali ma’lumotlaringiz',
  privacyLink: 'maxfiylik siyosati',
  privacyTail: 'asosida qayta işlanişiga rozilik bildirasiz.',
};
