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
	//textWidth.width;
	
	//document.body.appendChild(canvas);
	testcanvas.width  = $(window).width();
	testcanvas.height = $(window).height();
	ctx = testcanvas.getContext("2d");
	ctx.font = in_font; // "56px Pacifico"
	textWidth = ctx.measureText (in_text);
	
	Logger("in_font / in_text -> width: " + in_font + " " + in_text + " -> " + textWidth.width + "px" );
	return textWidth.width;
}

function getMaxFontSizeByWidth(in_width, in_font, in_text) {
	var in_text_len = in_text.length;
	var width_guess = 250;
	var flag = 1;
	var factor;
	var width = getTextBlockWidth( width_guess + "px " + in_font, in_text);
	var factor = width / in_width;
	width_guess = width_guess / factor;
	Logger("LOGGER: GOAL WIDTH = " + in_width + "px / WIDTH @ 250px = " + width + " SO MY GUESS FOR FONT SIZE = " + 250/factor + "px");
	
	width = getTextBlockWidth( width_guess + "px " + in_font, in_text);
	Logger("WIDTH @ GUESS = " + width + "px");
	/*while (flag) {

		width = getTextBlockWidth( width_guess + "px " + in_font, in_text);
		
		
		if (width > in_width) {
			width_guess = width_guess / 1.1;
		}
		else if (width < (in_width*.95)) {
			width_guess = width_guess * 1.03;
		}
		else {
			flag = 0;
		}
	}*/
	return Math.floor(width_guess);		
}

