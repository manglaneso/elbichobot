var cobreFolderId = '<folder ID>';

function increaseUserRank(username, ss) {
  var sheet = ss.getSheets()[0];
  var data = sheet.getRange('A1:B').getValues();
  
  var count = 1;
  var found = false;
  data.forEach(function(item) {
    if(item[0] == username) {
      sheet.getRange(count, 2).setValue(item[1]+1);
      found = true;
    }
    count++;
  });
  
  if(!found) {
    sheet.appendRow([username, 1]);
  }
}

function getChatSpreadsheet(chatId) {
  var cobreFolder = DriveApp.getFolderById(cobreFolderId);
  var cobreFile = cobreFolder.getFilesByName(chatId);
  if(cobreFile.hasNext()) {
    return SpreadsheetApp.open(cobreFile.next());
  } else {
    return null;
  }
}

function cobre(msg, username) {
  
  var ss = getChatSpreadsheet(msg.chat.id);
  
  if(ss !== null) {
    // ya ha habido cobres en esta conversación
    
    var lastRange = ss.getSheets()[1].getRange('A1');
    
    var lastValue = lastRange.getValue();
    var lastDate = new Date(lastValue);
    
    var today = new Date();
    
    if(!(lastDate.getDay() == today.getDay() && lastDate.getMonth() == today.getMonth() && lastDate.getFullYear() == today.getFullYear())) {
      // hay cobre
      lastRange.setValue(today);
      increaseUserRank(username, ss);
      sendMessage(msg, 'El lokoprimo @' + username + ' ha robao el cobre');
    }  

  } else {
    // no ha habido cobres -> luego se ha hecho cobre
    ss = SpreadsheetApp.create(msg.chat.id, 1, 2);
    
    moveFileToAnotherFolder(ss.getId(), cobreFolderId);
    
    var lastSheet = ss.insertSheet(1);
    lastSheet.deleteColumns(2, lastSheet.getMaxColumns()-1);
    lastSheet.deleteRows(2, lastSheet.getMaxRows()-1);
    
    var lastRange = lastSheet.getRange('A1');
    
    var lastValue = lastRange.getValue();
    var lastDate = new Date(lastValue);
    
    var today = new Date();
    
    lastRange.setValue(today);  
    increaseUserRank(username, ss);
    
    sendMessage(msg, 'El lokoprimo @' + username + ' ha robao el cobre');
    
  }
}
