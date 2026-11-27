/** Copy and form options for the /ishlab-chiqarish landing (manufacturers, Uzbek only). */

export const IC_FORM_ID = 'ariza';

export const nav = [
  { id: 'tizim', label: 'Tizim' },
  { id: 'sotuv-yollari', label: 'Chakana / Optom' },
  { id: 'tajriba', label: 'Tajriba' },
  { id: 'savollar', label: 'Savollar' },
];

export const hero = {
  eyebrow: 'Işlab chiqariş bizneslari uchun',
  titleA: 'Mahsulot işlab chiqarasiz.',
  titleB: 'Biz unga mijoz olib keladigan marketing tizimini quramiz.',
  text: 'FAZO Digital işlab chiqariş bizneslari uchun strategiya, kontent, reklama, sahifa, CRM va sotuv jarayonlarini yagona tizimga bog‘laydi.',
  chain: ['Strategiya', 'Reklama', 'Murojaat', 'CRM', 'Sotuv jarayoni'],
  cta: 'Loyihani muhokama qiliş',
  ctaSecondary: 'Tizim qanday işlaydi?',
};

export const problem = {
  eyebrow: 'Muammo',
  title: 'Sifatli mahsulotning o‘zi yetarli emas.',
  text: 'Sex işlayapti. Mahsulot tayyor. Jamoa bor. Lekin yangi buyurtmalar tizimli kelmasa, işlab chiqariş imkoniyatidan to‘liq foydalaniş qiyinlaşadi.',
  cards: [
    { t: 'Reklama bor, lekin tizim yo‘q', d: 'Kampaniyalar işlaydi, ammo qaysi reklama real mijoz olib kelayotgani aniq kuzatilmaydi.' },
    { t: 'Kontent bor, lekin sotuvga bog‘lanmagan', d: 'Instagram yuritiladi, lekin kontentdan murojaat va keyingi sotuv jarayonigacha aniq yo‘l qurilmagan.' },
    { t: 'Murojaat keladi, keyin yo‘qoladi', d: 'Murojaat tuşadi, lekin qayta aloqa va nazorat bo‘lmagani sabab ayrim potensial mijozlar yo‘qoladi.' },
    { t: 'Optom va chakana aralaşib ketgan', d: '1 dona mahsulot oladigan xaridor bilan katta hajmda xarid qiladigan mijozga bir xil taklif beriladi.' },
    { t: 'Mijoz manbasi noma’lum', d: 'Qaysi kanal, reklama materiali yoki taklif yaxşi işlayotganini ko‘rsatadigan analitika yetarli emas.' },
    { t: 'Marketing bo‘laklarga bo‘lingan', d: 'SMM boşqa tomonda, target boşqa tomonda, sotuv bo‘limi esa alohida işlaydi.' },
  ],
  statement: 'Muammo faqat reklamada bo‘lmasligi mumkin. Muammo butun jarayon bir-biriga ulanmaganida bo‘lişi mumkin.',
};

export const diagnostics = {
  eyebrow: 'Diagnostika',
  title: 'Reklamadan oldin biznesni tuşunamiz.',
  text: 'Mahsulot, narx, auditoriya, hudud, işlab chiqariş imkoniyati va hozirgi sotuv jarayonini ko‘rib chiqamiz. Şundan keyin qaysi marketing modeli biznesingizga mosligini aniqlaymiz.',
  outcomeTitle: 'Diagnostikadan keyin',
  outcome: [
    'Biznesingizning hozirgi holati birga ko‘rib chiqiladi',
    'Sizga mos marketing yo‘nalişi muhokama qilinadi',
    'Keyingi qadamlar kelişib olinadi',
  ],
  items: [
    { t: 'Mahsulot va taklif', d: 'Assortiment, narx va xaridorga beriladigan taklif' },
    { t: 'Bozor va auditoriya', d: 'Kim sotib oladi, qayerda va qanday hajmda' },
    { t: 'Hozirgi marketing', d: 'Reklama, kontent va murojaat manbalari' },
    { t: 'Sotuv jarayoni', d: 'Murojaat qanday qabul qilinadi va u bilan kim işlaydi' },
  ],
  cta: 'Biznesimni tahlil qiliş',
};

export const channels = {
  eyebrow: 'Chakana / Optom',
  title: 'Bitta mahsulot. Ikki xil sotuv yo‘li.',
  text: 'Chakana xaridor va katta hajmda xarid qiluvchi mijoz bir xil qaror qabul qilmaydi. Şuning uchun ularga bir xil reklama ko‘rsatiş şart emas.',
  cards: [
    {
      tag: 'Chakana',
      qty: '1',
      title: 'Oxirgi xaridorga sotiş',
      text: 'Mahsulotni bevosita iste’molchiga sotiş uchun alohida taklif, reklama materiallari va reklama yo‘li quriladi.',
      segmentsLabel: 'Kimlar uchun',
      segments: ['Uy uchun xarid qiluvchilar', 'Individual buyurtmachilar', 'Do‘kondan xarid qiluvchilar'],
      flow: ['Reklama materiali', 'Reklama', 'Sahifa / Direct', 'Murojaat', 'Menejer'],
    },
    {
      tag: 'Optom',
      qty: '50',
      title: 'Katta hajmdagi mijozlarni jalb qiliş',
      text: 'Optom va korporativ mijozlar uchun alohida muloqot, taklif va murojaat yig‘iş tizimi quriladi.',
      segmentsLabel: 'Segmentlar',
      segments: ['Dilerlar', 'Qayta sotuvchilar', 'Do‘konlar', 'Mehmonxonalar', 'Hostellar', 'Taşkilotlar', 'Korporativ xaridorlar', 'Boşqa bizneslar'],
      flow: ['Optom taklifi', 'Reklama', 'Sahifa', 'Ariza', 'CRM', 'Sotuv menejeri'],
    },
  ],
  example: '1 dona krovat oladigan xaridor bilan 50 dona oladigan biznes egasiga bir xil reklama işlamasligi kerak.',
};

export const system = {
  eyebrow: 'Marketing tizimi',
  title: 'Reklamadan sotuv jarayonigacha — bitta tizim.',
  text: 'Bizning vazifamiz faqat reklama yoqiş emas. Potensial mijoz reklamangizni ko‘rganidan boşlab sotuv jamoasiga yetib borgunigacha bo‘lgan yo‘lni bir tizimga bog‘laş.',
  stages: [
    { t: 'Strategiya', d: 'Bozor, auditoriya, maqsad' },
    { t: 'Taklif', d: 'Nima uchun aynan sizdan' },
    { t: 'Kontent', d: 'Reklama materiallari, suratga oliş, dizayn' },
    { t: 'Target reklama', d: 'Kerakli auditoriyaga chiqiş' },
    { t: 'Sahifa / Direct', d: 'Murojaat qabul qilinadigan joy' },
    { t: 'Murojaat', d: 'Qiziqqan potensial mijoz' },
    { t: 'CRM', d: 'Har bir murojaat nazoratda' },
    { t: 'Menejer', d: 'Tezkor aloqa va taklif' },
    { t: 'Qayta aloqa', d: 'Qaror qabul qilguncha aloqa' },
    { t: 'Natija va analitika', d: 'Qaysi kanal işlayotgani ko‘rinadi' },
  ],
  focus: 5,
  groups: [
    { name: 'Talab yaratiş', from: 0, to: 3 },
    { name: 'Murojaat', from: 4, to: 5 },
    { name: 'Sotuv jarayoni', from: 6, to: 8 },
    { name: 'Nazorat', from: 9, to: 9 },
  ],
  highlightA: 'Murojaat olib kelişning o‘zi yetarli emas.',
  highlightB: 'Uni yo‘qotmaslik ham kerak.',
};

export const modules = {
  eyebrow: 'Nimalarni quramiz',
  title: 'Biznesingiz uchun kerakli qismlarni bitta tizimga yig‘amiz.',
  note: 'Qaysi qismlar kerakligi biznesning hozirgi holatiga qarab aniqlanadi.',
  items: [
    { t: 'Marketing strategiyasi', d: 'Pozitsioning, auditoriya, raqobatchilar, taklif va reklama strategiyasi.' },
    { t: 'Kontent', d: 'Reklama g‘oyalari, suratga oliş, Reels, dizayn, reklama matnlari va materiallari.' },
    { t: 'Target reklama', d: 'Auditoriyani ajratiş, kampaniyalar, qiziqqanlarga qayta reklama va reklamani yaxşilaş.' },
    { t: 'Sahifa', d: 'Kerak bo‘lsa mahsulot, optom yo‘naliş yoki alohida taklif uchun alohida sahifa.' },
    { t: 'CRM', d: 'Murojaatlar, ularning holati, qayta aloqa va menejerlar işini nazorat qiliş tizimi.' },
    { t: 'Sotuv jarayoni', d: 'Kerak bo‘lsa suhbat skriptlari, iş ko‘rsatkichlari, menejerlar jarayoni va murojaat bilan işlaş tizimini şakllantiriş.' },
  ],
};

/**
 * Verified figures for the anonymous furniture case (15–28 Aug 2026).
 * Do NOT change, round or add derived metrics (revenue, ROAS, CPL, conversion) — only confirmed data.
 */
export const caseStudy = {
  eyebrow: 'Real tajriba',
  title: 'Mebel yo‘nalişidagi real tajriba.',
  text: 'Nazariya emas — real reklama va sotuv jarayonidan olingan natija.',
  label: 'Mebel işlab chiqariş · Anonim loyiha',
  period: '15–28 avgust 2026',
  metrics: [
    { v: '$902', k: 'reklama xarajati' },
    { v: '190', k: 'mijoz' },
    { v: '404 dona', k: 'sotilgan mahsulot' },
  ],
  story: [
    { k: 'Vazifa', d: 'Mebel mahsulotlariga yangi mijozlar oqimini yaratiş va reklama orqali kelayotgan talabni sotuv jarayoniga bog‘laş.' },
    { k: 'Yondaşuv', d: 'Mahsulot takliflari, reklama materiallari, auditoriyalar va murojaat bilan işlaş jarayoni ustida işladik.' },
    { k: 'Natija', d: 'Ko‘rsatilgan davr ichida reklama orqali kelgan mijozlar hisobiga 404 dona mahsulot sotildi.' },
  ],
  disclaimer: 'Bu natija aynan uşbu loyiha va ko‘rsatilgan davrga tegişli. Natijalar mahsulot, narx, bozor, reklama budjeti va sotuv jarayoniga qarab farq qiladi.',
};

export const industries = {
  eyebrow: 'Kimlar uchun',
  title: 'Qaysi işlab chiqariş bizneslari bilan işlaşimiz mumkin?',
  items: ['Mebel', 'Oşxona mebeli', 'Matras', 'Eşik va rom', 'Tekstil', 'Metall mahsulotlar', 'Quriliş materiallari', 'Uy uchun mahsulotlar', 'Boşqa işlab chiqariş yo‘nalişlari'],
  proven: 'Mebel',
  provenTag: 'Real tajriba bor',
  note: 'Yo‘nalişingiz ro‘yxatda yo‘qmi? Agar mahsulot işlab chiqarsangiz, loyihangizni alohida ko‘rib chiqamiz.',
  cta: 'Yo‘nalişimni muhokama qiliş',
};

export const states = {
  eyebrow: 'Hozirgi holat',
  title: 'Hozir biznesingiz qaysi bosqichda?',
  items: [
    { t: 'Işlab chiqariş bor. Marketing tizimi yo‘q.', d: 'Noldan mijoz jalb qiliş tizimini şakllantiramiz.' },
    { t: 'Reklama bor. Natija qoniqtirmaydi.', d: 'Amaldagi marketing, taklif, reklama materiallari va murojaat jarayonini tahlil qilib, zaif nuqtalarni aniqlaymiz.' },
    { t: 'Murojaatlar keladi. Sotuv jarayoni sust.', d: 'CRM, qayta aloqa va menejerlar bilan işlaş jarayonini tartibga solişga yordam beramiz.' },
  ],
  cta: 'Qaysi bosqichdaligimni aniqlaş',
};

export const process = {
  eyebrow: 'Jarayon',
  title: 'Qanday işlaymiz?',
  steps: [
    { t: 'Ariza', d: 'Biznesingiz haqida asosiy ma’lumotlarni olamiz.' },
    { t: 'Diagnostika', d: 'Mahsulot, bozor, marketing va sotuv jarayonini ko‘rib chiqamiz.' },
    { t: 'Strategiya', d: 'Auditoriya, taklif va mijoz jalb qiliş modelini belgilaymiz.' },
    { t: 'Tizimni quriş', d: 'Kerakli kontent, reklama, sahifa, CRM va boşqa qismlar tayyorlanadi.' },
    { t: 'Işga tuşiriş', d: 'Kampaniyalar işga tuşadi va murojaatlar oqimi kuzatiladi.' },
    { t: 'Optimallaştiriş', d: 'Natijalarga qarab reklama materiallari, reklama va jarayonlar yaxşilanadi.' },
  ],
};

export const fit = {
  eyebrow: 'Kimlar bilan işlaymiz',
  title: 'Har bir loyiha bilan işlamaymiz.',
  text: 'Marketing yaxşi işlaşi uchun biznesning o‘zi ham yangi mijozlarni qabul qilişga tayyor bo‘lişi kerak.',
  listTitle: 'Mos loyiha belgilari',
  list: [
    'Işlab chiqariş yo‘lga qo‘yilgan',
    'Mahsulot sotuvga tayyor',
    'Yangi buyurtmalarni bajariş imkoniyati mavjud',
    'Marketing uchun budjet ajratişga tayyor',
    'Tizimli işlaş istagi mavjud',
  ],
  closing: 'Agar biznesingiz şu bosqichda bo‘lsa, loyihani birga ko‘rib chiqişimiz mumkin.',
};

export const faq = {
  eyebrow: 'Savollar',
  title: 'Ko‘p beriladigan savollar.',
  items: [
    { q: 'Faqat target reklama qilib berasizlarmi?', a: 'Bizning asosiy yondaşuvimiz faqat reklama kabinetini boşqariş emas. Reklama natijasi taklif, reklama materiallari, sahifa va sotuv jarayoniga ham bog‘liq bo‘lgani uchun loyihaga tizim sifatida qaraymiz.' },
    { q: 'Kontentni ham tayyorlaysizlarmi?', a: 'Loyiha ehtiyojiga qarab suratga oliş, montaj, dizayn, reklama matnlari va materiallarini tayyorlaş jarayonga kiritilişi mumkin.' },
    { q: 'CRM bo‘lmasa nima qilamiz?', a: 'Kerak bo‘lsa murojaatlarni yig‘iş, ularning holati va qayta aloqa jarayonini nazorat qiliş uchun CRM tizimini qurişga yordam beramiz.' },
    { q: 'Sotuv bo‘limimiz bo‘lmasa-chi?', a: 'Loyiha ehtiyojiga qarab sotuv jarayoni, suhbat skriptlari, iş ko‘rsatkichlari va menejerlar bilan işlaş tizimini şakllantirişga yordam berişimiz mumkin.' },
    { q: 'Faqat Toşkentdagi bizneslar bilan işlaysizlarmi?', a: 'Yo‘q. O‘zbekiston bo‘ylab işlab chiqariş bizneslari bilan loyihalarni ko‘rib chiqamiz.' },
    { q: 'Qancha reklama budjeti kerak?', a: 'Bu mahsulot, hudud, auditoriya va maqsadga bog‘liq. Diagnostikadan keyin loyiha uchun real reklama budjeti bo‘yicha tavsiya beriladi.' },
    { q: 'Natija qancha vaqtda chiqadi?', a: 'Aniq muddatni oldindan kafolatlab bo‘lmaydi. Natija mahsulot, narx, bozor, reklama budjeti va sotuv jarayoniga bog‘liq. Dastlabki ma’lumotlar asosida kampaniyalar bosqichma-bosqich optimallaştiriladi.' },
  ],
};

export const finalCta = {
  eyebrow: 'Loyihani muhokama qiliş',
  titleA: 'Işlab chiqariş bor.',
  titleB: 'Endi mijoz oqimini tizimlaştiriş kerak.',
  text: 'Biznesingiz haqida qisqacha ma’lumot qoldiring. FAZO Digital jamoasi loyihangizni ko‘rib chiqib, qaysi marketing modeli mos kelişini muhokama qiladi.',
  cta: 'Loyihani muhokama qiliş',
  aside: ['Ariza 1–2 daqiqa oladi', 'Ma’lumotlaringiz faqat siz bilan bog‘laniş uchun işlatiladi'],
};
