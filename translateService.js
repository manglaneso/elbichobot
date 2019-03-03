function translate(message) {
  var params = message.text.split(';');
  var messageTranslated = '';
  
  try {
    messageTranslated = LanguageApp.translate(replaceString('/translate ', '', params[0]), params[1].toLowerCase(), params[2].toLowerCase());
  } catch(e) {
    console.error('Error in translate');
    console.error(e);
    messageTranslated = 'Ya lo has roto.';
  }
  replyToMessage(message, messageTranslated, message.message_id);
}

function getLanguages(msg) {
  var message = HtmlService.createHtmlOutputFromFile('languages_support').getContent();
  console.log(message);
  sendMessage(msg, message);
}
