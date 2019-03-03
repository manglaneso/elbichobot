var opleFolderId = '<folder ID>';

function getOpleChatSpreadsheet(chatId) {
  var opleFolder = DriveApp.getFolderById(opleFolderId);
  var opleFile = opleFolder.getFilesByName(chatId);
  if(opleFile.hasNext()) {
    return SpreadsheetApp.open(opleFile.next());
  } else {
    return null;
  }
}

function ople(msg, username) {
  
  var ss = getOpleChatSpreadsheet(msg.chat.id);
  
  if(ss !== null) {
    // ya ha habido oples en esta conversación
    
    var lastRange = ss.getSheets()[1].getRange('A1');
    
    var lastValue = lastRange.getValue();
    var lastDate = new Date(lastValue);
    
    var today = new Date();
    
    if(!(lastDate.getDay() == today.getDay() && lastDate.getMonth() == today.getMonth() && lastDate.getFullYear() == today.getFullYear())) {
      // hay ople
      lastRange.setValue(today);
      increaseUserRank(username, ss);
      sendMessage(msg, 'El tontopolla de @' + username + ' ha hecho la ople');
    }  

  } else {
    // no ha habido oples -> luego se ha hecho ople
    ss = SpreadsheetApp.create(msg.chat.id, 1, 2);
    
    moveFileToAnotherFolder(ss.getId(), opleFolderId);
    
    var lastSheet = ss.insertSheet(1);
    lastSheet.deleteColumns(2, lastSheet.getMaxColumns()-1);
    lastSheet.deleteRows(2, lastSheet.getMaxRows()-1);
    
    var lastRange = lastSheet.getRange('A1');
    
    var lastValue = lastRange.getValue();
    var lastDate = new Date(lastValue);
    
    var today = new Date();
    
    lastRange.setValue(today);  
    increaseUserRank(username, ss);
    
    sendMessage(msg, 'El tontopolla de @' + username + ' ha hecho la ople');
    
  }
}
