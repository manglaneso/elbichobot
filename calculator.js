var calculatorUrlBase = 'http://api.mathjs.org/v4/';

function mathjs(msg) {
  try {
    var params = msg.text.split(' ');  
    var expression = params[1];
    
    var data = UrlFetchApp.fetch(calculatorUrlBase + '?expr=' + encodeURIComponent(expression));
    replyToMessage(msg, data.getContentText(), msg.message_id);
  } catch(e) {
    console.error('Error en convertCurrency');
    console.error(e);
    replyToMessage(msg, 'No se ha podido realizar la operación.', msg.message_id);
  }  
}
