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
/ishlab-chiqarish      Ishlab chiqarish bizneslari uchun landing (faqat UZ)
/talim                 Ta’lim markazlari uchun landing (faqat UZ)
/card                  Raqamli vizitka (popup forma)
/avazbek               Avazbek Meliqoziyev shaxsiy portfoliosi (alohida entry, o‘z navbar/footer/CSS; kod: src/avazbek, assetlar: public/avazbek)
```
Har biri `/ru/...` va `/en/...` ko‘rinishida ham mavjud.

## Struktura
```
src/
  i18n/          uz.ts · ru.ts · en.ts, pages.*.ts (ichki sahifalar), home.{uz,ru,en}.ts (bosh sahifa)
  content/       articles.ts, card.ts, qurilish.ts, avtosalon.ts, ishlab.ts, talim.ts — matnlar
  forms/         defs.ts (barcha forma savollari), contact.ts (telefon/Telegram), LeadForm.tsx, FormDialog.tsx, i18n.ts
  server/lead/   /api/lead mantiqi: validate.ts, handler.ts, blobQueue.ts
  data/site.ts   kontaktlar, tasdiqlangan raqamlar, mijozlar, case'lar
  pages/         har bir sahifa;  components/  bo'limlar (home/, qurilish/, avtosalon/, ishlab/)
  lib/           analytics, tracking (UTM, Meta Pixel), scroll, seo, routes
api/lead.ts, api/lead-retry.ts   Vercel Functions
scripts/prerender.mjs            HTML sahifalar va sitemap
scripts/uz-sh.mjs                ş/Ş yozuv uslubi (tekshirish / qo'llash)
docs/fazo-leads-apps-script.gs   "FAZO Digital" jadvaliga yozuvchi Apps Script
docs/apps-script.gs              ESKI "Targeting Xizmat" skripti (saytdan uzilgan, faqat tarix uchun)
```

## Ariza → Google Sheets
Barcha formalar `/api/lead` orqali yangi **FAZO Digital** jadvaliga yoziladi — `docs/LEADS.md`. Eski "Targeting Xizmat" jadvali o‘zgarishsiz qoldi.
CRM imkoniyatlari bo‘yicha saytda nima ko‘rsatilgani: `docs/CRM-AUDIT.md`.

## Yozuv uslubi
O‘zbekcha matnlarda sayt uchun tanlangan uslub: sh → ş, Sh/SH → Ş (faqat shu). `node scripts/uz-sh.mjs --check $(cat scripts/uz-files.txt)` tekshiradi, `--write` qo‘llaydi. Kod identifikatorlari, URL, brend nomlari va mijoz kiritgan ma’lumot o‘zgartirilmaydi.

## Soha landinglari (/qurilish, /avtosalon, /ishlab-chiqarish, /talim)
- Har biri alohida entry (`<nom>.html` → `src/<nom>-main.tsx` → `src/*App.tsx` → `src/pages/*Page.tsx`), prerender qilinadi va sitemap'da bor.
  Asosiy menyu va bosh sahifadan havola yo‘q — faqat to‘g‘ridan-to‘g‘ri manzil orqali (reklama uchun). noindex qilinmagan.
- Tuzilma: muammo → biz nima qilamiz → siz nima olasiz → qanday ishlaymiz → ariza.
- Forma savollari `src/forms/defs.ts` dagi `FORMS.qurilish | avtosalon | ishlab-chiqarish | talim`; arizalar `/api/lead` → "FAZO Digital" jadvali
  (`Forma` ustunida landing nomi). Eski "… LEADLAR" varaqlariga endi yozilmaydi.
- Meta Pixel (`VITE_META_PIXEL_ID` bo‘lsa): PageView, ViewContent, landing CTA hodisalari va umumiy `CTAClick`, `FormOpen`, `FormSubmitSuccess`, `Lead` (eventID = Ariza ID), `FormError`.
- Narx landinglarda ko‘rsatilmaydi (avvalgi $5,000–7,000 tasdiqlanmagan): narx tahlildan keyin yozma taklifda.
- /ishlab-chiqarish case raqamlari ($902 / 190 mijoz / 404 dona, 15–28 avgust 2026) koddagi izohga ko‘ra tasdiqlangan; o‘zgartirmang.

## Deploy (GitHub + Vercel)
```bash
git init && git add -A && git commit -m "FAZO Digital website"
git branch -M main
git remote add origin https://github.com/<username>/fazodigital.git
git push -u origin main
```
1. vercel.com → **Add New → Project** → repo'ni tanlang. Sozlama `vercel.json` da tayyor.
2. Arizalar uchun server o‘zgaruvchilari va Blob store: `docs/LEADS.md`. `main` ga push = production deploy (Vercel Git ulangan).
3. **Settings → Domains** → `fazodigital.uz` va `www.fazodigital.uz`.
4. Vercel ko‘rsatgan DNS yozuvini ahost panelida kiriting. `.env` fayl hech qachon GitHub'ga yuklanmaydi.

ahost hostingiga qo‘yish kerak bo‘lsa: `npm run build` dan keyin `dist/` ichidagi hamma narsani `public_html` ga yuklang.

## Qolgan ishlar (kontent)
- **Mijoz logotiplari:** `src/data/site.ts` dagi `CLIENTS` ro‘yxatiga `logo: '/logos/nom.svg'` qo‘shing va fayllarni `public/logos/` ga soling.
- **Case media:** `CASES` ichida `media: { poster: '/work/nom.jpg', video: '/work/nom.mp4' }`. Video ovozsiz, 6–10 soniya, 2MB gacha.
- **Meta Pixel:** `index.html` ga pixel kodi **qo‘yilmaydi** (dublikat bo‘ladi). Faqat Vercel → Environment Variables → `VITE_META_PIXEL_ID` ni to‘ldiring va redeploy qiling; pixel barcha sahifalarda `src/lib/tracking.ts` orqali bir marta yuklanadi, `Lead` faqat server arizani saqlaganini tasdiqlagandan keyin yuboriladi.
- **Maqolalar:** `src/content/articles.ts`. Hozir 3 ta maqola o‘zbek tilida; RU/EN sahifalarida shu matn ko‘rsatiladi va til haqida qisqa izoh chiqadi.
