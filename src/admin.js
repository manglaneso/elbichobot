function sendHelp(msg) {
  var message = HtmlService.createHtmlOutputFromFile('help').getContent();
  telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: message, parseMode: 'HTML', replyParameters: {'message_id': msg['message_id']}}); 
}
