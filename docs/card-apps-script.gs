/**
 * @OnlyCurrentDoc
 * FAZO Digital — /card (raqamli vizitka) arizalarini qabul qiluvchi Apps Script web app.
 *
 * Faqat ALOHIDA "FAZO Digital Card Leads" jadvaliga yozadi:
 *   https://docs.google.com/spreadsheets/d/1EoRIdJ_e_noIR0PnPY46oEO87JW2OVW3HjInA6ZIf1M/edit
 * "Targeting Xizmat" va boshqa mavjud lid jadvallariga TEGMAYDI (ular docs/apps-script.gs da).
 *
 * O‘rnatish (bir marta):
 *   1. Yuqoridagi jadvalni oching → Extensions → Apps Script.
 *   2. Code.gs ichidagini o‘chirib, shu faylni to‘liq qo‘ying → Save.
 *   3. Deploy → New deployment → turi: Web app → Execute as: Me, Who has access: Anyone → Deploy → ruxsat bering.
 *   4. Berilgan ".../exec" URL'ni Vercel → Settings → Environment Variables → VITE_CARD_ENDPOINT ga qo‘ying
 *      (lokal tekshiruv uchun loyiha ildizidagi .env.local fayliga) → qayta build/deploy.
 *
 * Kod yangilanganda: Deploy → Manage deployments → Edit → Version: New version → Deploy (URL o‘zgarmaydi).
 *
 * CARD_TOKEN — brauzerda ochiq ko‘rinadigan identifikator, maxfiy kalit emas. Himoya: honeypot,
 * minimal to‘ldirish vaqti, server validatsiyasi, Ariza ID bo‘yicha dublikatga yo‘l qo‘ymaslik, soatlik limit.
 */
const CARD_SPREADSHEET_ID = '1EoRIdJ_e_noIR0PnPY46oEO87JW2OVW3HjInA6ZIf1M';
const CARD_SHEET_NAME = 'Leads';
const CARD_TOKEN = 'fazo-card-2026';
const CARD_MIN_FILL_MS = 2500;
const CARD_PER_HOUR = 120;
const TZ = 'Asia/Tashkent';

/* Ustunlar tartibi = jadvaldagi sarlavhalar. [payload kaliti, sarlavha] */
const CARD_COLUMNS = [
  ['__timestamp', 'Timestamp'],
  ['name', 'Ism'],
  ['phone', 'Telefon'],
  ['business', 'Biznes yo‘nalishi'],
  ['link', 'Instagram / Sayt'],
  ['need', 'Kerakli xizmat'],
  ['experience', 'Oldin SMM / Targeting bilan ishlaganmi'],
  ['currentSpend', 'Hozirgi marketing sarfi'],
  ['readyBudget', 'Ajratishga tayyor marketing budjeti'],
  ['problem', 'Asosiy muammo'],
  ['__source', 'Source'],
  ['utm_source', 'UTM Source'],
  ['utm_medium', 'UTM Medium'],
  ['utm_campaign', 'UTM Campaign'],
  ['page', 'Page URL'],
  ['__status', 'Status'],
  ['submissionId', 'Submission ID'],
];

/* Frontend (src/content/card.ts → CARD_OPT) bilan bir xil ruxsat etilgan qiymatlar. */
const CARD_OPT = {
  need: ['Marketing', 'SMM', 'Targeting', 'SMM + Targeting', 'Aniq bilmayman'],
  experience: ['Ha, hozir ham ishlayapmiz', 'Ha, oldin ishlaganmiz', 'Yo‘q'],
  currentSpend: ['Hozir sarflamaymiz', '$300 gacha', '$300–500', '$500–1,000', '$1,000–2,500', '$2,500+'],
  readyBudget: ['$500 gacha', '$500–1,000', '$1,000–2,500', '$2,500–5,000', '$5,000+'],
};

const MAX_LEN = { name: 80, phone: 20, business: 160, link: 300, problem: 1000, utm_source: 200, utm_medium: 200, utm_campaign: 200, page: 1000, submissionId: 40 };

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Formula-injection himoyasi: =, +, -, @ bilan boshlangan matn formula sifatida bajarilmaydi. */
function safe_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function clip_(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

function sheet_() {
  // Skript aynan "FAZO Digital Card Leads" jadvaliga bog‘langan bo‘lishi shart. Boshqa jadvalga (masalan
  // "Targeting Xizmat"ga) adashib qo‘yilsa — hech narsa yozilmaydi.
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss || ss.getId() !== CARD_SPREADSHEET_ID) throw new Error('wrong_sheet');
  let sh = ss.getSheetByName(CARD_SHEET_NAME);
  if (!sh) {
    // Jadval yaratilgandagi birinchi varaqni ishlatamiz (sarlavhalar u yerda), nomini "Leads" qilamiz.
    sh = ss.getSheets()[0];
    sh.setName(CARD_SHEET_NAME);
  }
  const headers = CARD_COLUMNS.map(function (c) { return c[1]; });
  const first = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  if (first.join('|') !== headers.join('|')) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (sh.getFrozenRows() < 1) {
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

function validate_(p) {
  const req = ['name', 'phone', 'business', 'need', 'experience', 'currentSpend', 'readyBudget', 'problem'];
  for (let i = 0; i < req.length; i++) {
    if (!clip_(p[req[i]], 2000)) return { ok: false, error: 'invalid', field: req[i] };
  }
  if (clip_(p.name, 200).length < 2) return { ok: false, error: 'invalid', field: 'name' };
  if (String(p.phone).replace(/\D/g, '').length !== 12) return { ok: false, error: 'invalid', field: 'phone' };
  const opts = ['need', 'experience', 'currentSpend', 'readyBudget'];
  for (let j = 0; j < opts.length; j++) {
    if (CARD_OPT[opts[j]].indexOf(String(p[opts[j]])) < 0) return { ok: false, error: 'invalid', field: opts[j] };
  }
  if (!/^FC-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(String(p.submissionId || ''))) return { ok: false, error: 'invalid', field: 'submissionId' };
  return null;
}

function doPost(e) {
  let p;
  try { p = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return json_({ ok: false, error: 'bad_json' }); }
  if (p.token !== CARD_TOKEN) return json_({ ok: false, error: 'forbidden' });
  if (p.formType !== 'card') return json_({ ok: false, error: 'invalid', field: 'formType' });
  if (p.hp) return json_({ ok: false, error: 'spam' });
  if (Number(p.elapsed || 0) < CARD_MIN_FILL_MS) return json_({ ok: false, error: 'too_fast' });
  const bad = validate_(p);
  if (bad) return json_(bad);

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' });
  try {
    const sh = sheet_();
    const idCol = CARD_COLUMNS.length; // Submission ID — oxirgi ustun
    const last = sh.getLastRow();
    if (last > 1) {
      // Bir xil Ariza ID bilan qayta urinish (timeout, ikki marta bosish) — yangi qator qo‘shilmaydi.
      const found = sh.getRange(2, idCol, last - 1, 1).createTextFinder(String(p.submissionId)).matchEntireCell(true).findNext();
      if (found) return json_({ ok: true, saved: true, duplicate: true, submissionId: p.submissionId });
    }

    const cache = CacheService.getScriptCache();
    const hourKey = 'card_h_' + Utilities.formatDate(new Date(), TZ, 'yyyyMMddHH');
    const count = Number(cache.get(hourKey) || 0);
    if (count >= CARD_PER_HOUR) return json_({ ok: false, error: 'rate_limited' });

    const fixed = {
      __timestamp: Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'),
      __source: 'FAZO Digital Card',
      __status: 'NEW',
    };
    const row = CARD_COLUMNS.map(function (c) {
      const k = c[0];
      if (fixed[k] !== undefined) return fixed[k];
      return safe_(clip_(p[k], MAX_LEN[k] || 300));
    });
    sh.appendRow(row);
    SpreadsheetApp.flush();
    cache.put(hourKey, String(count + 1), 3700);
    return json_({ ok: true, saved: true, duplicate: false, submissionId: p.submissionId });
  } catch (err) {
    return json_({ ok: false, error: 'storage_failed' });
  } finally {
    lock.releaseLock();
  }
}

/** Brauzerda URL ochilganda ishlayotganini tekshirish uchun. */
function doGet() {
  return json_({ ok: true, service: 'FAZO Digital Card Leads' });
}

/** Ixtiyoriy: Apps Script muharririda bir marta Run qilinsa sarlavhalar va varaq nomini tayyorlaydi. */
function setupCardSheet() {
  sheet_();
}
