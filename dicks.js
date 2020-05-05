/**
 * Handler of the /dick command. Returns a variable length (8===D) dick.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function sendDicks(msg) {
  const url = 'http://dicks-api.herokuapp.com/dicks/1';
  let data = UrlFetchApp.fetch(url);
  let JSONdata = JSON.parse(data);
  sendMessage(msg, JSONdata['dicks'][0]);
}
