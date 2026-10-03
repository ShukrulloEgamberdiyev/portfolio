/**
 * Saytdagi barcha matn va ma'lumotlar shu faylda.
 * fazodigital.uz/avazbek sahifasi shu ma'lumotdan quriladi (src/avazbek/).
 *
 * QOIDA: faqat tasdiqlangan ma'lumot yozing. Bo'sh qoldirilgan maydonlar
 * (null, "" yoki bo'sh massiv) saytda ham, PDF'da ham umuman ko'rsatilmaydi.
 */

export const site = {
  name: "Avazbek Meliqoziyev",
  shortName: "AVAZBEK.",
  role: "Marketing • SMM • Target • Kontent",
  title: "Avazbek Meliqoziyev | Marketing, SMM & Target Portfolio",
  description:
    "Avazbek Meliqoziyev — marketing, SMM, Meta Ads, target reklama, kontent va video production bo‘yicha professional portfolio.",
  url: "https://www.fazodigital.uz/avazbek",
  location: "Toshkent, O‘zbekiston",
  resumePdf: "/avazbek/resume/avazbek-meliqoziyev-resume.pdf",
};

export const contacts = {
  telegram: { label: "@melikuziyev_avaz", href: "https://t.me/melikuziyev_avaz" },
  email: {
    label: "avazbekmeliqoziyev15@gmail.com",
    href: "mailto:avazbekmeliqoziyev15@gmail.com",
  },
  phone: { label: "+998 91 010 75 66", href: "tel:+998910107566" },
};

export const nav = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Rezyume", href: "#resume" },
  { label: "Men haqimda", href: "#about" },
];

export const hero = {
  label: "Marketing • SMM • Target • Kontent",
  statement: "Marketingni biznes natijasiga bog‘layman.",
  subtitle: "SMM, Meta Ads, kontent va marketing strategiyasi orqali brendlarning o‘sishi ustida ishlayman.",
};

export const about = {
  title: "Men haqimda",
  lead: "Men Avazbek Meliqoziyev — marketing, SMM, target reklama, kontent va video yo‘nalishlarida ishlayman.",
  text: "Asosiy yondashuvim — strategiya, kreativ va reklamani biznesning real maqsadlari bilan bog‘lash.",
  facts: ["Marketing / SMM / Target", "Meta Ads", "Kontent va video", "Toshkent, O‘zbekiston"],
};

export const approach = {
  title: "Ishlash yondashuvim",
  steps: ["Biznes", "Auditoriya", "Offer", "Kontent", "Reklama", "Natija"],
};

/** Natijalar: FAQAT tasdiqlangan raqam. Yangi tasdiqlangan raqam bo'lsa shu yerga qo'shiladi. */
export const trust = {
  /** "19+" FAZO Digital reference'idan olingan (agentlik da'vosi) — Avazbek uchun tasdiqlanmagan, shuning uchun raqamsiz. */
  title: "Turli sohalardagi brendlar bilan ishlaganman",
  text: "Avtosalon, restoran, ko‘chmas mulk, ta’lim va ishlab chiqarish yo‘nalishidagi bizneslar bilan marketing, target va kontent loyihalari.",
};

/**
 * Logolar: /public/avazbek/images/brands/brand-XX.webp.
 * `name: null` — brend nomi aniq bo'lmasa: UI'da nom chiqmaydi, alt = "Brand logo".
 */
export const brands: { name: string | null; logo: string }[] = [
  { name: "Fazilat Estate", logo: "/avazbek/images/brands/brand-01.webp" },
  { name: "Rose Flowers", logo: "/avazbek/images/brands/brand-02.webp" },
  { name: "Bliss", logo: "/avazbek/images/brands/brand-03.webp" },
  { name: "West", logo: "/avazbek/images/brands/brand-04.webp" },
  { name: "UZ Style Catering", logo: "/avazbek/images/brands/brand-05.webp" },
  { name: "Boost", logo: "/avazbek/images/brands/brand-06.webp" },
  { name: "Alleya", logo: "/avazbek/images/brands/brand-07.webp" },
  { name: "Leapmotor · Exeed · Geely Auto", logo: "/avazbek/images/brands/brand-08.webp" },
  { name: "LaminoX Factory", logo: "/avazbek/images/brands/brand-09.webp" },
  { name: "Aura", logo: "/avazbek/images/brands/brand-10.webp" },
  { name: null, logo: "/avazbek/images/brands/brand-11.webp" },
  { name: "IFAR Home Confectionery", logo: "/avazbek/images/brands/brand-12.webp" },
  { name: "Tatneft 777", logo: "/avazbek/images/brands/brand-13.webp" },
  { name: "ZK Academy", logo: "/avazbek/images/brands/brand-14.webp" },
  { name: null, logo: "/avazbek/images/brands/brand-15.webp" },
  { name: null, logo: "/avazbek/images/brands/brand-16.webp" },
  { name: "Dilbar Restaurant", logo: "/avazbek/images/brands/brand-17.webp" },
  { name: null, logo: "/avazbek/images/brands/brand-18.webp" },
];

export const brandsCopy = {
  title: "Ishlagan brendlarim",
  text: "Avtosalon, restoran, ko‘chmas mulk, ta’lim va ishlab chiqarish — marketing, reklama va kontent loyihalari.",
};

export const portfolio = {
  kicker: "Tanlangan ishlar",
  title: "Portfolio",
  text: "Marketing, kontent va reklama yo‘nalishidagi ishlardan namunalar.",
  worksTitle: "Videolar",
  worksText: "Real loyihalardan video materiallar. Kartochkada faqat videoda ko‘rinadigan ma’lumot berilgan.",
  creativeTitle: "Yo‘nalishlar",
};

/** Marketing & Creative — 3 ta vizual blok. Vizuallar illyustratsiya, real kabinet ma'lumoti emas. */
export const creative = [
  {
    no: "01",
    title: "Marketing strategiyasi",
    text: "Biznes, auditoriya, offer va kontentni bitta yo‘nalishga bog‘layman.",
    visual: "strategy" as const,
  },
  {
    no: "02",
    title: "Target reklama",
    text: "Meta Ads kampaniyalarini test, optimizatsiya va performance asosida boshqaraman.",
    visual: "ads" as const,
  },
  {
    no: "03",
    title: "Kontent va video",
    text: "Reels, reklama kreativlari va short-form kontent ishlab chiqaman.",
    visual: "content" as const,
  },
];

/**
 * Videolar. `seen` — faqat kadrda ko'rinadigan fakt. Mijoz nomi, vazifa, Avazbekning roli va natija
 * tasdiqlangach `client`, `task`, `role`, `result` maydonlarini qo'shing — ular kartochkada avtomatik chiqadi.
 */
export const videos: {
  src: string;
  poster: string;
  title: string;
  category: string;
  seen: string;
  client?: string;
  task?: string;
  role?: string;
  result?: string;
}[] = [
  {
    src: "/avazbek/videos/video-01.mp4",
    poster: "/avazbek/videos/posters/video-01.jpg",
    title: "Kontent yaratish",
    category: "Intervyu • Reels",
    seen: "Ofis muhitida rahbar bilan suhbat: Avazbek savol beradi, video Reels formatida montaj qilingan.",
  },
  {
    src: "/avazbek/videos/video-02.mp4",
    poster: "/avazbek/videos/posters/video-02.jpg",
    title: "Marketing uchrashuvi",
    category: "Tadbir • Reels",
    seen: "Marketing mavzusidagi uchrashuvdan qisqa video: spiker, taqdimot ekrani va ishtirokchilar.",
  },
  {
    src: "/avazbek/videos/video-03.mp4",
    poster: "/avazbek/videos/posters/video-03.jpg",
    title: "Ish jarayonidan",
    category: "Ish jarayoni",
    seen: "Avazbek noutbuk va telefonda ishlayotgan payt — ish jarayonidan kadrlar.",
  },
  {
    src: "/avazbek/videos/video-04.mp4",
    poster: "/avazbek/videos/posters/video-04.jpg",
    title: "Biznes uchrashuv",
    category: "Korporativ kontent",
    seen: "Stol atrofidagi muhokama: Avazbek suhbatda o‘z fikrini bildiradi.",
  },
];

export const network = {
  title: "Professional muhit",
  text: "Marketingdagi ishlarim biznes egalari, jamoalar va kreativ mutaxassislar bilan doimiy hamkorlikni talab qiladi.",
};

export const resume = {
  title: "Rezyume",
  roles: "Marketing • SMM • Target • Video montaj",
  summary:
    "Biznesning auditoriyasi, taklifi, kontenti va reklamasini yagona tizim sifatida ko‘rib, sotuv va o‘sishga yo‘naltirilgan marketing ustida ishlayman.",
  /** Yo'nalishlar — Experience ma'lumoti kiritilmaguncha shu ko'rsatiladi */
  directions: [
    { title: "Marketing va SMM", text: "Strategiya, kontent rejasi va brend kommunikatsiyasi." },
    { title: "Target reklama", text: "Meta Ads kampaniyalari: sozlash, kreativ test, optimizatsiya." },
    { title: "Kontent va video", text: "Reels, reklama videolari va qisqa formatdagi kontent." },
  ],
  /**
   * Real ish tajribasi. Bo'sh bo'lsa timeline saytda ham, PDF'da ham chiqmaydi.
   * Format: { role, company, period?, points: [] } — period bo'lmasa ko'rsatilmaydi.
   */
  experience: [] as { role: string; company: string; period?: string; points: string[] }[],
  coreExpertise: [
    "Marketing Strategy",
    "SMM",
    "Meta Ads",
    "Targeting",
    "Content Strategy",
    "Video Editing",
    "Creative Strategy",
  ],
  /** Saytda ko'rsatiladigan o'zbekcha ro'yxatlar (PDF inglizcha `skills` dan foydalanadi) */
  skillsUz: [
    {
      group: "Ko‘nikmalar",
      items: ["Marketing strategiyasi", "SMM", "Meta Ads", "Target reklama", "Auditoriya tahlili", "Taklif (offer) ishlab chiqish", "Kontent strategiyasi", "Performance marketing"],
    },
    {
      group: "Kreativ",
      items: ["Video montaj", "Reels tayyorlash", "Motion grafika", "Kreativ strategiya", "Kopirayting", "Vizual kontent"],
    },
    {
      group: "Ishlatadigan dasturlar",
      items: ["Adobe Premiere Pro", "Adobe After Effects", "Adobe Photoshop", "Figma", "CapCut", "VN", "Meta Ads Manager", "Tilda", "amoCRM", "Bitrix24"],
    },
  ],
  skills: [
    {
      group: "Marketing",
      items: ["Marketing Strategy", "SMM", "Meta Ads", "Targeting", "Audience Research", "Offer Development", "Content Strategy", "Performance Marketing"],
    },
    {
      group: "Creative",
      items: ["Video Editing", "Reels Production", "Motion Graphics", "Creative Strategy", "Copywriting", "Visual Content"],
    },
    {
      group: "Tools",
      items: ["Adobe Premiere Pro", "Adobe After Effects", "Adobe Photoshop", "Figma", "CapCut", "VN", "Meta Ads Manager", "Tilda", "amoCRM", "Bitrix24"],
    },
  ],
  /** Bo'sh bo'lsa PDF'da bo'lim chiqmaydi */
  languages: "",
  education: "",
};

export const contact = {
  title: "Birga ishlaymizmi?",
  text: "Marketing, reklama yoki kontent bo‘yicha loyiha bo‘lsa, men bilan to‘g‘ridan-to‘g‘ri bog‘lanishingiz mumkin.",
};
