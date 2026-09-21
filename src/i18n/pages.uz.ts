import type { PageDict } from './pageTypes';

export const pagesUz: PageDict = {
  common: {
    home: 'Bosh sahifa', backHome: 'Bosh sahifaga qaytish', readMore: 'Keyingi material',
    ctaTitle: 'Biznesingizni birga tahlil qilamiz',
    ctaText: 'Marketing va sotuv tizimingizni ko‘rib chiqamiz, o‘sishga to‘sqinlik qilayotgan nuqtalarni aniqlaymiz va keyingi qadamlarni belgilaymiz.',
    ctaButton: 'Strategik uchrashuvga ariza qoldirish', ctaSecondary: 'Telegram orqali bog‘lanish',
  },
  work: {
    title: 'Natijalar', intro: 'Har bir loyihada bitta savolga javob berganmiz: pul qayerda yo‘qolyapti va uni qanday qaytarish mumkin.',
    featured: 'Tanlangan loyihalar', other: 'Boshqa loyihalar', otherNote: 'Ushbu brendlar bilan SMM, maqsadli reklama, kontent yoki sotuv yo‘nalishlarida ishlaganmiz.',
  },
  caseDetail: {
    back: 'Barcha loyihalar', industry: 'Soha', challenge: 'Vazifa', approach: 'Yondashuv', work: 'Nima qildik', result: 'Natija',
    systemUsed: 'Qo‘llangan tizim bosqichlari', mediaNote: 'Loyiha materiali', next: 'Keyingi loyiha',
    disclaimer: 'Natijalar mijoz bilan kelishilgan holda keltirilgan. Aniq raqam ko‘rsatilmagan joyda u maxfiy yoki tasdiqlanmagan.',
    approaches: {
      'fazilat-estate': 'Ko‘chmas mulkda muammo qamrovda emas edi — murojaatlarning aksariyati byudjeti mos kelmaydigan odamlardan kelardi. Reklamani obyekt va narx segmenti bo‘yicha ajratdik, kontentda kvartira emas, qaror jarayonini ko‘rsatdik, sotuv bo‘limiga esa lidni birinchi 15 daqiqada saralash tartibini berdik.',
      'exeed-buxoro-autocity': 'Avtosalonda lid arzon bo‘lishi mumkin, lekin salonga kelmasa, qiymati yo‘q. Shuning uchun test-drayv arizasini asosiy maqsad qilib oldik, kreativlarni model bo‘yicha ajratdik va kelmagan mijozlar uchun qayta aloqa ketma-ketligini qurdik.',
      'laminox-factory': 'B2B’da xaridor emas, hamkor qidiriladi. Zavod haqida kontent tayyorladik: ishlab chiqarish jarayoni, hajm, sifat nazorati. Bu diler uchun ishonch beradigan asosiy dalil va so‘rovlar aynan shundan keyin o‘sdi.',
      'uz-style-catering': 'Korporativ buyurtma va shaxsiy tadbir — bu ikki xil mijoz, ikki xil taklif. Ularni ajratdik, har biriga alohida taklif va skript yozdik. Qayta reklama esa narx so‘rab ketganlarni qaytardi.',
      'zk-academy': 'Ta’limda ariza arzon bo‘lishi mumkin, ammo qabulgacha yetmasligi mumkin. Shuning uchun kontentda o‘qituvchi va natijani ko‘rsatdik, arizadan keyingi aloqani avtomatlashtirdik — javob kutish vaqti qisqargani konversiyani ko‘tardi.',
      'dilbar-restaurant': 'Marosim — uzoq o‘ylanadigan qaror. Kontentda zalni, xizmatni va haqiqiy tadbirlarni ko‘rsatdik, arizaga javobni avtomatlashtirdik, bron so‘ragan mijozni esa darhol menejerga yo‘naltirdik.',
    },
  },
  expertise: { title: 'Yo‘nalishlar', intro: 'To‘rt yo‘nalish — bitta tizimning qismlari. Har biri alohida ham ishlaydi, lekin natija ular birga ishlaganda chiqadi.', open: 'Yo‘nalishni ochish' },
  expertiseDetail: {
    inSystem: 'Tizimdagi o‘rni', deliverables: 'Nima olasiz', howLabel: 'Qanday ishlaymiz', relatedLabel: 'Shu yo‘nalish qo‘llangan loyihalar',
    modules: [
      {
        lead: 'Strategiya — bu slayd emas. Bu qaysi mijozga, qanday taklif bilan va qaysi kanal orqali borishimiz haqidagi aniq qaror.',
        sections: [
          { h: 'Bozorni o‘rganamiz', body: 'Raqobatchilarning reklamasi, narxi va va’dasini yig‘amiz. Mijozlaringiz bilan gaplashamiz yoki mavjud murojaatlarni o‘qiymiz — odamlar aslida nimadan qo‘rqadi va nimani solishtiradi, shu yerda ko‘rinadi.' },
          { h: 'Pozitsiyani aniqlaymiz', body: 'Siz nima bilan boshqalardan farq qilasiz va buni bir jumlada ayta olasizmi? Agar farq narxdan boshqa narsada bo‘lmasa, uni yaratish ham shu bosqichning vazifasi.' },
          { h: 'Taklif va sotuv voronkasini quramiz', body: 'Mijoz birinchi qadamda nima oladi, keyin nima bo‘ladi, qaysi bosqichda odam yo‘qoladi. Har bir bosqich uchun o‘lchanadigan maqsad qo‘yiladi.' },
        ],
        deliverables: ['Bozor va raqobat tahlili', 'Mijoz portreti va e’tirozlar ro‘yxati', 'Pozitsiyalash va asosiy xabarlar', 'Taklif tuzilmasi', 'Sotuv voronkasi xaritasi va KPI'],
      },
      {
        lead: 'Kontent chiroyli bo‘lishi shart emas. U diqqatni tortishi va keyingi qadamga olib borishi kerak.',
        sections: [
          { h: 'Kontent tizimi', body: 'Oylik reja tasodifiy mavzulardan emas, mijozning savollari va e’tirozlaridan tuziladi. Har bir rubrika qaysi bosqich uchun ishlashini bilamiz.' },
          { h: 'Suratga olish', body: 'Reels, mahsulot va jarayon videolari, intervyu formatlari. Ssenariy, rejissura, montaj — hammasi bizda. Mahsulot rasmlarida ranglar o‘zgartirilmaydi: mijoz ko‘rgan narsa haqiqiysidan farq qilmasligi kerak.' },
          { h: 'Reklama kreativlari', body: 'Reklama uchun alohida kreativlar tayyorlanadi va ular sinovdan o‘tkaziladi. Ishlagani qoladi, ishlamagani almashtiriladi — bu to‘xtamaydigan jarayon.' },
        ],
        deliverables: ['Kontent strategiyasi va rubrikalar', 'Oylik kontent-reja', 'Suratga olish va montaj', 'Reels va tijoriy videolar', 'Reklama kreativlari va sinov natijalari'],
      },
      {
        lead: 'Reklama — byudjetni talabga aylantiruvchi mexanizm. Uning vazifasi arzon lid emas, xaridga tayyor lid.',
        sections: [
          { h: 'Kampaniya tuzilmasi', body: 'Maqsad, auditoriya va kreativ bo‘yicha aniq tuzilma quriladi. Tasodifiy sozlama qo‘shilmaydi — har bir o‘zgarish sababi bilan yoziladi.' },
          { h: 'Sinov va optimallashtirish', body: 'Kreativ, taklif va auditoriya ketma-ket sinaladi. Qaror akkauntdagi haqiqiy raqamlar asosida qabul qilinadi: CPA, sarf, natijalar soni va lid sifati.' },
          { h: 'Hisobot', body: 'Har hafta nima ishlagani, nima ishlamagani va keyingi qadam aytiladi. Layk va qamrov hisobotning asosiy raqami bo‘lmaydi.' },
        ],
        deliverables: ['Mediareja va byudjet taqsimoti', 'Meta Ads kampaniyalari', 'Qayta reklama ketma-ketligi', 'Kreativlarni sinash rejasi', 'Haftalik va oylik hisobot'],
      },
      {
        lead: 'Ko‘p biznesda pul reklamada emas, aynan shu joyda yo‘qoladi: lid keldi, lekin u bilan hech kim to‘g‘ri ishlamadi.',
        sections: [
          { h: 'Lidni qabul qilish', body: 'Lid qayerga tushadi, kim javob beradi, qancha vaqtda. Javob vaqti qisqarishi — eng arzon o‘sish manbai.' },
          { h: 'Skript va e’tirozlar', body: 'Sotuvchi uchun aniq savollar ketma-ketligi, e’tirozlarga javoblar va keyingi qadam. Bu yozma hujjat bo‘ladi, og‘zaki kelishuv emas.' },
          { h: 'CRM va nazorat', body: 'Har bir lid bosqichi ko‘rinib turadi: yangi, aloqada, uchrashuv, sotildi, yo‘qotildi. Yo‘qotilganlar sababi bilan yoziladi — keyingi oy strategiyasi shundan chiqadi.' },
        ],
        deliverables: ['Lid qabul qilish tartibi', 'Sotuv skripti va e’tiroz javoblari', 'CRM tuzilmasi va bosqichlar', 'Sotuv KPI va hisobot shakli', 'Sotuvchilar uchun qisqa trening'],
      },
    ],
  },
  processPage: {
    title: 'Jarayon', intro: 'Ish qanday boradi — birinchi uchrashuvdan ko‘lamni kengaytirishgacha. Har bir bosqichning aniq natijasi bor.',
    insideLabel: 'Ichida nima bor', outputLabel: 'Bosqich natijasi',
    inside: [
      ['Biznes va daromad tuzilmasini ko‘rib chiqamiz', 'Reklama akkauntidagi haqiqiy raqamlarni tekshiramiz', 'Sotuv bo‘limining javob vaqtini o‘lchaymiz', 'Kontent va raqobatchilarni tahlil qilamiz'],
      ['Pozitsiya va taklifni belgilaymiz', 'Mijoz yo‘lini chizamiz', 'Kanal va byudjet rejasi', 'KPI va o‘lchash tartibi'],
      ['Kreativ tizim va kontent-reja', 'Kampaniya tuzilmasi', 'CRM va lid qabul qilish tartibi', 'Skriptlar'],
      ['Kontent chiqadi', 'Kampaniyalar ishga tushadi', 'Lidlar oqimi boshlanadi', 'Birinchi haftada kunlik nazorat'],
      ['Haftalik sinov va optimallashtirish', 'Lidlar sifati bo‘yicha sotuv bo‘limi bilan aloqa', 'Ishlaganini kuchaytirish', 'Oylik strategik ko‘rib chiqish'],
    ],
    outputs: ['Audit hujjati va topilgan uzilishlar', 'Strategiya va o‘sish rejasi', 'Tayyor tizim va materiallar', 'Ishlayotgan kampaniyalar va lidlar oqimi', 'Oylik hisobot va keyingi oy rejasi'],
    ninetyTitle: 'Birinchi 90 kun',
    ninety: [
      { when: '1–2-hafta', what: 'Audit, strategiya va taklif. Shu bosqichda odatda eng katta uzilish topiladi.' },
      { when: '3–4-hafta', what: 'Suratga olish, kreativlar, CRM va skriptlar. Birinchi kampaniyalar ishga tushadi.' },
      { when: '2-oy', what: 'Sinov davri: kreativ va auditoriya almashtiriladi, lidlar sifati sotuv bilan birga tekshiriladi.' },
      { when: '3-oy', what: 'Ishlayotgan yo‘nalish kuchaytiriladi, byudjet shunga qarab qayta taqsimlanadi.' },
    ],
  },
  about: {
    title: 'FAZO haqida', lead: 'Biz Toshkentda ishlaymiz va bizneslarga marketingni sotuvga ulashda yordam beramiz.',
    story: [
      { h: 'Nimadan boshlangan', body: 'FAZO oddiy SMM bilan boshlangan. Vaqt o‘tib bir narsa aniq bo‘ldi: chiroyli kontent ham, arzon lid ham o‘z-o‘zidan pul keltirmaydi. Mijozning savoli har doim bitta edi — «sotuv qani?»' },
      { h: 'Nima o‘zgardi', body: 'Shundan keyin ish chegarasini kengaytirdik: reklamadan keyin sotuvga, CRM va tahlilga ham e’tibor qaratdik. Bugun biz kontent ishlab chiqaruvchi emas, mijozning o‘sish tizimiga javob beradigan jamoamiz.' },
      { h: 'Qanday ishlaymiz', body: 'Har bir loyihada vazifalarni o‘z yo‘nalishi bo‘yicha mutaxassislar bajaradi: strategiya, reklama, ssenariy, matn, dizayn va videotasvirga olish uchun alohida mutaxassislar jalb qilinadi. Ish haftalik ritmda boradi: reja, ijro, raqamlar, tuzatish. Hisobot layk emas, lid va sotuv tilida yoziladi.' },
    ],
    principlesTitle: 'Prinsiplar',
    principles: [
      { h: 'Raqamdan boshlaymiz', body: 'Tavsiya berishdan oldin akkauntdagi haqiqiy natijani tekshiramiz. Umumiy qoidalar emas — sizning CPA va sotuv raqamlaringiz.' },
      { h: 'Va’da bermaymiz', body: 'Kafolatlangan daromad haqida gapirmaymiz. Nimani nazorat qila olsak, shuni aytamiz: jarayon, sifat va tezlik.' },
      { h: 'Yomon xabarni ham aytamiz', body: 'Agar muammo reklamada emas, mahsulot yoki sotuvda bo‘lsa, buni to‘g‘ridan-to‘g‘ri aytamiz.' },
      { h: 'Bitta javobgar', body: 'Bo‘laklarga bo‘lingan ijro o‘rniga bitta jamoa va bitta natija.' },
    ],
    teamTitle: 'Jamoa', teamText: 'Strateg, reklama mutaxassisi, ssenarist, kopirayter, dizayner, videograf, montajchi, kontent-menejer va sotuv bo‘yicha maslahatchi — har biri o‘z yo‘nalishida ishlaydi. Tarkib loyiha vazifalariga qarab shakllanadi. Ish ko‘lami va hamkorlik byudjeti oshgani sari loyihaga jalb qilinadigan mutaxassislar soni ham ko‘payadi.',
    numbersTitle: 'Raqamlarda',
  },
  insightsPage: { title: 'Foydali materiallar', intro: 'Ish jarayonida takrorlanadigan xatolar va ularning yechimi haqida.', langNote: '', minutes: 'daqiqa' },
  applyPage: { title: 'Ariza qoldirish', intro: 'Formani to‘ldiring — arizani strateg ko‘rib chiqadi va mos bo‘lsa, uchrashuv uchun bog‘lanamiz.' },
  privacy: {
    title: 'Maxfiylik siyosati', updated: 'Yangilangan: 2026-yil sentabr',
    sections: [
      { h: 'Qanday ma’lumot yig‘amiz', body: 'Saytdagi ariza formasi orqali siz ko‘rsatgan ma’lumotlar: ism, kompaniya nomi, sayt yoki Instagram, soha, daromad va byudjet oralig‘i, maqsad hamda aloqa ma’lumoti (telefon yoki Telegram). Bundan tashqari saytga tashrif statistikasi (sahifalar, qurilma turi, manba) yig‘ilishi mumkin.' },
      { h: 'Nima uchun ishlatamiz', body: 'Faqat arizangizni ko‘rib chiqish, siz bilan bog‘lanish va taklif tayyorlash uchun. Ma’lumotlaringiz uchinchi shaxslarga sotilmaydi va reklama maqsadida boshqalarga berilmaydi.' },
      { h: 'Qayerda saqlanadi', body: 'Arizalar FAZO Digital’ning ichki Google Sheets asosidagi CRM tizimida saqlanadi. Unga faqat loyiha ustida ishlaydigan xodimlar kira oladi.' },
      { h: 'Cookie va statistika', body: 'Sayt tilni eslab qolish uchun brauzer xotirasidan foydalanadi. Reklama samaradorligini o‘lchash uchun Meta Pixel kabi vositalar ishlatilishi mumkin.' },
      { h: 'Sizning huquqingiz', body: 'Istalgan vaqtda ma’lumotlaringizni o‘chirishni yoki tuzatishni so‘rashingiz mumkin. Buning uchun @fazo_digital Telegram manziliga yozing.' },
      { h: 'Aloqa', body: 'FAZO Digital, Toshkent, O‘zbekiston. Telegram: @fazo_digital. Telefon: +998 93 040 10 70.' },
    ],
  },
  notFound: { title: 'Sahifa topilmadi', text: 'Manzil noto‘g‘ri yoki sahifa ko‘chirilgan.' },
};
