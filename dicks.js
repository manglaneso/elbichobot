// Send random text based dick
function sendDicks(msg) {
  var url = 'http://dicks-api.herokuapp.com/dicks/1';
  var data = UrlFetchApp.fetch(url);
  var JSONdata = JSON.parse(data);
  sendMessage(msg, JSONdata.dicks[0]);
}
