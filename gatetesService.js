var gatetesSuscriptionFolderId = '<folder ID>';

// thecatapi API KEY
var gatetesAPIKey = '<API KEY>';

var gatetesUrlBase = 'https://api.thecatapi.com/v1';

function getGatete(msg) {    
  var headers = {
    'x-api-key': gatetesAPIKey
  }
  
  var options = {
    'method': 'GET',
    'headers': headers
  }
  
  var data = UrlFetchApp.fetch(gatetesUrlBase + '/images/search', options);
  
  var JSONdata = JSON.parse(data.getContentText());
    
  sendPhoto(msg, UrlFetchApp.fetch(JSONdata[0].url));
  
}

function isGateteSubscribed(chatId) {
  var gatetesFolder = DriveApp.getFolderById(gatetesSuscriptionFolderId);
  var gateteFile = gatetesFolder.getFilesByName(chatId);
  return gateteFile.hasNext()
}

function subscribeToGatete(msg) {
  if(isGateteSubscribed(msg.chat.id)) {
    replyToMessage(msg, 'Este chat ya está suscrito a su ración de gatetes diaria.', msg.message_id);
  } else {
    try {
      var subscriptionFile = SpreadsheetApp.create(String(msg.chat.id), 1, 1);
      moveFileToAnotherFolder(subscriptionFile.getId(), gatetesSuscriptionFolderId);
      replyToMessage(msg, 'Gracias por suscribirse al servicio de gatetes.', msg.message_id);
    } catch(e) {
      replyToMessage(msg, 'Ha ocurrido un error al suscribirse al servicio de gatetes. :(', msg.message_id);
      console.error('Gatetes suscription error');
      console.error(e);
    }
  }
}

function unsubscribeFromGatete(msg) {
  if(isGateteSubscribed(msg.chat.id)) {
    try {
      var gateteFolder = DriveApp.getFolderById(gatetesSuscriptionFolderId);
      var gateteFile = gateteFolder.getFilesByName(msg.chat.id);
      gateteFile.next().setTrashed(true);
      replyToMessage(msg, 'Te echaré de menos :(', msg.message_id);
    } catch(e){
      replyToMessage(msg, 'Ha ocurrido un error desuscribiendote del servicio de gatetes. Esto es una fucking signal :)', msg.message_id);
      console.error('Pedetes unsubscription error');
      console.error(e);
    }    
  } else {
    replyToMessage(msg, 'No estás suscrito al servicio de gatetes.', msg.message_id);
  }
}

function sendGateteSubscription() {
  console.info('Enviando gatetes');
  var gateteFiles = DriveApp.getFolderById(gatetesSuscriptionFolderId).getFiles();
  while(gateteFiles.hasNext()) {
    var gateteFile = gateteFiles.next();    
    var msg = {chat:{}};
    msg['chat']['id'] = gateteFile.getName();
    console.info('Enviando gatete al chat ' + gateteFile.getName());
    try {
      getGatete(msg, 'Aquí tiene su gato. Gracias por utilizar el servicio de envío diario de gatetes');
    } catch(e) {
      console.error('Se ha intentado enviar un gatete por suscripción a un chat inaccesible: ' + msg.chat.id);
    }
    
    Utilities.sleep(500);
  }
}