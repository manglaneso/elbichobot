/**
 * Checks if a chat is subscribed to the puppy service
 *
 * @param {string} chatId Telegram chat 
 *
 * @return {boolean} True if the chat is subscribed, False otherwise
 *
 */
function isPerreteSubscribed(chatId) {
  let perretesFolder = DriveApp.getFolderById(scriptProperties.getProperty('PerreteSuscriptionsFolderID'));
  let perreteFile = perretesFolder.getFilesByName(chatId);
  return perreteFile.hasNext()
}

/**
 * Subscribe a chat to the puppy service, getting it an image/animation of a dog everyday
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function subscribeToPerretes(msg) {
  if(isPerreteSubscribed(msg['chat']['id'])) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Este chat ya está suscrito a su ración de perretes diaria.', replyParameters: {'message_id': msg['message_id']}});
    return;
  }

  try {
    let subscriptionFile = DriveApp.getFileById(SpreadsheetApp.create(String(msg['chat']['id']), 1, 1).getId());
    // TODO: Cambiar la forma de gestionar la ubicación de los archivos
    let rootFolder = DriveApp.getRootFolder();
    let perretesFolder = DriveApp.getFolderById(scriptProperties.getProperty('PerreteSuscriptionsFolderID'));
    
    perretesFolder.addFile(subscriptionFile);
    rootFolder.removeFile(subscriptionFile);
    
    getPerrete(msg, caption='Gracias por suscribirse al servicio de perretes. A partir de ahora recibirás uno cada día. Además, aquí tienes el primero ;)')
  } catch(e) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Ha ocurrido un error al suscribirse al servicio de perretes. :(', replyParameters: {'message_id': msg['message_id']}});
    console.error('Perretes suscription error');
    console.error(e);
  }
}

/**
 * Unsubscribe a chat from the puppy service
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function unsubscribeFromPerretes(msg) {
  if(!isPerreteSubscribed(msg['chat']['id'])) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'No estás suscrito al servicio de gatetes.', replyParameters: {'message_id': msg['message_id']}});
    return;
  }

  try {
    let perretesFolder = DriveApp.getFolderById(scriptProperties.getProperty('PerreteSuscriptionsFolderID'));
    let perreteFile = perretesFolder.getFilesByName(msg['chat']['id']);
    perreteFile.next().setTrashed(true);
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Te echaré de menos :(', replyParameters: {'message_id': msg['message_id']}});
  } catch(e) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Ha ocurrido un error desuscribiendote del servicio de gatetes. Esto es una señal perretes :)', replyParameters: {'message_id': msg['message_id']}});
    console.error('Perretes unsubscription error');
    console.error(e);
  }
}

/**
 * Sends a puppy to every subscribed chat
 *
 */
function sendPerreteSubscription() {
  console.info('Enviando perretes');
  let perreteFiles = DriveApp.getFolderById(scriptProperties.getProperty('PerreteSuscriptionsFolderID')).getFiles();
  while(perreteFiles.hasNext()) {
    let perreteFile = perreteFiles.next();    
    let msg = {'chat':{}};
    msg['chat']['id'] = perreteFile.getName();
    console.info('Enviando perrete al chat ' + msg['chat']['id']);
    try {
      getPerrete(msg, 'Aquí tienes tu perrete diario. 💜️')
    } catch(e) {
      console.error('Se ha intentado enviar un perrete por suscripción a un chat inaccesible: ' + msg['chat']['id']);
    }
    
    Utilities.sleep(500);
  }
}