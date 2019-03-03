function doPost(e) {
  var update = JSON.parse(e.postData.contents);
  if (update.hasOwnProperty('message')) {
    // This is a message sent to the bot in private or in a group
    var msg = update.message;
    if(msg.text) {
      // This is a text message
      
      // Check type of action to perform
      if(msg.text.indexOf('/echo ') > -1) {
        echo(msg);
      } else if(msg.text == '/dicks') {
        sendDicks(msg);
      } else if(msg.text.toUpperCase() == 'QUE' || msg.text.toUpperCase() == 'QUÉ' || msg.text.toUpperCase() == 'QUE?'
                || msg.text.toUpperCase() == 'QUÉ?' || msg.text == '¿QUE?' || msg.text == '¿QUÉ?') {
        replyToMessage(msg, 'Cacahué', msg.message_id);
      } else if(msg.text.toUpperCase() == 'HOLA') {
        replyToMessage(msg, 'Soy Vicente del Bosque.', msg.message_id)
      } else if(msg.text.toUpperCase() == 'HOLI') {
        replyToMessage(msg, 'Siy Vicinti dil Bisqui.', msg.message_id)
      } else if(msg.text.indexOf('/translate') == 0 ) {
        translate(msg);
      } else if(msg.text == '/getLanguages') {
        getLanguages(msg);
      } else if(msg.text.indexOf('/weather') > -1) {
        getCurrentWeather(msg);
      } else if(msg.text.indexOf('/convertCurrency') > -1) {
        convertCurrency(msg);
      } else if(msg.text == '/getCurrencies') {
        getCurrecyCodes(msg);
      } else if(msg.text.indexOf('/calc') > -1) {
         mathjs(msg);
      } else if(msg.text.indexOf('/tiempoEMT') > -1) {
        getStopTimes(msg);
      } else if(msg.text == '/help') {
        sendHelp(msg);
      }
      
      // If the message comes from a Group
      if(msg.chat.type == 'group') {
        if(msg.text.toUpperCase() == 'COBRE') {
          cobre(msg, msg.from.username);
        } else if(msg.text.toUpperCase() == 'OPLE') {
          ople(msg, msg.from.username);
        } else if(msg.text.toUpperCase() == 'FIAL') {
          fial(msg, msg.from.username);
        } else if(msg.text == '/cobrerank') {
          cobreRank(msg);
        }
      }
      
    } else if(msg.caption) {
      // This is a captioned image
    }
    
    
  } else if(update.hasOwnProperty('inline_query')) {
    // This is an inline query sent to the bot via its username
    var inline_query = update.inline_query;
    var query = inline_query.query;
    var queryInt = parseInt(inline_query.query);

    if(!isNaN(queryInt) && queryInt != 0) {
      var result = {};
      var input_message_content_result = {};
      result['type'] = 'article';
      result['id'] = '1';
      result['title'] = query;
      console.log(query);
      input_message_content_result['message_text'] = getInlineStopTimes(query);
      input_message_content_result['parse_mode'] = 'HTML';
      result['input_message_content'] = input_message_content_result;
      
      calculatedResults.push(result);
      
      console.log(calculatedResults);
      
      answerInlineQuery(inline_query, calculatedResults);  
    }  
  }
}
