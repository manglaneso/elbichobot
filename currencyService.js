var currencyApiKey = '<CurrencyConverterAPI API key>';
var currencyUrlBase = 'https://free.currencyconverterapi.com';

function convertCurrency(msg) {
  try {
    var params = msg.text.toUpperCase().split(' ');
        
    var amount = params[1];  
    var conversion = params[2] + '_' + params[3];
    
    var convertEndpoint = '/api/v6/convert?q=' + conversion + '&compact= ultra&apiKey=' + currencyApiKey;
    var data = UrlFetchApp.fetch(currencyUrlBase + convertEndpoint);
    var JSONdata = JSON.parse(data.getContentText());
    
    var result = amount * JSONdata['results'][conversion]['val'];
    
    replyToMessage(msg, result + ' ' + params[3], msg.message_id);
  } catch(e) {
    console.error('Error en convertCurrency');
    console.error(e);
    replyToMessage(msg, 'No se ha podido realizar la conversion.', msg.message_id);
  }
}

function getCurrecyCodes(msg) {
  var listOfCurrenciesEndpoint = '/api/v6/currencies?apiKey=' + currencyApiKey;
  
  try {
    var data = UrlFetchApp.fetch(currencyUrlBase + listOfCurrenciesEndpoint);
    var JSONdata = JSON.parse(data.getContentText());

    var template = HtmlService.createTemplateFromFile('currencyCodes');
    template.data = JSONdata['results'];
    replyToMessage(msg, template.evaluate().getContent(), msg.message_id);
  } catch(e) {
    console.error('Error en getCurrecyCodes');
    console.error(e);
    replyToMessage(msg, 'No se ha podido obtener la lista de divisas.', msg.message_id);
  }
}
