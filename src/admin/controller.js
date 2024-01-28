/**
 * Function to send the help message to a Telegram chat
 *
 * @param {object} msg Telegram API message resource object
 */
function sendHelp(msg) {
  let message = HtmlService.createHtmlOutputFromFile('admin/views/help').getContent();
  telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: message, parseMode: 'HTML'});
}
