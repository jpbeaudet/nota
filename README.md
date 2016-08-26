# nota
Take your note hands-free

## Features:
* Download in:
  * Pdf files
  * Txt files
* Send with:
  * email (to yourself until google+integration)

## Dependencies:
* Install the package.json `npm install`
  * express:3.3.4
  * jade: 0.34.1
  * passport: 0.1.18
  * passport-local: 0.1.6
  * mongoose: 3.8.5
  * passport-local-mongoose": 0.2.5 
  * mocha: 1.14.0
  * chai: 1.8.1
  * should: 2.1.0
  * install: 0.1.7
  * npm: 1.3.25
  * mongodb:1.3.23
  * socket.io
  * formidable

## Installation:
1. Download zip and extract in the wanted directory
2. Change port to 8080 or localhost in app.js (Until a config file is made)
  * Change port accordingly in all socket.io call (Until config file is made client side)
  1. Speech.js
  2. Control.js
  3. data.js 
3. Start mongodb in a screen `./mongod`
4. Run in home directory of the project `node app.js`

## TODO :
* Things to add and/or change
  * Add congig file on server side
  * Add config file on client-side
  * Add facebook,twitter,google+ integration (auth and api for contacts and share and tweets)
  * Add better UX
