/** Copy and form options for the /ishlab-chiqarish landing (manufacturers, Uzbek only). */

export const IC_FORM_ID = 'ariza';

export const nav = [
  { id: 'tizim', label: 'Tizim' },
  { id: 'sotuv-yollari', label: 'Chakana / Optom' },
  { id: 'tajriba', label: 'Tajriba' },
  { id: 'savollar', label: 'Savollar' },
];

export const hero = {
  eyebrow: 'Ishlab chiqarish bizneslari uchun',
  titleA: 'Mahsulot ishlab chiqarasiz.',
  titleB: 'Biz unga mijoz olib keladigan marketing tizimini quramiz.',
  text: 'FAZO Digital ishlab chiqarish bizneslari uchun strategiya, kontent, reklama, sahifa, CRM va sotuv jarayonlarini yagona tizimga bog‘laydi.',
  chain: ['Strategiya', 'Reklama', 'Murojaat', 'CRM', 'Sotuv jarayoni'],
  cta: 'Loyihani muhokama qilish',
  ctaSecondary: 'Tizim qanday ishlaydi?',
};

export const problem = {
  eyebrow: 'Muammo',
  title: 'Sifatli mahsulotning o‘zi yetarli emas.',
  text: 'Sex ishlayapti. Mahsulot tayyor. Jamoa bor. Lekin yangi buyurtmalar tizimli kelmasa, ishlab chiqarish imkoniyatidan to‘liq foydalanish qiyinlashadi.',
  cards: [
    { t: 'Reklama bor, lekin tizim yo‘q', d: 'Kampaniyalar ishlaydi, ammo qaysi reklama real mijoz olib kelayotgani aniq kuzatilmaydi.' },
    { t: 'Kontent bor, lekin sotuvga bog‘lanmagan', d: 'Instagram yuritiladi, lekin kontentdan murojaat va keyingi sotuv jarayonigacha aniq yo‘l qurilmagan.' },
    { t: 'Murojaat keladi, keyin yo‘qoladi', d: 'Murojaat tushadi, lekin qayta aloqa va nazorat bo‘lmagani sabab ayrim potensial mijozlar yo‘qoladi.' },
    { t: 'Optom va chakana aralashib ketgan', d: '1 dona mahsulot oladigan xaridor bilan katta hajmda xarid qiladigan mijozga bir xil taklif beriladi.' },
    { t: 'Mijoz manbasi noma’lum', d: 'Qaysi kanal, reklama materiali yoki taklif yaxshi ishlayotganini ko‘rsatadigan analitika yetarli emas.' },
    { t: 'Marketing bo‘laklarga bo‘lingan', d: 'SMM boshqa tomonda, target boshqa tomonda, sotuv bo‘limi esa alohida ishlaydi.' },
  ],
  statement: 'Muammo faqat reklamada bo‘lmasligi mumkin. Muammo butun jarayon bir-biriga ulanmaganida bo‘lishi mumkin.',
};

export const diagnostics = {
  eyebrow: 'Diagnostika',
  title: 'Reklamadan oldin biznesni tushunamiz.',
  text: 'Mahsulot, narx, auditoriya, hudud, ishlab chiqarish imkoniyati va hozirgi sotuv jarayonini ko‘rib chiqamiz. Shundan keyin qaysi marketing modeli biznesingizga mosligini aniqlaymiz.',
  outcomeTitle: 'Diagnostikadan keyin',
  outcome: [
    'Biznesingizning hozirgi holati birga ko‘rib chiqiladi',
    'Sizga mos marketing yo‘nalishi muhokama qilinadi',
    'Keyingi qadamlar kelishib olinadi',
  ],
  items: [
    { t: 'Mahsulot va taklif', d: 'Assortiment, narx va xaridorga beriladigan taklif' },
    { t: 'Bozor va auditoriya', d: 'Kim sotib oladi, qayerda va qanday hajmda' },
    { t: 'Hozirgi marketing', d: 'Reklama, kontent va murojaat manbalari' },
    { t: 'Sotuv jarayoni', d: 'Murojaat qanday qabul qilinadi va u bilan kim ishlaydi' },
  ],
  cta: 'Biznesimni tahlil qilish',
};

export const channels = {
  eyebrow: 'Chakana / Optom',
  title: 'Bitta mahsulot. Ikki xil sotuv yo‘li.',
  text: 'Chakana xaridor va katta hajmda xarid qiluvchi mijoz bir xil qaror qabul qilmaydi. Shuning uchun ularga bir xil reklama ko‘rsatish shart emas.',
  cards: [
    {
      tag: 'Chakana',
      qty: '1',
      title: 'Oxirgi xaridorga sotish',
      text: 'Mahsulotni bevosita iste’molchiga sotish uchun alohida taklif, reklama materiallari va reklama yo‘li quriladi.',
      segmentsLabel: 'Kimlar uchun',
      segments: ['Uy uchun xarid qiluvchilar', 'Individual buyurtmachilar', 'Do‘kondan xarid qiluvchilar'],
      flow: ['Reklama materiali', 'Reklama', 'Sahifa / Direct', 'Murojaat', 'Menejer'],
    },
    {
      tag: 'Optom',
      qty: '50',
      title: 'Katta hajmdagi mijozlarni jalb qilish',
      text: 'Optom va korporativ mijozlar uchun alohida muloqot, taklif va murojaat yig‘ish tizimi quriladi.',
      segmentsLabel: 'Segmentlar',
      segments: ['Dilerlar', 'Qayta sotuvchilar', 'Do‘konlar', 'Mehmonxonalar', 'Hostellar', 'Tashkilotlar', 'Korporativ xaridorlar', 'Boshqa bizneslar'],
      flow: ['Optom taklifi', 'Reklama', 'Sahifa', 'Ariza', 'CRM', 'Sotuv menejeri'],
    },
  ],
  example: '1 dona krovat oladigan xaridor bilan 50 dona oladigan biznes egasiga bir xil reklama ishlamasligi kerak.',
};

export const system = {
  eyebrow: 'Marketing tizimi',
  title: 'Reklamadan sotuv jarayonigacha — bitta tizim.',
  text: 'Bizning vazifamiz faqat reklama yoqish emas. Potensial mijoz reklamangizni ko‘rganidan boshlab sotuv jamoasiga yetib borgunigacha bo‘lgan yo‘lni bir tizimga bog‘lash.',
  stages: [
    { t: 'Strategiya', d: 'Bozor, auditoriya, maqsad' },
    { t: 'Taklif', d: 'Nima uchun aynan sizdan' },
    { t: 'Kontent', d: 'Reklama materiallari, suratga olish, dizayn' },
    { t: 'Target reklama', d: 'Kerakli auditoriyaga chiqish' },
    { t: 'Sahifa / Direct', d: 'Murojaat qabul qilinadigan joy' },
    { t: 'Murojaat', d: 'Qiziqqan potensial mijoz' },
    { t: 'CRM', d: 'Har bir murojaat nazoratda' },
    { t: 'Menejer', d: 'Tezkor aloqa va taklif' },
    { t: 'Qayta aloqa', d: 'Qaror qabul qilguncha aloqa' },
    { t: 'Natija va analitika', d: 'Qaysi kanal ishlayotgani ko‘rinadi' },
  ],
  focus: 5,
  groups: [
    { name: 'Talab yaratish', from: 0, to: 3 },
    { name: 'Murojaat', from: 4, to: 5 },
    { name: 'Sotuv jarayoni', from: 6, to: 8 },
    { name: 'Nazorat', from: 9, to: 9 },
  ],
  highlightA: 'Murojaat olib kelishning o‘zi yetarli emas.',
  highlightB: 'Uni yo‘qotmaslik ham kerak.',
};

export const modules = {
  eyebrow: 'Nimalarni quramiz',
  title: 'Biznesingiz uchun kerakli qismlarni bitta tizimga yig‘amiz.',
  note: 'Qaysi qismlar kerakligi biznesning hozirgi holatiga qarab aniqlanadi.',
  items: [
    { t: 'Marketing strategiyasi', d: 'Pozitsioning, auditoriya, raqobatchilar, taklif va reklama strategiyasi.' },
    { t: 'Kontent', d: 'Reklama g‘oyalari, suratga olish, Reels, dizayn, reklama matnlari va materiallari.' },
    { t: 'Target reklama', d: 'Auditoriyani ajratish, kampaniyalar, qiziqqanlarga qayta reklama va reklamani yaxshilash.' },
    { t: 'Sahifa', d: 'Kerak bo‘lsa mahsulot, optom yo‘nalish yoki alohida taklif uchun alohida sahifa.' },
    { t: 'CRM', d: 'Murojaatlar, ularning holati, qayta aloqa va menejerlar ishini nazorat qilish tizimi.' },
    { t: 'Sotuv jarayoni', d: 'Kerak bo‘lsa suhbat skriptlari, ish ko‘rsatkichlari, menejerlar jarayoni va murojaat bilan ishlash tizimini shakllantirish.' },
  ],
};

/**
 * Verified figures for the anonymous furniture case (15–28 Aug 2026).
 * Do NOT change, round or add derived metrics (revenue, ROAS, CPL, conversion) — only confirmed data.
 */
export const caseStudy = {
  eyebrow: 'Real tajriba',
  title: 'Mebel yo‘nalishidagi real tajriba.',
  text: 'Nazariya emas — real reklama va sotuv jarayonidan olingan natija.',
  label: 'Mebel ishlab chiqarish · Anonim loyiha',
  period: '15–28 avgust 2026',
  metrics: [
    { v: '$902', k: 'reklama xarajati' },
    { v: '190', k: 'mijoz' },
    { v: '404 dona', k: 'sotilgan mahsulot' },
  ],
  story: [
    { k: 'Vazifa', d: 'Mebel mahsulotlariga yangi mijozlar oqimini yaratish va reklama orqali kelayotgan talabni sotuv jarayoniga bog‘lash.' },
    { k: 'Yondashuv', d: 'Mahsulot takliflari, reklama materiallari, auditoriyalar va murojaat bilan ishlash jarayoni ustida ishladik.' },
    { k: 'Natija', d: 'Ko‘rsatilgan davr ichida reklama orqali kelgan mijozlar hisobiga 404 dona mahsulot sotildi.' },
  ],
  disclaimer: 'Bu natija aynan ushbu loyiha va ko‘rsatilgan davrga tegishli. Natijalar mahsulot, narx, bozor, reklama budjeti va sotuv jarayoniga qarab farq qiladi.',
};

export const industries = {
  eyebrow: 'Kimlar uchun',
  title: 'Qaysi ishlab chiqarish bizneslari bilan ishlashimiz mumkin?',
  items: ['Mebel', 'Oshxona mebeli', 'Matras', 'Eshik va rom', 'Tekstil', 'Metall mahsulotlar', 'Qurilish materiallari', 'Uy uchun mahsulotlar', 'Boshqa ishlab chiqarish yo‘nalishlari'],
  proven: 'Mebel',
  provenTag: 'Real tajriba bor',
  note: 'Yo‘nalishingiz ro‘yxatda yo‘qmi? Agar mahsulot ishlab chiqarsangiz, loyihangizni alohida ko‘rib chiqamiz.',
  cta: 'Yo‘nalishimni muhokama qilish',
};

export const states = {
  eyebrow: 'Hozirgi holat',
  title: 'Hozir biznesingiz qaysi bosqichda?',
  items: [
    { t: 'Ishlab chiqarish bor. Marketing tizimi yo‘q.', d: 'Noldan mijoz jalb qilish tizimini shakllantiramiz.' },
    { t: 'Reklama bor. Natija qoniqtirmaydi.', d: 'Amaldagi marketing, taklif, reklama materiallari va murojaat jarayonini tahlil qilib, zaif nuqtalarni aniqlaymiz.' },
    { t: 'Murojaatlar keladi. Sotuv jarayoni sust.', d: 'CRM, qayta aloqa va menejerlar bilan ishlash jarayonini tartibga solishga yordam beramiz.' },
  ],
  cta: 'Qaysi bosqichdaligimni aniqlash',
};

export const process = {
  eyebrow: 'Jarayon',
  title: 'Qanday ishlaymiz?',
  steps: [
    { t: 'Ariza', d: 'Biznesingiz haqida asosiy ma’lumotlarni olamiz.' },
    { t: 'Diagnostika', d: 'Mahsulot, bozor, marketing va sotuv jarayonini ko‘rib chiqamiz.' },
    { t: 'Strategiya', d: 'Auditoriya, taklif va mijoz jalb qilish modelini belgilaymiz.' },
    { t: 'Tizimni qurish', d: 'Kerakli kontent, reklama, sahifa, CRM va boshqa qismlar tayyorlanadi.' },
    { t: 'Ishga tushirish', d: 'Kampaniyalar ishga tushadi va murojaatlar oqimi kuzatiladi.' },
    { t: 'Optimallashtirish', d: 'Natijalarga qarab reklama materiallari, reklama va jarayonlar yaxshilanadi.' },
  ],
};

export const fit = {
  eyebrow: 'Kimlar bilan ishlaymiz',
  title: 'Har bir loyiha bilan ishlamaymiz.',
  text: 'Marketing yaxshi ishlashi uchun biznesning o‘zi ham yangi mijozlarni qabul qilishga tayyor bo‘lishi kerak.',
  listTitle: 'Mos loyiha belgilari',
  list: [
    'Ishlab chiqarish yo‘lga qo‘yilgan',
    'Mahsulot sotuvga tayyor',
    'Yangi buyurtmalarni bajarish imkoniyati mavjud',
    'Marketing uchun budjet ajratishga tayyor',
    'Tizimli ishlash istagi mavjud',
  ],
  closing: 'Agar biznesingiz shu bosqichda bo‘lsa, loyihani birga ko‘rib chiqishimiz mumkin.',
};

export const faq = {
  eyebrow: 'Savollar',
  title: 'Ko‘p beriladigan savollar.',
  items: [
    { q: 'Faqat target reklama qilib berasizlarmi?', a: 'Bizning asosiy yondashuvimiz faqat reklama kabinetini boshqarish emas. Reklama natijasi taklif, reklama materiallari, sahifa va sotuv jarayoniga ham bog‘liq bo‘lgani uchun loyihaga tizim sifatida qaraymiz.' },
    { q: 'Kontentni ham tayyorlaysizlarmi?', a: 'Loyiha ehtiyojiga qarab suratga olish, montaj, dizayn, reklama matnlari va materiallarini tayyorlash jarayonga kiritilishi mumkin.' },
    { q: 'CRM bo‘lmasa nima qilamiz?', a: 'Kerak bo‘lsa murojaatlarni yig‘ish, ularning holati va qayta aloqa jarayonini nazorat qilish uchun CRM tizimini qurishga yordam beramiz.' },
    { q: 'Sotuv bo‘limimiz bo‘lmasa-chi?', a: 'Loyiha ehtiyojiga qarab sotuv jarayoni, suhbat skriptlari, ish ko‘rsatkichlari va menejerlar bilan ishlash tizimini shakllantirishga yordam berishimiz mumkin.' },
    { q: 'Faqat Toshkentdagi bizneslar bilan ishlaysizlarmi?', a: 'Yo‘q. O‘zbekiston bo‘ylab ishlab chiqarish bizneslari bilan loyihalarni ko‘rib chiqamiz.' },
    { q: 'Qancha reklama budjeti kerak?', a: 'Bu mahsulot, hudud, auditoriya va maqsadga bog‘liq. Diagnostikadan keyin loyiha uchun real reklama budjeti bo‘yicha tavsiya beriladi.' },
    { q: 'Natija qancha vaqtda chiqadi?', a: 'Aniq muddatni oldindan kafolatlab bo‘lmaydi. Natija mahsulot, narx, bozor, reklama budjeti va sotuv jarayoniga bog‘liq. Dastlabki ma’lumotlar asosida kampaniyalar bosqichma-bosqich optimallashtiriladi.' },
  ],
};

export const finalCta = {
  eyebrow: 'Loyihani muhokama qilish',
  titleA: 'Ishlab chiqarish bor.',
  titleB: 'Endi mijoz oqimini tizimlashtirish kerak.',
  text: 'Biznesingiz haqida qisqacha ma’lumot qoldiring. FAZO Digital jamoasi loyihangizni ko‘rib chiqib, qaysi marketing modeli mos kelishini muhokama qiladi.',
  cta: 'Loyihani muhokama qilish',
  aside: ['Ariza 1–2 daqiqa oladi', 'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi'],
};

/* ───────── Form ───────── */

export const form = {
  title: 'Biznesingiz haqida qisqacha ma’lumot',
  submit: 'Loyihani yuborish',
  sending: 'Yuborilmoqda…',
  required: 'Belgilangan maydonlarni to‘ldiring.',
  errors: {
    network: 'Ariza yuborilmadi: aloqa uzildi yoki server javob bermadi. Internetni tekshirib, qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    busy: 'Hozir arizalar juda ko‘p. Bir necha daqiqadan so‘ng qayta yuboring — kiritilgan ma’lumotlar saqlanib qoldi.',
    contact: 'Shu telefon raqamidan yaqinda bir nechta ariza yuborilgan. Keyinroq qayta urinib ko‘ring yoki Telegram orqali yozing.',
    invalid: 'Ariza qabul qilinmadi: ba’zi maydonlar to‘liq emas. Javoblarni tekshirib, qayta yuboring.',
    generic: 'Ariza yuborilmadi. Qayta urinib ko‘ring — kiritilgan ma’lumotlar saqlanib qoldi.',
    mismatch: 'Server arizangizni joriy ma’lumotlar bilan tasdiqlamadi. Qayta yuboring — ariza bitta bo‘lib qoladi, ikkinchi nusxa yaratilmaydi.',
    corrections: 'Bu ariza juda ko‘p marta o‘zgartirildi. Iltimos, qo‘shimcha o‘zgarishlarni Telegram orqali yozing.',
  },
  submitCorrection: 'Tuzatishni yuborish',
  correctionTitle: 'Oldingi yuborish natijasi noma’lum.',
  correctionText: 'Ariza allaqachon saqlangan bo‘lishi mumkin. Hozir yuborsangiz, o‘zgartirgan ma’lumotlaringiz o‘sha arizaga tuzatish sifatida yoziladi — ikkinchi ariza yaratilmaydi.',
  updatedTitle: 'Arizangiz yangilandi.',
  updatedText: 'O‘zgartirishlar oldingi arizangizga saqlandi — ikkinchi ariza yaratilmadi. FAZO Digital jamoasi siz bilan bog‘lanadi.',
  retry: 'Qayta yuborish',
  errorAlt: 'Muammo takrorlansa, Telegram orqali yozing:',
  successTitle: 'Arizangiz qabul qilindi.',
  successText: 'FAZO Digital jamoasi ma’lumotlarni ko‘rib chiqadi va siz bilan bog‘lanadi.',
  privacy: 'Yuborish orqali ma’lumotlaringiz',
  privacyLink: 'maxfiylik siyosati',
  privacyTail: 'asosida qayta ishlanishiga rozilik bildirasiz.',
  budgetHint: 'Reklama uchun ajratiladigan budjet. Bu FAZO Digital xizmati narxi emas. Aniq bilmasangiz — “Budjet bo‘yicha tavsiya kerak”ni tanlang.',
};

export const OPT = {
  channel: ['Chakana', 'Optom', 'Chakana + Optom'],
  budget: ['$500–$1,000', '$1,000–$3,000', '$3,000+', 'Budjet bo‘yicha tavsiya kerak'],
};
