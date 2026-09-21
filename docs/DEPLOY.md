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
Ariza xizmati ishga tushirilgan; ushbu source’dagi endpoint tayyor. Qayta Apps Script loyihasi yaratish shart emas.

1. Yangilangan source’ni mavjud sayt loyihasiga joylang va `npm run build` bilan deploy qiling.
2. Vercel’da eski `VITE_APPLICATION_ENDPOINT` / `VITE_APPLICATION_TOKEN` qiymatlari bo‘lsa, olib tashlang yoki amaldagi xizmatga moslang; ular source’dagi qiymatdan ustun turadi.
3. Live saytdan TEST deb belgilangan ariza yuboring; [Sayt arizalari](https://docs.google.com/spreadsheets/d/1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo/edit#gid=1999326885) varag‘iga tushganini tekshiring.

2026-09-22 tekshiruvida xizmat va mahalliy sayt formasi ishladi. Live sayt source’i bu ish davomida deploy qilinmagan.

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
