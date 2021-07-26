function sendHelp(msg) {
  var message = HtmlService.createHtmlOutputFromFile('help').getContent();
  telegramApi.sendMessage(msg, message);
}
