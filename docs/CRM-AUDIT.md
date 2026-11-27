# CRM imkoniyatlari — sayt uchun ichki audit (2026-11-27)

Manba: `fazo-digital-crm` reposi (`origin/main`, 5fb34e0) kodi va `docs/HANDOFF.md` holat yozuvlari.
Production bazasi, CRM backend, Instagram OAuth va webhooklarga tegilmadi — faqat o‘qildi.

| Imkoniyat | Holat | Dalil | Saytda |
|---|---|---|---|
| Murojaatlarni menejerlarga avtomatik taqsimlash (teng navbat / qo‘lda) | 1 — ishlaydi | HANDOFF §3 Phase 3, §13: production'da `equal` rejim; `src/server/distribution.ts` | Tayyor sifatida |
| Foizli / natijaga qarab taqsimlash | 2 — sozlash kerak | §13: kodda bor, production'da yoqilmagan | Ko‘rsatilmadi |
| Javob vaqtini nazorat qilish, ogohlantirish, qayta biriktirish | 1 | §7: 15/5 daqiqa, "Shoshilinch — javobsiz", avtomatik o‘tkazish | Tayyor |
| Rahbar uchun hisobotlar (javobsizlik, lid natijalari, operator KPI) | 1 | §7, §3 Phase 4 | Tayyor |
| Buyurtma va sotuvni qayd etish ("Sotildi", sababli "Rad etildi") | 1 | §3 Phase 4, §7 | Tayyor |
| Bir nechta biznes, ma’lumot ajratilgan | 1 | Tenant isolation (PR #1, 895f981, d234ad2), RLS | Tayyor |
| Google Sheets integratsiyasi | 2/3 — tasdiqlanmagan | §13–14: test nusxada ishlagan, production jurnaliga yozish ko‘rilmagan; oldin uzilishlar | Ko‘rsatilmadi |
| Telegram bildirishnomalari | 2 — sozlash kerak | §18: kod va bot bor; webhook secret bo‘yicha so‘nggi tuzatishlar (9779e3c, ecab1d3) — hozirgi holat tasdiqlanmagan | Ko‘rsatilmadi |
| Instagram Direct | 2 — tasdiqlanmagan | Production'da bor, lekin 2026-11 da token bekor bo‘lishi va webhook uzilishlari; recovery dry-run davom etmoqda | Ko‘rsatilmadi |
| Meta CAPI | 2 — sozlash talab qilinadi | §9, §11: kod bor, faqat MOCK'da sinalgan; production'da "Hali ulanish yo‘q", live sinov tasdiqlanmagan | "Loyiha bo‘yicha sozlanadi" deb, kafolatsiz |
| SMS (Eskiz) bilan tasdiqlash | 3 — tayyor emas | §18: adapter bor, ulanmagan va sinalmagan | Ko‘rsatilmadi |
| AI operator (avtomatik javob) | 3 — tasdiqlanmagan | Ishlashi tasdiqlanmagan | Ko‘rsatilmadi |

CRM narxi: tasdiqlangan narx yoki litsenziya shartlari topilmadi. Saytda faqat tuzilma yozildi: xizmat haqiga kiradi yoki
alohida hisoblanadi; hosting, baza va tashqi xizmatlar taklifda alohida qator.
