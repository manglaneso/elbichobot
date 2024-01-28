/**
 * Checks if a chat is subscribed to the kitten service
 *
 * @param {string} chatId Telegram chat 
 *
 * @return {boolean} True if the chat is subscribed, False otherwise
 *
 */
function isGateteSubscribed(chatId='-23232799') {
  let gatetesFolder = DriveApp.getFolderById(scriptProperties.getProperty('GateteSuscriptionsFolderID'));
  let gateteFile = gatetesFolder.getFilesByName(chatId);
  return gateteFile.hasNext()
}

/**
 * Subscribe a chat to the kitten service, getting it an image/animation of a cat everyday
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function subscribeToGatetes(msg) {
  if(isGateteSubscribed(msg['chat']['id'])) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Este chat ya está suscrito a su ración de gatetes diaria.', replyParameters: {'message_id': msg['message_id']}});
    return;
  }

  try {
    let subscriptionFile = DriveApp.getFileById(SpreadsheetApp.create(String(msg['chat']['id']), 1, 1).getId());
    
    let rootFolder = DriveApp.getRootFolder();
    let gatetesFolder = DriveApp.getFolderById(scriptProperties.getProperty('GateteSuscriptionsFolderID'));
    
    gatetesFolder.addFile(subscriptionFile);
    rootFolder.removeFile(subscriptionFile);
    
    getGatete(msg, caption='Gracias por suscribirse al servicio de gatetes. A partir de ahora recibirás uno cada día. Además, aquí tienes el primero ;)')
  } catch(e) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Ha ocurrido un error al suscribirse al servicio de gatetes. :(', replyParameters: {'message_id': msg['message_id']}});
    console.error('Gatetes suscription error');
    console.error(e);
  }
}

/**
 * Unsubscribe a chat from the kitten service
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function unsubscribeFromGatetes(msg) {
  if(!isGateteSubscribed(msg['chat']['id'])) {
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'No estás suscrito al servicio de gatetes.', replyParameters: {'message_id': msg['message_id']}});
    return;
  }

  try {
    let gatetesFolder = DriveApp.getFolderById(scriptProperties.getProperty('GateteSuscriptionsFolderID'));
    let gateteFile = gatetesFolder.getFilesByName(msg['chat']['id']);
    gateteFile.next().setTrashed(true);
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Te echaré de menos :(', replyParameters: {'message_id': msg['message_id']}});

  } catch(e){
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'Ha ocurrido un error desuscribiendote del servicio de gatetes. Esto es una señal clarísima :)', replyParameters: {'message_id': msg['message_id']}});
    console.error('Gatetes unsubscription error');
    console.error(e);
  }    
}

/**
 * Sends a kitten to every subscribed chat
 *
 */
function sendGateteSubscription() {
  console.info('Enviando gatetes');
  let gateteFiles = DriveApp.getFolderById(scriptProperties.getProperty('GateteSuscriptionsFolderID')).getFiles();
  while(gateteFiles.hasNext()) {
    let gateteFile = gateteFiles.next();    
    let msg = {'chat':{}};
    msg['chat']['id'] = gateteFile.getName();
    console.info('Enviando gatete al chat ' + msg['chat']['id']);
    try {
      getGatete(msg, 'Aquí tienes tu gatete diario. ❤️')
    } catch(e) {
      console.error('Se ha intentado enviar un gatete por suscripción a un chat inaccesible: ' + msg['chat']['id']);
    }
    
    Utilities.sleep(500);
  }
}