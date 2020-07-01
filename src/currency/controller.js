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
    
    sendMessage(msg, result + ' ' + params[3], replyTo=false);
  } catch(e) {
    console.error('Error en convertCurrency');
    console.error(e);
    sendMessage(msg, 'No se ha podido realizar la conversion.', replyTo=true);
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
    sendMessage(msg, template.evaluate().getContent(), replyTo=false);
  } catch(e) {
    console.error('Error en getCurrecyCodes');
    console.error(e);
    sendMessage(msg, 'No se ha podido obtener la lista de divisas.', replyTo=true);
  }
}
