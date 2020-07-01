const perretesUrlBase = 'https://api.thedogapi.com/v1'

/**
 * Sends a puppy to a chat, either a Image or an animation
 *
 * @param {object} msg Telegram API message resource object
 * @param {string} caption Caption to be sent with the puppy
 *
 */
function getPerrete(msg, caption=null) {    
  let headers = {
    'x-api-key': scriptProperties.getProperty('PerretesAPIKey')
  }
  
  let options = {
    'method': 'GET',
    'headers': headers
  }
  
  let data = UrlFetchApp.fetch(perretesUrlBase + '/images/search', options);
  
  let JSONdata = JSON.parse(data.getContentText());
  
  let perrete = UrlFetchApp.fetch(JSONdata[0]['url']);
  
  let perreteType = perrete.getBlob().getContentType();
    
  if(perreteType.indexOf('gif') > -1) {
    sendAnimation(msg, perrete, replyTo=true);
  } else  {
    sendPhoto(msg, perrete, replyTo=true, caption);
  }
  
}