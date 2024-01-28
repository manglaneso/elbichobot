/**
 * Handler of the /echo command. Returns the writen message to the Telegram chat.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function echo(msg) {
  telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: replaceString('/echo ', '', msg['text'])});
}
