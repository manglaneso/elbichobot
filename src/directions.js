/**
 * Handler of the encontrar inline query. Returns a list of possible locations
 + as a Telegram API inline query answer.
 *
 * @param {object} inlineQuery Inline Query object received in Telegram API update
 *
 */
function handleInlineLocation(inlineQuery) {
  let address =  replaceString('encontrar ', '', inlineQuery['query']);
  
  let answers = [];
  
  let geocoder = Maps.newGeocoder();
  
  let response = geocoder.geocode(address);
    
  for(let i in response['results']) {
    
    let answer = {};
    
    answer['type'] = 'location';
    answer['id'] = String(i);
    answer['title'] = response['results'][i]['formatted_address'];
    answer['latitude'] = response['results'][i]['geometry']['location']['lat'];
    
    answer['longitude'] = response['results'][i]['geometry']['location']['lng'];
    
    answers.push(answer);
  }

  telegramApi.answerInlineQuery(inlineQuery, answers, cacheTime=300);
  
}