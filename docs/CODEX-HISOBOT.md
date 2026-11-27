# CODEX UCHUN HISOBOT — fazodigital.uz (2026-11-27)

Branch: `site-marketing-system` (asos: `main` = production 707d59e). Production'ga deploy qilinmagan.

## 1. O‘zgargan sahifalar va matnlar
- **Bosh sahifa** (UZ/RU/EN, `src/components/home/HomeSections.tsx`, `src/i18n/home.*.ts`):
  birinchi ekran (kimga, muammo, 3 foyda, bitta CTA) → muammolar → 7 xizmat (bajariladi / olasiz / sizdan kerak / chegara)
  → CRM + Meta CAPI sxemasi → loyihalar → jarayon → kimga mos → savol-javob → ariza → aloqa.
- Sarlavhalar: savol bilan tugagan qatorda ortiqcha nuqta chiqmaydi ("bo‘ladi?." → "bo‘ladi?"), `src/ui/Headline.tsx`.
- Brend aksenti #325BFF. Navbar va CTA: "Tahlilga yoziliş". /work sarlavhasi "Loyihalar".
- **/talim** — yangi landing. **/qurilish, /avtosalon, /ishlab-chiqarish** — yangi formalar; /qurilish'da narx o‘rniga "Siz nima olasiz".
- **/card** — popup forma; qolgan bloklar o‘zgarmadi.
- **/apply** — yangi forma. **Maxfiylik siyosati** — yangi saqlash tartibi (Sheets + Blob navbati), UZ/RU/EN.
- Olib tashlangan tasdiqlanmagan da’volar: 200+ kampaniya, 50+ mijoz, barcha case natijalari, $2,500 va $5,000–7,000 narxlari
  (shartnoma namunasida $1,600 — zid). Qoldi: 19+ brend (egasi tasdiqlagan), /ishlab-chiqarish mebel keysi (kodda "tasdiqlangan").

## 2. Saytda ko‘rsatilgan CRM imkoniyatlari (ishlaydi)
Avtomatik teng taqsimlash / qo‘lda biriktirish; javob vaqti nazorati, ogohlantirish va qayta biriktirish; buyurtma va sotuv qaydi;
rahbar hisobotlari; bir nechta biznes alohida ma’lumot bilan. Meta CAPI — "loyiha bo‘yicha sozlanadi", kafolatsiz. Dalillar: `docs/CRM-AUDIT.md`.

2-tekshiruv (2026-11-27, kunduzi): CRM `/crm/api/health` → baza ishlayapti, RLS yoqilgan. Instagram va Sheets jonli holatini
admin kirishisiz tasdiqlab bo‘lmadi — saytda tayyor xizmat sifatida ko‘rsatilmadi.

## 3. Kiritilmagan (tasdiqlanmagan)
Google Sheets integratsiyasi, Instagram Direct, Telegram bildirishnomalari, foizli taqsimlash, SMS, AI operator.

## 4. Forma va Sheets
Bitta oqim: `LeadForm` → `/api/lead` → Apps Script → "FAZO Digital / Arizalar"; Sheets ishlamasa — maxfiy Vercel Blob navbati,
kunlik cron + har yangi arizadan keyin qayta yuborish, ID bo‘yicha dublikatsiz. Spam: honeypot, minimal vaqt, Origin, IP/telefon limiti.
Kalitlar faqat serverda. Analytics: CTAClick, FormOpen, FormSubmitSuccess (+Lead), FormError — shaxsiy ma’lumotsiz.
**Holat:** Blob navbati va `LEADS_SHEETS_SECRET`, `LEADS_ADMIN_KEY`, `CRON_SECRET` Vercel'da (production + preview) sozlangan.
Preview'da navbat real Blob bilan sinaldi (sinov yozuvi o‘chirildi). **Apps Script deploy qilinmagan → `LEADS_SHEETS_URL` yo‘q**,
shuning uchun hozir arizalar jadvalga emas, navbatga tushadi.

## 5. Jadval
https://docs.google.com/spreadsheets/d/1LugvUPljtZG09kDRpk_O8dTdfqZdkopVFWvtmwV29_c/edit (egasi: Drive ulagichidagi shukrullo0504@ hisobi).

## 6. Yozuv uslubi
sh→ş, Sh/SH→Ş — `scripts/uz-sh.mjs`, ro‘yxat `scripts/uz-files.txt`; qoldiq 0. Identifikator, URL, analytics nomlari, brendlar
("Google Sheets", "WEST Tashkent") o‘zgarmagan. /avazbek, /077agency tegilmagan. RU/EN saqlangan.

## 7. Testlar
`npm run build` (typecheck + 70 ta prerender sahifa) — o‘tdi. `npm test` — 57/57 (telefon/Telegram, shartli yo‘llar, server,
Sheets uzilishi → navbat → retry, dublikat, spam, limit, Apps Script). Lint buyrug‘i loyihada yo‘q.
Brauzer (lokal): forma sichqoncha va klaviatura bilan, xato holati, ikki bosish = bitta so‘rov, mobil 375 px'da gorizontal scroll yo‘q,
/card popup, konsol xatosiz. Cheklov: brauzer paneli yashirin bo‘lgan paytda landinglarning yakuniy vizual skrinshotlari olinmadi.

Preview (2026-11-27, 2-tekshiruv, mobil 375 px): bosh sahifada gorizontal scroll yo‘q; forma: "Target reklama" tanlanganda savollar
4 → 5 ga o‘zgaradi, Instagram "Yo‘q", budjet "Hali aniqlamaganman" bor; noto‘g‘ri telefon — xato chiqadi, javoblar saqlanadi,
`/api/lead` ga so‘rov ketmaydi; /card popup mobil ekranda to‘liq; landinglar menyuda yo‘q, to‘g‘ridan-to‘g‘ri havola bilan ochiladi (200);
`/api/lead` holati: `queue: true, sheets: false`.

## 8. Havolalar
- PR ochish: https://github.com/ShukrulloEgamberdiyev/portfolio/compare/main...site-marketing-system (`gh` o‘rnatilmagan)
- Preview: https://portfolio-me-git-site-marketing-system-fazo-digital.vercel.app (branch preview, Vercel himoyasi ostida)

## 9. Kerakli kirishlar
1. Apps Script: jadvalda Extensions → Apps Script → `docs/fazo-leads-apps-script.gs`; Script properties `SECRET` =
   `.env.local` dagi `LEADS_SHEETS_SECRET`; `setup` ni bir marta ishga tushirish; Deploy → Web app (Me / Anyone) → `/exec` URL.
2. Arizadan keyin javob muddati va "bepul tahlil" — tasdiqlansa qo‘shiladi.
3. Production deploy — egasining tasdig‘i bilan (main ga merge = production).

## 10. Holat
Preview'da. Production o‘zgarmagan.
