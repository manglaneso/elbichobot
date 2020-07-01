const weatherBaseApi = 'https://api.openweathermap.org/data/2.5';

/**
 * Handler of the /weather command. Sends a message to the chat with weather data for the place passed as parameter in the command
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function getCurrentWeather(msg) {
    
  let city = replaceString('/weather ', '', msg['text']);
  
  try {
    let url = weatherBaseApi + '/weather?q=' + city + '&lang=es&units=metric&appid=' + scriptProperties.getProperty('OpenWeatherMapAPIKey');
    let apiResult = UrlFetchApp.fetch(url).getContentText();
    
    let jsonApiResult = JSON.parse(apiResult);
    
    let amanecer = jsonApiResult['sys']['sunrise'];
    let atardecer = jsonApiResult['sys']['sunset'];
    
    let template = HtmlService.createTemplateFromFile('weather/views/weatherTemplate');
    template.ciudad = jsonApiResult['name'];
    template.descripcion = jsonApiResult['weather'][0]['description'];
    template.nubes = jsonApiResult['clouds']['all'];
    template.temperatura = jsonApiResult['main']['temp'];
    template.maxima = jsonApiResult['main']['temp_max'];
    template.minima = jsonApiResult['main']['temp_min'];
    template.humedad = jsonApiResult['main']['humidity'];
    template.presion = jsonApiResult['main']['pressure'];
    template.viento = jsonApiResult['wind']['speed'];
    template.amanecer = formatHours(jsonApiResult['sys']['sunrise']);
    template.atardecer = formatHours(jsonApiResult['sys']['sunset']);
    
    sendMessage(msg, template.evaluate().getContent(), replyTo=true);
  } catch(e) {
    console.error('Error en getCurrentWeather');
    console.error(e);
    sendMessage(msg, 'No se ha encontrado la ciudad.', replyTo=true);
  }
}