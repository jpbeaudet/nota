var mongoose = require('mongoose');

module.exports = function (server, port) {
	
	var io = require('socket.io').listen(server);
	var memoryDb = require('./models/save');  

	io.on('connection', function(socket){ 
	
		var MEMORY = mongoose.model('memory', memoryDb);
		var memory = new Object();	
		memory.docA = "";
		memory.docB= "";
		console.log("socket.io started on port"+ port);
	
		MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
			if (err) return console.error(err);
			console.log("starting elements stored in "+ GLOBAL.username+" db: docA,docB "+doc);
		});
	
		socket.on("load",function(data){
			MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
				
			if(doc != null){
			socket.emit("res.load", [doc.docA, doc.docB, GLOBAL.username, doc.title, doc.language]);  
			}else{
			var Memory = new MEMORY({ language:0, docA: "", docB: "" , username: GLOBAL.username,lastsaveA:"",lastsaveB:"",title:"Untitled"});
			Memory.save(function (err, Memory) {
			if (err) return console.error(err);
			});
			socket.emit("res.load", ["", "", GLOBAL.username,"Untitled"]);    
			} 
			});
		});

		socket.on("newtext",function(data){
			MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
				var query = {docA:doc.docA, docB:doc.docB, username: GLOBAL.username,lastsave:doc.lastsave},
					options = { multi: true };
					MEMORY.update(query, { docA: "", docB: "", username: GLOBAL.username,lastsaveA:"",lastsaveB:"",title:"Untitled"}, options, callback);
					function callback (err, numAffected) {
					};
			});
		});

		socket.on("request",function(data){
			MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
				  console.log(" findOne did send :"+ doc);
				  console.log(" last doc for :: doc.docA for" + GLOBAL.username+"  :"+ doc.docA);
					console.log("lastsave A >> request = "+ doc.lastsaveA );
					console.log("lastsave B >> request = "+ doc.lastsaveB );
					console.log("doc.docA >> request = "+ doc.docA);
					console.log("doc.docB>> request = "+ doc.docB);
				  socket.emit("response", [doc.docA, doc.docB,doc.lastsaveA,doc.lastsaveB,doc.title]);
			});
		});
		
		socket.on("save",function(data){
			console.log("save has fire()--------------------------------->>")
			var doc = data[0];			
			memory.docA = data[1];
			memory.docB = data[2];
			var title = data[3];
			var language = data[4]
			MEMORY.findOne({ username: GLOBAL.username}, function (err, doc){
				var query = { docA:doc.docA, docB:doc.docB, username: GLOBAL.username,lastsaveA:doc.lastsaveA,lastsaveB:doc.lastsaveB},
				    options = { multi: true };
				  MEMORY.update(query, { language:language, docA: memory.docA , docB: memory.docB, username: GLOBAL.username,lastsaveA:doc.docA,lastsaveB:doc.docB,title:title}, options, callback);
				  function callback (err, numAffected) {
						console.log("lastsave A >> db = "+ doc.lastsaveA );
						console.log("lastsave B >> db = "+ doc.lastsaveB );
						console.log("doc.docA >> db= "+ doc.docA );
						console.log("doc.docB >> db= "+ doc.docB );
						console.log("username >> save= "+ GLOBAL.username);
						console.log("language >> save= "+ language);
					};
			});
		});
	});
};
