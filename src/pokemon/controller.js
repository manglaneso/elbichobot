/* 
* Adapted from:
* https://chatbotslife.com/introduction-to-the-telegram-bot-api-part-3-d09495fe387d
* https://github.com/yi-jiayu/rotom-pokedex-bot
*/

const wikidexBaseUrl = 'https://www.wikidex.net/wiki/';
const pokedexBaseUrl = 'https://www.pokemon.com';

// Capitalize first letter in a word
const capitalise = word => word.charAt(0).toUpperCase() + word.slice(1);

// Creates pokemon's types string as type1/type2
const format_type = pokemon => pokemon.type.map(capitalise).join("/");

// Check if searched pokemon exists on JSON DB
const match = (pokemon, id_or_name) => pokemon['id'] === id_or_name || pokemon['slug'].includes(id_or_name.toLowerCase());


/**
 * Handler of the /pokedex command. Sends a message with data regarding the Pokemon introduced.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function handlePokedex(msg) {
  let pokemon =  replaceString('/pokedex ', '', msg['text']);
  
  getPokedex(msg, pokemon);
}

/**
 * Orders an object by value
 *
 * @param {object} obj Object to be ordered
 *
 * @return {object} Ordered object
 *
 */
const sort_object_by_value = (obj) => {
    let sorted_obj = {};
    Object
        .keys(obj)
        .sort((a, b) => {
            if (obj[b] - obj[a] === 0) {
                return a < b ? -1 : a > b ? 1 : 0;
            }
            return obj[b] - obj[a];
        })
        .map(key => sorted_obj[key] = obj[key]);
    return sorted_obj;
};

/**
 * Format pokemon's types advantages
 *
 * @param {object} obj Pokemon's types object
 *
 * @return {array} Array of relations types
 *
 */
const format_type_advantage = (obj) => { 
    let str = "";
    let immune_str = "";
    let resistant_str = "";
    const sorted_obj = sort_object_by_value(obj);
    Object.keys(sorted_obj).map(item => {
        if (sorted_obj[item] === 0){
            immune_str += `${capitalise(item)} (${sorted_obj[item]}x), `;
        } else if (sorted_obj[item] < 1) { 
            resistant_str += `${capitalise(item)} (${sorted_obj[item]}x), `;
        } else if (sorted_obj[item] !== 1) {
            str += `${capitalise(item)} (${sorted_obj[item]}x), `;
        }
    });
    return [str.substring(0, str.length-2), resistant_str.substring(0, resistant_str.length-2), immune_str.substring(0, immune_str.length-2)];
};

/**
 * Format pokemon's types
 *
 * @param {object} pokemon_types Object of all Pokemon types and relations
 * @param {object} types Types of a specific Pokemon
 *
 * @return {object} Object containing the selected pokemon type relations
 *
 */
const format_against_types = (pokemon_types, types) => {
    let types_object = {};
    for (const type of pokemon_types) {
        let defense_object = types[type]["defense"];
        Object.keys(defense_object).map(type_item => {
            if (type_item in types_object) {
                types_object[type_item] *= defense_object[type_item];
            } else {
                types_object[type_item] = defense_object[type_item];
            }
        });
    }

    const result = format_type_advantage(types_object);

    return {
        'formated_weak_string': `${result[0]}`,
        'formated_resistant_string': result[1] !== "" ? `${result[1]}` : "",
        'formated_inmune_string': result[2] !== "" ? `${result[2]}` : ""
    };
};

/**
 * Load list of existing Pokemons in memory
 *
 * @return {object} JSON object containing all existing Pokemons
 *
 */
function loadPokedexJson() {
  let jsonFile = DriveApp.getFileById(scriptProperties.getProperty('PokedexJsonId'));
  
  let jsonBlob = jsonFile.getBlob();
  
  return JSON.parse(jsonBlob.getDataAsString());
  
}

/**
 * Load list of existing Pokemon types in memory
 *
 * @return {object} JSON object containing all existing Pokemon types
 *
 */
function loadTypes() {
  let jsonFile = DriveApp.getFileById(scriptProperties.getProperty('PokemonTypesConfigId'));
  
  let jsonBlob = jsonFile.getBlob();
  
  return JSON.parse(jsonBlob.getDataAsString());
  
}

/**
 * Sends a message with data regarding the Pokemon introduced.
 *
 * @param {object} msg Telegram API message resource object
 *
 */
function getPokedex(msg, pokemon) {
  
  const pokedex = loadPokedexJson();
  const types = loadTypes();
  
  const get_pokemon = id_or_name => pokedex.find(p => match(p, id_or_name));  
  
  let pokemonResource = get_pokemon(pokemon);
  
  if(pokemonResource) {
    
    let against_types = format_against_types(pokemonResource['type'], types);
    let toTemplate = {
      'name': pokemonResource['name'],
      'weight': String(pokemonResource['weight']),
      'height': String(pokemonResource['height']),
      'types': format_type(pokemonResource),
      'weaknesses': against_types['formated_weak_string'],
      'resistant': against_types['formated_resistant_string'],
      'inmune': against_types['formated_inmune_string'],
      'number': pokemonResource['number'],
      'pokedexUrl': pokedexBaseUrl + pokemonResource['detailPageURL'],
      'wikiDexUrl': wikidexBaseUrl + pokemonResource['name']
    };
    
    let template = HtmlService.createTemplateFromFile('pokemon/views/pokedexEntry');
    template['data'] = toTemplate;
    
    let caption = template.evaluate().getContent();

    telegramApi.sendPhoto(msg, UrlFetchApp.fetch(pokemonResource['ThumbnailImage']), replyTo=true, caption=caption);
    
  } else {
    telegramApi.sendMessage(msg, 'No se ha encontrado el Pokemon :(', replyTo=true);
  }
  
}

