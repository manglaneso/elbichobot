/**
 * Checks if the message received from Telegram comes from an authorized chat
 *
 * @param {string} chatId Telegram chat 
 *
 * @return {boolean} True if the message comes from an authorized chat, False otherwise
 *
 */
function checkIfAuthorizedChat(chatId) {
      
  let authorizedChats = scriptProperties.getProperty('GruposAutorizados');
  
  let authorizedChatsArray = JSON.parse(authorizedChats);
  
  return authorizedChatsArray.indexOf(chatId) > -1;
}

/**
 * Checks if the update received in the web server comes from Telegram Bot API 
 *
 * @param {object} request Request received in web server
 *
 * @return {boolean} True if the message comes from Telegram Bot API, False otherwise
 *
 */
function checkTelegramAuth(request) {
  if(request['parameter'] && request['parameter']['token']) {
    return request['parameter']['token'] === scriptProperties.getProperty('TelegramAPIAuthToken')
  }
  
  return false;
}