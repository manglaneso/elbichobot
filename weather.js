var openWeatherMapAPIKey = '<Your OpenWeatherMap API key>';

function getCurrentWeather(msg) {
    
  var city = replaceString('/weather ', '', msg.text);
  
  try {
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&lang=es&units=metric&appid=' + openWeatherMapAPIKey;
    var apiResult = UrlFetchApp.fetch(url).getContentText();
    
    var jsonApiResult = JSON.parse(apiResult);
    
    var amanecer = jsonApiResult['sys']['sunrise'];
    var atardecer = jsonApiResult['sys']['sunset'];
    
    var template = HtmlService.createTemplateFromFile('weatherTemplate');
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
    
    replyToMessage(msg, template.evaluate().getContent(), msg.message_id);
  } catch(e) {
    console.error('Error en getCurrentWeather');
    console.error(e);
    replyToMessage(msg, 'No se ha encontrado la ciudad.', msg.message_id);
  }
}
