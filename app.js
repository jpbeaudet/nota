// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//

// dependencies

var path = require('path');  
var express = require('express');
var http = require('http');
var https = require('https');
var session    = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var fs = require('fs');
var LocalStrategy = require('passport-local').Strategy;
var passphrase = "";
var sessionStore = new express.session.MemoryStore();
var expressValidator = require('express-validator');
var flash    = require('connect-flash');
var EXPRESS_SID_KEY = 'express.sid';
var COOKIE_SECRET ='J976dd78Hffr#$%68h';
var config = require('./config.js');

var options = {
		  key: fs.readFileSync('var/keys/server.key'),
		  cert: fs.readFileSync('var/keys/server.crt')
	};


	if(passphrase) {
		options.passphrase = passphrase;
	}

var cookieParser = express.cookieParser(COOKIE_SECRET);
// main config
var app = express();
app.configure(function () {
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(flash());
app.use(express.logger());
app.use(express.bodyParser());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({
    store: sessionStore,
    cookie: { 
        httpOnly: true
    },
    key: EXPRESS_SID_KEY
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/app", express.static(__dirname + "/app"));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://'+config.mongodb_host+'/'+config.mongodb_database);

var memoryDb = require('./models/save');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("db started ------------");
});
 
// routes
GLOBAL.username= "";
require('./routes/routes')(app);

var server = https.createServer(options, app);
app.set('port', process.env.PORT || config.node_web_server_port);
console.log(("Express server listening on port " + app.get('port')));

// socket.io
require('./socket.js')(server, app.get('port'))

server.listen(config.node_web_server_port);
