# Sayt arizalari → "FAZO Digital" Google Sheets

Barcha formalar (bosh sahifa, /apply, /ru, /en, /card, /qurilish, /avtosalon, /talim, /ishlab-chiqarish)
bitta yo‘ldan ketadi:

```
brauzer (src/forms/LeadForm.tsx) → POST /api/lead (api/lead.ts, Vercel Function)
  → Apps Script (docs/fazo-leads-apps-script.gs) → "FAZO Digital" jadvali, "Arizalar" varag‘i
  ↘ Sheets ishlamasa: maxfiy Vercel Blob navbati (fazo-leads/queue/<id>.json) → /api/lead-retry
```

- Savollar va shartli yo‘llar: `src/forms/defs.ts` (brauzer va server bir xil ta’rifdan foydalanadi).
- Telefon/Telegram normalizatsiyasi: `src/forms/contact.ts`. Telefon jadvalga `+998XXXXXXXXX` bo‘lib yoziladi.
- Har ariza bitta `Ariza ID` (`FD-…`) oladi; qayta yuborishda o‘sha ID ketadi, Apps Script bitta ID = bitta qator saqlaydi.
- "Ariza qabul qilindi" faqat server `{ok:true, status:'saved'|'queued', id}` qaytarganda chiqadi.
- Spam: yashirin maydon (honeypot), minimal to‘ldirish vaqti, Origin tekshiruvi, IP va telefon bo‘yicha limit
  (serverda) + telefon bo‘yicha 6 soatda 3 ta yangi ariza (Apps Script'da).
- Analytics (Meta Pixel + dataLayer): `CTAClick`, `FormOpen`, `FormSubmitSuccess` (+ standart `Lead`, eventID = Ariza ID), `FormError`. Shaxsiy ma’lumot yuborilmaydi.

## Vercel muhit o‘zgaruvchilari (faqat serverda)

| Nomi | Qiymat |
|---|---|
| `LEADS_SHEETS_URL` | Apps Script web app `/exec` manzili |
| `LEADS_SHEETS_SECRET` | Apps Script'dagi `SECRET` bilan bir xil (≥ 32 belgi) |
| `LEADS_ADMIN_KEY` | Navbatni ko‘rish va qo‘lda qayta yuborish kaliti |
| `CRON_SECRET` | Vercel Cron uchun |
| `BLOB_READ_WRITE_TOKEN` | Blob store ulanganda Vercel o‘zi qo‘shadi |

Eski `VITE_APPLICATION_ENDPOINT` / `VITE_APPLICATION_TOKEN` endi ishlatilmaydi (eski "Targeting Xizmat" jadvali va uning
Apps Script'i o‘chirilmadi, faqat saytdan ulanish olib tashlandi).

## Administrator uchun

```bash
curl -H "Authorization: Bearer $LEADS_ADMIN_KEY" https://www.fazodigital.uz/api/lead        # navbat holati (ID va xato, shaxsiy ma’lumotsiz)
curl -X POST -H "Authorization: Bearer $LEADS_ADMIN_KEY" https://www.fazodigital.uz/api/lead-retry   # navbatni hozir qayta yuborish
```

Navbat kuniga bir marta (Vercel Cron, Hobby rejasi chegarasi) va har yangi muvaffaqiyatli arizadan keyin avtomatik bo‘shatiladi.
Kechikib yozilgan qatorda "Yetkazish = Navbatdan (kechikib)" va sabab yoziladi, "Tizim jurnali" varag‘ida ham qayd bo‘ladi.

## Tekshiruv

```bash
npm test          # forma, server, navbat, Apps Script testlari (jadvalga yozmaydi)
npm run verify    # build + testlar + ş/Ş yozuvi tekshiruvi
```
