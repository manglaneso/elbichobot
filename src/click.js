/**
 * Handler of the /click command. Simmulates a russian roulette, you have a 1 out of 6 changes 
 * to die
 *
 * @param {string} chatId Telegram chat 
 *
 */
function handleClick(msg) {
  if(getRndInteger(0, 6) === 3) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: '😵💥🔫 BAAANG', replyParameters: {'message_id': msg['message_id']}}); 
  } else {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: '😛☁️🔫', replyParameters: {'message_id': msg['message_id']}}); 
  }
}
