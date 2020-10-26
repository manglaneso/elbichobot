function getChatId(msg) {
  sendMessage(msg, String(msg['chat']['id']));
}
