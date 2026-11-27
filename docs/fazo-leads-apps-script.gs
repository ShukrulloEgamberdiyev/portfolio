/**
 * @OnlyCurrentDoc
 * FAZO Digital — sayt arizalari qabul qiluvchisi ("FAZO Digital" Google Sheets fayli).
 *
 * Bu kod "FAZO Digital" jadvalining o‘zida: Extensions → Apps Script. Unga faqat sayt serveri
 * (Vercel Function /api/lead) murojaat qiladi; brauzer bu manzilni ko‘rmaydi.
 *
 * O‘rnatish (bir marta):
 *  1. Project Settings → Script properties → SECRET = (Vercel'dagi LEADS_SHEETS_SECRET bilan bir xil, kamida 32 belgi).
 *  2. Editor'da setup funksiyasini bir marta ishga tushiring (varaqlar va sarlavhalarni yaratadi).
 *  3. Deploy → New deployment → Web app: Execute as: Me, Who has access: Anyone → Deploy.
 *     /exec manzilini Vercel'dagi LEADS_SHEETS_URL ga yozing.
 *  Kod o‘zgarsa: Deploy → Manage deployments → Edit → Version: New version (manzil o‘zgarmaydi).
 *
 * Kafolatlar:
 *  - Bitta Ariza ID = bitta qator. Qayta yuborish (internet uzilishi, navbatdan retry) dublikat qilmaydi.
 *  - Javob {ok:true, saved:true, id} faqat qator haqiqatan yozilgan (yoki avval yozilgan) bo‘lsa qaytadi.
 *  - Foydalanuvchi kiritgan matn formula sifatida bajarilmaydi (=, +, -, @ bilan boshlansa matn bo‘lib yoziladi).
 *  - Bitta telefondan 6 soatda 3 tadan ortiq YANGI ariza qabul qilinmaydi (navbatdan retry bunga kirmaydi).
 */

const LEADS_SHEET = 'Arizalar';
const LOG_SHEET = 'Tizim jurnali';
const TZ = 'Asia/Tashkent';
const PER_PHONE = { max: 3, windowSec: 6 * 3600 };

const COLUMNS = [
  'Ariza ID', 'Sana-vaqt (Toshkent)', 'Holat', 'Forma', 'Sahifa', 'Xizmat / yo‘nalish',
  'Ism', 'Telefon', 'Telegram', 'Javoblar',
  'UTM source', 'UTM medium', 'UTM campaign', 'UTM content', 'UTM term', 'fbclid', 'Referrer',
  'Serverga kelgan vaqt', 'Yetkazish', 'Izoh',
];
const LOG_COLUMNS = ['Vaqt (Toshkent)', 'Daraja', 'Ariza ID', 'Xabar'];

const FORM_NAMES = {
  sayt: 'Asosiy sayt', card: '/card vizitka', qurilish: 'Qurilish landingi', avtosalon: 'Avtosalon landingi',
  talim: 'Ta’lim landingi', 'ishlab-chiqarish': 'Ishlab chiqarish landingi',
};

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  sheet_(ss, LEADS_SHEET, COLUMNS);
  sheet_(ss, LOG_SHEET, LOG_COLUMNS);
  return 'OK';
}

function doGet() {
  return out_({ ok: true, service: 'fazo-leads' });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return out_({ ok: false, error: 'bad_json' });
  }
  const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  if (!secret || secret.length < 32 || body.secret !== secret) {
    log_('XATO', '', 'Noto‘g‘ri yoki sozlanmagan SECRET bilan so‘rov rad etildi');
    return out_({ ok: false, error: 'forbidden' });
  }
  const lead = body.lead;
  if (!validLead_(lead)) {
    log_('XATO', lead && lead.id, 'Ariza tuzilmasi noto‘g‘ri, yozilmadi');
    return out_({ ok: false, error: 'invalid' });
  }
  const retry = body.delivery === 'retry';

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out_({ ok: false, error: 'busy' });
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = sheet_(ss, LEADS_SHEET, COLUMNS);
    const found = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1)
      .createTextFinder(lead.id).matchEntireCell(true).findNext();
    if (found) {
      if (retry) log_('INFO', lead.id, 'Navbatdan qayta yuborildi, lekin qator allaqachon bor — dublikat yaratilmadi');
      return out_({ ok: true, saved: true, duplicate: true, id: lead.id });
    }

    if (!retry) {
      const cache = CacheService.getScriptCache();
      const key = 'ph:' + lead.phone;
      const n = Number(cache.get(key) || 0);
      if (n >= PER_PHONE.max) {
        log_('OGOHLANTIRISH', lead.id, 'Bitta telefondan juda ko‘p ariza — qabul qilinmadi');
        return out_({ ok: false, error: 'rate_limited' });
      }
      cache.put(key, String(n + 1), PER_PHONE.windowSec);
    }

    const answers = (lead.answers || []).map(function (a) { return a.label + ': ' + a.value; }).join('\n');
    const utm = lead.utm || {};
    const row = [
      lead.id,
      Utilities.formatDate(new Date(lead.createdAt), TZ, 'yyyy-MM-dd HH:mm:ss'),
      lead.status || 'Yangi',
      FORM_NAMES[lead.formId] || lead.formId,
      lead.page, lead.service, lead.name, lead.phone, lead.telegram, answers,
      utm.source, utm.medium, utm.campaign, utm.content, utm.term, lead.fbclid, lead.referrer,
      Utilities.formatDate(new Date(lead.receivedAt), TZ, 'yyyy-MM-dd HH:mm:ss'),
      retry ? 'Navbatdan (kechikib)' : 'To‘g‘ridan-to‘g‘ri',
      retry ? String(body.note || '').slice(0, 500) : '',
    ].map(safe_);
    sh.appendRow(row);
    if (retry) log_('OGOHLANTIRISH', lead.id, 'Kechikib yozildi: ' + String(body.note || '').slice(0, 300));
    return out_({ ok: true, saved: true, duplicate: false, id: lead.id });
  } finally {
    lock.releaseLock();
  }
}

function validLead_(l) {
  const str = function (v, max) { return typeof v === 'string' && v.length <= max; };
  return !!l
    && /^FD-[A-Z0-9]{6,12}-[A-Z0-9]{8,16}$/.test(l.id || '')
    && str(l.formId, 40) && str(l.name, 60) && l.name.length >= 2
    && /^\+\d{8,15}$/.test(l.phone || '')
    && str(l.telegram || '', 40) && str(l.service, 120) && str(l.page || '', 1000)
    && !isNaN(Date.parse(l.createdAt)) && !isNaN(Date.parse(l.receivedAt))
    && Array.isArray(l.answers) && l.answers.length <= 30;
}

/** Text that starts like a formula is stored as plain text. */
function safe_(v) {
  const s = v == null ? '' : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function sheet_(ss, name, header) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function log_(level, id, message) {
  try {
    const sh = sheet_(SpreadsheetApp.getActiveSpreadsheet(), LOG_SHEET, LOG_COLUMNS);
    sh.appendRow([Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'), level, id || '', message].map(safe_));
  } catch (err) {
    console.error(err);
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
