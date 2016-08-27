// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//

var language = new Array();
language[0] = "en-EN";
language[1] = "en-US";
language[2] = "en-CA";
language[3] = "en-GB";
language[4] = "en-AU";
language[5] = "en-NZ";
var strUser;
var doc= " ";
var txt = "";
var diction='';	



if ('webkitSpeechRecognition' in window) {
	console.log('webSpeech recognition has started');
	if( strUser== undefined){
		strUser = 0;
	}
	 console.log("strUser = " + strUser);
	 console.log("language[strUser] = " + language[strUser]);
	var recognizing;
    var recognition = new webkitSpeechRecognition();
    recognition.lang = language[strUser];
    recognition.continuous = true;
    recognition.interimResults = true;
    reset();
    recognition.onend = reset;
    recognition.onerror = function(e) {
    	recognition.onend = null;	
    	restart(); 
	};
   
    recognition.onresult = function (event) { 
    	
      txt = "";
      var interim = "";

      for (var i = 0; i < event.results.length; ++i) {
    	  txt = "";
        if (event.results[i].isFinal) {
        	//$("#final_span").css("color", "grey");
        	toggleStartStop() ;
            txt = event.results[i][0].transcript;
        	interim = ""; 
        	var request="";
        	
        	var request = controls(txt) ;
        	restart(); 
        	
        	
        } else {
       	interim += event.results[i][0].transcript;   
        }
            
      } 
       
      interim_span.innerHTML = interim;
      icon_span.innerHTML = "<img src='images/blinking-cursor.GIF', height='25'>";
      
    }; 

    
	function reset() {
		button = document.getElementById("button");
		recognizing = false;
		button.innerHTML = "<a href='javascript:toggleStartStop();' id='button' class='btn btn-block btn-lg btn-default'><span class='glyphicon glyphicon-play-circle'></span> Start Now ! </a>";
	}

  	function toggleStartStop() {
  		console.log("toggleStartStop has been exited");
  	button = document.getElementById("button");
  	  if (recognizing) {
  	    recognition.stop();
  	    reset();
  	  } else {
  	    recognition.start();
  	    recognizing = true;
  	    button.innerHTML = "<a href='javascript:toggleStartStop();' id='button' class='btn btn-block btn-lg btn-default '><span class='glyphicon glyphicon-stop'></span> Stop !</a>";

  	  } };
  	  
  	 function restart(){
  		setTimeout(function(){toggleStartStop() ;}, 400);}

	 }else{
		 window.open("/oups");
	 }
