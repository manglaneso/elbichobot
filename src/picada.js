const nextLevelPicadaId = '1jRQ67lweIFSABvQKhso5jAG8yg6X6_cm';
const oskarHazAlgoId = '1685y6LdJD1p5yrLMYdxdev9qinkdDBvn';

const oskarUserId = '4652358';
const chatId = '-1001426910007';
// const oskarUserId = '1370410';
// const chatId = '-386989064';

const minionFloydMetadata = {
  'fromMessageId': '521538',
  'fromChatId': '1370410'
}

const minionFloydVideoId = '1MZUfL1wjS_6MMqKoGovVWLYtt3LqmX1C';

/*
const messagesToForward = [
  {
    "fromMessageId": 521636,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521637,
    "fromChatId": 1370410
  }, {
    "fromMessageId": 521638,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521639,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521640,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521641,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521642,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521643,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521644,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521645,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521646,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521647,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521648,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521649,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521650,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521651,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521652,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521653,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521654,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521655,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521656,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521657,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521658,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521659,
    "fromChatId": 1370410
  },
  {
    "fromMessageId": 521660,
    "fromChatId": 1370410
  }
]*/

const messagesToForward = [
  "Listo",
  "A mamar",
  "solo mamar",
  "asiq a mamar",
  "Listos para mamar",
  "TE SALE A MAMAR",
  "asi que puedes proceder a mamar bien fuerte",
  "A MAMAR",
  "bueno",
  "pues a mamar",
  "bro vaya que si vas a mamar bien",
  "Y tu a mamar",
  "asiq a mamar",
  "vaya dia llevas",
  "a mamar polla de perro sanxe a tu casa",
  "A mamarrrr",
  "a mamar",
  "A mamar oscar",
  "TITUUUUUUUUUUUUUUUUUUUU",
  "https://twitter.com/loloutlaw/status/1471794652244287491?t=fZSJjeWEhPHTX0W-zuJUUg&s=09",
  "https://twitter.com/loloutlaw/status/1471503338243969031?t=lCH8MJkgU7aPNbE_tQo1tw&s=09",
  "pues 5 y a dormir",
  "enga tira",
  "que voy con el barsa e"
]


function anuncioGanador(msg, globalRank) {
  let today = new Date();
  let winner = globalRank[0];
  if (winner[0] == 'Rober_6') {
    winner[0] == 'ARROZBERTO';
  }
  telegramApi.sendMessage(msg, `El ganador de la temporada ${today.getFullYear()} es...`);
  Utilities.sleep(1000);
  telegramApi.sendMessage(msg, `${winner[0]} con un total de ${winner[1]} puntos!`);
}

function a() {
  msg = {'chat':{'id': '-23232799'}}
  telegramApi.forwardMessage(minionFloydMetadata['fromMessageId'], minionFloydMetadata['fromChatId'], msg['chat']['id']);
}

function sendMinionFloyds(msg = {'chat':{'id': '-23232799'}}) {
  for (let i = 0; i < 4; i++) {
    // telegramApi.forwardMessage(minionFloydMetadata['fromMessageId'], minionFloydMetadata['fromChatId'], msg['chat']['id']);
    let file = DriveApp.getFileById(minionFloydVideoId);
    telegramApi.sendAnimation(msg, file, replyTo=false)
    Utilities.sleep(100);
  }
}

function forwardMessages(msg = {'chat':{'id': '-23232799'}}) {
  for (let message in messagesToForward) {
    //let m = messagesToForward[message]
    //telegramApi.forwardMessage(m['fromMessageId'], m['fromChatId'], msg['chat']['id']);
    try {
      telegramApi.sendMessage(msg, messagesToForward[message]);
      Utilities.sleep(1000);
    } catch(e) {
      Utilities.sleep(1000);
      try {
        telegramApi.sendMessage(msg, messagesToForward[message]);
      } catch(e) {
        Utilities.sleep(1000);
      }
    }    
  }
}

function picada(msg = {'chat':{'id': '-23232799'}}, globalRank) {
  let loser = globalRank[1];
  Utilities.sleep(3000);
  telegramApi.sendMessage(msg, `Qué, @${loser[0]}, a chuparla o qué, payaso`);
  sendMinionFloyds(msg);
  forwardMessages(msg);
  ScriptApp.newTrigger("cronPicada").timeBased().everyMinutes(1).create();
}

function manageCache(msg) {
  if (String(msg['from']['id']) == oskarUserId && String(msg['chat']['id']) == chatId) {
    cache.put('found', 'true', 70);
  }
}

function cronPicada(e) {
  let today = new Date();

  if (today.getDate() === 1 && today.getMonth() === 0 && today.getFullYear() === 2022) {
    if (!cache.get('found')) {
      
      let msg = {'chat':{'id': chatId}};
      let tries = cache.get('tries')

      if (!tries) {
        tries =  '1';
        cache.put('tries', tries);
      }

      let numberTries = Number(tries)

      var caption = null

      if (numberTries <= 3) {
        var file = DriveApp.getFileById(oskarHazAlgoId);
      } else if ( numberTries == 4) {
        telegramApi.sendMessage(msg, `En fin, ya sabemos lo que hay...`);
        var file = DriveApp.getFileById(nextLevelPicadaId);
        caption = 'Menudo año llevas... @JoseMourinho'
      } else {
        let triggers = ScriptApp.getProjectTriggers();
        for (let i = 0; i < triggers.length; i++) {
          if (triggers[i].getHandlerFunction() == 'cronPicada') {
            ScriptApp.deleteTrigger(triggers[i]);
          }
        }
      }

      cache.put('tries', String(numberTries + 1))

      
      telegramApi.sendPhoto(msg, file, caption = caption);
    }
  }
}

function delet() {
  cache.remove('tries');
  scriptProperties.deleteProperty('picadaDone');
}



















