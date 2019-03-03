var idClient = '<Your EMT idClient>';
var passKey = '<Your EMT passKey>';
var emtUrlBase = 'https://openbus.emtmadrid.es:9443/emt-proxy-server/last';

function getStopTimes(msg) {
  console.log('getStopTimes');
  try {
    var params = msg.text.split(' ');  
    var busStop = params[1];
    
    var payload = {
      'idClient': idClient,
      'passKey': passKey,
      'idStop': busStop
    }
      
    var options = {
      'method': 'POST',
      'payload': payload
    }
        
    var data = UrlFetchApp.fetch(emtUrlBase + '/geo/GetArriveStop.php', options);
    var JSONdata = JSON.parse(data);
    console.log(data.getContentText());
    if(data.getContentText() == '[false]') {
      replyToMessage(msg, 'No hay llegadas próximas.', msg.message_id);
    } else {
      var template = HtmlService.createTemplateFromFile('emtTemplate');
      template.data = JSONdata['arrives'];
      replyToMessage(msg, template.evaluate().getContent(), msg.message_id);
    }
  } catch(e) {
    console.error('Error en getStopTimes');
    console.error(e);
    Logger.log(e)
    replyToMessage(msg, 'No se ha podido obtener la información de parada.', msg.message_id);
  }  
}

function getInlineStopTimes(busStop) {
  console.log('getStopTimes');
  try {
    
    var payload = {
      'idClient': idClient,
      'passKey': passKey,
      'idStop': busStop
    }
      
    var options = {
      'method': 'POST',
      'payload': payload
    }
        
    var data = UrlFetchApp.fetch(emtUrlBase + '/geo/GetArriveStop.php', options);
    var JSONdata = JSON.parse(data);
    Logger.log(data.getContentText());
    if(data.getContentText() == '[false]') {
      return 'No hay llegadas próximas.';
    } else {
      var template = HtmlService.createTemplateFromFile('emtTemplate');
      template.data = JSONdata['arrives'];
      return template.evaluate().getContent();
    }
  } catch(e) {
    console.error('Error en getStopTimes');
    console.error(e);
    return 'No se ha podido obtener la información de parada.';
  }  
}
