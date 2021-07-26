const fiestasCalendar = 'es.spain#holiday@group.v.calendar.google.com';

/**
 * Handler of the /proximaFiesta command. Sends a message with the next national or local
 * holiday in Spain. A filter parameter can come with the message to get a local holiday.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function handleProximaFiesta(msg) {
  let filter =  replaceString('/proximaFiesta ', '', msg['text']);
  
  if(filter !== '/proximaFiesta') {
    getNextFiesta(msg, filter);
  } else {
    getNextFiesta(msg);
  }
}

/**
 * Handler of the /proximasFiestas command. Sends a message with a list of the next national
 * or local holidays in Spain. A filter parameter can come with the message to get a local
 * holiday.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function handleProximasFiestas(msg) {
  let filter =  replaceString('/proximasFiestas ', '', msg['text']);
  
  if(filter !== '/proximasFiestas') {
    getNextFiesta(msg, filter);
  } else {
    getNextFiesta(msg);
  }
}

/**
 * Sends a message with the next national or local
 * holiday in Spain. A filter parameter can come with the message to get a local holiday.
 *
 * @param {object} msg Telegram API message resource object
 * @param {string} filter Filter applied to search for local holidays
 *
 */
function getNextFiesta(msg, filter=undefined) {
  
  let today = new Date();
  
  let lastYearDay = new Date(today.getFullYear(), 11, 31);
  
  let fiestas = CalendarApp.getCalendarById(fiestasCalendar).getEvents(today, lastYearDay);
  
  let template = HtmlService.createTemplateFromFile('fiestas/views/fiestaTemplate');
  
  let toTemplate = {};
  
  if(!filter) {
    toTemplate['fecha'] = fiestas[0].getStartTime().toLocaleDateString('es-ES');
    toTemplate['nombre'] = fiestas[0].getTitle();
    
    template['data'] = toTemplate;
    
  } else {
    if(filter.toLowerCase() === 'nacional') {
      var results = fiestas.filter(fiesta => fiesta.getTitle().indexOf('(') < 0);
    } else {
      var results = fiestas.filter(fiesta => fiesta.getTitle().toLowerCase().indexOf(filter.toLowerCase()) > -1 || fiesta.getTitle().indexOf('(') < 0);
    }
    
    toTemplate['fecha'] = results[0].getStartTime().toLocaleDateString('es-ES');
    toTemplate['nombre'] = results[0].getTitle();
    
    template['data'] = toTemplate;  

  }

  telegramApi.sendMessage(msg, template.evaluate().getContent(), replyTo=true);
 
}

/**
 * Sends a message with a list of the next national
 * or local holidays in Spain. A filter parameter can come with the message to get a local
 * holiday.
 *
 * @param {object} msg Telegram API message resource object
 * @param {string} filter Filter applied to search for local holidays
 *
 */
function getNextFiestas(msg, filter=undefined) {
  
  let today = new Date();
  
  let lastYearDay = new Date(today.getFullYear(), 11, 31);
  
  let fiestas = CalendarApp.getCalendarById(fiestasCalendar).getEvents(today, lastYearDay);
  
  let template = HtmlService.createTemplateFromFile('fiestas/views/fiestasTemplate');
  
  let toTemplate = {};
  
  if(!filter) {
    template['data'] = fiestas;
    
  } else {
    if(filter.toLowerCase() === 'nacionales') {
      var results = fiestas.filter(fiesta => fiesta.getTitle().indexOf('(') < 0);
    } else {
      var results = fiestas.filter(fiesta => fiesta.getTitle().toLowerCase().indexOf(filter.toLowerCase()) > -1 || fiesta.getTitle().indexOf('(') < 0);
    }
    
    template['data'] = results;  

  }

  telegramApi.sendMessage(msg, template.evaluate().getContent(), replyTo=true);
 
}
