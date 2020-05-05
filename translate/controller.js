/**
 * Handler of the /translate command. Uses Google Translate to translate the text of a message to a different language
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function translate(msg) {
  let params = msg['text'].split(';');
  let messageTranslated = '';
  
  try {
    messageTranslated = LanguageApp.translate(replaceString("/translate ", "", params[0]), params[1].toLowerCase(), params[2].toLowerCase());
  } catch(e) {
    console.error('Error in translate');
    console.error(e);
    messageTranslated = 'Ya lo has roto.';
  }
  sendMessage(msg, messageTranslated, replyTo=true);
}

/**
 * Handler of the /getLanguages command. Gets a message with a list of available languages'
 * codes to pass as argument of the /translate command
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function getLanguages(msg) {
  let message = HtmlService.createHtmlOutputFromFile('translate/views/languages_support').getContent();
  sendMessage(msg, message);
}
