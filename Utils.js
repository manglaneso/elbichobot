// Replaces oldS with newS in the string fullS
function replaceString(oldS, newS, fullS) {
  for (var i = 0; i < fullS.length; ++i) {
    if (fullS.substring(i, i + oldS.length) == oldS) {
      fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length);
    }
  }
  return fullS;
}

// Move file in Google Drive to a folder
function moveFileToAnotherFolder(fileID, targetFolderID) {

  var file = DriveApp.getFileById(fileID);
  
  // Remove the file from all parent folders
  var parents = file.getParents();
  while (parents.hasNext()) {
    var parent = parents.next();
    parent.removeFile(file);
  }

  DriveApp.getFolderById(targetFolderID).addFile(file);
  
}

function compare(a, b) {
  const first = a[1];
  const second = b[1];
  
  var comparison = 0;
  if (first < second) {
    comparison = 1;
  } else if (first > second) {
    comparison = -1;
  }
  return comparison;
}

// Format UNIX timestamo to human readable format
function formatHours(unix_timestamp) {
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var hours = '0' + date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Will display time in 10:30:23 format
  return hours.substr(-2) + ':' + minutes.substr(-2);
}

// Truncate floating point number to 2 decimals
function precise(x) {
  return parseFloat(x).toPrecision(3);
}