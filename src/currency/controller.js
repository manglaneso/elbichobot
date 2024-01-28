const currencyUrlBase = 'https://free.currencyconverterapi.com';

/**
 * Handler of the /convertCurrency command. Converts an amount on one currency to another
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function convertCurrency(msg) {
  try {
    let params = msg['text'].toUpperCase().split(' ');
        
    let amount = params[1];  
    let conversion = params[2] + '_' + params[3];
    
    let convertEndpoint = '/api/v6/convert?q=' + conversion + '&compact= ultra&apiKey=' + scriptProperties.getProperty('CurrencyApiKey');
    let data = UrlFetchApp.fetch(currencyUrlBase + convertEndpoint);
    let JSONdata = JSON.parse(data.getContentText());
    
    let result = amount * JSONdata['results'][conversion]['val'];
    
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: result + ' ' + params[3], replyParameters: {'message_id': msg['message_id']}});
  } catch(e) {
    console.error('Error en convertCurrency');
    console.error(e);
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'No se ha podido realizar la conversion.', replyParameters: {'message_id': msg['message_id']}});
  }
}

/**
 * Handler of the /getCurrencies command. Returns a list of available currency codes
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function getCurrecyCodes(msg) {
  let listOfCurrenciesEndpoint = '/api/v6/currencies?apiKey=' + scriptProperties.getProperty('CurrencyApiKey');
  
  try {
    let data = UrlFetchApp.fetch(currencyUrlBase + listOfCurrenciesEndpoint);
    let JSONdata = JSON.parse(data.getContentText());

    let template = HtmlService.createTemplateFromFile('currency/views/currencyCodes');
    template.data = JSONdata['results'];
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: template.evaluate().getContent(), parseMode: 'HTML'});
  } catch(e) {
    console.error('Error en getCurrecyCodes');
    console.error(e);
    telegramApi.sendMessage({chatId: String(msg['chat']['id']), text: 'No se ha podido obtener la lista de divisas.', replyParameters: {'message_id': msg['message_id']}});
  }
}
