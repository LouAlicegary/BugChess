<!DOCTYPE html>
<html>

<head>
	
	<title>loualicegary.com / Bug Chess (alpha)</title>
	
	<!-- jQuery + jQuery Touch Punch -->
	<script src="js/jquery/jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>
	
	<!-- Logger -->
	<script src="js/logger/logger.js"></script>
	
	<!-- CSS -->
	<link href='css/jquery-ui.css' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>
	<link href='css/index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	<div id="wrapper">	
		<div id="game_title" style="text-align: center;">Bug Chess</div>
		<form action="games_lobby.php" method="post">
			<div id="directions" style="position: absolute; font-family: 'Pacifico'; text-align: right; ">type your name:</div>
			<input id="name_input" type="text" name="name" style="position: absolute; border: 0px; font-family: 'Droid Sans'; font-size: 64px; color: #ffffff; background-color: #009966;" autofocus="autofocus">
			<input id="submit_button" type="submit" style="position: absolute; font-family: 'Pacifico'; background: #ffffff; border: '0px solid black'; padding: 5px 10px 5px 10px; -webkit-border-radius: 15px;" value="enter game">
		</form>
	</div>
	
	<div id="portrait_warning" style="position: absolute; font-family: 'Pacifico'; text-align: center; ">This app is designed for use in landscape mode. Please flip your device.</div>
	
	<script type="text/javascript">
	$(document).ready(function(){
		WINDOW_HEIGHT = $(window).height();   // RETURNS HEIGHT OF BROWSER VIEWPORT
		WINDOW_WIDTH = $(window).width();   // RETURNS WIDTH OF BROWSER VIEWPORT 
		
		GAME_TITLE_WIDTH = WINDOW_WIDTH / 2;
		GAME_TITLE_FONT_PX = getMaxFontSizeByWidth(GAME_TITLE_WIDTH, 'Pacifico', $("#game_title").text());
		GAME_TITLE_HEIGHT = GAME_TITLE_FONT_PX * 1.4;
		GAME_TITLE_TOP = GAME_TITLE_FONT_PX * .2;
		GAME_TITLE_LEFT = (WINDOW_WIDTH/2) - (GAME_TITLE_WIDTH/2);
		GAME_TITLE_LINE_HEIGHT = GAME_TITLE_FONT_PX;
		
		DIRECTIONS_PADDING = 20;
		DIRECTIONS_HEIGHT = 100;
		DIRECTIONS_WIDTH = (WINDOW_WIDTH / 4) - DIRECTIONS_PADDING;
		DIRECTIONS_LEFT = WINDOW_WIDTH / 4;
		DIRECTIONS_TOP = GAME_TITLE_HEIGHT + (WINDOW_HEIGHT-GAME_TITLE_HEIGHT)/3 - DIRECTIONS_HEIGHT/2; 
		DIRECTIONS_FONT_PX = getMaxFontSizeByWidth(DIRECTIONS_WIDTH, 'Pacifico', $("#directions").text());; 
		DIRECTIONS_LINE_HEIGHT = DIRECTIONS_HEIGHT;
		
		NAME_INPUT_HEIGHT = 100;
		NAME_INPUT_WIDTH = WINDOW_WIDTH / 4;
		NAME_INPUT_WIDTH_RIGHT_PADDING = 20;
		NAME_INPUT_LEFT = WINDOW_WIDTH/2;
		NAME_INPUT_FONT_PX = DIRECTIONS_FONT_PX * 1.3; 
		NAME_INPUT_TOP = DIRECTIONS_TOP;
		NAME_INPUT_LINE_HEIGHT = DIRECTIONS_LINE_HEIGHT;
		
		SUBMIT_BUTTON_HEIGHT = 100;
		SUBMIT_BUTTON_WIDTH = WINDOW_WIDTH / 4;
		SUBMIT_BUTTON_LEFT = (WINDOW_WIDTH / 2) - (SUBMIT_BUTTON_WIDTH / 2);
		SUBMIT_BUTTON_TOP = GAME_TITLE_HEIGHT + (WINDOW_HEIGHT-GAME_TITLE_HEIGHT)*2/3 - SUBMIT_BUTTON_HEIGHT/2; 
		SUBMIT_BUTTON_FONT_PX = DIRECTIONS_FONT_PX; //NOT YET
		
		
		WARNING_WIDTH = WINDOW_WIDTH * .9;
		WARNING_LEFT = WINDOW_WIDTH * .05;
		WARNING_FONT_PX = getMaxFontSizeByWidth( WARNING_WIDTH, "Pacifico", $("#portrait_warning").text().substring( 0, $("#portrait_warning").text().indexOf(".") ) );
		WARNING_LINE_HEIGHT = WARNING_FONT_PX * 1.4;
		WARNING_HEIGHT = WINDOW_HEIGHT / 4;
		WARNING_TOP = (WINDOW_HEIGHT/2) - (WINDOW_HEIGHT/8);

		$("#game_title").css({'height': GAME_TITLE_HEIGHT, 'width': GAME_TITLE_WIDTH, 'top': GAME_TITLE_TOP, 'left': GAME_TITLE_LEFT, 'font': GAME_TITLE_FONT_PX + "px Pacifico", 'text-align': 'center', 'line-height': GAME_TITLE_LINE_HEIGHT + 'px'});
		
		$("#directions").css({'height': DIRECTIONS_HEIGHT, 'width': DIRECTIONS_WIDTH, 'top': DIRECTIONS_TOP, 'left': DIRECTIONS_LEFT, 'font': DIRECTIONS_FONT_PX + "px Pacifico", 'padding-right': DIRECTIONS_PADDING, 'line-height': DIRECTIONS_LINE_HEIGHT + 'px' });
		$("#name_input").css({'height': NAME_INPUT_HEIGHT, 'width': NAME_INPUT_WIDTH, 'top': NAME_INPUT_TOP, 'left': NAME_INPUT_LEFT, 'font': NAME_INPUT_FONT_PX + "px Droid Sans", 'line-height': NAME_INPUT_LINE_HEIGHT + 'px'});
		$("#submit_button").css({'height': SUBMIT_BUTTON_HEIGHT, 'width': SUBMIT_BUTTON_WIDTH, 'top': SUBMIT_BUTTON_TOP, 'left': SUBMIT_BUTTON_LEFT, 'font': SUBMIT_BUTTON_FONT_PX + "px Pacifico" });

		$("#portrait_warning").css({'height': WARNING_HEIGHT, 'width': WARNING_WIDTH, 'top': WARNING_TOP, 'left': WARNING_LEFT, 'font': WARNING_FONT_PX + "px Pacifico", 'text-align': 'center', 'line-height': WARNING_LINE_HEIGHT + 'px'});
		
		window.onorientationchange = function(event) {
			window.location.href = window.location.href;
		};
		
		document.ontouchmove = function(e) {e.preventDefault()};
		
	});
			
	</script>

</body>

</html>