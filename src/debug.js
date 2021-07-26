function getChatId(msg) {
  telegramApi.sendMessage(msg, String(msg['chat']['id']));
}
