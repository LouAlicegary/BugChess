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
	<link href='css/jquery-ui.css' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pacifico' rel='stylesheet' type='text/css'>
	<link href='css/index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	
	<div id="game_title">Bug Chess</div>
	
	<div id="reset_button" class="ui-corner-all">reset</div>
	<div id="return_button" class="ui-corner-all">return to lobby</div>
	
	<div id="white_mask_box" class="mask_box ui-corner-all"></div>
	<div id="black_mask_box" class="mask_box ui-corner-all"></div>
	
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
	
	
	<div id="container">
		<div id="content" data-scrollable="true">
			<canvas id="hexCanvas"></canvas>
		</div>
	</div>
	
	<script type="text/javascript">
	var NAME = "<?php echo $_GET['name']; ?>";		
	var GAME_ID = "<?php echo $_GET['gameid']; ?>" ;
	$(document).ready(CONTROLLER_MAIN);
	
	</script>

</body>

</html>