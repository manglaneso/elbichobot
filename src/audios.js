/**
 * Sends a "Putos Yayos" audio from La Vida Moderna
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function sendPutosYayos(msg) {
  let file = DriveApp.getFileById('1Adza9f1p2T6ru6ll_okAkS6n4ArNfVz_');
  telegramApi.sendVoice({chatId: String(msg['chat']['id']), voice: file.getBlob()});
}
