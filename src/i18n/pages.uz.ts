import type { PageDict } from './pageTypes';

export const pagesUz: PageDict = {
  common: {
    home: 'Bosh sahifa', backHome: 'Bosh sahifaga', readMore: 'Batafsil',
    ctaTitle: 'O‘sish haqida gaplashamizmi?',
    ctaText: 'Biznesingizni ko‘rib chiqamiz va qayerda uzilish borligini aytamiz. Bu uchrashuv bepul.',
    ctaButton: 'Ariza qoldirish', ctaSecondary: 'Telegramda yozish',
  },
  work: {
    title: 'Loyihalar', intro: 'Har bir loyihada bitta savolga javob berganmiz: pul qayerda yo‘qolyapti va uni qanday qaytarish mumkin.',
    featured: 'Batafsil case’lar', other: 'Boshqa loyihalar', otherNote: 'Ushbu brendlar bilan SMM, target, kontent yoki sotuv yo‘nalishlarida ishlaganmiz.',
  },
  caseDetail: {
    back: 'Barcha loyihalar', industry: 'Soha', challenge: 'Vazifa', approach: 'Yondashuv', work: 'Nima qildik', result: 'Natija',
    systemUsed: 'Tizimning ishlatilgan bosqichlari', mediaNote: 'Loyiha materiali', next: 'Keyingi loyiha',
    disclaimer: 'Natijalar mijoz bilan kelishilgan holda keltirilgan. Aniq raqam ko‘rsatilmagan joyda u maxfiy yoki tasdiqlanmagan.',
    approaches: {
      'fazilat-estate': 'Ko‘chmas mulkda muammo qamrovda emas edi — murojaatlarning aksariyati byudjeti mos kelmaydigan odamlardan kelardi. Reklamani obyekt va narx segmenti bo‘yicha ajratdik, kontentda kvartira emas, qaror jarayonini ko‘rsatdik, sotuv bo‘limiga esa lidni birinchi 15 daqiqada saralash tartibini berdik.',
      'exeed-buxoro-autocity': 'Avtosalonda lid arzon bo‘lishi mumkin, lekin salonga kelmasa, qiymati yo‘q. Shuning uchun test-drayv arizasini asosiy maqsad qilib oldik, kreativlarni model bo‘yicha ajratdik va kelmagan mijozlar uchun qayta aloqa ketma-ketligini qurdik.',
      'laminox-factory': 'B2B da xaridor emas, hamkor qidiriladi. Zavodning o‘zini kontent qildik: ishlab chiqarish jarayoni, hajm, sifat nazorati. Bu diler uchun ishonch beradigan asosiy dalil, va so‘rovlar aynan shundan keyin o‘sdi.',
      'uz-style-catering': 'Korporativ buyurtma va shaxsiy tadbir — bu ikki xil mijoz, ikki xil taklif. Ularni ajratdik, har biriga alohida offer va skript yozdik. Retargeting esa narx so‘rab ketganlarni qaytardi.',
      'zk-academy': 'Ta’limda ariza arzon bo‘lishi mumkin, ammo qabulgacha yetmasligi mumkin. Shuning uchun kontentda o‘qituvchi va natijani ko‘rsatdik, arizadan keyingi aloqani avtomatlashtirdik — javob kutish vaqti qisqargani konversiyani ko‘tardi.',
      'dilbar-restaurant': 'Marosim — uzoq o‘ylanadigan qaror. Kontentda zalni, xizmatni va real tadbirlarni ko‘rsatdik, arizaga javobni avtomatlashtirdik, bron so‘ragan mijoz esa menejerga darhol tushadigan qilib yo‘naltirdik.',
    },
  },
  expertise: { title: 'Ekspertiza', intro: 'To‘rt yo‘nalish — bitta tizimning qismlari. Har biri alohida ham ishlaydi, lekin natija ular birga ishlaganda chiqadi.', open: 'Yo‘nalishni ochish' },
  expertiseDetail: {
    inSystem: 'Tizimdagi o‘rni', deliverables: 'Nima olasiz', howLabel: 'Qanday ishlaymiz', relatedLabel: 'Shu yo‘nalish ishlagan loyihalar',
    modules: [
      {
        lead: 'Strategiya — bu slayd emas. Bu qaysi mijozga, qanday taklif bilan va qaysi kanal orqali borishimiz haqidagi aniq qaror.',
        sections: [
          { h: 'Bozorni o‘rganamiz', body: 'Raqobatchilarning reklamasi, narxi va va’dasini yig‘amiz. Mijozlaringiz bilan gaplashamiz yoki mavjud murojaatlarni o‘qiymiz — odamlar aslida nimadan qo‘rqadi va nimani solishtiradi, shu yerda ko‘rinadi.' },
          { h: 'Pozitsiyani aniqlaymiz', body: 'Siz nima bilan boshqalardan farq qilasiz va buni bir jumlada ayta olasizmi. Agar farq narxdan boshqa narsada bo‘lmasa, uni yaratish ham shu bosqichning vazifasi.' },
          { h: 'Offer va funnelni quramiz', body: 'Mijoz birinchi qadamda nima oladi, keyin nima bo‘ladi, qaysi bosqichda odam yo‘qoladi. Har bir bosqich uchun o‘lchanadigan maqsad qo‘yiladi.' },
        ],
        deliverables: ['Bozor va raqobat tahlili', 'Mijoz portreti va e’tirozlar ro‘yxati', 'Pozitsiyalash va asosiy xabarlar', 'Offer arxitekturasi', 'Funnel xaritasi va KPI'],
      },
      {
        lead: 'Kontent chiroyli bo‘lishi shart emas. U diqqatni tortishi va keyingi qadamga olib borishi kerak.',
        sections: [
          { h: 'Kontent tizimi', body: 'Oylik reja tasodifiy mavzulardan emas, mijozning savollari va e’tirozlaridan tuziladi. Har bir rubrika qaysi bosqich uchun ishlashini bilamiz.' },
          { h: 'Suratga olish', body: 'Reels, mahsulot va jarayon videolari, intervyu formatlar. Stsenariy, rejissura, montaj — hammasi bizda. Mahsulot rasmlarida ranglar o‘zgartirilmaydi: mijoz ko‘rgan narsa realdan farq qilmasligi kerak.' },
          { h: 'Performance kreativlar', body: 'Reklamaga alohida kreativlar tayyorlanadi va ular testdan o‘tadi. Ishlagani qoladi, ishlamagani almashtiriladi — bu to‘xtamaydigan jarayon.' },
        ],
        deliverables: ['Kontent strategiya va rubrikalar', 'Oylik kontent-plan', 'Suratga olish va montaj', 'Reels va tijoriy videolar', 'Reklama kreativlari va ularning test natijalari'],
      },
      {
        lead: 'Reklama — byudjetni talabga aylantiruvchi mexanizm. Uning vazifasi arzon lid emas, sotiladigan lid.',
        sections: [
          { h: 'Kampaniya tuzilmasi', body: 'Maqsad, auditoriya va kreativ bo‘yicha aniq tuzilma quriladi. Tasodifiy sozlama qo‘shilmaydi — har bir o‘zgarish sababi bilan yoziladi.' },
          { h: 'Test va optimizatsiya', body: 'Kreativ, offer va auditoriya ketma-ket sinaladi. Qaror akkauntdagi real raqamlar asosida qabul qilinadi: CPA, sarf, natijalar soni va lid sifati.' },
          { h: 'Hisobot', body: 'Har hafta nima ishlagani, nima ishlamagani va keyingi qadam aytiladi. Layk va qamrov hisobotning asosiy raqami bo‘lmaydi.' },
        ],
        deliverables: ['Media-reja va byudjet taqsimoti', 'Meta Ads kampaniyalari', 'Retargeting ketma-ketligi', 'Kreativ test jadvali', 'Haftalik va oylik hisobot'],
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
    title: 'Jarayon', intro: 'Ish qanday boradi — birinchi uchrashuvdan masshtablashgacha. Har bosqichning aniq natijasi bor.',
    insideLabel: 'Ichida nima bor', outputLabel: 'Bosqich natijasi',
    inside: [
      ['Biznes va daromad tuzilmasini ko‘rib chiqamiz', 'Reklama akkauntidagi real raqamlarni tekshiramiz', 'Sotuv bo‘limining javob vaqtini o‘lchaymiz', 'Kontent va raqobatchilarni tahlil qilamiz'],
      ['Pozitsiya va offerni belgilaymiz', 'Mijoz yo‘lini chizamiz', 'Kanal va byudjet rejasi', 'KPI va o‘lchash tartibi'],
      ['Kreativ tizim va kontent-plan', 'Kampaniya tuzilmasi', 'CRM va lid qabul qilish tartibi', 'Skriptlar'],
      ['Kontent chiqadi', 'Kampaniyalar ishga tushadi', 'Lid oqimi boshlanadi', 'Birinchi haftada kunlik nazorat'],
      ['Haftalik test va optimizatsiya', 'Lid sifati bo‘yicha sotuv bilan aloqa', 'Ishlaganini kuchaytirish', 'Oylik strategik ko‘rib chiqish'],
    ],
    outputs: ['Audit hujjati va topilgan uzilishlar', 'Strategiya va o‘sish rejasi', 'Tayyor tizim va materiallar', 'Ishlayotgan kampaniyalar va lid oqimi', 'Oylik hisobot va keyingi oy rejasi'],
    ninetyTitle: 'Birinchi 90 kun',
    ninety: [
      { when: '1–2 hafta', what: 'Audit, strategiya va offer. Shu bosqichda odatda eng katta uzilish topiladi.' },
      { when: '3–4 hafta', what: 'Suratga olish, kreativlar, CRM va skriptlar. Birinchi kampaniyalar ishga tushadi.' },
      { when: '2-oy', what: 'Test davri: kreativ va auditoriya almashtiriladi, lid sifati sotuv bilan birga tekshiriladi.' },
      { when: '3-oy', what: 'Ishlayotgan yo‘nalish kuchaytiriladi, byudjet shunga qarab qayta taqsimlanadi.' },
    ],
  },
  about: {
    title: 'FAZO haqida', lead: 'Biz Toshkentda ishlaymiz va bizneslarga marketingni sotuvga ulashda yordam beramiz.',
    story: [
      { h: 'Nimadan boshlangan', body: 'FAZO oddiy SMM bilan boshlangan. Vaqt o‘tib bir narsa aniq bo‘ldi: chiroyli kontent ham, arzon lid ham o‘z-o‘zidan pul keltirmaydi. Mijozning savoli har doim bitta edi — "sotuv qani?".' },
      { h: 'Nima o‘zgardi', body: 'Shundan keyin ish chegarasini kengaytirdik: reklamadan keyin sotuvga, CRM va analitikaga kirdik. Bugun biz kontent ishlab chiqaruvchi emas, mijozning o‘sish tizimiga javob beradigan jamoamiz.' },
      { h: 'Qanday ishlaymiz', body: 'Bitta mijozga bitta strateg, kreativ guruh va target biriktiriladi. Ish haftalik ritmda boradi: reja, ijro, raqamlar, tuzatish. Hisobot layk emas, lid va sotuv tilida yoziladi.' },
    ],
    principlesTitle: 'Prinsiplar',
    principles: [
      { h: 'Raqamdan boshlaymiz', body: 'Tavsiya berishdan oldin akkauntdagi real natijani tekshiramiz. "Best practice" o‘rniga sizning CPA va sotuv raqamlaringiz.' },
      { h: 'Va’da bermaymiz', body: 'Kafolatlangan daromad haqida gapirmaymiz. Nimani nazorat qila olsak, shuni aytamiz: jarayon, sifat va tezlik.' },
      { h: 'Yomon xabarni ham aytamiz', body: 'Agar muammo reklamada emas, mahsulot yoki sotuvda bo‘lsa, buni to‘g‘ridan-to‘g‘ri aytamiz.' },
      { h: 'Bitta javobgar', body: 'Bo‘laklarga bo‘lingan ijro o‘rniga bitta jamoa va bitta natija.' },
    ],
    teamTitle: 'Jamoa', teamText: 'Strateg, targetolog, kreativ prodyuser, kontent-menejer, videograf va sotuv bo‘yicha maslahatchi — loyihaga qarab guruh yig‘iladi.',
    numbersTitle: 'Raqamlarda',
  },
  insightsPage: { title: 'Insights', intro: 'Ish jarayonida takrorlanadigan xatolar va ularning yechimi haqida.', langNote: '', minutes: 'daqiqa o‘qish' },
  applyPage: { title: 'Ariza', intro: 'Formani to‘ldiring — arizani strateg ko‘rib chiqadi va mos bo‘lsa, uchrashuv uchun bog‘lanamiz.' },
  privacy: {
    title: 'Maxfiylik siyosati', updated: 'Yangilangan: 2026-yil sentabr',
    sections: [
      { h: 'Qanday ma’lumot yig‘amiz', body: 'Saytdagi ariza formasi orqali siz ko‘rsatgan ma’lumotlar: ism, kompaniya nomi, sayt yoki Instagram, soha, daromad va byudjet oralig‘i, maqsad hamda aloqa ma’lumoti (telefon yoki Telegram). Bundan tashqari saytga tashrif statistikasi (sahifalar, qurilma turi, manba) yig‘ilishi mumkin.' },
      { h: 'Nima uchun ishlatamiz', body: 'Faqat arizangizni ko‘rib chiqish, siz bilan bog‘lanish va taklif tayyorlash uchun. Ma’lumotlaringiz uchinchi shaxslarga sotilmaydi va reklama maqsadida boshqalarga berilmaydi.' },
      { h: 'Qayerda saqlanadi', body: 'Arizalar FAZO Digital’ning ichki Google Sheets asosidagi CRM tizimida saqlanadi. Unga faqat loyiha ustida ishlaydigan xodimlar kira oladi.' },
      { h: 'Cookie va analitika', body: 'Sayt tilni eslab qolish uchun brauzer xotirasidan foydalanadi. Reklama samaradorligini o‘lchash uchun Meta Pixel kabi vositalar ishlatilishi mumkin.' },
      { h: 'Sizning huquqingiz', body: 'Istalgan vaqtda ma’lumotlaringizni o‘chirishni yoki tuzatishni so‘rashingiz mumkin. Buning uchun @fazo_digital Telegram manziliga yozing.' },
      { h: 'Aloqa', body: 'FAZO Digital, Toshkent, O‘zbekiston. Telegram: @fazo_digital. Telefon: +998 93 040 10 70.' },
    ],
  },
  notFound: { title: 'Sahifa topilmadi', text: 'Manzil noto‘g‘ri yoki sahifa ko‘chirilgan.' },
};
