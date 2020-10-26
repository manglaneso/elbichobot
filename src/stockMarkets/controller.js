const stockMarketapiBaseUrl = 'https://www.alphavantage.co/';

/**
 * Handler for the /stockPrice command.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function handleStockPrice(msg) {
  let commands = msg['text'].split(' ');
  
  if(commands.length > 1) {
    if(commands[1].toLowerCase() == 'hoy') {
      getLastDayIntraStockPrice(msg, commands[2]);
    } else if(commands[1].toLowerCase() == 'ultima' || commands[1].toLowerCase() == 'última') {
      getLastStockPrice(msg, commands[2]);
    }
  }
}

/**
 * Handler for the searchCompany inline query.
 *
 * @param {object} inlineQuery Telegram API inlineQuery resource object
 * @param {array} commands Array of commands passed to the query
 *
 */
function handleStockPriceInlineQuery(inlineQuery, commands) {
  
  let answers = [];
  
  let results = searchCompanySymbol(query=commands[1])['bestMatches'];
                
  for(let i in results) {
    let answer = {};
    
    answer['type'] = 'article';
    answer['id'] = String(i);
    answer['title'] = results[i]['1. symbol'];
    answer['description'] = results[i]['2. name'];
    
    answer['input_message_content'] = {};
    answer['input_message_content']['message_text'] = results[i]['1. symbol'];
    
    answers.push(answer);
    
  }
    
  answerInlineQuery(inlineQuery, answers, cacheTime=300);
  
}

/**
 * Sends a message with a chart for the last day stock prices for a company.
 *
 * @param {object} msg Telegram API message resource object
 * @param {string} companyCode Code for the company whose data is to be sent
 *
 */
function getLastDayIntraStockPrice(msg, companyCode='GOOG') {
  
  let company = companyCode;
  
  let apiKey = scriptProperties.getProperty('AlphaVantageApiKey');

  let apiEndpoint = `${stockMarketapiBaseUrl}query?function=TIME_SERIES_INTRADAY&symbol=${company}&interval=5min&apikey=${apiKey}`;
       
  let options = {
    'method': 'GET'
  }

  try {
    var data = UrlFetchApp.fetch(apiEndpoint, options);
  } catch(e) {
    sendMessage(msg, 'No se han podido obtener los datos para esa compañia', replyTo=true);
    return;
  }
  
  let JSONdata = JSON.parse(data);

  let dataTableBuilder = Charts.newDataTable()
      .addColumn(Charts.ColumnType.DATE, 'Hour')
      .addColumn(Charts.ColumnType.NUMBER, 'value');
  
  let today = new Date();

  let todayISODate = getIsoDate(today);

  let timeSeriesElements =  Object.keys(JSONdata['Time Series (5min)']);
    
  const hasDate = (element) => element.indexOf(todayISODate) > -1;

  let existsDate = timeSeriesElements.some(hasDate);

  let searchDateCount = 0;
  while(!timeSeriesElements.some(hasDate)) {
    if(searchDateCount > 5) {
      sendMessage(msg, 'No se han podido obtener los datos para esa compañia', replyTo=true);
      return;
    }
    let todayDay = today.getDate();
    today.setDate(todayDay - 1);
    todayISODate = getIsoDate(today);
    searchDateCount += 1;
  }
 
  for(let i = timeSeriesElements.length-1; i >= 0; --i) {
    if(timeSeriesElements[i].indexOf(todayISODate) > -1) {
      let dateHours = timeSeriesElements[i].split(' ');
      let hourElems = dateHours[1].split(':')
      let date = new Date(timeSeriesElements[i]);
            
      dataTableBuilder.addRow([date, JSONdata['Time Series (5min)'][timeSeriesElements[i]]['4. close']]);

    }  
  }

  let dataTable = dataTableBuilder.build();

  let chart = Charts.newLineChart()
    .setDataTable(dataTable)
    .setTitle('Stock prices for ' + company + ' at ' + todayISODate)
    .setXAxisTitle('h')
    .setYAxisTitle('Money')
    .setDimensions(533, 164)
    .setCurveStyle(Charts.CurveStyle.NORMAL)
    .setPointStyle(Charts.PointStyle.NONE)
    .build();

  sendPhoto(msg, chart, replyTo=false, caption=null)
  
}

/**
 * Sends a message with last stock price for a company.
 *
 * @param {object} msg Telegram API message resource object
 * @param {string} companyCode Code for the company whose data is to be sent
 *
 */
function getLastStockPrice(msg={'chat':{'id': -23232799}}, companyCode='ANIOY') {
  
  let company = companyCode;
  
  let apiKey = scriptProperties.getProperty('AlphaVantageApiKey');

  let apiEndpoint = `${stockMarketapiBaseUrl}query?function=GLOBAL_QUOTE&symbol=${company}&apikey=${apiKey}`;
       
  let options = {
    'method': 'GET',
    'muteHttpExceptions':false
  }

  try {
    var data = UrlFetchApp.fetch(apiEndpoint, options);
  } catch(e) {
    sendMessage(msg, 'No se han podido obtener los datos para esa compañia', replyTo=true);
  }
  
  let JSONdata = JSON.parse(data);

  let values = JSONdata['Global Quote'];

  if(values) {
    let template = HtmlService.createTemplateFromFile('stockMarkets/views/lastStockPrice');
    template['data'] = values;
        
    sendMessage(msg, template.evaluate().getContent(), replyTo=true); 
  } else {
    return null;
  }
  
}

/**
 * Searchs companies by a query string. Returns a list of possible companies.
 *
 * @param {string} query Name of the company to search
 *
 * @return {object} Object with an array of possible results
 *
 */
function searchCompanySymbol(query='BA') {
  let apiKey = scriptProperties.getProperty('AlphaVantageApiKey');

  let apiEndpoint = `${stockMarketapiBaseUrl}query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
       
  let options = {
    'method': 'GET'
  }

  try {
    var data = UrlFetchApp.fetch(apiEndpoint, options);
  } catch(e) {
    return;
  }
  
  let JSONdata = JSON.parse(data);

  return JSONdata;

}