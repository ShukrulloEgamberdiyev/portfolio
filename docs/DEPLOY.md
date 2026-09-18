# Saytni jonli qilish — qadamma-qadam

## 0. Kerak bo‘ladi
- GitHub akkaunt (yangi bo‘lsa ham bo‘ladi)
- Vercel akkaunt (GitHub bilan kiriladi, bepul)
- ahost paneliga kirish (DNS uchun)
- Node.js 20+ (faqat lokalda ishlash uchun)

## 1. Kodni GitHub'ga yuklash
Zip faylni oching, papkaga kiring va terminalda:
```bash
npm install
npm run build          # xatolik bo'lmasligini tekshirish uchun
git init
git add -A
git commit -m "FAZO Digital website"
git branch -M main
```
GitHub'da yangi **private** repo oching (nomi: `fazodigital`), so‘ng:
```bash
git remote add origin https://github.com/<username>/fazodigital.git
git push -u origin main
```

## 2. Vercel'ga ulash
1. vercel.com → GitHub bilan kiring
2. **Add New → Project** → `fazodigital` repo'sini **Import**
3. Sozlamalarga tegmang (hammasi `vercel.json` da) → **Deploy**
4. 1–2 daqiqada `fazodigital.vercel.app` manzili ishlaydi

## 3. Ariza formasini ulash
1. "Targeting Xizmat" jadvali → Extensions → Apps Script → `docs/apps-script.gs` kodini qo‘ying
2. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone → URL ni oling
3. Vercel → Project → **Settings → Environment Variables**:
   - `VITE_APPLICATION_ENDPOINT` = o‘sha URL
   - `VITE_APPLICATION_TOKEN` = `fazo-2026-maxfiy`
4. **Deployments → Redeploy** (o‘zgarish kuchga kirishi uchun)
5. Saytda test ariza yuboring va jadvalda "Sayt arizalari" listini tekshiring

## 4. Domenni ulash
1. Vercel → Project → **Settings → Domains** → `fazodigital.uz` qo‘shing, keyin `www.fazodigital.uz`
2. Vercel kerakli DNS yozuvini ko‘rsatadi (odatda `A` yozuv apex domen uchun va `CNAME` www uchun)
3. ahost paneli → domen → **DNS boshqaruvi** → o‘sha yozuvlarni kiriting
4. 15 daqiqadan 24 soatgacha kutiladi. SSL sertifikat Vercel tomonidan avtomatik olinadi

## 5. Ishga tushgandan keyin
- Google Search Console'ga saytni qo‘shing va `https://fazodigital.uz/sitemap.xml` ni yuboring
- Meta Pixel kodini `index.html` ga qo‘shing
- Instagram va Telegram profillariga sayt havolasini qo‘ying

## Keyinchalik o‘zgartirish kiritish
Matnni o‘zgartirish: `src/i18n/` fayllari. Case qo‘shish: `src/data/site.ts` + `src/i18n/uz.ts` (va ru/en).
So‘ng:
```bash
git add -A && git commit -m "matn yangilandi" && git push
```
Vercel o‘zi qayta deploy qiladi.
