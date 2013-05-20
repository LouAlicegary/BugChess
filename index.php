<!DOCTYPE html>
<html>

<head>
	
	<title>loualicegary.com / Bug Chess (alpha)</title>
	
	<!-- jQuery + jQuery Touch Punch -->
	<script src="js/jquery/jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>
	
	<!-- CSS -->
	<link href='css/jquery-ui.css' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>
	<link href='css/index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	
	<form action="games_lobby.php" method="post">
		<div id="directions" style="position: absolute; font-family: 'Pacifico'; font-size: 48px; ">type your name:</div>
		<div id="name_input_div" style="position: absolute;" >
			<input id="name_input" type="text" name="name" style="border: 0px; font-family: 'Droid Sans'; font-size: 64px; color: #ffffff; background-color: #009966;" autofocus="autofocus">
			<input id="submit_button" type="submit" style="position: absolute; font-family: 'Pacifico'; font-size: 36px; background: #ffffff; border: '0px solid black'; padding: 5px 10px 5px 10px; -webkit-border-radius: 15px;" value="enter game">
		</div>
	</form>

	<script type="text/javascript">
	$(document).ready(function(){
		WINDOW_HEIGHT = $(window).height();   // RETURNS HEIGHT OF BROWSER VIEWPORT
		WINDOW_WIDTH = $(window).width();   // RETURNS WIDTH OF BROWSER VIEWPORT 
		
		DIRECTIONS_HEIGHT = 100;
		DIRECTIONS_WIDTH = 320;
		
		NAME_INPUT_HEIGHT = 100;
		NAME_INPUT_WIDTH = 300;
		NAME_INPUT_WIDTH_RIGHT_PADDING = 20;
		
		SUBMIT_BUTTON_HEIGHT = 80;
		SUBMIT_BUTTON_WIDTH = 200;
		
		NAME_INPUT_DIV_HEIGHT = 100;
		NAME_INPUT_DIV_WIDTH = NAME_INPUT_WIDTH + NAME_INPUT_WIDTH_RIGHT_PADDING + SUBMIT_BUTTON_WIDTH;
		
		DIRECTIONS_TOP = (WINDOW_HEIGHT/2) - (DIRECTIONS_HEIGHT/2); 
		DIRECTIONS_LEFT = (WINDOW_WIDTH/2) - ((NAME_INPUT_DIV_WIDTH+DIRECTIONS_WIDTH)/2);
		
		NAME_INPUT_DIV_TOP = (WINDOW_HEIGHT/2) - (NAME_INPUT_DIV_HEIGHT/2); 
		NAME_INPUT_DIV_LEFT = DIRECTIONS_LEFT + DIRECTIONS_WIDTH;
		
		NAME_INPUT_TOP = 0;
		NAME_INPUT_LEFT = 0;
		
		SUBMIT_BUTTON_TOP = (DIRECTIONS_HEIGHT - SUBMIT_BUTTON_HEIGHT) / 2;
		SUBMIT_BUTTON_LEFT = NAME_INPUT_WIDTH + NAME_INPUT_WIDTH_RIGHT_PADDING;

		
		$("#directions").css({'height': DIRECTIONS_HEIGHT, 'width': DIRECTIONS_WIDTH, 'top': DIRECTIONS_TOP, 'left': DIRECTIONS_LEFT});
		$("#name_input_div").css({'height': NAME_INPUT_DIV_HEIGHT, 'width': NAME_INPUT_DIV_WIDTH, 'top': NAME_INPUT_DIV_TOP, 'left': NAME_INPUT_DIV_LEFT});
		$("#name_input").css({'height': NAME_INPUT_HEIGHT, 'width': NAME_INPUT_WIDTH, 'top': NAME_INPUT_TOP, 'left': NAME_INPUT_LEFT});
		$("#submit_button").css({'height': SUBMIT_BUTTON_HEIGHT, 'width': SUBMIT_BUTTON_WIDTH, 'top': SUBMIT_BUTTON_TOP, 'left': SUBMIT_BUTTON_LEFT});
	});
			
	</script>

</body>

</html>