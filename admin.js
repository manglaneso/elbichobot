function sendHelp(msg) {
  var message = HtmlService.createHtmlOutputFromFile('help').getContent();
  console.log(message);
  sendMessage(msg, message);
}
