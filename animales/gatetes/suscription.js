/**
 * Checks if a chat is subscribed to the kitten service
 *
 * @param {string} chatId Telegram chat 
 *
 * @return {boolean} True if the chat is subscribed, False otherwise
 *
 */
function isGateteSubscribed(chatId) {
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
    sendMessage(msg, 'Este chat ya está suscrito a su ración de gatetes diaria.', replyTo=true);
  } else {
    try {
      let subscriptionFile = SpreadsheetApp.create(String(msg['chat']['id']), 1, 1);
      
      let rootFolder = DriveApp.getRootFolder();
      let gatetesFolder = DriveApp.getFolderById(scriptProperties.getProperty('GateteSuscriptionsFolderID'));
      
      gatetesFolder.addFile(subscriptionFile);
      rootFolder.removeFile(subscriptionFile);
      
      getGatete(msg, caption='Gracias por suscribirse al servicio de gatetes. A partir de ahora recibirás uno cada día. Además, aquí tienes el primero ;)')
    } catch(e) {
      sendMessage(msg, 'Ha ocurrido un error al suscribirse al servicio de gatetes. :(', replyTo=true);
      console.error('Gatetes suscription error');
      console.error(e);
    }
  }
}

/**
 * Unsubscribe a chat from the kitten service
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function unsubscribeFromGatetes(msg) {
  if(isGateteSubscribed(msg['chat']['id'])) {
    try {
      let gatetesFolder = DriveApp.getFolderById(scriptProperties.getProperty('GateteSuscriptionsFolderID'));
      let gateteFile = gatetesFolder.getFilesByName(msg['chat']['id']);
      gateteFile.next().setTrashed(true);
      sendMessage(msg, 'Te echaré de menos :(', replyTo=true);
    } catch(e){
      sendMessage(msg, 'Ha ocurrido un error desuscribiendote del servicio de gatetes. Esto es una señal clarísima :)', replyTo=true);
      console.error('Gatetes unsubscription error');
      console.error(e);
    }    
  } else {
    sendMessage(msg, 'No estás suscrito al servicio de gatetes.', replyTo=true);
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