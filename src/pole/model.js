/**
 * Creates a new Spreadsheet for the current chat to store pole data
 *
 * @param {string} chatId ID of the Telegram chat which needs a new Spreadsheet created
 *
 * @return {Spreadsheet} Newly created spreadsheet for the chat
 *
 */
function initChatPoleSpreadsheet(chatId) {

  let poleFolder = DriveApp.getFolderById(scriptProperties.getProperty('PolesFolderId'));
  
  let rootFolder = DriveApp.getRootFolder();
  
  let poleConfig = JSON.parse(scriptProperties.getProperty('PoleConfig'));
  
  let ss = SpreadsheetApp.create(chatId);
  
  var ssFile = DriveApp.getFileById(ss.getId());
  
  let poleConfigJSON = {};
  
  for(let i in poleConfig['names']) {
    
    poleConfigJSON[poleConfig['names'][i]] = {
      'priority': i,
      'lastPoleador': '',
      'lastDate': '1970-01-01'
    }
    
    let newSheet = ss.insertSheet(poleConfig['names'][i]);
    newSheet.deleteColumns(3, newSheet.getMaxColumns() - 3);
    newSheet.deleteRows(1, newSheet.getMaxRows() - 1);
  }
  
  let configSheet = ss.insertSheet('CONFIG', poleConfig['names'].length + 1);
  configSheet.deleteColumns(1, configSheet.getMaxColumns() - 1);
  configSheet.deleteRows(1, configSheet.getMaxRows() - 1);
  
  configSheet.getRange(1,1).setValue(JSON.stringify(poleConfigJSON));
  
  ss.deleteSheet(ss.getSheets()[0]);
  
  poleFolder.addFile(ssFile);
  rootFolder.removeFile(ssFile);
  
  
  return ss;  
}

/**
 * Gets the corresponding Spreadsheet for the current chat
 *
 * @param {string} chatId ID of the Telegram chat whose spreadsheet need to be returned
 *
 * @return {Spreadsheet} Spreadsheet for the chat
 *
 */
function getChatSpreadsheet(chatId) {
  var poleFolder = DriveApp.getFolderById(scriptProperties.getProperty('PolesFolderId'));
  var poleFile = poleFolder.getFilesByName(chatId);
  if(poleFile.hasNext()) {
    return SpreadsheetApp.open(poleFile.next());
  } else {
    return null;
  }
}

/**
 * Gets the best username for a Telegram user. Either his/her username, name + surname or name
 *
 * @param {object} user User Telegram object resource
 *
 * @return {string} Best username for the user
 *
 */
function getBestUsername(user) {
  if(user['username']) {
    return user['username'];
  } else {
    if(user['last_name']) {
      return `${user['first_name']} ${user['last_name']}`;
    } else {
      return user['first_name'];
    }
  }
} 

/**
 * Increase the rank for a user in a Chat Spreadsheet
 *
 * @param {object} user User Telegram object resource
 * @param {string} username Username of the user whose rank to be increased
 * @param {string} command Name of the Sheet whose ranking is to be updated
 * @param {Spreadsheet} ss Spreadsheet whose ranking is to be updated
 *
 */
function increaseUserRank(user, username, command, ss) {
    
  let sheet = ss.getSheetByName(command);
  //var data = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  let data = sheet.getRange('A1:C').getValues();
  
  let count = 1;
  let found = false;
  
  for(let i in data) {
    if(data[i][0] == user['id']) {
      data[i][1] = username;
      data[i][2] += 1;
      sheet.getRange(parseInt(i) + 1, 1, 1, 3).setValues([data[i]]);
      found = true;
    }
  }
  
  if(!found) {
    sheet.appendRow([user['id'], username, 1]);
  }
}
