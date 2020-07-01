/**
 * Handler of the /click command. Simmulates a russian roulette, you have a 1 out of 6 changes 
 * to die
 *
 * @param {string} chatId Telegram chat 
 *
 */
function handleClick(msg) {
  if(getRndInteger(0, 6) == 3) {
    sendMessage(msg, '😵💥🔫 BAAANG', replyTo=true);
  } else {
    sendMessage(msg, '😛☁️🔫', replyTo=true);
  }
}
