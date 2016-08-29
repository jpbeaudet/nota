// Author: Jean-Philippe Beaudet @ S3R3NITY Technology
// Nota - Web based hands-free text noter
//

function MyData (docA,docB,transcript,LastdocA,LastdocB,title){
	var docAll = docA.trim() + docB.trim() + transcript.trim();
	this.title = title;
	this.docA = docA;
	this.LastdocA = LastdocA;
	this.LastdocB=LastdocB;
	this.docB = docB;
	this.wordsTotal = docAll.trim().split(" ").length;
}
		
