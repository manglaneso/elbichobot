function getChatId(msg) {
  let chatId = String(msg['chat']['id']);
  telegramApi.sendMessage({chatId: chatId, text: chatId}); 
}
