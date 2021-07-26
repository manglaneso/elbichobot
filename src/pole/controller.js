/**
 * Handler of the pole command. Sends a message if a user does the pole in a chat, depending on the current configuration
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function handlePole(msg) {
  // Get a script lock, because we're about to modify a shared resource.
  let lock = LockService.getScriptLock();
  // Wait for up to 30 seconds for other processes to finish.
  lock.waitLock(30000);
  
  let poleConfig = JSON.parse(scriptProperties.getProperty('PoleConfig'));
  
  if(!checkIfExcludedChat(msg, poleConfig)) {
    let ss = getChatSpreadsheet(String(msg['chat']['id']));  
  
    if(ss == null) {
      // No ha habido poles en esta conversación
      ss = initChatPoleSpreadsheet(msg['chat']['id']);
    }
    
    let poleConfigSheet = ss.getSheetByName('CONFIG');
    let poleConfigRange = poleConfigSheet.getRange(1, 1);
    let poleConfigValues = JSON.parse(poleConfigRange.getValue());
    
    let commandPriority = poleConfig['names'].indexOf(msg.text);
    
    let today = new Date();
    
    let lastDate = new Date(poleConfigValues[msg['text']]['lastDate']);
    
    let username = getBestUsername(msg['from']);
    
    if(commandPriority === 0) {
      // Es la pole, vamos a ver si la de hoy ya se ha hecho
      
      if(!isToday(poleConfigValues[msg['text']]['lastDate'])) {
        // hay pole
        
        // TODO: Place this logic into a function
        
        let poleConfigConfiguration = poleConfig['configuration'][msg['text']];
        
        poleConfigValues[msg['text']]['lastDate'] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        poleConfigValues[msg['text']]['lastPoleador'] = msg['from']['id'];
        
        poleConfigRange.setValue(JSON.stringify(poleConfigValues));
        
        increaseUserRank(msg['from'], username, msg['text'], ss);
        telegramApi.sendMessage(msg, `El ${poleConfigConfiguration['message']} @${username} ha hecho ${poleConfigConfiguration['gender']} ${msg['text']}`);
      }  
    } else {
      
      if(!isToday(poleConfigValues[msg.text]['lastDate'])) {
        // No se ha hecho hoy, vamos a ver si se ha hecho la anterior
        
        let previousCommand = poleConfig['names'][commandPriority - 1];
        
        if(isToday(poleConfigValues[previousCommand]['lastDate'])) {
          // Ya se ha hecho el comando anterior, así que podemos hacer el siguiente
          if(!checkIfUserPoleo(msg['from']['id'], poleConfigValues)) {
            // No hemos hecho nosotros ninguna pole anterior, así que la podemos hacer
            let poleConfigConfiguration = poleConfig['configuration'][msg['text']];
            
            poleConfigValues[msg['text']]['lastDate'] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            poleConfigValues[msg['text']]['lastPoleador'] = msg['from']['id'];
            
            poleConfigRange.setValue(JSON.stringify(poleConfigValues));
            
            increaseUserRank(msg['from'], username, msg.text, ss);
            telegramApi.sendMessage(msg, `El ${poleConfigConfiguration['message']} @${username} ha hecho ${poleConfigConfiguration['gender']} ${msg['text']}`);
          }
        }
      }
    }
  }
  

  
  // Release the lock so that other processes can continue.
  lock.releaseLock();
  
}

function checkIfExcludedChat(msg, poleConfig) {
  return poleConfig['excludedChats'].indexOf(String(msg['chat']['id'])) > -1;
}

/**
 * Helper function to check if a user has already done the pole
 *
 * @param {string} userId ID of the user trying to do the pole
 * @param {object} poleConfigValues Current pole configuration
 *
 * @return {boolean} True if the user have done the pole, False otherwise
 *
 */
function checkIfUserPoleo(userId, poleConfigValues) {
  
  for(let i in poleConfigValues) {    
    if(poleConfigValues[i]['lastPoleador'] === userId && isToday(poleConfigValues[i]['lastDate'])) {
      return true;
    }
  }
  
  return false;
}

/**
 * Helper function to compute the global rank, multiplying the result of a user's rank by a hierarchy parameter
 *
 * @param {object} poleConfig Current pole configuration
 * @param {object} data Chat pole data
 *
 * @return {array} Computed global rank
 *
 */
function computeGlobalRank(poleConfig, data) {
  
  let numLength = poleConfig['names'].length;
  
  let globalRankObject = {};
  
  for(let sheet in poleConfig['names']) { 
    let values = data[poleConfig['names'][sheet]]['sortedValues'];
    for(let i in values) {
      if(values[i][0] !== ''){
        if(globalRankObject[values[i][0]]) {
          globalRankObject[values[i][0]][values[i][1]] += values[i][2] * numLength
        } else {
          globalRankObject[values[i][0]] = {}
          globalRankObject[values[i][0]][values[i][1]] = values[i][2] * numLength;
        }
      }
    }
    numLength -= 1; 
  }
    
  let globalRankObjectValues = Object.values(globalRankObject);
  
  let globalRank = [];
  
  for(let user in globalRankObjectValues) {
    globalRank.push(Object.entries(globalRankObjectValues[user])[0]);
  }
  
  globalRank.sort(compare);
  
  return globalRank;
  
}

/**
 * Handler of the /polerank command. Sends a message with the chat's pole data, including a computed global rank
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function polerank(msg) {
  
  if(!checkIfExcludedChat(msg, poleConfig)) {
    let poleConfig = JSON.parse(scriptProperties.getProperty('PoleConfig'));
    let ss = getChatSpreadsheet(String(msg['chat']['id']));
    if(ss) {
      let toTemplate = {};
      
      for(let sheet in poleConfig['names']) {
        toTemplate[poleConfig['names'][sheet]] = {};
        let values = ss.getSheetByName(poleConfig['names'][sheet]).getRange('A1:C').getValues();
        values.sort(comparePolerank);    
        toTemplate[poleConfig['names'][sheet]]['sortedValues'] = values;
        
      }

      toTemplate['globalRank'] = computeGlobalRank(poleConfig, toTemplate);
      
      let template = HtmlService.createTemplateFromFile('pole/views/poleTemplate');
      template['data'] = toTemplate;
      template['priority'] = poleConfig['names'];

      telegramApi.sendMessage(msg, template.evaluate().getContent(), replyTo=true);
    } else {
      telegramApi.sendMessage(msg, 'No se ha hecho nunca la Pole en este chat', replyTo=true);
    }  
  }
}

/**
 * Handler of the /resetPolerank command. Removes chat spreadsheet to reset chat.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function resetPolerank(msg) {
  if(!checkIfExcludedChat(msg, poleConfig)) {
    let ss = getChatSpreadsheet(String(msg['chat']['id']));
    
    if(ss) {
      DriveApp.getFileById(ss.getId()).setTrashed(true);

      telegramApi.sendMessage(msg, 'Hecho!', replyTo=true);
    } else {
      telegramApi.sendMessage(msg, 'Ha habido un problema reseteando el ranking de este chat', replyTo=true);
    }
  }  
}