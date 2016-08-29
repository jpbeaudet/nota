// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//

var socket = io.connect('https://localhost:3000', {'force new connection': true});
var username;
var strUser;

// Set languages:
var language = new Array();
var languageIndex = new Array();
var languageFlag = new Array();
language[0] = "en-EN";
languageIndex[0] = "English";
languageFlag[0]= "<img src='img/us-uk.png'>"
language[1] = "en-US";
languageIndex [1] = "English - United States";
languageFlag[1]= "<img src='img/us.png'>"
language[2] = "en-CA";
languageIndex [2] = "English - Canada";
languageFlag[2]= "<img src='img/ca.png'>"
language[3] = "en-GB";
languageIndex [3] = "English - Great Britain";
languageFlag[3]= "<img src='img/uk.png'>"
language[4] = "en-AU";
languageFlag[4]= "<img src='img/au.png'>"
languageIndex [4] = "English - Australia";
language[5] = "en-NZ";
languageIndex [5] = "English - New Zeeland";
languageFlag[5]= "<img src='img/nz.png'>"
language[6] = "fr-FR";
languageIndex [6] = "Francais - France";
languageFlag[6]= "<img src='img/fr.png'>"
language[7] = "fr-CA";
languageIndex [7] = "Francais - Canada";
languageFlag[7]= "<img src='img/ca.png'>"
language[8] = "pt-PT";
languageIndex [8] = "Português - Portugal";
languageFlag[8]= "<img src='img/pt.png'>"
language[9] = "pt-BR";
languageIndex [9] = "Português - Brasil";
languageFlag[9]= "<img src='img/bz.png'>"
language[10] = "es-ES";
languageIndex [10] = "Español - España";
languageFlag[10]= "<img src='img/es.png'>"
language[11] = "es-MX";
languageIndex [11] = "Español - México";
languageFlag[11]= "<img src='img/mx.png'>"
language[12] = "de-DE";
languageIndex [12] = "Deutsch - Deutschland";
languageFlag[12]= "<img src='img/de.png'>"
language[13] = "de-AT";
languageIndex [13] = "Deutsch - Österreicher";
languageFlag[13]= "<img src='img/at.png'>"
language[14] = "ru-RU";
languageIndex [14] = "Россия - русский";
languageFlag[14]= "<img src='img/ru.png'>"
language[15] = "ar-AR";
languageIndex [15] = "العربية";
languageFlag[15]= "<img src='img/iq.png'>"
language[16] = "zh-CN";
languageIndex [16] = "中国";
languageFlag[16]= "<img src='img/cn.png'>"

window.onload = function()
{
	
	socket.emit("load", "load -------------------------------->");	
	socket.on("res.load", function(response){
		var docA =response[0];
		var docB =response[1];
		username =response[2];
		var title = response[3];
		var language = response[4];
			strUser = language;
		if( strUser== undefined){
			strUser = 0
		}
   	    language_span.innerHTML =  languageFlag[strUser]+"&nbsp"+languageIndex[strUser];
		welcome_span.innerHTML = "Welcome "+ username;
		title_span.innerHTML = "<h1>"+title+"</h1>";
		icon_span.innerHTML = "<img src='images/blinking-cursor.GIF', height='25'>";
		docA_span.innerHTML = docA;
	    docB_span.innerHTML = docB;	
		words_span.innerHTML = " Words: ";	    
	    //restart();
});
};

	function controls (transcript, language) {		
	var index;		
	console.log("controls() fired");;	
	socket.emit("request", "test -------------------------------->");
	socket.on("response", function(res){
		console.log("response fired");
		var docA = res[0];
		var docB = res[1];
		var LastdocA = res[2];
		var LastdocB = res[3];
		var title = res[4];
		if(transcript == "\n"){
			transcript = "<div><br \></div>";
		}
		index = new MyData (docA,docB,transcript,LastdocA,LastdocB,title);
		words_span.innerHTML = " Words: "+ index.wordsTotal;
		console.log('lastsaveA = '+index.LastdocA);
		console.log('lastsaveB = '+index.LastdocB);
		return response(transcript, index, language);
	  });
	
	return true;
	}//end of controls	
	

function response(doc, index, language){
	console.log("response() fired");
	var diction;
	if(diction != doc){
		var pretext = index.docA;
		var afttext = index.docB;
		console.log("pretext= "+ pretext);
		console.log("afttext= "+ afttext);
		docA_span.innerHTML = pretext + " " + doc + " ";
		docB_span.innerHTML = afttext + " ";
		pretext = pretext + " " + doc + " ";
		afttext = afttext + "";  
		diction = doc;  
		var title = index.title;  
		socket.emit("save", [doc, pretext, afttext, title, language]);	
		return false;
	}
}

//Confirmation section :
//-------------------------------------------------------------------
//
     
function confirmNewText(index)	{      
	
	$.confirm({
		'title'		: 'Delete Confirmation',
		'message'	: 'You are about to delete your current text. <br />It cannot be restored at a later time! Continue?',
		'buttons'	: {
			'Yes'	: {
				'class'	: 'blue',
				'action': function(){
		index.docA = ""; 
		index.docB ="";
		index.title = "Untitled";
		docA_span.innerHTML = "";
		docB_span.innerHTML = "";
		socket.emit('newtext',"new text----------------->>");
		location.reload(true);
				}
			},
			'No'	: {
				'class'	: 'gray',
				'action': function(){ location.reload(true);}	// Nothing to do in this case. You can as well omit the action property.
			}
		}
	});
}
 
 ///Menu section : 
 ///-----------------------------------------------------------------------------
 
var onSettings = false;
$('#settings').click(function(){
	if(onSettings){
	onSettings = false; 
	removeSettings();
	}else{ 
		var markupS = [
			'<br><div class="alert alert-success" id="settingsMenu" style="margin:3em;"><center>',
			'<div class=".container"><br>',
			'<h3>',"Settings",'</h3>',
			'<div id="preference">',
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
			' <span aria-hidden="true">&nbsp; Close</span></button>', 
			'<p>','Select your region for better results !','</p>',                       
			'<select id="language" name="language" style="width:90%;height:2em;;font-size:1em;">',
			'<option value="0"> English </option>',
			'<option value="1"> English - United States </option>',   
			'<option value="2"> English - Canada </option>',   
			'<option value="3"> English - Great Britain</option>',
			'<option value="4"> English - Australia </option>',  
			'<option value="5"> English - New Zeeland </option>',   
			'<option value="6"> Francais - France </option>',
			'<option value="7"> Francais - Canada </option>',   
			'<option value="8"> Português - Portugal </option>',  
			'<option value="9"> Português - Brasil </option>',
			'<option value="10"> Español - España </option>',  
			'<option value="11"> Español - México </option>',   
			'<option value="12"> Deutsch - Deutschland </option>', 
			'<option value="13"> Deutsch - Österreicher </option>',  
			'<option value="14"> Россия - русский </option>',  
			'<option value="15">العربية </option>',  
			'<option value="16"> 中国 </option>',  
			'</select>',
			'</div></div></center></div>'
			].join('');

		$(markupS).hide().prependTo('#startstop').fadeIn();
		var $test = $('body');
		$test.update();
		onSettings = true;
		$('#language').click(function(){ 
			var e = document.getElementById("language");
			strUser = e.options[e.selectedIndex].value;
			console.log("strUser = " + strUser);
			recognition.lang = language[strUser];
			console.log(" recognition.lang= " +  recognition.lang);
			console.log(" language[strUser].index= " + languageIndex[strUser]);
			language_span.innerHTML = languageFlag[strUser]+"&nbsp"+languageIndex[strUser];
		});
	}
});

function removeSettings(){
	$('#settingsMenu').fadeOut(function(){
		$(this).remove();
	});
}

var newtitle = false;
$('#newtitle').click(function(){
	if(newtitle){
	newtitle = false; 
	removeNewTitle();
	}else{ 
		newtitle = true
	var markupS = [
		'<div class="alert alert-success" id="titlediv"><center><br>',
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close">',
		' <span aria-hidden="true">&nbsp; Close</span></button>',
		'<form role="form" action="/newtitle" method="post" id="titleform" style="max-width: 100%;">',
		'<div class="input-group"><span id="basic-addon1" class="input-group-addon">Title</span>',
		'<input type="text" name="title" id="title" placeholder="Enter New Title" class="form-control">',
		'</div><br>',
		'<button type="submit" id="submit_title" class="btn btn-default">Submit</button>',
		'</form></center></div>'
		].join('');

		$(markupS).hide().prependTo('#title_span').fadeIn();
		var $test = $('body');
		$test.update();
		}
	});
	
$('#submit_title').click(function(){
	removeNewTitle()
});
	
function removeNewTitle(){
	$('#titlediv').fadeOut(function(){
		$(this).remove();
	});
}
	
$.fn.update = function(){
	var newElements = $(this.selector),i;    
	for(i=0;i<newElements.length;i++){
		this[i] = newElements[i];
	}
	for(;i<this.length;i++){
		this[i] = undefined;
	}
	this.length = newElements.length;
	return this;
};

