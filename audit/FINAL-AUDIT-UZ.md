# FAZO Digital — 2-bosqich final audit

Sana: 2026-09-22.
Baza: foydalanuvchi yuklagan fazo-digital-website.zip. stage2-copy ishlatilmadi.
Live bosh sahifa ochildi: asosiy headline «E’tiborni daromadga aylantiruvchi tizim» original ZIP bilan mos. Live deployning to‘liq source bilan tengligi tasdiqlanmagan; deliverable yuklangan source ustidagi tuzatishlardir.

## Qilingan ishlar

- Home, yo‘nalishlar, 6 ta case, jarayon, biz haqimizda, 3 ta maqola, ariza, maxfiylik, 404, navbar/footer, mobil matnlar va uchala locale ko‘rib chiqildi.
- UZ: Yo‘nalishlar, ko‘lamni kengaytirish, reklama matnlari, maqsadli reklama, qayta reklama atamalari birxillashtirildi. Ssenariy, CRM’da, lidlarni jalb qilish, tinish belgilari va aniq g‘alati jumlalar tuzatildi.
- Maqoladagi $75 va $30 misolida «ikki barobar arzon» iborasi «ancha arzon»ga tuzatildi; raqamlar o‘zgartirilmadi.
- RU: qolib ketgan inglizcha bo‘lim va bosqich nomlari ruschasiga keltirildi. EN: imlo uslubi, savol belgilari va aniq g‘alati iboralar tozalandi.
- RU/EN metadata, eyebrow va footer’dagi eski agentlik nomi tegishli tildagi «raqamli marketing agentligi»ga almashtirildi. UZ default HTML title aniqlashtirildi.
- Navbar va hero’dagi ekran o‘quvchi yorliqlari locale matniga bog‘landi. Headline satrlari va muammo qatorlaridagi matn bo‘shliqlari tuzatildi; CSS va animatsiya o‘zgarmadi.
- Forma validation matnlari majburiy maydonlarni to‘g‘ri to‘ldirish kerakligini aniq aytadi. Placeholder, success va error matnlari tekshirildi.
- Foydalanuvchining qo‘shimcha ko‘rsatmasi: jamoada ssenarist, kopirayter, dizayner, videograf va boshqa alohida mutaxassislar ishlashi, loyiha ko‘lami va hamkorlik byudjeti oshgani sari tarkib kengayishi UZ/RU/EN «Jamoa» va «Qanday ishlaymiz» bo‘limlariga kiritildi.

Katta headline’lar, dizayn, ranglar, animatsiya, layout sozlamalari, routing, integratsiya, narxlar va case raqamlari saqlandi. /avtosalon va /qurilish yaratilmadi. O‘zgartirilgan fayllarning to‘liq farqi changes.diff ichida.

## Tekshiruvlar

- npm ci --ignore-scripts: o‘tdi; lockfile o‘zgarmadi.
- npm run typecheck: o‘tdi.
- npm run build: o‘tdi; 63 sahifa + 404 + sitemap.
- package.json’da lint komandasi yo‘q; yangi lint konfiguratsiyasi kiritilmadi.
- 64 ta HTML faylda bittadan H1 va description / Open Graph description mosligi tekshirildi.
- UZ render qilingan matnlarda Growth, Performance, Insights, Application, Ekspertiza, Masshtablash, Kopirayting, offer va CRM da izlari qolmaganligi tekshirildi. Ichki identifier va URL’lar o‘zgartirilmadi.
- Desktop bosh sahifa, 390×844 mobil menyu, About matni va forma validation holati brauzerda tekshirildi. To‘liq barcha sahifalarning vizual regressiya testi bajarilmadi.
- OG rasmi ko‘rildi: eski inglizcha branding yo‘q; rasm o‘zgartirilmadi.
- Haqiqiy CRM’ga sinov arizasi yuborilmadi.

## Qolgan muammolar va cheklovlar

1. Mobil /apply dastlabki yuklanishida React #418 / #423 xatolari chiqadi. Xuddi shu xatolar original ZIP alohida build qilinganda ham qayta kuzatildi. Sahifa keyin ko‘rinadi va validation ishlaydi, lekin boshlang‘ich server/client mosligini alohida tuzatish kerak. Funksional logikani o‘zgartirmaslik shartiga ko‘ra saqlandi.
2. src/components/Seo.tsx ichki sahifa almashganda og:description’ni yangilamaydi. Statik builddagi description to‘g‘ri; client navigatsiyada eski tavsif qolishi mumkin. scripts/prerender.mjs ham og:locale’ni tillarga mos almashtirmaydi: RU/EN’da uz_UZ qoladi. Bu metadata mexanizmi keyingi texnik tuzatishga qoldirildi.
3. VITE_APPLICATION_ENDPOINT bo‘lmasa, mavjud forma yubormasdan success holatini qaytaradi. Production sozlamalari va CRM’ga real yetib borish bu auditda tasdiqlanmagan. Mavjud spam/duplicate himoyasi ham success holatini qaytarishi mumkin.
4. npm audit react-router va react-router-dom uchun 2 ta moderate darajadagi dependency yozuvini qaytardi. Taklif etilgan yangilash major versiyaga o‘tishni talab qiladi; routingga tegmaslik uchun paketlar yangilanmadi. Tafsilotlar dependency-audit.json’da.
5. Build JS bundle hajmi bo‘yicha ogohlantirish berdi; build muvaffaqiyatli yakunlandi. Bundle bo‘lish yoki optimallashtirish bajarilmadi.
6. Uchta maqola original loyihada faqat UZ tilida yozilgan. RU/EN maqola sahifalarida UZ matn va tegishli til haqida eslatma bor; maqola metadata’si ham UZ. To‘liq yangi tarjima bu minimal auditga qo‘shilmadi. Brendning «NATIJAGA ISHLAYMIZ. SIZ O‘SASIZ.» shiori va umumiy OG rasmi original kabi tillar bo‘ylab saqlandi.
7. Privacy description mavjud mexanizmda birinchi paragrafning 155 belgisidan olinadi va jumla o‘rtasida uzilishi mumkin. Maxfiylik mazmuni huquqiy jihatdan tekshirilmagan, case da’volari mustaqil tasdiqlanmagan.

## ZIP tarkibi

Source, package-lock, mavjud deploy fayllari va ushbu audit hisobotlari. node_modules, dist, .git va mahalliy vaqtinchalik fayllar ZIPga kiritilmagan. Deploy uchun mavjud build komandasi: npm run build. Productionga deploy qilinmadi.

## O‘zgargan fayllar

- src/components/Problem.tsx
- src/components/Nav.tsx
- src/components/Hero.tsx
- src/ui/Headline.tsx
- src/content/articles.ts
- src/i18n/en.ts
- src/i18n/pages.en.ts
- src/i18n/pages.uz.ts
- src/i18n/pages.ru.ts
- src/i18n/ru.ts
- src/i18n/uz.ts
- index.html
