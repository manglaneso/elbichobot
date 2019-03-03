var fialFolderId = '<folder ID>';

function getFialChatSpreadsheet(chatId) {
  var fialFolder = DriveApp.getFolderById(fialFolderId);
  var fialFile = fialFolder.getFilesByName(chatId);
  if(fialFile.hasNext()) {
    return SpreadsheetApp.open(fialFile.next());
  } else {
    return null;
  }
}

function fial(msg, username) {
  
  var ss = getFialChatSpreadsheet(msg.chat.id);
  
  if(ss !== null) {
    // ya ha habido fials en esta conversación
    
    var lastRange = ss.getSheets()[1].getRange('A1');
    
    var lastValue = lastRange.getValue();
    var lastDate = new Date(lastValue);
    
    var today = new Date();
    
    if(!(lastDate.getDay() == today.getDay() && lastDate.getMonth() == today.getMonth() && lastDate.getFullYear() == today.getFullYear())) {
      // hay fial
      lastRange.setValue(today);
      increaseUserRank(username, ss);
      sendMessage(msg, 'El usuario @' + username + ' fialeó');
    }  

  } else {
    // no ha habido fials -> luego se ha hecho fial
    ss = SpreadsheetApp.create(msg.chat.id, 1, 2);
    
    moveFileToAnotherFolder(ss.getId(), fialFolderId);
    
    var lastSheet = ss.insertSheet(1);
    lastSheet.deleteColumns(2, lastSheet.getMaxColumns()-1);
    lastSheet.deleteRows(2, lastSheet.getMaxRows()-1);
    
    var lastRange = lastSheet.getRange('A1');
    
    var lastValue = lastRange.getValue();
    var lastDate = new Date(lastValue);
    
    var today = new Date();
    
    lastRange.setValue(today);  
    increaseUserRank(username, ss);
    
    sendMessage(msg, 'El usuario @' + username + ' fialeó');
    
  }
}
