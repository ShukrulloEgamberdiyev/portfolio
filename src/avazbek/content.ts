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
  role: "Marketing • SMM • Target • Content",
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
  { label: "Resume", href: "#resume" },
  { label: "Men haqimda", href: "#about" },
];

/** Bo'limlar raqami va inglizcha label — bitta joyda, ketma-ketlik buzilmasligi uchun */

export const hero = {
  label: "MARKETING • SMM • TARGET • CONTENT",
  statement: "Marketingni biznes natijasiga bog‘layman.",
  subtitle: "SMM, Meta Ads, kontent va marketing strategiyasi orqali brendlarning o‘sishi ustida ishlayman.",
};

export const about = {
  title: "Men haqimda",
  lead: "Men Avazbek Meliqoziyev — marketing, SMM, target reklama, kontent va video yo‘nalishlarida ishlayman.",
  text: "Asosiy yondashuvim — strategiya, kreativ va reklamani biznesning real maqsadlari bilan bog‘lash.",
  facts: ["Marketing / SMM / Target", "Meta Ads", "Content & Video", "Toshkent, O‘zbekiston"],
};

export const approach = {
  title: "Ishlash yondashuvim",
  steps: ["Biznes", "Auditoriya", "Offer", "Kontent", "Reklama", "Natija"],
};

/** Portfolio oxiridagi trust-blok. Faqat tasdiqlangan raqam; qolganlari matnli. */
export const highlights = [
  { value: "19+", label: "Ishlangan brendlar" },
  { value: "SMM", label: "Strategiyadan kontentgacha" },
  { value: "META ADS", label: "Target va optimizatsiya" },
  { value: "VIDEO", label: "Reels va reklama kontenti" },
];

/**
 * Logolar: /public/images/brands/brand-XX.png.
 * `name: null` — brend nomi aniq bo'lmasa: UI'da nom chiqmaydi, alt = "Client brand".
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
  text: "Turli yo‘nalishdagi bizneslar bilan marketing, reklama va kontent loyihalarida.",
};

export const portfolio = {
  title: "Portfolio",
  text: "Marketing, kontent va reklama yo‘nalishida ishlagan loyihalarimdan ayrimlari.",
  parts: [
    { id: "brands", label: "Ishlagan brendlar" },
    { id: "video", label: "Video ishlari" },
    { id: "creative", label: "Marketing & Creative" },
    { id: "results", label: "Natijalar" },
  ],
  videoTitle: "Video ishlari",
  videoText: "Suratga olish, montaj va short-form kontent.",
  creativeTitle: "Marketing & Creative",
};

/** Marketing & Creative kartalari — vizual kompozitsiya, real raqam emas */
export const creative = [
  {
    no: "01",
    title: "Marketing Strategy",
    tags: ["Strategy", "Audience", "Offer", "Content", "Ads", "Optimization"],
    visual: "flow" as const,
  },
  {
    no: "02",
    title: "Target Advertising",
    tags: ["Creative testing", "Audience", "Campaign", "Optimization"],
    visual: "ads" as const,
  },
  {
    no: "03",
    title: "Content",
    tags: ["Reels", "Creative", "Visual", "Communication"],
    visual: "content" as const,
  },
];

export const videos = [
  {
    src: "/avazbek/videos/video-01.mp4",
    poster: "/avazbek/videos/posters/video-01.jpg",
    title: "Content Production",
    category: "Intervyu • Reels",
  },
  {
    src: "/avazbek/videos/video-02.mp4",
    poster: "/avazbek/videos/posters/video-02.jpg",
    title: "Business Content",
    category: "Marketing meeting",
  },
  {
    src: "/avazbek/videos/video-03.mp4",
    poster: "/avazbek/videos/posters/video-03.jpg",
    title: "Behind the Scenes",
    category: "Ish jarayoni",
  },
  {
    src: "/avazbek/videos/video-04.mp4",
    poster: "/avazbek/videos/posters/video-04.jpg",
    title: "Corporate Content",
    category: "Biznes uchrashuv",
  },
];

export const network = {
  title: "Professional muhit",
  text: "Marketingdagi ishlarim biznes egalari, jamoalar va kreativ mutaxassislar bilan doimiy hamkorlikni talab qiladi.",
};

export const resume = {
  title: "Resume",
  roles: "Marketing • SMM • Target • Video Editing",
  summary:
    "Biznesning auditoriyasi, taklifi, kontenti va reklamasini yagona tizim sifatida ko‘rib, sotuv va o‘sishga yo‘naltirilgan marketing ustida ishlayman.",
  /** Yo'nalishlar — Experience ma'lumoti kiritilmaguncha shu ko'rsatiladi */
  directions: [
    { title: "Marketing & SMM", text: "Strategiya, kontent rejasi va brend kommunikatsiyasi." },
    { title: "Target Advertising", text: "Meta Ads kampaniyalari: sozlash, kreativ test, optimizatsiya." },
    { title: "Content & Video", text: "Reels, reklama videolari va short-form kontent." },
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
