# Xavfsizlik

Sayt statik: ma'lumotlar bazasi, admin panel va foydalanuvchi akkauntlari yo‘q. Asosiy xavf — akkauntlar va ariza formasi.

## Kodda qilingan himoya
- **Honeypot maydoni** — odamga ko‘rinmaydi, botlar to‘ldiradi. To‘ldirilsa, ariza yuborilmaydi (xato holati qaytadi).
- **Minimal vaqt** — forma 4 soniyadan tez to‘ldirilsa, yuborilmaydi.
- **Takroriy ariza** — server bir xil ariza ma’lumotlarini 10 daqiqa davomida qayta yozmaydi; avval saqlanganini tasdiqlaydi.
- **Maydon uzunligi cheklangan** (160 / 1000 belgi).
- **Apps Script** (`docs/apps-script.gs`): honeypot va minimal vaqt (son bo‘lmagan qiymat ham rad etiladi), avtosalon uchun to‘liq server validatsiyasi, `Ariza ID` bo‘yicha dublikat nazorati (jadval orqali, lock ichida), har forma uchun alohida limit, avtosalonda kontakt bo‘yicha limit, formula injection himoyasi.
- **Xavfsizlik sarlavhalari** (`vercel.json`): Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

## Keyinchalik e'tibor bering
- **Meta Pixel** uchun CSP (`connect.facebook.net`, `www.facebook.com`) `vercel.json` da allaqachon ruxsat etilgan. Boshqa tashqi skript qo‘shsangiz, uning domenini ham CSP ga qo‘shing.
- Apps Script kodini yangilaganda: Deploy → Manage deployments → Edit → **New version** → Deploy.

## O‘zingiz qilishingiz kerak
1. GitHub, Vercel, Google, ahost akkauntlarida **2FA** yoqing.
2. Vercel → Project → **Firewall** → Bot protection / Attack Challenge Mode ni yoqing (bepul).
3. Apps Script URL va `VITE_APPLICATION_TOKEN` brauzerga yuboriladi; ular maxfiy kalit emas. Limitlar har forma uchun alohida (sayt: soatiga 30; avtosalon: kontakt bo‘yicha 3 ta / 6 soat, umumiy favqulodda 200 / soat). Bu cheklov, honeypot va vaqt tekshiruvi kuchli bot himoyasi o‘rnini bosmaydi.
