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
/avtosalon             Avtosalonlar uchun landing (faqat UZ, alohida header/footer, 4 bosqichli ariza)
/qurilish              Turar joy quruvchilari uchun landing (faqat UZ, alohida header/footer, 1 bosqichli ariza)
/ishlab-chiqarish      Ishlab chiqarish bizneslari uchun landing (faqat UZ, alohida header/footer, 1 bosqichli ariza)
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
Ariza xizmati 2026-09-22 kuni ishga tushirildi. Arizalar [Targeting Xizmat → Sayt arizalari](https://docs.google.com/spreadsheets/d/1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo/edit#gid=1999326885) varag‘iga yoziladi.

Amaldagi endpoint `src/lib/submit.ts` ichida tayyor. Ushbu versiyani build va deploy qilish kifoya. `VITE_APPLICATION_ENDPOINT` va `VITE_APPLICATION_TOKEN` faqat ulanishni almashtirish uchun ixtiyoriy; eski noto‘g‘ri qiymatlar Vercel’da bo‘lsa, ularni olib tashlang yoki yangilang va qayta build qiling.

Muvaffaqiyat ekrani faqat xizmat `{ok:true}` qaytarganda chiqadi. Telegram bildirishnomasi ulanmagan. Google Apps Script kodi `docs/apps-script.gs` ichida; xizmat yangilanganda mavjud deployment uchun yangi versiya chiqaring.

## /avtosalon landing
- Alohida sahifa: `avtosalon.html` → `src/avtosalon-main.tsx` → `src/AvtosalonApp.tsx`. Reklama trafigi asosiy sayt JS'ini yuklamaydi. Build `dist/avtosalon.html` va `dist/avtosalon/index.html` ni prerender qiladi.
- Asosiy manzil: `https://fazodigital.uz/avtosalon`. `/avtosalon/` → 308 bilan `/avtosalon` ga (query, UTM, fbclid saqlanadi) — `vercel.json`.
- Arizalar o‘sha Apps Script orqali **Targeting Xizmat → AVTOSALON LEADLAR** varag‘iga yoziladi (`formType: 'avtosalon'`). Varaq birinchi arizada yaratiladi; mavjud ustunlar sarlavha nomi bo‘yicha to‘ldiriladi.
- Muvaffaqiyat faqat server shu arizani saqlaganini tasdiqlaganda (`{ok:true, saved:true, submissionId}`) ko‘rsatiladi; oddiy `{ok:true}` (health) tasdiq hisoblanmaydi.
- Har bir ariza bitta `Ariza ID` oladi; timeout, internet uzilishi, qayta bosish yoki sahifani yangilashdan keyingi retry shu ID bilan ketadi. Server ID'ni jadvaldagi **Ariza ID** ustunidan (lock ichida) tekshiradi — bir ID uchun bitta qator, payload o‘zgargan yoki cache yo‘qolgan bo‘lsa ham. `Lead` bitta ID uchun bir marta.
- Server validatsiyasi: majburiy maydonlar, uzunliklar, +998 telefon, Instagram/sayt/Telegram formati, barcha variantlar frontend ro‘yxatiga (`tests/avtosalonContract.test.mjs` ikkala ro‘yxat bir xilligini tekshiradi), `Boshqa` → izoh majburiy.
- Limitlar (`LIMITS` in `docs/apps-script.gs`): har forma alohida; avtosalon — bitta telefon/Telegram 6 soatda 3 ta yangi ariza, favqulodda umumiy chegara soatiga 200. Retry limitni sarflamaydi.
- `TOKEN` / `VITE_APPLICATION_TOKEN` brauzerda ochiq — maxfiy kalit emas; himoya honeypot, minimal vaqt, validatsiya va limitlardan iborat.
- `docs/apps-script.gs` o‘zgarsa: Apps Script → Deploy → Manage deployments → Edit → **New version** (URL o‘zgarmaydi).
- UTM (`utm_source/medium/campaign/content/term`), `fbclid`, landing URL va referrer sessiya davomida saqlanadi va arizaga qo‘shiladi.
- Meta Pixel: Vercel → Environment Variables → `VITE_META_PIXEL_ID` (so‘ng redeploy). Hodisalar: PageView, ViewContent, `AvtosalonCTA`, `AvtosalonFormStart`, `AvtosalonFormStep`, `Lead`. ID bo‘lmasa pixel yuklanmaydi.
- Lokal: `npm run dev` → `http://localhost:5173/avtosalon`; `npm run build && npm run preview` → `http://localhost:4173/avtosalon`.
- `npm run preview` Vercel kabi ishlaydi: `/about`, `/ru/work` va h.k. o‘z prerender HTML'ini qaytaradi, `/about/` → `/about` (308), noma’lum yo‘l → `404.html` (404).

## /qurilish landing
- Alohida sahifa: `qurilish.html` → `src/qurilish-main.tsx` → `src/QurilishApp.tsx` → `src/pages/QurilishPage.tsx`. Matnlar va forma variantlari: `src/content/qurilish.ts`. Komponentlar: `src/components/qurilish/` (QrUi, QrForm, Skyline).
- Asosiy manzil: `https://fazodigital.uz/qurilish`; `/qurilish/` → `/qurilish` (vercel.json). Build `dist/qurilish.html` va `dist/qurilish/index.html` ni prerender qiladi, sitemap'ga qo‘shiladi.
- Hero vizual — kodda chizilgan arxitektura SVG (`Skyline.tsx`), rasm yuklanmaydi. Real loyiha foto/renderi bo‘lsa, `Skyline` o‘rniga qo‘yish mumkin.
- Arizalar o‘sha Apps Script orqali **Targeting Xizmat → QURILISH LEADLAR** varag‘iga yoziladi (`formType: 'qurilish'`, ID `QR-...`). **Muhim:** `docs/apps-script.gs` yangilangan — Apps Script → Deploy → Manage deployments → Edit → **New version** qilinmaguncha /qurilish arizalari qabul qilinmaydi (forma xato ko‘rsatadi, lead yo‘qolmaydi — foydalanuvchi Telegram'ga yo‘naltiriladi).
- Muvaffaqiyat faqat server `{ok:true, saved:true, submissionId}` qaytarganda ko‘rsatiladi. Retry bir xil ID bilan — dublikat qator bo‘lmaydi. Bitta telefon 6 soatda 3 ta yangi ariza.
- Meta Pixel hodisalari (`VITE_META_PIXEL_ID` bo‘lsa): PageView, ViewContent, `QurilishCTA`, `QurilishFormStart`, `Lead` (eventID = Ariza ID).
- Case qo‘shish: `src/content/qurilish.ts` → `proof.cases` (faqat tasdiqlangan, mijoz nomisiz ma’lumot).
- `npm test` — `tests/qurilish.test.mjs` forma va server variantlari bir xilligini, narx va budjet variantlarini tekshiradi.

## /ishlab-chiqarish landing
- Alohida sahifa: `ishlab-chiqarish.html` → `src/ishlab-chiqarish-main.tsx` → `src/IshlabApp.tsx` → `src/pages/IshlabPage.tsx`. Matnlar, case raqamlari va forma variantlari: `src/content/ishlab.ts`. Komponentlar: `src/components/ishlab/` (IcUi, IcForm, ProductionLine). Section/SectionHead/Eyebrow va forma maydonlari /qurilish bilan umumiy.
- Asosiy manzil: `https://fazodigital.uz/ishlab-chiqarish`; `/ishlab-chiqarish/` → `/ishlab-chiqarish` (vercel.json). Build `dist/ishlab-chiqarish.html` va `dist/ishlab-chiqarish/index.html` ni prerender qiladi, sitemap'ga qo‘shiladi. OG rasm: `public/og-ishlab-chiqarish.jpg`.
- Arizalar o‘sha Apps Script orqali **Targeting Xizmat → ISHLAB CHIQARISH LEADLAR** varag‘iga yoziladi (`formType: 'ishlab_chiqarish'`, ID `IC-...`). **Muhim:** `docs/apps-script.gs` yangilangan — Apps Script'ga yangi kodni qo‘yib, Deploy → Manage deployments → Edit → **New version** qilinmaguncha /ishlab-chiqarish arizalari qabul qilinmaydi (forma xato ko‘rsatadi va Telegram'ga yo‘naltiradi, kiritilgan ma’lumot saqlanib qoladi).
- Majburiy maydonlar: ism, telefon (+998), nima ishlab chiqaradi, hudud, sotuv yo‘nalishi, reklama budjeti. "Hozirgi asosiy muammo" — ixtiyoriy.
- Budjet variantlari: `$500–$1,000`, `$1,000–$3,000`, `$3,000+`, `Budjet bo‘yicha tavsiya kerak` (frontend `OPT.budget` = server `IC.budget`, test tekshiradi).
- Qayta yuborish: bitta ariza — bitta Ariza ID. Server har arizaning **ma’lumot izi**ni (`src/lib/leadFingerprint.ts` = `icFingerprint` in apps-script) saqlaydi va javobda qaytaradi; brauzer muvaffaqiyatni (va Meta `Lead`ni) faqat server aynan shu ma’lumotni saqlaganini tasdiqlagandan keyin ko‘rsatadi. Bir xil ma’lumot bilan retry — dublikat yaratilmaydi; javob yo‘qolgandan keyin ma’lumot o‘zgartirilsa — o‘sha qator joyida tuzatiladi (`Tuzatilgan vaqt`, `Tuzatishlar soni`, ko‘pi bilan 5 marta), ikkinchi lead yaratilmaydi.
- UTM/landing: `src/lib/attribution.ts` landing URL'dan faqat UTM/gclid/fbclid parametrlarini qoldiradi va barcha maydonlarni server limitlariga (utm 200, fbclid 500, page 1000, referrer 500) moslaydi — uch landing uchun ham. /ishlab-chiqarish serveri uzun qiymatlarni rad etmaydi, qisqartiradi.
- Meta Pixel hodisalari (`VITE_META_PIXEL_ID` bo‘lsa): PageView, ViewContent, `IshlabCTA`, `IshlabFormStart`, `Lead` (eventID = Ariza ID).
- Case raqamlari ($902 / 190 mijoz / 404 dona, 15–28 avgust 2026) — tasdiqlangan ma’lumot; `tests/ishlabChiqarish.test.mjs` ularning o‘zgarmaganini va forma/server variantlari bir xilligini tekshiradi.

## Deploy (GitHub + Vercel)
```bash
git init && git add -A && git commit -m "FAZO Digital website"
git branch -M main
git remote add origin https://github.com/<username>/fazodigital.git
git push -u origin main
```
1. vercel.com → **Add New → Project** → repo'ni tanlang. Sozlama `vercel.json` da tayyor.
2. Ushbu versiyada Sheets ulanishi tayyor. Eski environment qiymatlari bo‘lsa, yuqoridagi izohga qarang.
3. **Settings → Domains** → `fazodigital.uz` va `www.fazodigital.uz`.
4. Vercel ko‘rsatgan DNS yozuvini ahost panelida kiriting. `.env` fayl hech qachon GitHub'ga yuklanmaydi.

ahost hostingiga qo‘yish kerak bo‘lsa: `npm run build` dan keyin `dist/` ichidagi hamma narsani `public_html` ga yuklang.

## Qolgan ishlar (kontent)
- **Mijoz logotiplari:** `src/data/site.ts` dagi `CLIENTS` ro‘yxatiga `logo: '/logos/nom.svg'` qo‘shing va fayllarni `public/logos/` ga soling.
- **Case media:** `CASES` ichida `media: { poster: '/work/nom.jpg', video: '/work/nom.mp4' }`. Video ovozsiz, 6–10 soniya, 2MB gacha.
- **Meta Pixel:** `index.html` ga pixel kodi **qo‘yilmaydi** (dublikat bo‘ladi). Faqat Vercel → Environment Variables → `VITE_META_PIXEL_ID` ni to‘ldiring va redeploy qiling; pixel `/avtosalon` da `src/lib/tracking.ts` orqali bir marta yuklanadi, `Lead` faqat server arizani saqlaganini tasdiqlagandan keyin yuboriladi.
- **Maqolalar:** `src/content/articles.ts`. Hozir 3 ta maqola o‘zbek tilida; RU/EN sahifalarida shu matn ko‘rsatiladi va til haqida qisqa izoh chiqadi.
