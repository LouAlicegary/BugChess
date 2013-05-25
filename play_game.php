<!DOCTYPE html>
<html>

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
	
	<title>loualicegary.com / Bug Chess (alpha)</title>
	
	<!-- jQuery + jQuery Touch Punch -->
	<script src="js/jquery/jquery-1.9.1.min.js"></script>
	<script src="js/jquery/jquery-ui-1.10.3.min.js"></script>
	<script src="js/jquery/jquery.ui.touch-punch.min.js"></script>

	<!-- Logging Wrapper -->
	<script src="js/logger.js"></script>
		
	<!-- MVC Architecture -->
	<script src="js/mvc/MODEL.js"></script>
	<script src="js/mvc/VIEW.js"></script>
	<script src="js/mvc/CONTROLLER.js"></script>
	
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
	<link href='http://fonts.googleapis.com/css?family=Pacifico|Droid+Sans:bold|Open+Sans:bold|Oswald:bold' rel='stylesheet' type='text/css'>
	<link href='css/index.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	<div id="wrapper">
	
		<div id="game_title">Bug Chess</div>
		
		<div id="bottom_bar">
			<div id="undo_move_button" class="game_button ui-corner-all">undo move</div>
			<div id="cancel_game_button" class="game_button ui-corner-all">cancel game</div>
			<div id="return_button" class="game_button ui-corner-all">return to lobby</div>	
			<div id="rematch_button" class="game_button ui-corner-all">play rematch</div>
			<div id="clear_board_button" class="game_button ui-corner-all">clear board</div>
			<div id="resign_button" class="game_button ui-corner-all">resign game</div>
				
		</div>
		
		<div id="game_over_popup"></div>
		<div id="white_player_name"></div>
		<div id="black_player_name"></div>
		
		<div id="white_mask_box" class="mask_box ui-corner-all"></div>
		<div id="black_mask_box" class="mask_box ui-corner-all"></div>
		
		<!-- WHITE PIECES -->
		<div id="white_ant3" class="game_piece white_ant"><img src="pieces/white_ant.png"></div>
		<div id="white_ant2" class="game_piece white_ant"><img src="pieces/white_ant.png"></div>
		<div id="white_ant1" class="game_piece white_ant"><img src="pieces/white_ant.png"></div>
		<div id="white_grasshopper3" class="game_piece white_grasshopper"><img src="pieces/white_grasshopper.png"></div>
		<div id="white_grasshopper2" class="game_piece white_grasshopper"><img src="pieces/white_grasshopper.png"></div>
		<div id="white_grasshopper1" class="game_piece white_grasshopper"><img src="pieces/white_grasshopper.png"></div>
		<div id="white_spider2" class="game_piece white_spider"><img src="pieces/white_spider.png"></div>
		<div id="white_spider1" class="game_piece white_spider"><img src="pieces/white_spider.png"></div>
		<div id="white_beetle2" class="game_piece white_beetle"><img src="pieces/white_beetle.png"></div>
		<div id="white_beetle1" class="game_piece white_beetle"><img src="pieces/white_beetle.png"></div>
		<div id="white_bee1" class="game_piece white_bee"><img src="pieces/white_bee.png"></div>
		
		<!-- BLACK PIECES -->	
        <div id="black_ant3" class="game_piece black_ant"><img src="pieces/black_ant.png"></div>
        <div id="black_ant2" class="game_piece black_ant"><img src="pieces/black_ant.png"></div>
        <div id="black_ant1" class="game_piece black_ant"><img src="pieces/black_ant.png"></div>
        <div id="black_grasshopper3" class="game_piece black_grasshopper"><img src="pieces/black_grasshopper.png"></div>
        <div id="black_grasshopper2" class="game_piece black_grasshopper"><img src="pieces/black_grasshopper.png"></div>
        <div id="black_grasshopper1" class="game_piece black_grasshopper"><img src="pieces/black_grasshopper.png"></div>
        <div id="black_spider2" class="game_piece black_spider"><img src="pieces/black_spider.png"></div>
        <div id="black_spider1" class="game_piece black_spider"><img src="pieces/black_spider.png"></div>
        <div id="black_beetle2" class="game_piece black_beetle"><img src="pieces/black_beetle.png"></div>
        <div id="black_beetle1" class="game_piece black_beetle"><img src="pieces/black_beetle.png"></div>
        <div id="black_bee1" class="game_piece black_bee"><img src="pieces/black_bee.png"></div>	
		
		
		<div id="container">
			<div id="content" data-scrollable="true">
				<canvas id="hexCanvas"></canvas>
			</div>
		</div>
		
	</div>
	
	<script type="text/javascript">

		<?php
		if(isset($_GET['name']) && !empty($_GET['name']) && isset($_GET['gameid']) && isset($_GET['white_player']) && isset($_GET['white_player']) ) {
		 	echo "NAME = '" . $_GET['name'] . "';\n";
		 	echo "GAME_ID = " . $_GET['gameid'] . ";\n";
		 	if ( !empty($_GET['white_player']) ) {
		 		echo "WHITE_PLAYER_NAME = '" . $_GET['white_player'] . "';\n";
		 	}
			else {
				echo "WHITE_PLAYER_NAME = '(none)';\n";
			} 
		 	if ( !empty($_GET['black_player']) ) {
		 		echo "BLACK_PLAYER_NAME = '" . $_GET['black_player'] . "';\n";
		 	}
			else {
				echo "BLACK_PLAYER_NAME = '(none)';\n";
			} 	 	
		 	echo "var SOLO_GAME = 0;";
			echo "if (!GAME_ID) {SOLO_GAME = 1; BLACK_PLAYER_NAME = 'Black'; WHITE_PLAYER_NAME = 'White';}";
		 	echo "$(document).ready(CONTROLLER_MAIN);\n";
		}
		else {
			echo "window.location = 'index.php';";
		}		
		?>			

	</script>

</body>

</html>