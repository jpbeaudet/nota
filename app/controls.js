// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//

var socket = io.connect('https://localhost:3000', {'force new connection': true});
var _USERNAME;
var strUser;
var language = new Array();
var languageIndex = new Array();
language[0] = "en-EN";
languageIndex[0] = "English";
language[1] = "en-US";
languageIndex [1] = "English - United States";
language[2] = "en-CA";
languageIndex [2] = "English - Canada";
language[3] = "en-GB";
languageIndex [3] = "English - Great Britain";
language[4] = "en-AU";
languageIndex [4] = "English - Australia";
language[5] = "en-NZ";
languageIndex [5] = "English - New Zeeland";

window.onload = function()
{
	
	socket.emit("load", "load -------------------------------->");	
	socket.on("res.load", function(response){
		var docA =response[0];
		var docB =response[1];
		_USERNAME =response[2];
		var title = response[3];
		var language = response[4];
			strUser = language;
		if( strUser== undefined){
			strUser = 0
		}
   	    language_span.innerHTML = languageIndex[strUser];
		welcome_span.innerHTML = "Welcome "+ _USERNAME;
		title_span.innerHTML = "<h1>"+title+"</h1>";
		icon_span.innerHTML = "<img src='images/blinking-cursor.GIF', height='25'>";
		docA_span.innerHTML = docA;
	    docB_span.innerHTML = docB;	
		//lines_span.innerHTML = "Lines: ";
		words_span.innerHTML = " Words: ";	    
	    restart();
});
};

	function controls (transcript, language) {		
		var index;		
	   console.log("controls() fired");;	
	  // start by building the index object which will contain all relevant info 
	  socket.emit("request", "test -------------------------------->");
	  socket.on("response", function(response){
		  console.log("response fired");
		  //$("#final_span").css("color", "grey");
		  var docA = response[0];
		  var docB = response[1];
		  var LastdocA = response[2];
		  var LastdocB = response[3];
		  var title = response[4];
		  
		  console.log('lastsaveA arrival= '+LastdocA);
		  console.log('lastsaveB arrival = '+LastdocB);
		  if(transcript == "\n"){
			  transcript = "<div><br \></div>";
		  }
		  index = new MyData (docA,docB,transcript,LastdocA,LastdocB,title);
		  //lines_span.innerHTML = "Lines: "+ index.lines;
		  words_span.innerHTML = " Words: "+ index.wordsTotal;
		  console.log('lastsaveA = '+index.LastdocA);
		  console.log('lastsaveB = '+index.LastdocB);
		  return resp(transcript, index, language);
		  
	  });
	
		return true;
	
	}//end of controls	
	

function resp(data, index, language){
	console.log("response() fired");
	var diction;
	var doc = data;
	if(diction != doc){ 
		var json = {event:'0',data:data};

	console.log("json in response = "+JSON.stringify(json));
	var pretext = index.docA;
	var afttext = index.docB;
	console.log("pretext= "+ pretext);
	console.log("afttext= "+ afttext);

	docA_span.innerHTML = pretext + " " + doc + " ";
	docB_span.innerHTML = afttext + " ";
	pretext = pretext + " " + doc + " ";
	afttext = afttext + "";  
	//final_span.innerHTML = " @@@->  " + doc + "  <-@@@ ";
	diction = doc;  
	var title = index.title;  
	socket.emit("save", [data, pretext, afttext, json, title, language]);	
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
	 //$("#final_span").css("color", "pink");	
 index.docA = ""; 
 index.docB ="";
 index.title = "Untitled";
 docA_span.innerHTML = "";
 docB_span.innerHTML = "";
 //final_span.innerHTML = " @@@->  New Text  <-@@@ ";
 socket.emit('newtext',"new text----------------->>");
 //socket.to(_USERNAME).emit('newtext',"new text----------------->>");
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
                      '</select>',
                      '</div></div></center></div>'
                  ].join('');

        $(markupS).hide().prependTo('#startstop').fadeIn();
        var $test = $('.mainmenu');
        $test.update();
        var $test2 = $('div.settingsMenu');
        console.log("body = "+ $test);
        console.log("div.settingsMenubody = "+ $test2);
        onSettings = true;
        $('#language').click(function(){ 
         	var e = document.getElementById("language");
        	 strUser = e.options[e.selectedIndex].value;
        	 console.log("strUser = " + strUser);
        	 recognition.lang = language[strUser];
        	 console.log(" recognition.lang= " +  recognition.lang);
        	 console.log(" language[strUser].index= " + languageIndex[strUser]);
        	 language_span.innerHTML = languageIndex[strUser];
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
        var $test = $('.mainmenu');
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

