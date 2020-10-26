let scriptProperties = PropertiesService.getScriptProperties();

let poleConfig = JSON.parse(scriptProperties.getProperty('PoleConfig'));

/**
 * Enpoint suscribed as webhook in Telegram API which receives notifications once a message
 * is sent to the bot
 *
 * @param {object} request HTTP Request object received.
 */
function doPost(request) {
  if(checkTelegramAuth(request)) {
     let update = JSON.parse(request['postData']['contents']);
  
    // Make sure this is update is a type message
    if (update.hasOwnProperty('message')) {
      let msg = update['message'];
      // console.info(JSON.stringify(msg));
      console.info(String(msg['chat']['id']));
      
      // Process text messages and images with captions
      if(msg['text']) {  
        
        // Check if there is a better way to do this
        if(msg['text'].indexOf(scriptProperties.getProperty('BotUsername')) > -1) {
          msg['text'] = replaceString(scriptProperties.getProperty('BotUsername'), '', msg['text']);
        }
        
        // Process text messages
        if(msg['text'].indexOf('/echo ') > -1) {
          echo(msg);
        } else if(msg['text'] == '/putosYayos' || msg['text'].toUpperCase().indexOf('PUTOS YAYOS') > -1 || msg['text'].toUpperCase() == 'PUTOS YAYOS') {
          sendPutosYayos(msg);
        } else if(msg['text'].toUpperCase() == 'HOLA') {
          sendMessage(msg, 'Soy Vicente del Bosque.', replyTo=true);
        } else if(msg['text'].toUpperCase() == 'HOLI') {
          sendMessage(msg, 'Siy Vicinti dil Bisqui', replyTo=true);
        } else if(msg['text'].indexOf('/translate') > -1 ) {
          handleTranslate(msg);
        } else if(msg['text'] == '/getLanguages') {
          getLanguages(msg);
        } else if(msg['text'] == '/help') {
          sendHelp(msg);
        } else if(msg['text'].indexOf('/weather') > -1) {
          getCurrentWeather(msg);
        } else if(msg['text'].indexOf('/convertCurrency') > -1) {
          convertCurrency(msg);
        } else if(msg['text'] == '/getCurrencies') {
          getCurrecyCodes(msg);
        } else if(msg['text'].toUpperCase().indexOf('/CALC') > -1) {
          mathjs(msg);
        } else if(msg['text'].indexOf('/tiempoEMT') > -1) {
          getStopTimes(msg);
        } else if(msg['text'] == '/gatete') {
          getGatete(msg);
        } else if(msg['text'] == '/perrete') {
          getPerrete(msg);
        } else if(msg.text == '/dameGatetes') {
          subscribeToGatetes(msg);
        } else if(msg.text == '/bastaDeGatetes') {
          unsubscribeFromGatetes(msg);
        } else if(msg.text == '/damePerretes') {
          subscribeToPerretes(msg);
        } else if(msg.text == '/bastaDePerretes') {
          unsubscribeFromPerretes(msg);
        } else if(msg['text'].indexOf('/stockPrice') > -1) {
          handleStockPrice(msg);
        } else if(msg['text'].indexOf('/proximaFiesta') > -1) {
          handleProximaFiesta(msg);
        } else if(msg['text'].indexOf('/proximasFiestas') > -1) {
          handleProximasFiestas(msg);
        } else if(msg['text'] == '/click') {
          handleClick(msg);
        } else if(msg['text'].indexOf('/pokedex') > -1) {
          handlePokedex(msg);
        } else if(msg.text.toUpperCase() == 'QUE' || msg.text.toUpperCase() == 'QUÉ' || msg.text.toUpperCase() == 'QUE?'
                || msg.text.toUpperCase() == 'QUÉ?' || msg.text == '¿QUE?' || msg.text == '¿QUÉ?') {
          sendMessage(msg, 'Cacahué', replyTo=true);
        } else if(msg['text'] == '/chatInfo') {
          getChatId(msg);
        } else if(msg['text'].toUpperCase().indexOf(' MESSIRVE ') > -1 || msg['text'].toUpperCase().indexOf('MESSIRVE ') > -1 || msg['text'].toUpperCase().indexOf(' MESSIRVE') > -1 || msg['text'].toUpperCase() == 'MESSIRVE') {
          sendMessirve(msg);
        } else if(msg['text'].toUpperCase().indexOf(' NOMESSIRVE ') > -1 || msg['text'].toUpperCase().indexOf('NOMESSIRVE ') > -1 || msg['text'].toUpperCase().indexOf(' NOMESSIRVE') > -1 || msg['text'].toUpperCase() == 'NOMESSIRVE') {
          sendNoMessirve(msg);
        }
         
        // Process messages specific for groups and supergroups
        if(msg.chat.type == 'group' || msg.chat.type == 'supergroup') {
          let lowerCaseTextMessage = msg['text'].toLowerCase();
          if(poleConfig['names'].indexOf(lowerCaseTextMessage) > -1) {
            msg['text'] = lowerCaseTextMessage;
            handlePole(msg);
          } else if(msg['text'] == '/polerank') {
            polerank(msg);
          } else if(msg['text'] == '/resetPolerank') {
            resetPolerank(msg);
          }
        }
      
      // Process images with captions
      } else if(msg['caption']) {
        
      }
      
    // Process inline queries sent to the bot
    } else if (update.hasOwnProperty('inline_query')) {
      let inlineQuery = update['inline_query'];
      
      console.info(JSON.stringify(inlineQuery));
      
      let query = inlineQuery['query'];
      
      let commands = query.split(' ');
      
      let command = commands[0];
      
      if(command == 'searchCompany') {
        handleStockPriceInlineQuery(inlineQuery, commands)
      } else if(command == 'encontrar') {
        handleInlineLocation(inlineQuery);
      } else if(command == 'searchVideo') {
        handleSearchVideo(inlineQuery);
      }
    }
  
  }
  
  return 1;

}