const gatetesUrlBase = 'https://api.thecatapi.com/v1';

/**
 * Sends a kitten to a chat, either a Image or an animation
 *
 * @param {object} msg Telegram API message resource object
 * @param {string} caption Caption to be sent with the kitten
 *
 */
function getGatete(msg, caption=null) {    
  let headers = {
    'x-api-key': scriptProperties.getProperty('GatetesAPIKey')
  }
  
  let options = {
    'method': 'GET',
    'headers': headers
  }
  
  let data = UrlFetchApp.fetch(gatetesUrlBase + '/images/search', options);
  
  let JSONdata = JSON.parse(data.getContentText());
  
  let gatete = UrlFetchApp.fetch(JSONdata[0]['url']);
  
  let gateteType = gatete.getBlob().getContentType();
    
  if(gateteType.indexOf('gif') > -1) {
    telegramApi.sendAnimation(msg, gatete, replyTo=true);
  } else  {
    telegramApi.sendPhoto(msg, gatete, replyTo=true, caption);
  }
  
}