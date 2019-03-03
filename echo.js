// Responds with same message received
function echo(msg, message) {
  sendMessage(msg, replaceString('/echo ', '', msg.text));
}
