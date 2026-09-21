/**
 * @OnlyCurrentDoc
 * FAZO Digital — Targeting Xizmat jadvalidagi Sayt arizalari varag‘i.
 * Ushbu kod aynan maqsad jadvalining Extensions → Apps Script loyihasiga qo‘yiladi.
 * Web app: Execute as Me; Who has access: Anyone.
 * VITE_APPLICATION_ENDPOINT = deployment /exec URL; VITE_APPLICATION_TOKEN = TOKEN.
 * TOKEN brauzer buildida ko‘rinadi; u maxfiy server kaliti emas.
 */
const SHEET_NAME = 'Sayt arizalari';
const TOKEN = 'fazo-2026-maxfiy';

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


function doGet() {
  return out({ ok: true, status: 'FAZO application endpoint' });
}

function doPost(e) {
  let lock;
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data || typeof data !== 'object') return out({ ok: false, error: 'invalid' });
    if (data.token !== TOKEN) return out({ ok: false, error: 'forbidden' });
    if (data.hp || Number(data.elapsed || 0) < 4000) return out({ ok: false, error: 'spam' });
    const required = ['name', 'company', 'industry', 'revenue', 'spend', 'budget', 'problem', 'objective', 'decision', 'contact'];
    if (required.some(function (key) { return typeof data[key] !== 'string' || !data[key].trim(); })) {
      return out({ ok: false, error: 'invalid' });
    }

    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const cache = CacheService.getScriptCache();
    const fingerprint = COLUMNS.filter(function (c) { return c[0] !== 'submittedAt'; })
      .map(function (c) { return String(data[c[0]] || '').trim(); }).join('|');
    const duplicateKey = 'd_' + Utilities.base64EncodeWebSafe(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, fingerprint));
    if (cache.get(duplicateKey)) return out({ ok: true, duplicate: true });
    const hourKey = 'h_' + Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyyMMddHH');
    const count = Number(cache.get(hourKey) || 0);
    if (count >= 30) return out({ ok: false, error: 'rate_limited' });

    const sheet = getSheet();
    const row = COLUMNS.map(function (c) {
      return c[0] === 'submittedAt' ? new Date() : clean(data[c[0]]);
    });
    row.push('Yangi');
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    cache.put(duplicateKey, '1', 600);
    cache.put(hourKey, String(count + 1), 3600);
    return out({ ok: true });
  } catch (error) {
    console.error(error);
    return out({ ok: false, error: 'storage_failed' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function clean(value) {
  if (value == null) return '';
  let text = String(value).slice(0, 1000).trim();
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet || spreadsheet.getId() !== '1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo') {
    throw new Error('Wrong spreadsheet binding');
  }
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }).concat(['Holat']));
    sheet.getRange(1, 1, 1, COLUMNS.length + 1).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function out(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
