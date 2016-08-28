// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//

var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var memoryDb = require('../models/save');  

module.exports = function (app) {

	app.get('/', function (req, res) {
		res.render('index', { user : req.user });
	});
  
	app.get('/register', function(req, res) {
		res.render('register', { });
	});
  
	app.get('/oups', function(req, res) {
		res.render('oups', {message: "You need to use Google Chrome or Chromium to use smartnotes."});
	});
  


	app.get('/home', function(req, res) {
		if(!req.user){
			res.redirect('/');
		}else{
		res.render('home', { user : req.user });
		}
	});

	app.get('/login', function(req, res) {
		res.render('login', { user : req.user });
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/ping', function(req, res){
		res.send("pong!", 200);
	});


	
	app.get('/speech.js', function(req, res) {
		res.set('Content-Type', 'text/javascript');
		res.sendfile('./speech.js');
	});
  

	app.get('/data.js', function(req, res) {
		res.set('Content-Type', 'text/javascript');
		res.sendfile('./data.js');
	});

	app.get('/controls.js', function(req, res) {
		res.set('Content-Type', 'text/javascript');
		res.sendfile('./controls.js');
	});
	
	// PROFILE SECTION =========================
	app.get('/profile',  function(req, res) {
		res.render('profile', {
			user : req.user
		});
	});
  
	app.use(function (err, req, res, next) {
		// treat as 404
		if (err.message
			&& (~err.message.indexOf('not found')
			|| (~err.message.indexOf('Cast to ObjectId failed')))) {
			return next();
		}
		console.error(err.stack);
		// error page
		if (req.user) {
		    // logged in
		  res.redirect("/home");
		} else {
		// not logged in
		res.status(500).render('500', {error: err.stack});
		}
	});

	// assume 404 since no middleware responded
	app.use(function (req, res, next) {
		var logged;
		if (req.user) {
				// logged in
			res.redirect("/home");
		} else {
		// not logged in
		
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not found'
		});
		}
	});

};
