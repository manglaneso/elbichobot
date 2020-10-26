const messirveFileId = '1oREpxLss0qhE_1tZ9lzll_A-amAqdN7O';
const noMessirveFileId = '1kL9k4mNzYUa02oWvo71J28ed0nDMVXb5';

function sendMessirve(msg) {
  let file = DriveApp.getFileById(messirveFileId);
  sendAnimation(msg, file, replyTo=false)
}

function sendNoMessirve(msg) {
  let file = DriveApp.getFileById(noMessirveFileId);
  sendAnimation(msg, file, replyTo=false)
}

