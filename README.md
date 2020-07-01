# elbichobot

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

![deploy](https://github.com/manglaneso/elbichobot/workflows/deploy/badge.svg)

Telegram bot deployed on [Google Apps Script](https://developers.google.com/apps-script).

You can talk to the default implementation clicking on the [following link](https://t.me/elbichobot).

---
**NOTE**

The default implementation (and all the bot for now) works in Spanish.

---


### Bot Commands

#### Regular commands

| Name | Description | Usage |
| --- | --- | --- |
| echo | Echo your message! | /echo@elbichobot [Text] |
| dicks | Get a variable lenght **text based** dick! | /dicks@elbichobot |
| translate | Translate a text | /translate@elbichobot [text],[input language],[output language]. (In reply to message) /translate@elbichobot[input language],[output language] |
| get languages | Get list with languages codes for translate command | /getLanguages@elbichobot |
| weather | Get the current weather in a place | /weather@elbichobot [place] |
| convert currency | Convert a quantity from one currency to another | /convertCurrency@elbichobot [quantity] [from currency] [to currency] |
| get currencies | Get list with currency codes for convert currency command | /getCurrencies@elbichobot |
| calculator | Compute mathematical expressions | /calc@elbichobot [expression] |
| tiempo EMT | Get time remaining for Madrid's buses to get to a stop | /tiempoEMT@elbichobot [stop number] |
| stock prices | GRegularet stock market prices for a company. You can get data for the last day or the latest value | /stockPrice@elbichobot [hoy/ultima] [company code] |
| pokedex | Get info about a Pokemon | /pokedex@elbichobot [pokemon] |
| click | Russian roulette. You have 1/6 of possibilites of dying | /click@elbichobot |
| proxima fiesta | Get the next holiday in Spain. A filter of a local region can be specified to get the next local holiday. | /proximaFiesta@elbichobot [filter] |
| kitten | Get a random kitten. | /gatete@elbichobot |
| puppy | Get a random puppy. | /perrete@elbichobot |
| kitten subscription | Subscribe the current chat to get a daily kitten. | /dameGatetes@elbichobot |
| puppy subscription | Subscribe the current chat to get a daily puppy. | /damePerretes@elbichobot |
| kitten unsubscription | Unsubscribe the current chat from the kitten service. | /bastaDeGatetes@elbichobot |
| puppy unsubscription | Subscribe the current chat from the puppy service. | /bastaDePerretes@elbichobot |
| help| Send the bot help to the chat | /help@elbichobot |

#### Inline commands

| Name | Description | Usage |
| --- | --- | --- |
| search company | Get list with company codes for stock prices command | @elbichobot searchCompany [company name] |
| find place | Look for a place on Google Maps | @elbichobot encontrar [place name] |
| search video | Look for info about a TV show or a movie | @elbichobot searchVideo [tv show/movie name] |

#### Other functionalities

| Name | Description | Usage |
| --- | --- | --- |
| pole | Write the first/second/third/fourth text of a day in a chat | Pole (for first message) Subpole (for second message) Bronce (for third message) Cobre (for fourth message) |
| polerank | Get the pole ranking for the current chat | /polerank@elbichobot |

### TODO

- Configure language
- Configure enabled/disabled plugins
- New plugins (?)

