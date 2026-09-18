# fazodigital.uz

FAZO Digital — growth & performance agency website. React 18 · TypeScript · Tailwind CSS v4 · Framer Motion · React Router · Lenis.

Uch tilda: **UZ** (asosiy, `/`), **RU** (`/ru`), **EN** (`/en`). Har bir sahifa build paytida tayyor HTML ga aylantiriladi (prerender), shuning uchun Google va Telegram/Facebook preview to‘g‘ri ishlaydi.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck + build + 63 sahifani prerender + sitemap → dist/
npm run preview      # build natijasini lokalda ko‘rish
```

## Sahifalar
```
/                      Bosh sahifa
/expertise             4 yo‘nalish
/expertise/:slug       growth-strategy · creative-content · performance-marketing · sales-system
/work                  Barcha loyihalar
/work/:slug            6 ta case study
/process               Jarayon + birinchi 90 kun
/about                 FAZO haqida, prinsiplar, raqamlar
/insights              Maqolalar
/insights/:slug        3 ta maqola (o‘zbek tilida)
/apply                 Ariza formasi
/privacy               Maxfiylik siyosati
```
Har biri `/ru/...` va `/en/...` ko‘rinishida ham mavjud.

## Struktura
```
src/
  i18n/          uz.ts · ru.ts · en.ts (bosh sahifa matni), pages.*.ts (ichki sahifalar), provider
  content/       articles.ts — maqolalar matni
  data/site.ts   kontaktlar, statistika, mijozlar, case'lar, tizim bosqichlari
  pages/         har bir sahifa
  components/    bo'limlar va umumiy bloklar
  ui/            Headline, Button, Reveal, CountUp, Cursor, Atmosphere
  lib/           scroll, seo, submit, routes
scripts/prerender.mjs   HTML sahifalarni va sitemap'ni yaratadi
docs/apps-script.gs     Google Sheets'ga ariza yozadigan skript
```

## Ariza → Google Sheets
`docs/apps-script.gs` faylini **Targeting Xizmat** jadvalida Apps Script sifatida joylashtiring va web app qilib deploy qiling. Keyin `.env` faylga yozing (`.env.example` ga qarang):

```
VITE_APPLICATION_ENDPOINT=https://script.google.com/macros/s/.../exec
VITE_APPLICATION_TOKEN=fazo-2026-maxfiy
```
Arizalar jadvalda **"Sayt arizalari"** listiga tushadi. Telegram xabari uchun skript ichidagi `BOT_TOKEN` va `CHAT_ID` ni to‘ldiring.

## Deploy (GitHub + Vercel)
```bash
git init && git add -A && git commit -m "FAZO Digital website"
git branch -M main
git remote add origin https://github.com/<username>/fazodigital.git
git push -u origin main
```
1. vercel.com → **Add New → Project** → repo'ni tanlang. Sozlama `vercel.json` da tayyor.
2. **Settings → Environment Variables** → yuqoridagi ikki qiymatni qo‘shing → qayta deploy.
3. **Settings → Domains** → `fazodigital.uz` va `www.fazodigital.uz`.
4. Vercel ko‘rsatgan DNS yozuvini ahost panelida kiriting. `.env` fayl hech qachon GitHub'ga yuklanmaydi.

ahost hostingiga qo‘yish kerak bo‘lsa: `npm run build` dan keyin `dist/` ichidagi hamma narsani `public_html` ga yuklang.

## Qolgan ishlar (kontent)
- **Mijoz logotiplari:** `src/data/site.ts` dagi `CLIENTS` ro‘yxatiga `logo: '/logos/nom.svg'` qo‘shing va fayllarni `public/logos/` ga soling.
- **Case media:** `CASES` ichida `media: { poster: '/work/nom.jpg', video: '/work/nom.mp4' }`. Video ovozsiz, 6–10 soniya, 2MB gacha.
- **Meta Pixel:** `index.html` ga pixel kodini qo‘ying va `src/lib/submit.ts` ichida muvaffaqiyatli yuborilgandan keyin `Lead` hodisasini yuboring.
- **Maqolalar:** `src/content/articles.ts`. Hozir 3 ta maqola o‘zbek tilida; RU/EN sahifalarida shu matn ko‘rsatiladi va til haqida qisqa izoh chiqadi.
# portfolio
# portfolio
# portfolio
# portfolio
# portfolio
# portfolio
