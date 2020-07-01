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
    sendMessage(msg, data.getContentText(), replyTo=true);
  } catch(e) {
    console.error('Error en convertCurrency');
    console.error(e);
    sendMessage(msg, 'No se ha podido realizar la operación.', replyTo=true);
  }  
}
