OUTPUT_CONSOLE_LOG = 0;
OUTPUT_LOGGER_WINDOW = 1;

SHOW_TIME = 0;

var LOG_ARRAY = new Array(15);

if (OUTPUT_LOGGER_WINDOW) {
    $(document).ready(function(){
        $("body").append("<div id='logger_window' draggable='true' style='position: absolute; overflow: auto; font-family: Arial; font-size: 16px; font-face: bold; top: 0; left: 0; height: 30%; width: 60%; margin: 0% 20%; background: rgba(0,0,0,.7); color: rgba(255,255,255,1);'>Logger window initialized.\n</div>")
        $("#logger_window").draggable();
    });
    
    window.onerror=function(msg, url, linenumber){
        url = url.substr(url.lastIndexOf("/")+1);
        //$('#logger_window').html($('#logger_window').html() + '<div style="color:rgba(255,0,0,1)">' + msg + ' [' + url + ': ' + linenumber + "]</div>");
        alert(msg + ' [' + url + ': ' + linenumber + "]");
        return true;
    }
    
    for (var i=0; i < 15; i++) 
        LOG_ARRAY[i] = "";
}

if (OUTPUT_CONSOLE_LOG) {
    window.onerror=function(msg, url, linenumber){
        url = url.substr(url.lastIndexOf("/")+1);
        //console.log(msg + ' [' + url + ': ' + linenumber + ']');
        alert(msg + ' [' + url + ': ' + linenumber + "]");
        return true;
    }
}

function Logger(in_string) {
	if (OUTPUT_CONSOLE_LOG) {
	    if (SHOW_TIME)
	       console.log(Logger.caller.name + " " + timestamp() + in_string); 
	    else
	       console.log(Logger.caller.name + " " + in_string);
	}
	if (OUTPUT_LOGGER_WINDOW) {
	    for (var i=13; i >= 0; i--) {
	        LOG_ARRAY[i+1] = LOG_ARRAY[i];
	    }
	    if (SHOW_TIME)
           LOG_ARRAY[0] = "<div style='color: green; display: inline;'> " + Logger.caller.name + " " + timestamp() + "</div>" + in_string; 
        else
           LOG_ARRAY[0] = "<div style='color: green; display: inline;'> " + Logger.caller.name + " </div>" + in_string;
	    
	    var arraystring = "";
        for (var i=0; i < 15; i++) {
            arraystring += LOG_ARRAY[i] + "<br>";
        }	    
	    $('#logger_window').html(arraystring);
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
	return textWidth.width;
}


function getMaxFontSizeByWidth(in_width, in_upperbound, in_fontface, in_text) {
	// DIV HEIGHT * .7 MAKES A GOOD STARTING UPPERBOUND
	var in_text_len = in_text.length;
	var width_guess = 50;
	var flag = 1;
	var factor;
	
	var width = getTextBlockWidth( width_guess + "px " + in_fontface, in_text);
	var factor = width / in_width;
	
	width_guess = width_guess / factor;
	width = getTextBlockWidth( width_guess + "px " + in_fontface, in_text);
		
	if (width_guess < in_upperbound)
	   return Math.floor(width_guess);	
	else 
	   return in_upperbound;
}

/**
 * Makes a copy of an array (Arrays in JS copy by address, not value)
 * @param   {Array} obj
 *          Some array that you want to make a copy of.
 * @return  {Array} 
 *          An exact value-by-value copy of the array that was passed into the function.
 */
function arrayCloner(obj) {
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = arrayCloner(obj[key]);
    
    return temp;
}

/**
 * Copies array values into a visually appealing string. 
 * @param   {Array} in_array
 *          An array that you want to print out.
 */
function printNiceArray(in_array) {
    var out_string = "";
    for (var i=0; i < in_array.length; i++) {
        out_string += "[" + in_array[i] + "] ";
    }
    return out_string;
}

/**
 * Based on Fisher-Yates randomization algorithm
 */
function randomizeArray(in_array) {
  var myArray = arrayCloner(in_array);
  var i = myArray.length;
  var j;
  var temp;
  
  if ( i === 0 ) 
    myArray = [];
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = myArray[i];
     myArray[i] = myArray[j]; 
     myArray[j] = temp;
   }
   return myArray;    
}

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);