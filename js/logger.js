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
   

