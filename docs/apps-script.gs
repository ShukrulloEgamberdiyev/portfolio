/**
 * @OnlyCurrentDoc
 * FAZO Digital — Targeting Xizmat jadvali uchun ariza qabul qiluvchi (Apps Script web app).
 * Ushbu kod aynan maqsad jadvalining Extensions → Apps Script loyihasiga qo‘yiladi.
 * Web app: Execute as Me; Who has access: Anyone.
 *
 * To‘rt forma bitta endpointga keladi:
 *   - umumiy sayt arizasi              → "Sayt arizalari" varag‘i (avvalgidek)
 *   - /avtosalon (formType=avtosalon)  → "AVTOSALON LEADLAR" varag‘i (alohida, aralashmaydi)
 *   - /qurilish  (formType=qurilish)   → "QURILISH LEADLAR" varag‘i (alohida, aralashmaydi)
 *   - /ishlab-chiqarish (formType=ishlab_chiqarish) → "ISHLAB CHIQARISH LEADLAR" varag‘i (alohida)
 *
 * Kod yangilanganda: Deploy → Manage deployments → (mavjud deployment) Edit →
 * Version: New version → Deploy. URL o‘zgarmaydi, saytni qayta build qilish shart emas.
 *
 * TOKEN — brauzer buildida ochiq ko‘rinadigan identifikator. U maxfiy kalit ham, to‘liq spam
 * himoyasi ham emas: faqat tasodifiy so‘rovlarni ajratadi. Asosiy himoya — honeypot, minimal
 * to‘ldirish vaqti, server validatsiyasi, kontakt va umumiy limitlar (pastda).
 */
const SPREADSHEET_ID = '1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo';
const SHEET_NAME = 'Sayt arizalari';
const AVTOSALON_SHEET_NAME = 'AVTOSALON LEADLAR';
const QURILISH_SHEET_NAME = 'QURILISH LEADLAR';
const ISHLAB_SHEET_NAME = 'ISHLAB CHIQARISH LEADLAR';
const TOKEN = 'fazo-2026-maxfiy';
const MIN_FILL_MS = 4000;

/* ───────── Umumiy sayt arizasi (o‘zgarmagan) ───────── */

const COLUMNS = [
  ['submittedAt', 'Sana'],
  ['name', 'Ism'],
  ['company', 'Kompaniya'],
  ['website', 'Sayt / Instagram'],
  ['industry', 'Soha'],
  ['revenue', 'Oylik daromad'],
  ['spend', 'Reklama xarajati'],
  ['budget', 'Byudjet'],
  ['problem', 'Muammo'],
  ['problemDetail', 'Izoh'],
  ['objective', 'Maqsad'],
  ['decision', 'Qaror qabul qiluvchi'],
  ['contact', 'Aloqa'],
  ['lang', 'Til'],
  ['utm_source', 'UTM source'],
  ['utm_campaign', 'UTM campaign'],
  ['page', 'Sahifa'],
];
const SITE_REQUIRED = ['name', 'company', 'industry', 'revenue', 'spend', 'budget', 'problem', 'objective', 'decision', 'contact'];

/* ───────── Avtosalon arizasi ───────── */

const AVTOSALON_COLUMNS = [
  ['submittedAt', 'Sana va vaqt'],
  ['dealer', 'Avtosalon nomi'],
  ['region', 'Hudud / shahar'],
  ['instagram', 'Instagram'],
  ['website', 'Sayt'],
  ['carTypes', 'Avtomobil turi'],
  ['branches', 'Filiallar soni'],
  ['stock', 'Ombordagi avtomobillar'],
  ['marketingOwner', 'Marketing kimda'],
  ['targetStatus', 'Target holati'],
  ['budget', 'Marketing + reklama budjeti (oylik)'],
  ['monthlyLeads', 'Oylik murojaatlar'],
  ['monthlySales', 'Oylik avtomobil sotuvlari'],
  ['salesStaff', 'Sotuv xodimlari soni'],
  ['rop', 'ROP mavjudligi'],
  ['crm', 'CRM holati'],
  ['leadSystem', 'Lead yuritish tizimi'],
  ['goals', 'FAZO Digital’dan kutilayotgan natijalar'],
  ['goalsOther', 'Boshqa kutilayotgan natija'],
  ['problem', 'Eng katta muammo'],
  ['name', 'Ism'],
  ['position', 'Lavozim'],
  ['phone', 'Telefon'],
  ['telegram', 'Telegram'],
  ['utm_source', 'UTM Source'],
  ['utm_medium', 'UTM Medium'],
  ['utm_campaign', 'UTM Campaign'],
  ['utm_content', 'UTM Content'],
  ['utm_term', 'UTM Term'],
  ['fbclid', 'fbclid'],
  ['page', 'Landing / sahifa manbasi'],
  ['referrer', 'Referrer'],
  ['submissionId', 'Ariza ID'],
];
const AVTOSALON_STATUS_HEADER = 'Lead status';
const AVTOSALON_ID_HEADER = 'Ariza ID';

/* Frontend (src/content/avtosalon.ts) bilan bir xil ruxsat etilgan qiymatlar. */
const AV = {
  regions: ['Toshkent shahri', 'Toshkent viloyati', 'Andijon viloyati', 'Buxoro viloyati', 'Farg‘ona viloyati', 'Jizzax viloyati',
    'Xorazm viloyati', 'Namangan viloyati', 'Navoiy viloyati', 'Qashqadaryo viloyati', 'Qoraqalpog‘iston Respublikasi',
    'Samarqand viloyati', 'Sirdaryo viloyati', 'Surxondaryo viloyati'],
  carTypes: ['Yangi avtomobillar', 'Ishlatilgan avtomobillar', 'Elektromobil / gibrid', 'Premium segment', 'Tijorat transporti'],
  branches: ['1', '2', '3–5', '6+'],
  stock: ['0–9', '10–29', '30–49', '50–99', '100+'],
  marketingOwner: ['Ichki jamoa', 'Agentlik', 'Freelancer', 'O‘zimiz', 'Hozir hech kim', 'Boshqa'],
  targetStatus: ['Ha', 'Yo‘q', 'Vaqti-vaqti bilan'],
  budget: ['$2,000–3,000', '$3,000–5,000', '$5,000–7,000', '$7,000–10,000+'],
  monthlySales: ['0–9', '10–29', '30–49', '50–99', '100+'],
  salesStaff: ['Hozir yo‘q', '1–2', '3–5', '6–9', '10+'],
  rop: ['Ha', 'Yo‘q'],
  crm: ['Ha', 'Yo‘q', 'Bilmayman'],
  leadSystem: ['CRM', 'Google Sheets', 'Excel', 'Telegram', 'Tizim yo‘q', 'Boshqa'],
  goals: ['Sifatli murojaatlar sonini oshirish', 'Marketingni to‘liq tizimlashtirish', 'Target reklamani kuchaytirish',
    'Kontent va brend ko‘rinishini yaxshilash', 'CRM va lead nazoratini yo‘lga qo‘yish', 'Mavjud sotuv bo‘limini kuchaytirish',
    'Sotuv bo‘limini noldan qurish', 'Marketing va sotuvni bitta tizimga bog‘lash', 'Kompleks marketing va sotuv boshqaruvi', 'Boshqa'],
};

/* ───────── Qurilish (turar joy quruvchilari) arizasi ───────── */

const QURILISH_COLUMNS = [
  ['submittedAt', 'Sana va vaqt'],
  ['name', 'Ism'],
  ['phone', 'Telefon'],
  ['company', 'Kompaniya'],
  ['region', 'Hudud / shahar'],
  ['stage', 'Loyiha bosqichi'],
  ['problem', 'Asosiy muammo'],
  ['problemOther', 'Muammo — izoh'],
  ['budget', 'Oylik reklama budjeti'],
  ['contactTime', 'Qulay aloqa vaqti'],
  ['utm_source', 'UTM Source'],
  ['utm_medium', 'UTM Medium'],
  ['utm_campaign', 'UTM Campaign'],
  ['utm_content', 'UTM Content'],
  ['utm_term', 'UTM Term'],
  ['fbclid', 'fbclid'],
  ['page', 'Landing / sahifa manbasi'],
  ['referrer', 'Referrer'],
  ['submissionId', 'Ariza ID'],
];

/* Frontend (src/content/qurilish.ts) bilan bir xil ruxsat etilgan qiymatlar. */
const QR = {
  regions: AV.regions,
  stage: ['Qurilish jarayonida', 'Sotuv boshlangan', 'Qurilish tugagan / sotuv davom etmoqda', 'Yangi loyiha'],
  problem: ['Murojaatlar kam', 'Murojaatlar sifati past', 'Sotuv sust', 'Marketing tizimi yo‘q', 'Sotuv bo‘limi yo‘q',
    'Reklama ishlayapti, lekin natija qoniqtirmaydi', 'Boshqa'],
  budget: ['$1,000 gacha', '$1,000–$3,000', '$3,000–$5,000', '$5,000+'],
  contactTime: ['Imkon qadar tezroq', 'Ertalab (9:00–12:00)', 'Tushdan keyin (12:00–18:00)', 'Kechqurun (18:00–20:00)'],
};

/* ───────── Ishlab chiqarish arizasi ───────── */

const ISHLAB_COLUMNS = [
  ['submittedAt', 'Sana va vaqt'],
  ['name', 'Ism'],
  ['phone', 'Telefon'],
  ['product', 'Nima ishlab chiqaradi'],
  ['region', 'Hudud'],
  ['channel', 'Sotuv yo‘nalishi'],
  ['budget', 'Oylik reklama budjeti'],
  ['problem', 'Asosiy muammo'],
  ['utm_source', 'UTM Source'],
  ['utm_medium', 'UTM Medium'],
  ['utm_campaign', 'UTM Campaign'],
  ['utm_content', 'UTM Content'],
  ['utm_term', 'UTM Term'],
  ['fbclid', 'fbclid'],
  ['page', 'Landing / sahifa manbasi'],
  ['referrer', 'Referrer'],
  ['submissionId', 'Ariza ID'],
  ['fingerprint', 'Ma’lumot izi'],
  ['correctedAt', 'Tuzatilgan vaqt'],
  ['corrections', 'Tuzatishlar soni'],
];
/* Tuzatishda (bir xil Ariza ID, boshqa ma’lumot) qayta yoziladigan maydonlar. Sana, UTM va manba o‘zgarmaydi. */
const ISHLAB_EDITABLE = ['name', 'phone', 'product', 'region', 'channel', 'budget', 'problem'];
const ISHLAB_MAX_CORRECTIONS = 5;

/* Frontend (src/content/ishlab.ts → OPT) bilan bir xil ruxsat etilgan qiymatlar. */
const IC = {
  channel: ['Chakana', 'Optom / B2B', 'Chakana + Optom'],
  budget: ['$500–$1,000', '$1,000–$3,000', '$3,000+', 'Budjet bo‘yicha tavsiya kerak'],
};

/* ───────── Limitlar (sozlanadi) ─────────
 * Har forma alohida hisoblanadi — biri ikkinchisini bloklamaydi. Bir xil Ariza ID bilan qayta
 * urinish (retry) yangi ariza hisoblanmaydi va limitni sarflamaydi.
 *  - site: umumiy sayt formasi, avvalgidek soatiga 30 ta.
 *  - avtosalon.globalPerHour: faqat favqulodda to‘siq (spam oqimi). Avtosalon reklamasi odatda kuniga
 *    o‘nlab ariza beradi; soatiga 200 normal oqimni bloklamaydi, lekin ommaviy hujumni to‘xtatadi.
 *  - avtosalon.perContact: bitta telefon yoki Telegram 6 soat ichida ko‘pi bilan 3 ta YANGI ariza
 *    (tuzatib qayta yuborish uchun yetarli). Kontakt forma javobidan olinadi — mijoz yuborgan IP'ga ishonilmaydi.
 */
const LIMITS = {
  site: { perHour: 30, duplicateTtlSec: 600 },
  avtosalon: { globalPerHour: 200, perContact: 3, perContactWindowSec: 21600 },
  qurilish: { globalPerHour: 200, perContact: 3, perContactWindowSec: 21600 },
  ishlab: { globalPerHour: 200, perContact: 3, perContactWindowSec: 21600 },
};

const MAX_LEN = {
  dealer: 160, region: 260, instagram: 120, website: 160, carTypes: 420, problem: 1000, name: 80, position: 80,
  goalsOther: 300, utm: 200, fbclid: 500, page: 1000, referrer: 500,
};

function doGet() {
  // Faqat holat tekshiruvi. Bu javob hech qachon ariza saqlanganini bildirmaydi.
  return out({ ok: true, status: 'FAZO application endpoint' });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ ok: false, error: 'invalid', field: 'payload' });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return out({ ok: false, error: 'invalid', field: 'payload' });
  if (data.token !== TOKEN) return out({ ok: false, error: 'forbidden' });
  if (isSpam(data)) return out({ ok: false, error: 'spam' });
  if (data.formType === 'avtosalon') return handleAvtosalon(data);
  if (data.formType === 'qurilish') return handleQurilish(data);
  if (data.formType === 'ishlab_chiqarish') return handleIshlab(data);
  return handleSite(data);
}

/** Honeypot va minimal vaqt. Noto‘g‘ri/son bo‘lmagan elapsed tekshiruvni chetlab o‘tmaydi. */
function isSpam(data) {
  if (data.hp !== undefined && data.hp !== null && data.hp !== '') return true;
  const elapsed = Number(data.elapsed);
  return !isFinite(elapsed) || elapsed < MIN_FILL_MS;
}

/* ───────── Umumiy sayt formasi — xatti-harakat o‘zgarmagan ───────── */

function handleSite(data) {
  if (SITE_REQUIRED.some(function (key) { return typeof data[key] !== 'string' || !data[key].trim(); })) {
    return out({ ok: false, error: 'invalid' });
  }
  let lock;
  try {
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const cache = CacheService.getScriptCache();
    const fingerprint = COLUMNS.filter(function (c) { return c[0] !== 'submittedAt'; })
      .map(function (c) { return String(data[c[0]] || '').trim(); }).join('|');
    const duplicateKey = 'd_' + Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, fingerprint));
    if (cache.get(duplicateKey)) return out({ ok: true, duplicate: true });
    const hourKey = 'h_site_' + Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyyMMddHH');
    const count = Number(cache.get(hourKey) || 0);
    if (count >= LIMITS.site.perHour) return out({ ok: false, error: 'rate_limited' });

    const sheet = getSheetByConfig(SHEET_NAME, COLUMNS, 'Holat');
    const row = COLUMNS.map(function (c) { return c[0] === 'submittedAt' ? new Date() : clean(data[c[0]]); });
    row.push('Yangi');
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    cache.put(duplicateKey, '1', LIMITS.site.duplicateTtlSec);
    cache.put(hourKey, String(count + 1), 3600);
    return out({ ok: true });
  } catch (error) {
    console.error(error);
    return out({ ok: false, error: 'storage_failed' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

/* ───────── Avtosalon formasi ───────── */

function handleAvtosalon(data) {
  const problem = validateAvtosalon(data);
  if (problem) return out({ ok: false, error: 'invalid', field: problem });
  const id = data.submissionId;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out({ ok: false, error: 'busy' });
  try {
    const sheet = getSheetByConfig(AVTOSALON_SHEET_NAME, AVTOSALON_COLUMNS, AVTOSALON_STATUS_HEADER);
    const header = ensureHeader(sheet, AVTOSALON_COLUMNS, AVTOSALON_STATUS_HEADER);
    // Dublikat faqat jadvalda shu Ariza ID bilan qator haqiqatan bo‘lsa tasdiqlanadi (cache emas).
    if (findRowById(sheet, header, id)) return out({ ok: true, saved: true, duplicate: true, submissionId: id });

    // Yangi ariza — limitlar (retry bu yerga yetib kelmaydi, shuning uchun limitni sarflamaydi).
    const cache = CacheService.getScriptCache();
    const hourKey = 'h_avtosalon_' + Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyyMMddHH');
    const hourCount = Number(cache.get(hourKey) || 0);
    if (hourCount >= LIMITS.avtosalon.globalPerHour) return out({ ok: false, error: 'rate_limited' });
    const contactKeys = contactKeysFor(data);
    const contactCounts = contactKeys.map(function (k) { return Number(cache.get(k) || 0); });
    if (contactCounts.some(function (n) { return n >= LIMITS.avtosalon.perContact; })) {
      return out({ ok: false, error: 'contact_rate_limited' });
    }

    appendMapped(sheet, header, AVTOSALON_COLUMNS, AVTOSALON_STATUS_HEADER, data);
    SpreadsheetApp.flush();
    if (!findRowById(sheet, header, id)) throw new Error('Row not found after append');

    cache.put(hourKey, String(hourCount + 1), 3600);
    contactKeys.forEach(function (k, i) { cache.put(k, String(contactCounts[i] + 1), LIMITS.avtosalon.perContactWindowSec); });
    return out({ ok: true, saved: true, submissionId: id });
  } catch (error) {
    console.error(error);
    return out({ ok: false, error: 'storage_failed' });
  } finally {
    lock.releaseLock();
  }
}

/** Birinchi xato maydon nomini qaytaradi (frontend uni tegishli bosqichda ko‘rsatadi) yoki null. */
function validateAvtosalon(d) {
  const str = function (k) { return typeof d[k] === 'string' ? d[k].trim() : null; };
  const within = function (k, min, max) { const v = str(k); return v !== null && v.length >= min && v.length <= max; };
  const oneOf = function (k, list) { const v = str(k); return v !== null && list.indexOf(v) >= 0; };
  const optional = function (k, max) { return d[k] === undefined || d[k] === null || (typeof d[k] === 'string' && d[k].length <= max); };

  if (!/^AV-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(str('submissionId') || '')) return 'submissionId';
  if (!within('dealer', 2, MAX_LEN.dealer)) return 'dealer';

  const region = str('region');
  if (region === null || region.length > MAX_LEN.region) return 'region';
  const sep = region.indexOf(' — ');
  const regionName = sep >= 0 ? region.slice(0, sep) : region;
  if (AV.regions.indexOf(regionName) < 0 || (sep >= 0 && region.slice(sep + 3).trim().length > 80)) return 'region';

  const instagram = str('instagram');
  if (instagram === null || instagram.length > MAX_LEN.instagram ||
      !(/^@?[a-zA-Z0-9._]{2,30}$/.test(instagram) ||
        /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{2,30}\/?(\?.*)?$/i.test(instagram))) return 'instagram';

  const website = str('website');
  if (website === null ? d.website !== undefined : (website.length > MAX_LEN.website ||
      (website !== '' && !/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(website)))) return 'website';

  // "Tur1, Tur2 · Brendlar: matn" — brend qismi ixtiyoriy.
  const carTypes = str('carTypes');
  if (carTypes === null || carTypes.length > MAX_LEN.carTypes) return 'carTypes';
  const brandSep = carTypes.indexOf(' · Brendlar: ');
  const typesPart = brandSep >= 0 ? carTypes.slice(0, brandSep) : carTypes;
  if (brandSep >= 0) {
    const brands = carTypes.slice(brandSep + 13).trim();
    if (!brands || brands.length > 200) return 'carTypes';
  }
  const types = typesPart.split(', ');
  if (!types.length || types.some(function (t) { return AV.carTypes.indexOf(t) < 0; }) || hasDuplicates(types)) return 'carTypes';

  const selects = ['branches', 'stock', 'marketingOwner', 'targetStatus', 'budget', 'monthlySales', 'salesStaff', 'rop', 'crm', 'leadSystem'];
  for (let i = 0; i < selects.length; i++) if (!oneOf(selects[i], AV[selects[i]])) return selects[i];

  const leads = str('monthlyLeads');
  if (leads === null || !(leads === 'Aniq bilmayman' || /^\d{1,6}$/.test(leads))) return 'monthlyLeads';

  const goalsRaw = str('goals');
  if (!goalsRaw) return 'goals';
  const goals = goalsRaw.split('; ');
  if (goals.some(function (g) { return AV.goals.indexOf(g) < 0; }) || hasDuplicates(goals)) return 'goals';
  if (goals.indexOf('Boshqa') >= 0) {
    if (!within('goalsOther', 2, MAX_LEN.goalsOther)) return 'goalsOther';
  } else if (!optional('goalsOther', MAX_LEN.goalsOther)) return 'goalsOther';

  if (!within('problem', 5, MAX_LEN.problem)) return 'problem';
  if (!within('name', 2, MAX_LEN.name)) return 'name';
  if (!within('position', 2, MAX_LEN.position)) return 'position';
  if (!/^\+998\d{9}$/.test((str('phone') || '').replace(/[\s()-]/g, ''))) return 'phone';
  if (!/^@[A-Za-z][A-Za-z0-9_]{4,31}$/.test(str('telegram') || '')) return 'telegram';

  const extras = { utm_source: MAX_LEN.utm, utm_medium: MAX_LEN.utm, utm_campaign: MAX_LEN.utm, utm_content: MAX_LEN.utm,
    utm_term: MAX_LEN.utm, fbclid: MAX_LEN.fbclid, page: MAX_LEN.page, referrer: MAX_LEN.referrer };
  for (const k in extras) if (!optional(k, extras[k])) return k;
  return null;
}

/* ───────── Qurilish formasi ───────── */

function handleQurilish(data) {
  const problem = validateQurilish(data);
  if (problem) return out({ ok: false, error: 'invalid', field: problem });
  const id = data.submissionId;

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out({ ok: false, error: 'busy' });
  try {
    const sheet = getSheetByConfig(QURILISH_SHEET_NAME, QURILISH_COLUMNS, AVTOSALON_STATUS_HEADER);
    const header = ensureHeader(sheet, QURILISH_COLUMNS, AVTOSALON_STATUS_HEADER);
    if (findRowById(sheet, header, id)) return out({ ok: true, saved: true, duplicate: true, submissionId: id });

    const cache = CacheService.getScriptCache();
    const hourKey = 'h_qurilish_' + Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyyMMddHH');
    const hourCount = Number(cache.get(hourKey) || 0);
    if (hourCount >= LIMITS.qurilish.globalPerHour) return out({ ok: false, error: 'rate_limited' });
    const phone = String(data.phone || '').replace(/\D/g, '');
    const contactKey = 'c_qurilish_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'p:' + phone));
    const contactCount = Number(cache.get(contactKey) || 0);
    if (contactCount >= LIMITS.qurilish.perContact) return out({ ok: false, error: 'contact_rate_limited' });

    appendMapped(sheet, header, QURILISH_COLUMNS, AVTOSALON_STATUS_HEADER, data);
    SpreadsheetApp.flush();
    if (!findRowById(sheet, header, id)) throw new Error('Row not found after append');

    cache.put(hourKey, String(hourCount + 1), 3600);
    cache.put(contactKey, String(contactCount + 1), LIMITS.qurilish.perContactWindowSec);
    return out({ ok: true, saved: true, submissionId: id });
  } catch (error) {
    console.error(error);
    return out({ ok: false, error: 'storage_failed' });
  } finally {
    lock.releaseLock();
  }
}

/** Birinchi xato maydon nomini qaytaradi yoki null. */
function validateQurilish(d) {
  const str = function (k) { return typeof d[k] === 'string' ? d[k].trim() : null; };
  const within = function (k, min, max) { const v = str(k); return v !== null && v.length >= min && v.length <= max; };
  const oneOf = function (k, list) { const v = str(k); return v !== null && list.indexOf(v) >= 0; };
  const optional = function (k, max) { return d[k] === undefined || d[k] === null || (typeof d[k] === 'string' && d[k].length <= max); };

  if (!/^QR-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(str('submissionId') || '')) return 'submissionId';
  if (!within('name', 2, MAX_LEN.name)) return 'name';
  if (!/^\+998\d{9}$/.test((str('phone') || '').replace(/[\s()-]/g, ''))) return 'phone';
  if (!within('company', 2, MAX_LEN.dealer)) return 'company';

  const region = str('region');
  if (region === null || region.length > MAX_LEN.region) return 'region';
  const sep = region.indexOf(' — ');
  const regionName = sep >= 0 ? region.slice(0, sep) : region;
  if (QR.regions.indexOf(regionName) < 0 || (sep >= 0 && region.slice(sep + 3).trim().length > 80)) return 'region';

  const selects = ['stage', 'problem', 'budget', 'contactTime'];
  for (let i = 0; i < selects.length; i++) if (!oneOf(selects[i], QR[selects[i]])) return selects[i];
  if (str('problem') === 'Boshqa') {
    if (!within('problemOther', 2, MAX_LEN.goalsOther)) return 'problemOther';
  } else if (!optional('problemOther', MAX_LEN.goalsOther)) return 'problemOther';

  const extras = { utm_source: MAX_LEN.utm, utm_medium: MAX_LEN.utm, utm_campaign: MAX_LEN.utm, utm_content: MAX_LEN.utm,
    utm_term: MAX_LEN.utm, fbclid: MAX_LEN.fbclid, page: MAX_LEN.page, referrer: MAX_LEN.referrer };
  for (const k in extras) if (!optional(k, extras[k])) return k;
  return null;
}

/* ───────── Ishlab chiqarish formasi ───────── */

function handleIshlab(data) {
  normalizeAttribution(data); // /ishlab-chiqarish: uzun UTM/sahifa rad etilmaydi, qisqartiriladi
  const problem = validateIshlab(data);
  if (problem) return out({ ok: false, error: 'invalid', field: problem });
  const id = data.submissionId;
  const fp = icFingerprint(data);
  data.fingerprint = fp; // server o‘zi hisoblaydi — mijoz yuborgan qiymatga ishonilmaydi

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out({ ok: false, error: 'busy' });
  try {
    const sheet = getSheetByConfig(ISHLAB_SHEET_NAME, ISHLAB_COLUMNS, AVTOSALON_STATUS_HEADER);
    const header = ensureHeader(sheet, ISHLAB_COLUMNS, AVTOSALON_STATUS_HEADER);
    const existing = findRowById(sheet, header, id);
    if (existing) return correctIshlabRow(sheet, header, existing, data, fp);

    const cache = CacheService.getScriptCache();
    const hourKey = 'h_ishlab_' + Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyyMMddHH');
    const hourCount = Number(cache.get(hourKey) || 0);
    if (hourCount >= LIMITS.ishlab.globalPerHour) return out({ ok: false, error: 'rate_limited' });
    const phone = String(data.phone || '').replace(/\D/g, '');
    const contactKey = 'c_ishlab_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'p:' + phone));
    const contactCount = Number(cache.get(contactKey) || 0);
    if (contactCount >= LIMITS.ishlab.perContact) return out({ ok: false, error: 'contact_rate_limited' });

    data.correctedAt = '';
    data.corrections = '0';
    appendMapped(sheet, header, ISHLAB_COLUMNS, AVTOSALON_STATUS_HEADER, data);
    SpreadsheetApp.flush();
    const row = findRowById(sheet, header, id);
    if (!row || storedFingerprint(sheet, header, row) !== fp) throw new Error('Row not confirmed after append');

    cache.put(hourKey, String(hourCount + 1), 3600);
    cache.put(contactKey, String(contactCount + 1), LIMITS.ishlab.perContactWindowSec);
    return out({ ok: true, saved: true, submissionId: id, fingerprint: fp });
  } catch (error) {
    console.error(error);
    return out({ ok: false, error: 'storage_failed' });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Bir xil Ariza ID qayta keldi. Ma’lumot bir xil bo‘lsa — oddiy retry (dublikat yaratilmaydi).
 * Farq qilsa — o‘sha qator joyida tuzatiladi (yangi lead emas) va javobda yangi izi qaytariladi.
 */
function correctIshlabRow(sheet, header, row, data, fp) {
  const width = header.length;
  const values = sheet.getRange(row, 1, 1, width).getValues()[0].slice();
  const fpCol = header.indexOf('Ma’lumot izi');
  if (String(values[fpCol]) === fp) return out({ ok: true, saved: true, duplicate: true, submissionId: data.submissionId, fingerprint: fp });

  const countCol = header.indexOf('Tuzatishlar soni');
  const count = Number(values[countCol] || 0);
  if (count >= ISHLAB_MAX_CORRECTIONS) return out({ ok: false, error: 'too_many_corrections' });

  const byKey = {};
  ISHLAB_COLUMNS.forEach(function (c) { byKey[c[0]] = c[1]; });
  ISHLAB_EDITABLE.forEach(function (k) { values[header.indexOf(byKey[k])] = clean(data[k]); });
  values[fpCol] = fp;
  values[header.indexOf('Tuzatilgan vaqt')] = new Date();
  values[countCol] = count + 1;
  sheet.getRange(row, 1, 1, width).setValues([values]);
  SpreadsheetApp.flush();
  if (storedFingerprint(sheet, header, row) !== fp) throw new Error('Correction not confirmed');
  return out({ ok: true, saved: true, updated: true, submissionId: data.submissionId, fingerprint: fp });
}

function storedFingerprint(sheet, header, row) {
  const col = header.indexOf('Ma’lumot izi') + 1;
  return col > 0 ? String(sheet.getRange(row, 1, 1, header.length).getValues()[0][col - 1]) : '';
}

/**
 * src/lib/leadFingerprint.ts dagi icFingerprint bilan AYNAN bir xil bo‘lishi shart (test tekshiradi).
 * Faqat arizaning o‘z maydonlari; UTM/manba kirmaydi.
 */
function icFingerprint(d) {
  const s = ISHLAB_EDITABLE.map(function (k) {
    const v = d[k] == null ? '' : String(d[k]);
    return k === 'phone' ? v.replace(/\D/g, '').slice(-9) : v.trim().replace(/\s+/g, ' ');
  }).join('\u241f');
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193 ^ 0x5bd1e995;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
  }
  return ('0000000' + h1.toString(16)).slice(-8) + ('0000000' + h2.toString(16)).slice(-8);
}

/**
 * UTM/sahifa/referrer — yordamchi ma’lumot. Ular sababli to‘g‘ri ariza rad etilmasligi kerak:
 * matn bo‘lmasa bo‘sh qilinadi, limitdan uzun bo‘lsa qisqartiriladi (rad etilmaydi).
 */
function normalizeAttribution(d) {
  const limits = { utm_source: MAX_LEN.utm, utm_medium: MAX_LEN.utm, utm_campaign: MAX_LEN.utm, utm_content: MAX_LEN.utm,
    utm_term: MAX_LEN.utm, fbclid: MAX_LEN.fbclid, page: MAX_LEN.page, referrer: MAX_LEN.referrer };
  for (const k in limits) {
    if (d[k] === undefined || d[k] === null) continue;
    d[k] = typeof d[k] === 'string' ? d[k].slice(0, limits[k]) : '';
  }
}

/** Birinchi xato maydon nomini qaytaradi yoki null. */
function validateIshlab(d) {
  const str = function (k) { return typeof d[k] === 'string' ? d[k].trim() : null; };
  const within = function (k, min, max) { const v = str(k); return v !== null && v.length >= min && v.length <= max; };
  const oneOf = function (k, list) { const v = str(k); return v !== null && list.indexOf(v) >= 0; };
  const optional = function (k, max) { return d[k] === undefined || d[k] === null || (typeof d[k] === 'string' && d[k].length <= max); };

  if (!/^IC-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(str('submissionId') || '')) return 'submissionId';
  if (!within('name', 2, MAX_LEN.name)) return 'name';
  if (!/^\+998\d{9}$/.test((str('phone') || '').replace(/[\s()-]/g, ''))) return 'phone';
  if (!within('product', 2, MAX_LEN.dealer)) return 'product';
  if (!within('region', 2, 120)) return 'region';
  if (!oneOf('channel', IC.channel)) return 'channel';
  if (!oneOf('budget', IC.budget)) return 'budget';
  if (!optional('problem', MAX_LEN.problem)) return 'problem';

  const extras = { utm_source: MAX_LEN.utm, utm_medium: MAX_LEN.utm, utm_campaign: MAX_LEN.utm, utm_content: MAX_LEN.utm,
    utm_term: MAX_LEN.utm, fbclid: MAX_LEN.fbclid, page: MAX_LEN.page, referrer: MAX_LEN.referrer };
  for (const k in extras) if (!optional(k, extras[k])) return k;
  return null;
}

function hasDuplicates(list) {
  return list.some(function (v, i) { return list.indexOf(v) !== i; });
}

/** Kontakt bo‘yicha limit kalitlari: normalizatsiya qilingan telefon va Telegram. */
function contactKeysFor(d) {
  const phone = String(d.phone || '').replace(/\D/g, '');
  const telegram = String(d.telegram || '').trim().toLowerCase();
  return ['p:' + phone, 't:' + telegram].map(function (v) {
    return 'c_avtosalon_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, v));
  });
}

/**
 * Mavjud sarlavhani o‘qiydi; yetishmayotgan kutilgan ustunlarni o‘ngga qo‘shadi. Mavjud ustunlar
 * (jumladan qo‘lda qo‘shilganlari) ko‘chirilmaydi va o‘chirilmaydi.
 */
function ensureHeader(sheet, columns, statusHeader) {
  const width = sheet.getLastColumn();
  const header = width ? sheet.getRange(1, 1, 1, width).getValues()[0].map(String) : [];
  let changed = false;
  columns.map(function (c) { return c[1]; }).concat([statusHeader]).forEach(function (h) {
    if (header.indexOf(h) < 0) { header.push(h); changed = true; }
  });
  if (changed) {
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return header;
}

function findRowById(sheet, header, id) {
  const col = header.indexOf(AVTOSALON_ID_HEADER) + 1;
  const last = sheet.getLastRow();
  if (col < 1 || last < 2) return 0;
  const hit = sheet.getRange(2, col, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

/** Sarlavha nomi bo‘yicha yozadi. Lead status serverda "Yangi" qilib qo‘yiladi. */
function appendMapped(sheet, header, columns, statusHeader, data) {
  const byHeader = {};
  columns.forEach(function (c) { byHeader[c[1]] = c[0] === 'submittedAt' ? new Date() : clean(data[c[0]]); });
  byHeader[statusHeader] = 'Yangi';
  sheet.appendRow(header.map(function (h) { return Object.prototype.hasOwnProperty.call(byHeader, h) ? byHeader[h] : ''; }));
}

/** Uzunlikni cheklaydi va formula injection'ning oldini oladi (=, +, -, @ bilan boshlansa — matn sifatida). */
function clean(value) {
  if (value == null) return '';
  let text = String(value).slice(0, 1000).trim();
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

/** Nomlangan varaqni qaytaradi; yo‘q bo‘lsa (qalin, muzlatilgan sarlavha bilan) yaratadi. */
function getSheetByConfig(name, columns, statusHeader) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet || spreadsheet.getId() !== SPREADSHEET_ID) {
    throw new Error('Wrong spreadsheet binding');
  }
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns.map(function (c) { return c[1]; }).concat([statusHeader]));
    sheet.getRange(1, 1, 1, columns.length + 1).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function out(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
