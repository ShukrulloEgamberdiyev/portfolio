/**
 * 077 Agency — Leads  |  Google Apps Script web app
 *
 * 1. Create a new Google Spreadsheet named "077 Agency — Leads".
 * 2. Extensions → Apps Script → paste this file.
 * 3. Change SECRET below to a long random string (Vercel: AGENCY077_SHEETS_SECRET).
 * 4. Run setup() once (authorize when asked) — it creates the 6 tabs + headers.
 * 5. Deploy → New deployment → Web app: Execute as "Me", Who has access "Anyone".
 * 6. Copy the /exec URL into Vercel env AGENCY077_SHEETS_URL, then Redeploy.
 */

const SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';

const TABS = ['Ishlab chiqarish', 'Qurilish', 'Avtosalon', 'Ta’lim', 'Tekstil', 'Boshqa'];
const HEADERS = [
  'Sana va vaqt',
  'Biznes yo‘nalishi',
  'Xizmat',
  'Reklama budjeti',
  'Mijoz ismi',
  'Telefon raqami',
  'Manba',
  'Lead holati',
  'ID',
];
const STATUSES = ['Yangi lead', 'Bog‘lanildi', 'Uchrashuv belgilandi', 'Shartnoma', 'Rad etildi'];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Tashkent');
  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
  TABS.forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS])
      .setFontWeight('bold')
      .setBackground('#15151B')
      .setFontColor('#F5F5F7');
    sh.setFrozenRows(1);
    sh.getRange(2, 8, 1000, 1).setDataValidation(statusRule);
    sh.setColumnWidths(1, HEADERS.length, 170);
  });
  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Лист1') || ss.getSheetByName('Varaq1');
  if (def && ss.getSheets().length > TABS.length) ss.deleteSheet(def);
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload.secret !== SECRET) return json_({ ok: false, error: 'unauthorized' });

    const r = payload.row || {};
    if (TABS.indexOf(r.tab) === -1) return json_({ ok: false, error: 'bad_tab' });
    if (!/^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(r.phone || '')) return json_({ ok: false, error: 'bad_phone' });
    const id = String(r.submissionId || '').slice(0, 64);
    if (!id) return json_({ ok: false, error: 'no_id' });

    // Duplicate protection: the same submission ID is written only once
    const cache = CacheService.getScriptCache();
    if (cache.get('lead_' + id)) return json_({ ok: true, duplicate: true });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (cache.get('lead_' + id)) return json_({ ok: true, duplicate: true });
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sh = ss.getSheetByName(r.tab);
      if (!sh) return json_({ ok: false, error: 'tab_missing_run_setup' });
      const when = Utilities.formatDate(new Date(), 'Asia/Tashkent', 'dd.MM.yyyy HH:mm');
      sh.appendRow([
        when,
        safe_(r.category),
        safe_(r.service),
        safe_(r.budget),
        safe_(r.name),
        safe_(r.phone),
        safe_(r.source || 'Sayt'),
        'Yangi lead',
        safe_(id),
      ]);
      cache.put('lead_' + id, '1', 21600); // 6 hours
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: '077 Agency — Leads' });
}

// Blocks spreadsheet formula injection (=, +, -, @) and caps length
function safe_(v) {
  const s = String(v == null ? '' : v).slice(0, 120);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
