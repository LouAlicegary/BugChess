ALLOW_CONSOLE_LOG = 1;

function Logger(old_string) {
	if (ALLOW_CONSOLE_LOG) {
		console.log(timestamp() + old_string);
	}	
}

function timestamp() {
	var now = new Date();
	var hours = ("0" + now.getHours()).slice(-2);
	var minutes = ("0" + now.getMinutes()).slice(-2);
	var seconds = ("0" + now.getSeconds()).slice(-2);
	var milliseconds = ("00" + now.getMilliseconds()).slice(-3);
  	var outStr = "[" +  hours + ':' + minutes + ':' + seconds + "." + milliseconds + "] ";
  	
  	return outStr;
}   
   
var testcanvas = document.createElement("canvas"); 
var ctx;  
var textWidth;

function getTextBlockWidth(in_font, in_text) {

	testcanvas.width  = $(window).width();
	testcanvas.height = $(window).height();
	ctx = testcanvas.getContext("2d");
	ctx.font = in_font; // "56px Pacifico"
	textWidth = ctx.measureText (in_text);
	Logger("in_font / in_text -> textwidth: " + in_font + " " /*+ in_text*/ + "-> " + textWidth.width + "px, " + " TESTCANVAS: " + testcanvas.width + "px " + testcanvas.height + "px" );
	return textWidth.width;
}

// DIV HEIGHT * .7 MAKES A GOOD STARTING UPPERBOUND
function getMaxFontSizeByWidth(in_width, in_upperbound, in_fontface, in_text) {
	Logger("IN_WIDTH: " + in_width + " IN_UPPERBOUND: " + in_upperbound +  " IN_FONTFACE: " + in_fontface + " IN_TEXT: " + in_text); 
	var in_text_len = in_text.length;
	var width_guess = 50;
	var flag = 1;
	var factor;
	
	var width = getTextBlockWidth( width_guess + "px " + in_fontface, in_text);
	var factor = width / in_width;
	
	width_guess = width_guess / factor;
	width = getTextBlockWidth( width_guess + "px " + in_fontface, in_text);
	
	//Logger("GOAL WIDTH: " + in_width + " WIDTH GUESS: " + width +  " UPPER BOUND: " + in_upperbound + " WIDTH CALC: " + width_guess);
	
	if (width_guess < in_upperbound)
	   return Math.floor(width_guess);	
	else 
	   return in_upperbound;
}

