/**
 * Handler of the /translate command. Uses Google Translate to translate the text of a message to a different language
 *
 * @param {object} msg Telegram API message resource object
 *
 */

function handleTranslate(msg) {
  
  let translateFrom;
  let translateTo;
  let translateText;
  
  try {
    if(msg.hasOwnProperty('reply_to_message')) {
      let messageText = msg['text'];    
      messageText = replaceString('/translate ', '', messageText);
      
      let params = messageText.split(',');
      
      translateFrom = params[0];
      translateTo = params[1];
      
      translateText = msg['reply_to_message']['text'];
      
    } else {
      let messageText = msg['text'];    
      messageText = replaceString('/translate ', '', messageText);
      
      let params = messageText.split(',');
      
      translateFrom = params[params.length - 2];
      translateTo = params[params.length - 1];
      
      messageText = replaceString(',' + translateFrom, '', messageText);
      messageText = replaceString(',' + translateTo, '', messageText);
      
      translateText = messageText;
    }
  
    translate(msg, translateText, translateFrom, translateTo);
  } catch(e) {
    console.error('Error in formatting translate call');
    console.error(e);
    telegramApi.sendMessage(msg, 'Ya lo has roto.', replyTo=true);
  }
  
}


function translate(msg, text, translateFrom, translateTo) {
  let messageTranslated = '';
  
  try {
    messageTranslated = LanguageApp.translate(text, translateFrom.toLowerCase(), translateTo.toLowerCase());
  } catch(e) {
    console.error('Error in translate');
    console.error(e);
    messageTranslated = 'Ya lo has roto.';
  }
  telegramApi.sendMessage(msg, messageTranslated, replyTo=true);
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
  telegramApi.sendMessage(msg, message);
}
