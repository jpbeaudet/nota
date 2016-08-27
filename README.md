# Nota Bene V 1.0
Take your note hands-free

## Features:
* Download in:
  * Pdf files
  * Txt files
* Send with:
  * email (to yourself until google+integration)

## Dependencies:
* Must be ran in a linux instance (ubuntu) or mail function will not work
* Install node.js
* Install the package.json `npm install`
* Install mongoDb
    "express": "~3.3.4",
    "jade": "~0.34.1",
    "passport": "~0.1.18",
    "passport-local": "~0.1.6",
    "mongoose": "~3.8.5",
    "passport-local-mongoose": "~0.2.5",
    "socket.io": "~1.4.8 ",
    "connect-flash": "~0.1.1",
    "path": "~0.12.7"

## Installation:
1. Download zip and extract in the wanted directory or clone the repository
2. Change port in config.js
  * Change port accordingly in all socket.io in app/controls.js

3. Start mongodb in a screen `./mongod`
4. Run in home directory of the project `node app.js`

## TODO :
* Things to add and/or change
  * Add google+ integration (auth and api for contacts and share and tweets)
  * Add evernote, google drive integration
  * add sms integration
  * Try to add a slack integration
