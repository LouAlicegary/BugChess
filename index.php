<!DOCTYPE html>
<html>

<head>
	
	<title>loualicegary.com / Bug Chess (alpha)</title>
	
	<!-- jQuery + jQuery Touch Punch -->
	<script src="js/jquery/jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>
	
	<!-- MVC Architecture -->
	<script src="js/mvc/MODEL.js"></script>
	<script src="js/mvc/VIEW.js"></script>
	<script src="js/mvc/CONTROLLER.js"></script>
	
	<!-- Logging Wrapper -->
	<script src="js/logger.js"></script>
	
	<!-- Hex -->	
	<script src="js/hex/HexagonTools.js"></script>
	<script src="js/hex/Grid.js"></script>
	<script src="js/hex/Support.js"></script>
	
	<!-- Scroller -->
	<script src="js/scroller/Animate.js"></script>
	<script src="js/scroller/Scroller.js"></script>
	<script src="js/scroller/EasyScroller.js"></script>
	
	<!-- CSS -->
	<link href='http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pacifico' rel='stylesheet' type='text/css'>
	<link href='index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	
	<div id="game_title">Bug Chess</div>
	<div id="reset_button" class=".ui-corner-all">reset board</div>
	
	<div id="white_mask_box" class="mask_box .ui-corner-all"></div>
	<div id="black_mask_box" class="mask_box .ui-corner-all"></div>
	
	<!-- WHITE PIECES -->
	<div id="white_ant3" class="game_piece white_ant"></div>
	<div id="white_ant2" class="game_piece white_ant"></div>
	<div id="white_ant1" class="game_piece white_ant"></div>
	<div id="white_grasshopper3" class="game_piece white_grasshopper"></div>
	<div id="white_grasshopper2" class="game_piece white_grasshopper"></div>
	<div id="white_grasshopper1" class="game_piece white_grasshopper"></div>
	<div id="white_spider2" class="game_piece white_spider"></div>
	<div id="white_spider1" class="game_piece white_spider"></div>
	<div id="white_beetle2" class="game_piece white_beetle"></div>
	<div id="white_beetle1" class="game_piece white_beetle"></div>
	<div id="white_bee1" class="game_piece white_bee"></div>
	
	<!-- BLACK PIECES -->	
	<div id="black_ant3" class="game_piece black_ant"></div>
	<div id="black_ant2" class="game_piece black_ant"></div>
	<div id="black_ant1" class="game_piece black_ant"></div>
	<div id="black_spider2" class="game_piece black_spider"></div>
	<div id="black_spider1" class="game_piece black_spider"></div>
	<div id="black_grasshopper3" class="game_piece black_grasshopper"></div>
	<div id="black_grasshopper2" class="game_piece black_grasshopper"></div>
	<div id="black_grasshopper1" class="game_piece black_grasshopper"></div>
	<div id="black_beetle2" class="game_piece black_beetle"></div>
	<div id="black_beetle1" class="game_piece black_beetle"></div>
	<div id="black_bee1" class="game_piece black_bee"></div>	
	
	
	<div id="container" style="z-index: 1;">
		<div id="content" data-scrollable="true">
			<canvas id="hexCanvas"></canvas>
		</div>
	</div>
	
	<script type="text/javascript">
	$(document).ready(function() {
			
		VIEW_setAllViewProperties();
		VIEW_drawEmptyGrid();
		VIEW_initGameWindow();

		document.getElementById('hexCanvas').addEventListener('click', clickHandler, false);
		document.getElementById('hexCanvas').addEventListener('touchstart', clickHandler, false);
		document.getElementById('reset_button').addEventListener('click', CONTROLLER_resetGame, false);
					
		CONTROLLER_pollingFunction(3000); // POLLS SERVER FOR UPDATES TO SERVER

	}); 	
	</script>

</body>

</html>