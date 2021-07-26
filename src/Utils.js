/**
 * Replaces a substring with another in a string
 *
 * @param {string} oldS String to be replaced
 * @param {string} newS String to replace with
 * @param {string} fullS Result string
 *
 * @return {string} String replaced
 */
function replaceString(oldS, newS, fullS) {
  for (let i = 0; i < fullS.length; ++i) {
    if (fullS.substring(i, i + oldS.length) === oldS) {
      fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length);
    }
  }
  return fullS;
}

/**
 * Moves a Google Drive File from a folder to another
 *
 * @param {string} fileID ID of the file to be moved
 * @param {string} trgetFolderID ID of the folder to move the file to
 * @param {string} fullS Result string
 *
 */
function moveFileToAnotherFolder(fileID, targetFolderID) {

  let file = DriveApp.getFileById(fileID);
  
  // Remove the file from all parent folders
  let parents = file.getParents();
  while (parents.hasNext()) {
    let parent = parents.next();
    parent.removeFile(file);
  }

  DriveApp.getFolderById(targetFolderID).addFile(file);
  
}

/**
 * Gets a random integer between 2 boundaries
 *
 * @param {number} min Lower (included) boundary
 * @param {number} max Upper (excluded) boundary
 *
 * @return {number} Random integer
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

/**
 * Function to pass array.sort to compare arrays in the form of [[,],[,]]
 *
 * @param {array} a Element of the array
 * @param {array} b Element of the array
 *
 * @return {number} 1 if the [1] component of the first element is smaller than the one on
 * the second. -1 otherwise
 */
function compare(a, b) {
  const first = a[1];
  const second = b[1];
  
  let comparison = 0;
  if (first < second) {
    comparison = 1;
  } else if (first > second) {
    comparison = -1;
  }
  return comparison;
}

/**
 * Function to pass array.sort to compare arrays in the form of [[,,],[,,]]
 *
 * @param {array} a Element of the array
 * @param {array} b Element of the array
 *
 * @return {number} 1 if the [2] component of the first element is smaller than the one on
 * the second. -1 otherwise
 */
function comparePolerank(a, b) {
  const first = a[2];
  const second = b[2];
  
  let comparison = 0;
  if (first < second) {
    comparison = 1;
  } else if (first > second) {
    comparison = -1;
  }
  return comparison;
}

/**
 * Format date in HH:MM:SS fashion
 *
 * @param {number} unixTimestamp Unix Timestamp representing the Hour to be formatted
 *
 * @return {string} Hour represented in HH:MM:SS format 
 */
function formatHours(unixTimestamp) {
  let date = new Date(unixTimestamp * 1000);
  // Hours part from the timestamp
  let hours = '0' + date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Will display time in 10:30:23 format
  return hours.substr(-2) + ':' + minutes.substr(-2);
}

/**
 * Get date formatted in ISO format
 *
 * @param {date} date Date to be formatted
 *
 * @return {string} Date represented in ISO format 
 */
function getIsoDate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Format a float number to 3 decimals
 *
 * @param {float} x Float number to be formatted
 *
 * @return {float} Formatted float to 3 decimals 
 */
function precise(x) {
  return parseFloat(x).toPrecision(3);
}

/**
 * Checks if a date is today
 *
 * @param {string} dateString Date string representing the date to check
 *
 * @return {boolean} True if the dateString is today, False otherwise
 */
function isToday(dateString) {
  
  let today = new Date();
  let toCheck = new Date(dateString);
  
  return toCheck.getDate() === today.getDate() && toCheck.getMonth() === today.getMonth() && toCheck.getFullYear() === today.getFullYear();

}

/**
 * Checks if a date is older than today
 *
 * @param {number} unixTimestamp Unix Timestamp representing the to check
 *
 * @return {boolean} True if the unixTimestamp is older than today, False otherwise
 */
function dateIsOlder(unixTimestamp) {
  let todayTimestamp = new Date().getTime();
  return todayTimestamp > unixTimestamp;
}

function getScriptProperties() {
  Logger.log(JSON.stringify(scriptProperties.getProperties()));
}

function setProperties() {
  const properties = {};
  scriptProperties.setProperties(properties);
}

function logChatId(chatId) {
  let logsArray = JSON.parse(scriptProperties.getProperty('logs'));

  if(logsArray.indexOf(chatId) < 0) {
    logsArray.push(chatId);
    scriptProperties.setProperty('logs', JSON.stringify(logsArray));
  }
}
