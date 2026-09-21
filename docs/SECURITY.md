# Xavfsizlik

Sayt statik: ma'lumotlar bazasi, admin panel va foydalanuvchi akkauntlari yo‘q. Asosiy xavf — akkauntlar va ariza formasi.

## Kodda qilingan himoya
- **Honeypot maydoni** — odamga ko‘rinmaydi, botlar to‘ldiradi. To‘ldirilsa, ariza yuborilmaydi (bot "muvaffaqiyat" ekranini ko‘radi).
- **Minimal vaqt** — forma 4 soniyadan tez to‘ldirilsa, yuborilmaydi.
- **10 daqiqalik cheklov** — bitta brauzerdan qayta-qayta yuborish bloklanadi.
- **Maydon uzunligi cheklangan** (160 / 1000 belgi).
- **Apps Script** (`docs/apps-script.gs`): token, honeypot va vaqt tekshiruvi, bir xil aloqa 10 daqiqada takrorlansa rad etiladi, soatiga 30 tadan ortiq ariza bloklanadi, jadvalga formula yozilishining oldi olinadi (formula injection).
- **Xavfsizlik sarlavhalari** (`vercel.json`): Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

## Keyinchalik e'tibor bering
- **Meta Pixel yoki boshqa skript qo‘shsangiz**, `vercel.json` dagi CSP ga domenini qo‘shing (masalan `script-src 'self' https://connect.facebook.net; connect-src ... https://www.facebook.com; img-src ... https://www.facebook.com`). Aks holda skript bloklanadi.
- Apps Script kodini yangilaganda: Deploy → Manage deployments → Edit → **New version** → Deploy.

## O‘zingiz qilishingiz kerak
1. GitHub, Vercel, Google, ahost akkauntlarida **2FA** yoqing.
2. Vercel → Project → **Firewall** → Bot protection / Attack Challenge Mode ni yoqing (bepul).
3. Apps Script URL'ini va `VITE_APPLICATION_TOKEN` ni hech kimga bermang.
