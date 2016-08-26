// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//
	
	//This constructor will built all the parameters MyData object will need to use as ressources for controls. 
	//For the moment i just added a few i could think i will need. 
	//-------------------------------------------------------------------
	
	function MyData (docA,docB,transcript,LastdocA,LastdocB,title){
		var n = 77;
		var docAll = docA + docB + transcript;
		var nbDiv=0;
		if(docAll.match(new RegExp('<div>', 'g'))!= null){
		nbDiv = (docAll.match(new RegExp('<div>', 'g')).length+1);
		}
		this.title = title;
		this.lines=  nbDiv;
		this.docA = docA;
		this.LastdocA = LastdocA;
		this.LastdocB=LastdocB;
		this.docA.words = docA.split(" ").length ;
		this.docB = docB;
		this.docB.words = docB.split(" ").length;
		this.wordsTotal = ( docA.split(" ").length + docB.split(" ").length + transcript.split(" ").length);
		this.request = transcript.split(" ");
		this.request.num = transcript.split(" ").length;
	}
		
