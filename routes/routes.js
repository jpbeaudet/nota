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
	
	app.post('/login', function(req, res,next) {
		req.assert('username', 'required').notEmpty();
		req.assert('username', 'valid email required').isEmail();
		req.assert('password', 'required').notEmpty();
		//req.assert('password', '6 to 20 characters required with at least 1 number, 1 upper case character and 1 special symbol').isStrongPassword();
		var errors = req.validationErrors();
		if (errors) {
			return res.render("login", {errors: "Your email and password did not match. Please enter a valid email and password. "});
		}
		GLOBAL.username = req.body.username;
		console.log(GLOBAL.username);
		next();
		
	}, passport.authenticate('local', {
		successRedirect : '/home', // redirect to the secure account section
		failureRedirect : '/login' ,// redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/newtitle', function(req, res){
		var title = req.body.title
		var MEMORY = mongoose.model('memory', memoryDb);
			MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
				var query = {docA:doc.docA, docB:doc.docB, username: GLOBAL.username,lastsaveA:doc.lastsaveA,lastsaveB:doc.lastsaveB},
					options = { multi: true };
					MEMORY.update(query, { docA: doc.docA , docB: doc.docB, username:GLOBAL.username,lastsaveA:doc.docA,lastsaveB:doc.docB,title:title}, options, callback);
					function callback (err, numAffected) {
						console.log("new title saving... = "+ doc);
						res.redirect('/home')
					};
			});
	});
	
	app.get('/download_txt', function(req, res){
		var file_content,
		file_title ;
		var fs = require('fs');
		var filepath = path.join(__dirname, 'public/tmp/');
		var MEMORY = mongoose.model('memory', memoryDb);
		MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
			file_content=doc.docA+doc.docB;
			file_content = file_content.replace('<div>',"").replace('</div>',"\n").replace('&nbsp',"	").replace('</br>',"\n").replace('<br >',"\n");
			file_title = doc.title+".txt" || "Untitled.txt";
			console.log("download has sent title= "+file_title+" content = "+file_content+" at path ="+ filepath);
			var md = file_content;
			fs.writeFile(filepath+ file_title, md, function(err) {
				if(err) {
					return console.log(err);
				}
				var file = filepath + file_title;
				res.download(file); // Set disposition and send it.
				console.log("The file was saved!");
			}); 
		});
	});

	app.get('/email', function(req, res){
		var file_content,
		file_title ;
		var fs = require('fs');
		var util = require('util'),
		exec = require('child_process').exec,
		child;
		var user = GLOBAL.username;
		var MEMORY = mongoose.model('memory', memoryDb);
		var filepath = path.join(__dirname, 'public/tmp/');
		
		MEMORY.findOne({ username: username}, function (err, doc){
			file_content=doc.docA+doc.docB;
			file_content = file_content.replace('<div>',"").replace('</div>',"\n").replace('&nbsp',"	").replace('</br>',"\n").replace('<br >',"\n");
			file_title = doc.title+".txt" || "Untitled.txt";
			var md = file_content;
			file_title = file_title.replace(/ /g,"");
			var args= (__dirname + '/script/'+ './sendingmail.sh "'+user+'" "'+file_title+'" "'+filepath+ file_title+'"' );
			console.log("the request to sh sent = "+args);
			fs.writeFile(filepath+ file_title, md, function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file was saved!");
					child = exec(args,
					function (error, stdout, stderr) {
					console.log('stdout: ' + stdout);
					if (error !== null) {
						console.log("email was sent to : "+req.user );
					}else{
						console.log('stderr: ' + stderr);
						} 
					});	
					res.redirect("/home");
					});
			});
	});
	
	app.post('/register', function(req, res,next) {
		req.assert('username', 'required').notEmpty();
		req.assert('username', 'valid email required').isEmail();
		req.assert('password', 'required').notEmpty();
		//req.assert('password', '6 to 20 characters required with at least 1 number, 1 upper case character and 1 special symbol').isStrongPassword();
		var errors = req.validationErrors();
		if (errors) {
			return res.render("register", {errors: " Invalid email or password. The password must contain numbers and at least a capital character. "});
		}else{ 
		Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
		GLOBAL.username = req.body.username;
		var user = account
		req.logIn(account, function(err) {
		if (err) {
			console.log(err);
		}
		return res.render('home', {user : user});
		});
		});
		}
	})

	// SCRIPT SECTION =================================
	
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
	
	
	
   // ERROR SECTION ===============================
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
