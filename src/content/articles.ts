export type Article = {
  slug: string;
  tag: string;
  minutes: number;
  date: string;
  title: string;
  lead: string;
  /** Body blocks: h = heading, p = paragraph, list = bullet list, quote = pull quote. */
  body: ({ h: string } | { p: string } | { list: string[] } | { quote: string })[];
};

/** Articles are written in Uzbek. RU/EN pages show the original with a short notice. */
export const ARTICLES: Article[] = [
  {
    slug: 'arzon-lid-qimmat',
    tag: 'Reklama',
    minutes: 6,
    date: '2026-09-02',
    title: 'Nega eng arzon lid ko‘pincha eng qimmatga tushadi',
    lead: 'Lid narxi pasaydi, hisobot chiroyli, lekin oy oxirida sotuv o‘sgani yo‘q. Bu holat tasodif emas — bu o‘lchov xatosi.',
    body: [
      { p: 'Reklama hisobotida eng ko‘p ko‘rsatiladigan raqam — lid narxi. U tushunarli, uni oson solishtirish mumkin va u tushganda hamma xursand bo‘ladi. Muammo shundaki, bu raqam biznesning pulini emas, faqat marketingning ijrosini o‘lchaydi.' },
      { h: 'Arzon lid qayerdan chiqadi' },
      { p: 'Meta algoritmi siz so‘ragan narsani beradi. Agar maqsad «lid» bo‘lsa, u sizga forma to‘ldirishga eng moyil odamlarni topadi. Bular ko‘pincha hamma joyda forma to‘ldiradigan, narxni so‘rab keyin yo‘qoladigan yoki umuman sizning byudjetingizdagi mijoz bo‘lmagan odamlar bo‘ladi.' },
      { p: 'Natijada akkauntda go‘zal manzara paydo bo‘ladi: 100 ta lid, har biri $1.5. Sotuv bo‘limida esa boshqa manzara: 100 tadan 60 tasi telefonni olmaydi, 25 tasi «shunchaki qiziqdim» deydi, 13 tasi gaplashadi, 2 tasi sotib oladi.' },
      { h: 'Haqiqiy narxni qanday hisoblash kerak' },
      { p: 'Bitta formula hammasini joyiga qo‘yadi: sarflangan pulni lidlarga emas, sotuvga bo‘ling.' },
      { quote: 'Lid narxi — marketing raqami. Mijoz narxi — biznes raqami. Qaror ikkinchisi bo‘yicha qabul qilinadi.' },
      { p: 'Yuqoridagi misolda: $150 sarf, 2 ta sotuv — mijoz narxi $75. Endi boshqa kampaniyani olaylik: lid narxi $6, 25 ta lid, sarf yana $150. Ammo bu lidlarning 8 tasi gaplashgan, 5 tasi sotib olgan. Mijoz narxi — $30. Ikkinchi kampaniya hisobotda «qimmat» ko‘ringan, aslida esa ikki barobar arzon.' },
      { h: 'Nimani o‘zgartirish kerak' },
      { list: [
        'Hisobotga «sotuv soni» va «mijoz narxi» ustunlarini qo‘shing. Faqat shu ikki ustun ko‘p qarorni o‘zgartiradi.',
        'Lid sifatini har hafta sotuv bo‘limi bilan birga belgilang: qaysi kampaniyadan kelgan odam gaplashdi, qaysinisidan yo‘q.',
        'Formada bitta saralovchi savol qoldiring — byudjet, muddat yoki hajm. Lidlar kamayadi, sifat ko‘tariladi.',
        'Meta’ga sotuv haqida signal yuboring (Conversions API yoki oflayn konversiya). Algoritm forma to‘ldiruvchini emas, xaridorni qidira boshlaydi.',
      ] },
      { h: 'Qachon arzon lid haqiqatan yaxshi' },
      { p: 'Agar mahsulotingiz arzon va qaror tez qabul qilinsa, ko‘p va arzon lid to‘g‘ri strategiya. Muammo qimmat va uzoq o‘ylanadigan mahsulotlarda boshlanadi: ko‘chmas mulk, avtomobil, B2B, ta’lim, qurilish. U yerda sotuv bo‘limining vaqti eng qimmat resurs — va uni sifatsiz lidga sarflash reklamadan ham qimmatga tushadi.' },
    ],
  },
  {
    slug: 'sotuv-skripti-belgilari',
    tag: 'Sotuv',
    minutes: 5,
    date: '2026-08-19',
    title: 'Muammo reklamada emas, sotuv skriptida ekanining 5 belgisi',
    lead: 'Reklama byudjetini oshirishdan oldin tekshirib ko‘rish arziydigan besh narsa.',
    body: [
      { p: 'Mijoz ko‘pincha bitta xulosa bilan keladi: «reklama ishlamayapti». Ammo akkauntni ochganda ko‘rinadiki, lid bor, narxi ham normal. Demak, pul reklamada emas, undan keyingi bosqichda yo‘qolyapti. Quyidagi belgilardan ikkitasi topilsa, byudjetni oshirish foyda bermaydi.' },
      { h: '1. Javob vaqti soatlar bilan o‘lchanadi' },
      { p: 'Odam formani to‘ldirgan payt — uning qiziqishi eng yuqori nuqtasi. Bir soatdan keyin u boshqa kompaniyani topadi yoki umuman unutadi. Agar lidga javob 15 daqiqada emas, ertasiga kelsa, kampaniyani emas, jarayonni tuzatish kerak.' },
      { h: '2. Har bir sotuvchi o‘zicha gapiradi' },
      { p: 'Bir sotuvchi narxni birinchi aytadi, ikkinchisi umuman aytmaydi. Bir xil reklamadan kelgan lidlarning konversiyasi sotuvchiga qarab bir necha barobar farq qiladi. Bu skript yo‘qligining eng aniq belgisi.' },
      { h: '3. «Qimmat» degan javobdan keyin suhbat tugaydi' },
      { p: 'Narx e’tirozi — sotuvning normal qismi. Agar unga tayyor javob bo‘lmasa, sotuvchi chegirma berishdan boshqa qurolga ega bo‘lmaydi. Chegirma esa marjani yeydi va reklama rentabelligini pasaytiradi.' },
      { h: '4. Yo‘qotilgan lidlar sababi yozilmaydi' },
      { p: 'CRM’da «sotilmadi» bor, lekin nega sotilmagani yo‘q. Shu sabab yozilmagunicha strategiyani tuzatib bo‘lmaydi: muammo narxdami, muddatdami, ishonchdami yoki noto‘g‘ri auditoriyadami — bu faqat sabablar ro‘yxatidan ko‘rinadi.' },
      { h: '5. Ikkinchi urinish yo‘q' },
      { p: 'Ko‘p sotuv bitta qo‘ng‘iroqdan keyin emas, ikkinchi yoki uchinchisidan keyin bo‘ladi. Agar javob bermagan lidga qayta yozilmasa, byudjetning katta qismi shunchaki tashlab yuboriladi.' },
      { quote: 'Reklama lidni olib keladi. Sotuv esa uni pulga aylantiradi. Ikkinchisi buzuq bo‘lsa, birinchisiga pul qo‘shish faqat zararni tezlashtiradi.' },
      { h: 'Nimadan boshlash kerak' },
      { list: [
        'Bir hafta davomida javob vaqtini o‘lchang. Faqat shu ko‘rsatkichni tuzatish ko‘pincha konversiyani sezilarli ko‘taradi.',
        'Eng yaxshi sotuvchining suhbatini yozib oling va uni skriptga aylantiring.',
        'Uchta asosiy e’tirozga yozma javob tayyorlang: narx, muddat, ishonch.',
        'CRM’ga «yo‘qotish sababi» maydonini qo‘shing va uni majburiy qiling.',
      ] },
    ],
  },
  {
    slug: 'cpl-dan-cac-ga',
    tag: 'Tahlil',
    minutes: 5,
    date: '2026-07-28',
    title: 'CPL’dan CAC’ga: qaysi raqamni kuzatish kerak',
    lead: 'Marketing hisobotidagi o‘nlab raqamdan biznes uchun ahamiyatlisi to‘rtta.',
    body: [
      { p: 'Reklama kabinetida yuzlab ko‘rsatkich bor. Ularning aksariyati qaror qabul qilishga yordam bermaydi — ular faqat nima bo‘layotganini tasvirlaydi. Biznes uchun ahamiyatlisi to‘rtta raqam.' },
      { h: 'CPL — lid narxi' },
      { p: 'Boshlang‘ich raqam. U kampaniyalarni bir-biri bilan solishtirish uchun kerak, lekin faqat bir xil sifatdagi lidlar ichida. Turli auditoriya va turli offerdagi CPL’ni solishtirish — noto‘g‘ri xulosa manbai.' },
      { h: 'CAC — mijoz narxi' },
      { p: 'Sarflangan pul bo‘linadi sotib olgan mijozlar soniga. Bu marketingning asosiy raqami. CAC hisoblanmasa, qaysi kanal foyda keltirayotganini bilishning imkoni yo‘q.' },
      { h: 'AOV — o‘rtacha chek' },
      { p: 'Bitta mijoz o‘rtacha qancha pul qoldiradi. CAC bilan birga qaralganda rasm to‘liq bo‘ladi: mijoz $30 ga tushsa va o‘rtacha $500 lik xarid qilsa, byudjetni oshirish kerak. Teskari holatda esa reklamani emas, offerni ko‘rish kerak.' },
      { h: 'LTV — mijozning umumiy qiymati' },
      { p: 'Mijoz butun hamkorlik davomida qancha olib keladi. Takroriy xarid bo‘ladigan sohalarda (restoran, ta’lim, mebel, xizmat) aynan shu raqam byudjet chegarasini belgilaydi. LTV yuqori bo‘lsa, raqobatchidan qimmatroq CAC to‘lashga ham imkon bo‘ladi — bu strategik ustunlik.' },
      { quote: 'Umumiy qoida: LTV kamida CAC’dan uch barobar katta bo‘lsin. Aks holda o‘sish pulni ko‘paytirmaydi, balki yo‘qotishni tezlashtiradi.' },
      { h: 'Amalda qanday yo‘lga qo‘yiladi' },
      { list: [
        'CRM da har bir lidga manba yozilsin: qaysi kampaniya, qaysi kreativ.',
        'Sotuv yopilganda summa yozilsin — AOV shu yerdan chiqadi.',
        'Har oy oxirida bitta jadval: kanal, sarf, lid, sotuv, CAC, AOV.',
        'Qaror shu jadval asosida qabul qilinsin, hisobotdagi qamrov asosida emas.',
      ] },
      { p: 'Bu tizim murakkab emas. Ko‘pincha bitta Google Sheets va intizom yetarli. Lekin aynan shu jadval byudjetni oshirish yoki to‘xtatish haqidagi savolga javob beradigan yagona hujjat bo‘ladi.' },
    ],
  },
];
