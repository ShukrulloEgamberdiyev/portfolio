/**
 * FAZO Digital — sayt arizalarini "Targeting Xizmat" jadvaliga yozadi.
 *
 * O‘RNATISH
 * 1. https://docs.google.com/spreadsheets/d/1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo  → Extensions → Apps Script
 * 2. Kodni shu faylga qo‘ying (Code.gs ichidagi hammasini almashtiring) va saqlang.
 * 3. Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 *    → Deploy → ruxsat bering → Web app URL ni nusxalang.
 * 4. Sayt papkasida .env fayl yarating:
 *      VITE_APPLICATION_ENDPOINT=https://script.google.com/macros/s/AKfy.../exec
 *      VITE_APPLICATION_TOKEN=fazo-2026-maxfiy   (pastdagi TOKEN bilan bir xil bo‘lsin)
 * 5. Telegramga xabar kelishi uchun BOT_TOKEN va CHAT_ID ni to‘ldiring (ixtiyoriy).
 *
 * Kodni o‘zgartirsangiz: Deploy → Manage deployments → tahrirlash → Version: New version → Deploy.
 */

const SHEET_NAME = 'Sayt arizalari';
const TOKEN = 'fazo-2026-maxfiy';   // .env dagi VITE_APPLICATION_TOKEN bilan bir xil
const BOT_TOKEN = '';               // masalan: 1234567:AAH... (bo‘sh bo‘lsa xabar yuborilmaydi)
const CHAT_ID = '';                 // masalan: -1001234567890

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

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (TOKEN && data.token !== TOKEN) return out({ ok: false, error: 'forbidden' });

    const sheet = getSheet();
    const row = COLUMNS.map(function (c) {
      const v = data[c[0]];
      return c[0] === 'submittedAt' ? new Date() : (v == null ? '' : String(v));
    });
    row.push('Yangi');                       // Holat ustuni — sotuv bo‘limi uchun
    sheet.appendRow(row);

    notify(data);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doGet() { return out({ ok: true, status: 'FAZO application endpoint' }); }

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    const header = COLUMNS.map(function (c) { return c[1]; }).concat(['Holat']);
    sheet.appendRow(header);
    const head = sheet.getRange(1, 1, 1, header.length);
    head.setFontWeight('bold').setBackground('#0b0b0d').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, header.length, 150);
  }
  return sheet;
}

function notify(data) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  const text =
    '🟣 Yangi ariza — fazodigital.uz\n\n' +
    'Ism: ' + (data.name || '-') + '\n' +
    'Kompaniya: ' + (data.company || '-') + '\n' +
    'Soha: ' + (data.industry || '-') + '\n' +
    'Byudjet: ' + (data.budget || '-') + '\n' +
    'Daromad: ' + (data.revenue || '-') + '\n' +
    'Muammo: ' + (data.problem || '-') + '\n' +
    'Aloqa: ' + (data.contact || '-');
  UrlFetchApp.fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
    method: 'post',
    payload: { chat_id: CHAT_ID, text: text },
    muteHttpExceptions: true,
  });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
