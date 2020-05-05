function sendHelp(msg) {
  var message = HtmlService.createHtmlOutputFromFile('help').getContent();
  sendMessage(msg, message);
}
