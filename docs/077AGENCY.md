# /077agency — 077agency landingi

Manzil: https://www.fazodigital.uz/077agency

Bu sahifa FAZO Digital sahifalaridan to‘liq ajratilgan:
- Alohida HTML entry (`077agency.html`) va alohida komponent/layout (`src/agency077/`).
- FAZO header, footer, logotip, menyu, Meta Pixel ishlatilmaydi.
- Uslublar faqat `src/agency077/agency077.css` da, `.a077` ildizi ichida; FAZO `src/index.css` bu papkani skanerlamaydi.
- Arizalar FAZO "Targeting Xizmat" jadvaliga emas, alohida **077 Agency — Leads** jadvaliga yoziladi.

## Arizalar qayerga tushadi
Brauzer → `POST /api/077agency/lead` (Vercel Function, `api/077agency/lead.ts`) → 077agency Apps Script → jadval.
Validatsiya ikki tomonda (`src/agency077/lead.ts`). Apps Script URL va SECRET brauzerga chiqmaydi.

Holatni tekshirish (lead yaratmaydi): `GET https://www.fazodigital.uz/api/077agency/lead` → `{"configured": true|false}`.

## Jadvalni ulash (bir marta, ≈10 daqiqa)
1. Google Drive’da yangi jadval: **077 Agency — Leads**.
2. Kengaytmalar → Apps Script → `docs/077agency-apps-script.gs` kodini joylang.
3. `SECRET` ni uzun tasodifiy satrga almashtiring.
4. `setup` funksiyasini Run qiling (6 ta varaq: Ishlab chiqarish, Qurilish, Avtosalon, Ta’lim, Tekstil, Boshqa).
5. Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone → URL’ni nusxalang.
6. Vercel → Project → Settings → Environment Variables (Production):
   - `AGENCY077_SHEETS_URL` = `.../exec` URL
   - `AGENCY077_SHEETS_SECRET` = 3-qadamdagi SECRET
7. Deployments → oxirgi deploy → Redeploy. So‘ng holat manzilida `"configured": true` chiqishini tekshiring.

Sozlanmaguncha forma "vaqtincha sozlanmagan" xabarini ko‘rsatadi va muvaffaqiyat haqida yolg‘on xabar bermaydi.
