const emtUrlBase = 'https://openapi.emtmadrid.es';

/**
 * Handler of the /tiempoEMT command. Sends a message to the chat with the closest
 * arrivals to the corresponding bus stop
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function getStopTimes(msg) {
  let params = msg['text'].split(' ');  
  let busStop = params[1];
    
  let payload = {
    'cultureInfo': 'ES',
    'Text_StopRequired_YN': 'N',
    'Text_EstimationsRequired_YN': 'Y',
    'Text_IncidencesRequired_YN': 'N'
  }
  
  let accessToken = getAccessToken();
      
  let options = {
    'method': 'POST',
    'headers': {
      'accessToken': accessToken
    },
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  }
  
  let response = UrlFetchApp.fetch(emtUrlBase + '/v2/transport/busemtmad/stops/' + busStop + '/arrives/', options);
   
  let data = JSON.parse(response.getContentText());
  console.log(data);
                                                
  if(data.hasOwnProperty('data')) {
    if(data['data'].length > 0) {
      if(data['data'][0]['Arrive']) {
        let arriveTimes = data['data'][0]['Arrive'];
        
        if(arriveTimes.length > 0) {
          let template = HtmlService.createTemplateFromFile('emt/views/emtTemplate');
          template.data = arriveTimes;
          telegramApi.sendMessage(msg, template.evaluate().getContent(), replyTo=true);
        } else {
          telegramApi.sendMessage(msg, 'No se ha podido obtener la información de parada.', replyTo=false);
        }
      }
    } else {
      telegramApi.sendMessage(msg, 'No se ha podido obtener la información de parada.', replyTo=false);
    }
  } else {
    telegramApi.sendMessage(msg, 'No se ha podido obtener la información de parada.', replyTo=false);
  }
}

/**
 * Gets expiration date of EMT access token to authorize calls to EMT API
 *
 * @param {object} jsonEMT EMT API login resource object
 * @return {number} UNIX timestamp of expirationDate
 *
 */
function getExpirationDate(jsonEMT) {
  let updatedDate = new Date(jsonEMT['updatedAt']).getTime();
  let tokenSecExpiration = jsonEMT['tokenSecExpiration'] * 1000;  
  return updatedDate+tokenSecExpiration;
}

/**
 * Gets EMT access token to authorize calls to EMT API
 *
 * @return {string} EMT Access token
 *
 */
function getAccessToken() {
  let emtAccessInfo = scriptProperties.getProperty('EMTAccessInfo');
  
  if(emtAccessInfo) {
    let jsonEMT = JSON.parse(emtAccessInfo);
    let tokenExpirationDate = getExpirationDate(jsonEMT);
    if(dateIsOlder(tokenExpirationDate)) {
      return refreshAccessToken();
    } else {
      return jsonEMT['accessToken'];
    }
  } else {
    return refreshAccessToken();
  }
}

/**
 * Refreshes EMT access token to authorize calls to EMT API
 *
 * @return {string|null} EMT Access token
 *
 */
function refreshAccessToken() {
  
  let options = {
    'method': 'GET',
    'headers': {
      'X-ClientId': scriptProperties.getProperty('EmtIdClient'),
      'passKey': scriptProperties.getProperty('EmtPassKey'),
    }    
  }
  
  let data = JSON.parse(UrlFetchApp.fetch(emtUrlBase + '/v2/mobilitylabs/user/login', options));
    
  if(data.hasOwnProperty('data')) {
    if(data['data'].length > 0) {
      scriptProperties.setProperty('EMTAccessInfo', JSON.stringify(data['data'][0]));
      return data['data'][0]['accessToken'];
    } else {
      return null;
    }
  } else {
    return null;
  }
}