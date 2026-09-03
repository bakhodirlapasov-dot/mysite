/**
 * Sayt aloqa formasi → Google Sheets
 *
 * O‘RNATISH:
 *  1. Google Sheets’da yangi jadval oching (nomi ixtiyoriy).
 *  2. Kengaytmalar (Extensions) → Apps Script.
 *  3. Ichidagi hamma narsani o‘chirib, shu faylni to‘liq nusxalang.
 *  4. Pastdagi TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID ni to‘ldiring
 *     (ixtiyoriy — to‘ldirsangiz, har bir murojaat Telegram’ga ham keladi).
 *  5. Deploy → New deployment → turi: Web app
 *       Description : Sayt formasi
 *       Execute as  : Me
 *       Who has access : Anyone          ← muhim!
 *  6. Deploy bosing, ruxsat bering, chiqqan .../exec havolasini nusxalang.
 *  7. Saytdagi script.js faylining boshidagi FORMA_MANZILI ga qo‘ying.
 *
 * ESLATMA: kodni keyin o‘zgartirsangiz, qayta Deploy qilish kerak
 * (Deploy → Manage deployments → qalamcha → Version: New version).
 */

// ── Ixtiyoriy: Telegram’ga bildirishnoma ────────────────────────────
// Bot yaratish: Telegram’da @BotFather → /newbot → token oling.
// Chat ID: botga bir marta yozing, keyin
// https://api.telegram.org/bot<TOKEN>/getUpdates manzilidan chat.id ni oling.
//
// ⚠️ MUHIM: ikkalasi ham QO‘SHTIRNOQ ICHIDA yozilishi shart.
//
//    TO‘G‘RI:
//      var TELEGRAM_BOT_TOKEN = 'BU_YERGA_BOTFATHER_BERGAN_TOKEN';
//      var TELEGRAM_CHAT_ID   = 'BU_YERGA_CHAT_ID';
//
//    NOTO‘G‘RI (qo‘shtirnoqsiz — "ReferenceError ... is not defined" beradi):
//      var TELEGRAM_BOT_TOKEN = BU_YERGA_BOTFATHER_BERGAN_TOKEN;
//
var TELEGRAM_BOT_TOKEN = '';
var TELEGRAM_CHAT_ID   = '';

var JADVAL_NOMI = 'Murojaatlar';

// Deploy tekshiruvi uchun. Kodni o‘zgartirsangiz shuni ham oshiring.
var KOD_VERSIYASI = '2.0';


function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Spam tuzog‘i to‘ldirilgan bo‘lsa — bot, yozmaymiz
    if (p.sayt) {
      return javob({ ok: true });
    }

    var varaq = varaqniOl();

    varaq.appendRow([
      new Date(),
      p.ism     || '',
      p.telefon || '',
      p.biznes  || '',
      p.xabar   || '',
      p.sahifa  || '',
      'Yangi'
    ]);

    // Telegram bildirishnomasi — ASOSIY ISHDAN AJRATILGAN.
    // Bu yerda xato chiqsa ham murojaat jadvalga yozilgan bo‘ladi
    // va jadvalga ortiqcha "XATO" qatori qo‘shilmaydi.
    try {
      telegramgaYubor(p);
    } catch (tgXato) {
      console.error('Telegram bildirishnomasi yuborilmadi: ' + tgXato);
    }

    return javob({ ok: true });

  } catch (xato) {
    // Xatoni ham jadvalga yozib qo‘yamiz — keyin ko‘rish uchun
    try {
      varaqniOl().appendRow([new Date(), 'XATO', String(xato), '', '', '', '']);
    } catch (ignore) {}
    return javob({ ok: false, xato: String(xato) });
  }
}


/**
 * Brauzerdan ochib ko‘rish uchun — tizim holatini qaytaradi.
 *
 * MAXFIYLIK: bu manzil hamma uchun ochiq, shuning uchun bu yerda
 * murojaatlar MAZMUNI (ism, telefon, xabar) hech qachon qaytarilmaydi —
 * faqat sanoq va sozlama holati.
 */
function doGet() {
  var natija = {
    ok: true,
    versiya: KOD_VERSIYASI,
    holat: 'Forma qabul qilgichi ishlayapti'
  };

  try {
    var varaq = varaqniOl();
    var oxirgi = varaq.getLastRow();
    natija.jamiQatorlar = Math.max(0, oxirgi - 1);

    // Nechta "XATO" qatori bor — B ustunini sanaymiz
    natija.xatoQatorlar = 0;
    if (oxirgi > 1) {
      var bUstun = varaq.getRange(2, 2, oxirgi - 1, 1).getValues();
      for (var i = 0; i < bUstun.length; i++) {
        if (String(bUstun[i][0]).trim() === 'XATO') natija.xatoQatorlar++;
      }
    }
  } catch (e) {
    natija.jadvalXatosi = String(e);
  }

  natija.telegram = telegramHolati();
  return javob(natija);
}


/** Telegram sozlamasi qanday holatda — token/chat id ni oshkor qilmaydi */
function telegramHolati() {
  if (typeof TELEGRAM_BOT_TOKEN !== 'string' || !TELEGRAM_BOT_TOKEN) return 'sozlanmagan';
  if (!/^\d+:[\w-]{30,}$/.test(TELEGRAM_BOT_TOKEN)) return 'token noto‘g‘ri ko‘rinishda';
  if (typeof TELEGRAM_CHAT_ID !== 'string' || !TELEGRAM_CHAT_ID) return 'chat id kiritilmagan';
  return 'sozlangan';
}


/** Varaqni topadi, bo‘lmasa sarlavhalar bilan yaratadi */
function varaqniOl() {
  var kitob = SpreadsheetApp.getActiveSpreadsheet();
  var varaq = kitob.getSheetByName(JADVAL_NOMI);

  if (!varaq) {
    varaq = kitob.insertSheet(JADVAL_NOMI);
    varaq.appendRow(['Vaqt', 'Ism', 'Telefon', 'Soha', 'Xabar', 'Sahifa', 'Holat']);
    varaq.getRange('A1:G1').setFontWeight('bold');
    varaq.setFrozenRows(1);
    varaq.setColumnWidth(1, 150);
    varaq.setColumnWidth(2, 160);
    varaq.setColumnWidth(3, 140);
    varaq.setColumnWidth(4, 160);
    varaq.setColumnWidth(5, 380);
  }
  return varaq;
}


/** Telegram’ga xabar yuboradi (token to‘g‘ri kiritilgan bo‘lsa) */
function telegramgaYubor(p) {
  // Bo‘sh bo‘lsa yoki qo‘shtirnoqsiz yozilgan bo‘lsa — jimgina o‘tkazib yuboramiz
  if (typeof TELEGRAM_BOT_TOKEN !== 'string' || !TELEGRAM_BOT_TOKEN) return;
  if (typeof TELEGRAM_CHAT_ID !== 'string' || !TELEGRAM_CHAT_ID) return;

  // Token ko‘rinishi: raqamlar, ikki nuqta, keyin harf-raqamlar
  if (!/^\d+:[\w-]{30,}$/.test(TELEGRAM_BOT_TOKEN)) {
    console.error('TELEGRAM_BOT_TOKEN noto‘g‘ri ko‘rinishda — bildirishnoma yuborilmadi');
    return;
  }

  var matn = '🔔 Saytdan yangi murojaat\n\n'
    + '👤 ' + (p.ism || '—') + '\n'
    + '📞 ' + (p.telefon || '—') + '\n'
    + (p.biznes ? '🏢 ' + p.biznes + '\n' : '')
    + (p.xabar ? '\n' + p.xabar : '');

  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'post',
    payload: { chat_id: TELEGRAM_CHAT_ID, text: matn },
    muteHttpExceptions: true
  });
}


function javob(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
