import type { PageDict } from './pageTypes';

export const pagesUz: PageDict = {
  common: {
    home: 'Boş sahifa', backHome: 'Boş sahifaga qaytiş', readMore: 'Keyingi material',
    ctaTitle: 'Biznesingizni birga tahlil qilamiz',
    ctaText: 'Marketing va sotuv tizimingizni ko‘rib chiqamiz, o‘sişga to‘sqinlik qilayotgan nuqtalarni aniqlaymiz va keyingi qadamlarni belgilaymiz.',
    ctaButton: 'Strategik uchraşuvga ariza qoldiriş', ctaSecondary: 'Telegram orqali bog‘laniş',
  },
  work: {
    title: 'Natijalar', intro: 'Har bir loyihada bitta savolga javob berganmiz: pul qayerda yo‘qolyapti va uni qanday qaytariş mumkin.',
    featured: 'Tanlangan loyihalar', other: 'Boşqa loyihalar', otherNote: 'Uşbu brendlar bilan SMM, maqsadli reklama, kontent yoki sotuv yo‘nalişlarida işlaganmiz.',
  },
  caseDetail: {
    back: 'Barcha loyihalar', industry: 'Soha', challenge: 'Vazifa', approach: 'Yondaşuv', work: 'Nima qildik', result: 'Natija',
    systemUsed: 'Qo‘llangan tizim bosqichlari', mediaNote: 'Loyiha materiali', next: 'Keyingi loyiha',
    disclaimer: 'Natijalar mijoz bilan kelişilgan holda keltirilgan. Aniq raqam ko‘rsatilmagan joyda u maxfiy yoki tasdiqlanmagan.',
    approaches: {
      'fazilat-estate': 'Ko‘chmas mulkda muammo qamrovda emas edi — murojaatlarning aksariyati byudjeti mos kelmaydigan odamlardan kelardi. Reklamani obyekt va narx segmenti bo‘yicha ajratdik, kontentda kvartira emas, qaror jarayonini ko‘rsatdik, sotuv bo‘limiga esa lidni birinchi 15 daqiqada saralaş tartibini berdik.',
      'exeed-buxoro-autocity': 'Avtosalonda lid arzon bo‘lişi mumkin, lekin salonga kelmasa, qiymati yo‘q. Şuning uchun test-drayv arizasini asosiy maqsad qilib oldik, kreativlarni model bo‘yicha ajratdik va kelmagan mijozlar uchun qayta aloqa ketma-ketligini qurdik.',
      'laminox-factory': 'B2B’da xaridor emas, hamkor qidiriladi. Zavod haqida kontent tayyorladik: işlab chiqariş jarayoni, hajm, sifat nazorati. Bu diler uchun işonch beradigan asosiy dalil va so‘rovlar aynan şundan keyin o‘sdi.',
      'uz-style-catering': 'Korporativ buyurtma va şaxsiy tadbir — bu ikki xil mijoz, ikki xil taklif. Ularni ajratdik, har biriga alohida taklif va skript yozdik. Qayta reklama esa narx so‘rab ketganlarni qaytardi.',
      'zk-academy': 'Ta’limda ariza arzon bo‘lişi mumkin, ammo qabulgacha yetmasligi mumkin. Şuning uchun kontentda o‘qituvchi va natijani ko‘rsatdik, arizadan keyingi aloqani avtomatlaştirdik — javob kutiş vaqti qisqargani konversiyani ko‘tardi.',
      'dilbar-restaurant': 'Marosim — uzoq o‘ylanadigan qaror. Kontentda zalni, xizmatni va haqiqiy tadbirlarni ko‘rsatdik, arizaga javobni avtomatlaştirdik, bron so‘ragan mijozni esa darhol menejerga yo‘naltirdik.',
    },
  },
  expertise: { title: 'Yo‘nalişlar', intro: 'To‘rt yo‘naliş — bitta tizimning qismlari. Har biri alohida ham işlaydi, lekin natija ular birga işlaganda chiqadi.', open: 'Yo‘nalişni ochiş' },
  expertiseDetail: {
    inSystem: 'Tizimdagi o‘rni', deliverables: 'Nima olasiz', howLabel: 'Qanday işlaymiz', relatedLabel: 'Şu yo‘naliş qo‘llangan loyihalar',
    modules: [
      {
        lead: 'Strategiya — bu slayd emas. Bu qaysi mijozga, qanday taklif bilan va qaysi kanal orqali borişimiz haqidagi aniq qaror.',
        sections: [
          { h: 'Bozorni o‘rganamiz', body: 'Raqobatchilarning reklamasi, narxi va va’dasini yig‘amiz. Mijozlaringiz bilan gaplaşamiz yoki mavjud murojaatlarni o‘qiymiz — odamlar aslida nimadan qo‘rqadi va nimani soliştiradi, şu yerda ko‘rinadi.' },
          { h: 'Pozitsiyani aniqlaymiz', body: 'Siz nima bilan boşqalardan farq qilasiz va buni bir jumlada ayta olasizmi? Agar farq narxdan boşqa narsada bo‘lmasa, uni yaratiş ham şu bosqichning vazifasi.' },
          { h: 'Taklif va sotuv voronkasini quramiz', body: 'Mijoz birinchi qadamda nima oladi, keyin nima bo‘ladi, qaysi bosqichda odam yo‘qoladi. Har bir bosqich uchun o‘lchanadigan maqsad qo‘yiladi.' },
        ],
        deliverables: ['Bozor va raqobat tahlili', 'Mijoz portreti va e’tirozlar ro‘yxati', 'Pozitsiyalaş va asosiy xabarlar', 'Taklif tuzilmasi', 'Sotuv voronkasi xaritasi va KPI'],
      },
      {
        lead: 'Kontent chiroyli bo‘lişi şart emas. U diqqatni tortişi va keyingi qadamga olib borişi kerak.',
        sections: [
          { h: 'Kontent tizimi', body: 'Oylik reja tasodifiy mavzulardan emas, mijozning savollari va e’tirozlaridan tuziladi. Har bir rubrika qaysi bosqich uchun işlaşini bilamiz.' },
          { h: 'Suratga oliş', body: 'Reels, mahsulot va jarayon videolari, intervyu formatlari. Ssenariy, rejissura, montaj — hammasi bizda. Mahsulot rasmlarida ranglar o‘zgartirilmaydi: mijoz ko‘rgan narsa haqiqiysidan farq qilmasligi kerak.' },
          { h: 'Reklama kreativlari', body: 'Reklama uchun alohida kreativlar tayyorlanadi va ular sinovdan o‘tkaziladi. Işlagani qoladi, işlamagani almaştiriladi — bu to‘xtamaydigan jarayon.' },
        ],
        deliverables: ['Kontent strategiyasi va rubrikalar', 'Oylik kontent-reja', 'Suratga oliş va montaj', 'Reels va tijoriy videolar', 'Reklama kreativlari va sinov natijalari'],
      },
      {
        lead: 'Reklama — byudjetni talabga aylantiruvchi mexanizm. Uning vazifasi arzon lid emas, xaridga tayyor lid.',
        sections: [
          { h: 'Kampaniya tuzilmasi', body: 'Maqsad, auditoriya va kreativ bo‘yicha aniq tuzilma quriladi. Tasodifiy sozlama qo‘şilmaydi — har bir o‘zgariş sababi bilan yoziladi.' },
          { h: 'Sinov va optimallaştiriş', body: 'Kreativ, taklif va auditoriya ketma-ket sinaladi. Qaror akkauntdagi haqiqiy raqamlar asosida qabul qilinadi: CPA, sarf, natijalar soni va lid sifati.' },
          { h: 'Hisobot', body: 'Har hafta nima işlagani, nima işlamagani va keyingi qadam aytiladi. Layk va qamrov hisobotning asosiy raqami bo‘lmaydi.' },
        ],
        deliverables: ['Mediareja va byudjet taqsimoti', 'Meta Ads kampaniyalari', 'Qayta reklama ketma-ketligi', 'Kreativlarni sinaş rejasi', 'Haftalik va oylik hisobot'],
      },
      {
        lead: 'Ko‘p biznesda pul reklamada emas, aynan şu joyda yo‘qoladi: lid keldi, lekin u bilan hech kim to‘g‘ri işlamadi.',
        sections: [
          { h: 'Lidni qabul qiliş', body: 'Lid qayerga tuşadi, kim javob beradi, qancha vaqtda. Javob vaqti qisqarişi — eng arzon o‘siş manbai.' },
          { h: 'Skript va e’tirozlar', body: 'Sotuvchi uchun aniq savollar ketma-ketligi, e’tirozlarga javoblar va keyingi qadam. Bu yozma hujjat bo‘ladi, og‘zaki kelişuv emas.' },
          { h: 'CRM va nazorat', body: 'Har bir lid bosqichi ko‘rinib turadi: yangi, aloqada, uchraşuv, sotildi, yo‘qotildi. Yo‘qotilganlar sababi bilan yoziladi — keyingi oy strategiyasi şundan chiqadi.' },
        ],
        deliverables: ['Lid qabul qiliş tartibi', 'Sotuv skripti va e’tiroz javoblari', 'CRM tuzilmasi va bosqichlar', 'Sotuv KPI va hisobot şakli', 'Sotuvchilar uchun qisqa trening'],
      },
    ],
  },
  processPage: {
    title: 'Jarayon', intro: 'Iş qanday boradi — birinchi uchraşuvdan ko‘lamni kengaytirişgacha. Har bir bosqichning aniq natijasi bor.',
    insideLabel: 'Ichida nima bor', outputLabel: 'Bosqich natijasi',
    inside: [
      ['Biznes va daromad tuzilmasini ko‘rib chiqamiz', 'Reklama akkauntidagi haqiqiy raqamlarni tekşiramiz', 'Sotuv bo‘limining javob vaqtini o‘lchaymiz', 'Kontent va raqobatchilarni tahlil qilamiz'],
      ['Pozitsiya va taklifni belgilaymiz', 'Mijoz yo‘lini chizamiz', 'Kanal va byudjet rejasi', 'KPI va o‘lchaş tartibi'],
      ['Kreativ tizim va kontent-reja', 'Kampaniya tuzilmasi', 'CRM va lid qabul qiliş tartibi', 'Skriptlar'],
      ['Kontent chiqadi', 'Kampaniyalar işga tuşadi', 'Lidlar oqimi boşlanadi', 'Birinchi haftada kunlik nazorat'],
      ['Haftalik sinov va optimallaştiriş', 'Lidlar sifati bo‘yicha sotuv bo‘limi bilan aloqa', 'Işlaganini kuchaytiriş', 'Oylik strategik ko‘rib chiqiş'],
    ],
    outputs: ['Audit hujjati va topilgan uzilişlar', 'Strategiya va o‘siş rejasi', 'Tayyor tizim va materiallar', 'Işlayotgan kampaniyalar va lidlar oqimi', 'Oylik hisobot va keyingi oy rejasi'],
    ninetyTitle: 'Birinchi 90 kun',
    ninety: [
      { when: '1–2-hafta', what: 'Audit, strategiya va taklif. Şu bosqichda odatda eng katta uziliş topiladi.' },
      { when: '3–4-hafta', what: 'Suratga oliş, kreativlar, CRM va skriptlar. Birinchi kampaniyalar işga tuşadi.' },
      { when: '2-oy', what: 'Sinov davri: kreativ va auditoriya almaştiriladi, lidlar sifati sotuv bilan birga tekşiriladi.' },
      { when: '3-oy', what: 'Işlayotgan yo‘naliş kuchaytiriladi, byudjet şunga qarab qayta taqsimlanadi.' },
    ],
  },
  about: {
    title: 'FAZO haqida', lead: 'Biz Toşkentda işlaymiz va bizneslarga marketingni sotuvga ulaşda yordam beramiz.',
    story: [
      { h: 'Nimadan boşlangan', body: 'FAZO oddiy SMM bilan boşlangan. Vaqt o‘tib bir narsa aniq bo‘ldi: chiroyli kontent ham, arzon lid ham o‘z-o‘zidan pul keltirmaydi. Mijozning savoli har doim bitta edi — «sotuv qani?»' },
      { h: 'Nima o‘zgardi', body: 'Şundan keyin iş chegarasini kengaytirdik: reklamadan keyin sotuvga, CRM va tahlilga ham e’tibor qaratdik. Bugun biz kontent işlab chiqaruvchi emas, mijozning o‘siş tizimiga javob beradigan jamoamiz.' },
      { h: 'Qanday işlaymiz', body: 'Har bir loyihada vazifalarni o‘z yo‘nalişi bo‘yicha mutaxassislar bajaradi: strategiya, reklama, ssenariy, matn, dizayn va videotasvirga oliş uchun alohida mutaxassislar jalb qilinadi. Iş haftalik ritmda boradi: reja, ijro, raqamlar, tuzatiş. Hisobot layk emas, lid va sotuv tilida yoziladi.' },
    ],
    principlesTitle: 'Prinsiplar',
    principles: [
      { h: 'Raqamdan boşlaymiz', body: 'Tavsiya berişdan oldin akkauntdagi haqiqiy natijani tekşiramiz. Umumiy qoidalar emas — sizning CPA va sotuv raqamlaringiz.' },
      { h: 'Va’da bermaymiz', body: 'Kafolatlangan daromad haqida gapirmaymiz. Nimani nazorat qila olsak, şuni aytamiz: jarayon, sifat va tezlik.' },
      { h: 'Yomon xabarni ham aytamiz', body: 'Agar muammo reklamada emas, mahsulot yoki sotuvda bo‘lsa, buni to‘g‘ridan-to‘g‘ri aytamiz.' },
      { h: 'Bitta javobgar', body: 'Bo‘laklarga bo‘lingan ijro o‘rniga bitta jamoa va bitta natija.' },
    ],
    teamTitle: 'Jamoa', teamText: 'Strateg, reklama mutaxassisi, ssenarist, kopirayter, dizayner, videograf, montajchi, kontent-menejer va sotuv bo‘yicha maslahatchi — har biri o‘z yo‘nalişida işlaydi. Tarkib loyiha vazifalariga qarab şakllanadi. Iş ko‘lami va hamkorlik byudjeti oşgani sari loyihaga jalb qilinadigan mutaxassislar soni ham ko‘payadi.',
    numbersTitle: 'Raqamlarda',
  },
  insightsPage: { title: 'Foydali materiallar', intro: 'Iş jarayonida takrorlanadigan xatolar va ularning yechimi haqida.', langNote: '', minutes: 'daqiqa' },
  applyPage: { title: 'Ariza qoldiriş', intro: 'Formani to‘ldiring — arizani strateg ko‘rib chiqadi va mos bo‘lsa, uchraşuv uchun bog‘lanamiz.' },
  privacy: {
    title: 'Maxfiylik siyosati', updated: 'Yangilangan: 2026-yil sentabr',
    sections: [
      { h: 'Qanday ma’lumot yig‘amiz', body: 'Saytdagi ariza formasi orqali siz ko‘rsatgan ma’lumotlar: ism, kompaniya nomi, sayt yoki Instagram, soha, daromad va byudjet oralig‘i, maqsad hamda aloqa ma’lumoti (telefon yoki Telegram). Bundan taşqari saytga taşrif statistikasi (sahifalar, qurilma turi, manba) yig‘ilişi mumkin.' },
      { h: 'Nima uchun işlatamiz', body: 'Faqat arizangizni ko‘rib chiqiş, siz bilan bog‘laniş va taklif tayyorlaş uchun. Ma’lumotlaringiz uchinchi şaxslarga sotilmaydi va reklama maqsadida boşqalarga berilmaydi.' },
      { h: 'Qayerda saqlanadi', body: 'Arizalar FAZO Digital’ning ichki Google Sheets asosidagi CRM tizimida saqlanadi. Unga faqat loyiha ustida işlaydigan xodimlar kira oladi.' },
      { h: 'Cookie va statistika', body: 'Sayt tilni eslab qoliş uchun brauzer xotirasidan foydalanadi. Reklama samaradorligini o‘lchaş uchun Meta Pixel kabi vositalar işlatilişi mumkin.' },
      { h: 'Sizning huquqingiz', body: 'Istalgan vaqtda ma’lumotlaringizni o‘chirişni yoki tuzatişni so‘raşingiz mumkin. Buning uchun @fazo_digital Telegram manziliga yozing.' },
      { h: 'Aloqa', body: 'FAZO Digital, Toşkent, O‘zbekiston. Telegram: @fazo_digital. Telefon: +998 93 040 10 70.' },
    ],
  },
  notFound: { title: 'Sahifa topilmadi', text: 'Manzil noto‘g‘ri yoki sahifa ko‘chirilgan.' },
};
