// Telegram BOT API token obtained from @BotFather
var API_TOKEN = '<Your Telegram API Folder>';

// Send message through Telegram Bot API
function sendMessage(msg, message) {
  var payload = {
    'method': 'sendMessage',
    'chat_id': msg.chat.id,
    'text': message,
    'parse_mode': 'HTML'
  }

  var data = {
    "method": "post",
    "payload": payload
  }

  UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
}

// Reply to message through Telegram Bot API
function replyToMessage(msg, message, replyTo) {
  var payload = {
    'method': 'sendMessage',
    'chat_id': msg.chat.id,
    'text': message,
    'parse_mode': 'HTML',
    'reply_to_message_id': replyTo
  }

  var data = {
    "method": "post",
    "payload": payload
  }

  UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
}

// Send photo to chat through Telegram Bot API
function sendPhoto(msg, photo, msg_id) {
  var payload = {
    'method': 'sendPhoto',
    'chat_id': msg.chat.id,
    'photo': photo.getBlob()
  }
  
  if(msg_id) {
    payload['reply_to_message_id'] = msg_id;
  }

  var data = {
    "method": "post",
    "payload": payload,
    "muteHttpExceptions": true
  }

  var result = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data).getContentText());  
}

// Send animation to chat through Telegram Bot API
function sendAnimation(msg, photo, msg_id) {
  var payload = {
    'method': 'sendAnimation',
    'chat_id': msg.chat.id,
    'animation': photo.getBlob()
  }
  
  if(msg_id) {
    payload['reply_to_message_id'] = msg_id;
  }

  var data = {
    "method": "post",
    "payload": payload,
    "muteHttpExceptions": true
  }

  var result = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data).getContentText());  
}

// Send voice message to chat through Telegram Bot API
function sendVoice(msg, voice, caption) {
  
  var cap = caption || 0;
  
  var payload = {
    'method': 'sendVoice',
    'chat_id': msg.chat.id,
    'voice': voice.getBlob()
  }
  
  if(cap != 0) {
    payload.caption = cap;
  }

  var data = {
    "method": "post",
    "payload": payload,
    "muteHttpExceptions": true
  }

  var result = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data).getContentText());  
}

// Send results to InlineQuery
function answerInlineQuery(inline_query, results) {
    
  var payload = {
    'method': 'answerInlineQuery',
    'inline_query_id': inline_query.id,
    'results': JSON.stringify(results),
    'cache_time': 1
  }

  var data = {
    "method": "post",
    "payload": payload,
    "muteHttpExceptions": true
  }

  var result = JSON.parse(UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data).getContentText());  
}