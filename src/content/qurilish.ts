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
    { k: 'Tizim', v: 'Sahifa → CRM → Sotuv' },
  ],
  imageAlt: 'Kunduzgi yorug‘likda qurilayotgan zamonaviy turar joy majmuasi: ko‘p qavatli binolar va minorali kran',
};

export const problem = {
  title: 'Qurilish bor. Sotuv sustmi?',
  points: ['Murojaatlar kam', 'Reklama ishlayapti, natija qoniqtirmaydi', 'Murojaatlar sotuv jarayonida yo‘qoladi'],
};

export const system = {
  title: 'Biz jarayonni bitta tizimga bog‘laymiz.',
  steps: ['Meta + Google', 'Sahifa', 'Murojaat', 'CRM', 'Sotuv'],
};

/** What the service covers, step by step: how a targeted enquiry reaches the sales team. No figures, no promises. */
export const process = {
  title: 'Maqsadli murojaat qanday keladi?',
  text: 'Bizning ishimiz reklamani yoqish bilan tugamaydi. Xaridor reklamani ko‘rganidan sotuv bo‘limingiz u bilan gaplashguncha bo‘lgan yo‘lni quramiz va yuritamiz.',
  steps: [
    { t: 'Loyiha va xaridorni aniqlash', d: 'Turar joy majmuangiz, hududi, narx segmenti va kim sotib olishini birga ko‘rib chiqamiz. Reklama shu xaridorga qaratiladi.' },
    { t: 'Meta Ads va Google Ads', d: 'Instagram, Facebook va Google’da kampaniyalarni sozlaymiz va yuritamiz: auditoriya, hudud, reklama matni va budjet taqsimoti.' },
    { t: 'Murojaat sahifasi', d: 'Reklamadan kelgan odam loyiha haqida asosiy ma’lumotni ko‘radi va qisqa forma orqali murojaat qoldiradi.' },
    { t: 'CRM ga tushirish', d: 'Har bir murojaat qaysi reklamadan kelgani bilan CRM ga yoziladi — hech biri chatlarda yo‘qolmaydi.' },
    { t: 'Sotuv bo‘limiga uzatish', d: 'Murojaat menejeringizga yetadi, uning holati kuzatiladi. Qaysi reklama sotuvga olib kelayotganini ko‘rib, kampaniyalarni o‘zgartiramiz.' },
  ],
  note: 'Aniq ish hajmi loyihangiz bosqichi va sotuv bo‘limingiz holatiga qarab kelishiladi.',
};

/** What the client gets — no price figure: the published $5,000–7,000 was not confirmed against current terms. */
export const offer = {
  label: 'Siz nima olasiz',
  gets: [
    'Loyihangiz xaridoriga qaratilgan Meta Ads kampaniyalari va ularni muntazam optimallashtirish',
    'Reklama taklifiga mos murojaat sahifasi',
    'Har bir murojaat manbasi bilan bir joyda — chatlarda yo‘qolmaydi',
    'Sotuv bo‘limingizga uzatilgan murojaatlar holatini kuzatish',
    'Oy yakunida hisobot: reklama sarfi, murojaatlar va qayd etilgan sotuvlar',
  ],
  price: 'Xizmat narxi loyiha hajmiga qarab tahlildan keyin yozma taklifda ko‘rsatiladi.',
  adBudget: 'Reklama budjeti alohida ajratiladi va reklama platformasiga to‘lanadi.',
};

export const register = {
  title: 'Ro‘yxatdan o‘tish',
  text: 'Loyihangiz haqida qisqacha ma’lumot qoldiring. Jamoamiz siz bilan bog‘lanadi.',
};
