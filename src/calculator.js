var calculatorUrlBase = 'http://api.mathjs.org/v4/';

/**
 * Handler for the /CALC command. Computes mathematical expressions.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function mathjs(msg) {
  try {
    let params = msg['text'].split(' ');  
    let expression = params[1];
    
    let data = UrlFetchApp.fetch(calculatorUrlBase + '?expr=' + encodeURIComponent(expression));
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: data.getContentText(), replyParameters: {'message_id': msg['message_id']}});
  } catch(e) {
    console.error('Error en convertCurrency');
    console.error(e);
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'No se ha podido realizar la operación.', replyParameters: {'message_id': msg['message_id']}});
  }  
}
