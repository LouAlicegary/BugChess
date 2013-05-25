<!DOCTYPE html>
<html>

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
	
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
	<link href='css/games_lobby.css' rel='stylesheet' type='text/css'>

</head>
 
<body>
	
	<div id="wrapper">	

		<?php // THIS PART READS IN THE GAMES USER IS CURRENTY IN PLUS OPEN GAMES FROM DB AND DISPLAYS THEM
		
			if(isset($_POST['name']) || isset($_GET['name']) ) {
				
				$name = "";
				
				if(isset($_POST['name'])) {
					$name = $_POST['name'];
				}
				else {
					$name = $_GET["name"];
				}
					
				mysql_connect("localhost", "sweetlou_bc", "sweetlou_bc") or die(mysql_error());
			    mysql_select_db("sweetlou_bugchess") or die(mysql_error());
			  
			 //////////////////////CURRENT GAMES///////////////////////////////////////
			 
			 	echo "<div class='game_menu_div'><div class='header_text'>games you're currently in: </div><br />";
				
				$name = mysql_real_escape_string($name);
				$data = mysql_query("SELECT * FROM games WHERE (white_player = '" . $name . "' OR black_player = '" . $name . "') AND finished = 0 ORDER BY game_id DESC LIMIT 5") or die(mysql_error()); 
				
				while($info = mysql_fetch_array( $data )) 
				{ 
					$game_id = $info['game_id'];
					$white_player = $info['white_player'];
					$black_player = $info['black_player'];
					
					if ($white_player === "") {
						$white_player = "(?)";
					}
					else if ($black_player === "") {
						$black_player = "(waiting)";
					}
					
					$time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM moves WHERE game_id = '" . $game_id . "' ORDER BY move_id DESC LIMIT 1");
					$the_diff = mysql_fetch_array($time_diff);
			
					$count = mysql_query("SELECT COUNT(*) FROM moves WHERE game_id =" . $game_id ) or die(mysql_error()); 
					$the_info = mysql_fetch_array( $count );
					$num_moves = $the_info[0];
					
					if ($num_moves == 0) {
						$game_time = mysql_query("SELECT TIMEDIFF(NOW(), time_created) AS DIFF FROM games WHERE game_id = '" . $game_id . "'");
						$the_gt = mysql_fetch_array($game_time);
						$time_since_last = "started " . $the_gt[0] . " ago";
					}
					else {
						$time_since_last = "last move " . $the_diff[0] . " ago";
					}
			
					echo "<div id='" . $game_id . "' class='regular_text current_game'><div class='column1'> " . $white_player . " vs. " . $black_player . "</div><div class='column2'>[" . $time_since_last . "]</div>";
					echo "<div class='column3'> ::: ";
					
					
					
					if ( (($name == $white_player) && ($num_moves%2 == 0)) || (($name == $black_player) && ($num_moves%2 == 1)) ) {
						echo "YOUR TURN :::";
					} 
					else {
						echo "OPPONENT'S TURN :::";
					}
					echo "</div></div>"; 
			 	}	
			 	
			 	echo  "</div>";
			    
			    ///////////////////OPPONENTS LOOKING///////////////////////////////////////////
			     
				echo "<div class='game_menu_div'><div class='header_text'>opponents looking for players: </div><br />";
				
				$data = mysql_query("SELECT * FROM games WHERE white_player LIKE '' OR black_player LIKE '' AND white_player NOT LIKE '" . $name . "' AND black_player NOT LIKE '" . $name . "' ORDER BY game_id DESC LIMIT 5") or die(mysql_error()); 
				
				while($info = mysql_fetch_array( $data )) 
				{ 
					$game_id = $info['game_id'];
					$white_player = $info['white_player'];
					$black_player = $info['black_player'];
					
					$time_diff = mysql_query("SELECT TIMEDIFF(NOW(), time_created) as diff FROM games WHERE game_id = '" . $game_id . "' LIMIT 1");
					$the_diff = mysql_fetch_array($time_diff);
							
					//echo "<div id='" . $game_id . "' class='regular_text open_game'>[started " . $the_diff[0] . " ago] " . $white_player . "</div>";
					echo "<div id='" . $game_id . "' class='regular_text open_game'><div class='column1'> " . $white_player . "</div><div class='column2'>[started " . $the_diff[0] . " ago]</div></div>";
					
			 	}
				
				echo "</div>";
			
			}
		
		?>	
	
		<div class='game_menu_div'>
			<div class='header_text'>start a new game:</div>
			<div id="solo_game" style="font-family: 'Droid Sans'; font-size: 32px; background: #000000; color: #ffffff; border: '5px solid black'; padding: 5px 10px 5px 10px; -webkit-border-radius: 15px; text-align: center;">solo practice mode</div>
			<div id="vs_game" style=" background: #000000; color: #ffffff; border: '5px solid black'; padding: 5px 10px 5px 10px; -webkit-border-radius: 15px; text-align: center;">vs. online opponent</div>
		</div>
	</div>

	<div id="portrait_warning" style="position: absolute; font-family: 'Pacifico'; text-align: center; ">This app is designed for use in landscape mode. Please flip your device.</div>
	
	<script type="text/javascript">
	
	
		<?php // MAKES SURE A NAME WAS PASSED TO THE LOBBY SCRIPT. NO NAME = NO VIEW
		
			if( (isset($_GET['name']) && !empty($_GET['name'])) || (isset($_POST['name']) && !empty($_POST['name'])) ) {
				if ($_POST['name']) {
					$name = $_POST['name'];
				}
				else {
					$name = $_GET['name'];
				}
				echo "var NAME = '" . $name . "';"; 
				echo "showPage();";
			}
			else {
				echo "window.location = 'index.php';";
			}		
		?>	

	
		function showPage() {
			$(document).ready(function(){
				
				
				//setInterval(function() {
				//	window.location = 'games_lobby.php?name=' + NAME;
				//}, 15000);
					
				var WINDOW_HEIGHT = $(window).height();
				var WINDOW_WIDTH = $(window).width();
				
				var DIV_MARGINLR = WINDOW_WIDTH / 20;
				var DIV_MARGINTB = 20;
				var DIV_SIDE_BORDER = 5;
				var DIV_HEIGHT = (WINDOW_HEIGHT / 3) - (DIV_SIDE_BORDER * 2) - (DIV_MARGINTB);
				var DIV_WIDTH = WINDOW_WIDTH - (DIV_MARGINLR * 2);
				
				var REGULAR_BAR_HEIGHT = DIV_HEIGHT / 8;
				var REGULAR_TEXT_PX = REGULAR_BAR_HEIGHT / 1.5;
				var REGULAR_TEXT_LEFT_MARGIN = 5;
				
				var HEADER_BAR_HEIGHT = DIV_HEIGHT / 4; 
				var HEADER_TEXT_PX = HEADER_BAR_HEIGHT / 2;
				var HEADER_TEXT_LEFT_MARGIN = 10;
				
				var BUTTON_HEIGHT = 50;
				var BUTTON_WIDTH = 300;
				var BUTTON_TOP = ((DIV_HEIGHT - HEADER_BAR_HEIGHT) / 2) - (BUTTON_HEIGHT/2) + HEADER_BAR_HEIGHT;
				var BUTTON_LEFT = 50;
				var BUTTON_MARGIN = 50;
				var BUTTON_TEXT_PX = 24;
				
				var WARNING_HEIGHT = WINDOW_HEIGHT / 4;
				var WARNING_WIDTH = WINDOW_WIDTH / 2;
				var WARNING_TOP = (WINDOW_HEIGHT/2) - (WINDOW_HEIGHT/8);
				var WARNING_LEFT = WINDOW_WIDTH / 4;
				var WARNING_FONT_PX = getMaxFontSizeByWidth($("#portrait_warning").width(), ($("#portrait_warning").height() * .8), "Pacifico", $("#portrait_warning").text().substring( $("#portrait_warning").text().indexOf(".") ));
				var WARNING_LINE_HEIGHT = WARNING_FONT_PX * 1.4;
				
				$('.header_text').css({ 
					'height' : HEADER_BAR_HEIGHT, 
					'font-size': + HEADER_TEXT_PX + 'px', 
					'font-family': 'Pacifico', 
					'margin-left': HEADER_TEXT_LEFT_MARGIN 
				});
				
				$('.regular_text').css({ 
					'height' : REGULAR_BAR_HEIGHT, 
					'font-size': + REGULAR_TEXT_PX + 'px', 
					'font-family': 'Droid Sans',
					'margin-left': REGULAR_TEXT_LEFT_MARGIN,
					'cursor': 'pointer'  
				});
				
				$(".game_menu_div").each(function( index ) {
					$(this).css({
						'position': 'absolute', 
						'height': DIV_HEIGHT, 
						'width': DIV_WIDTH, 
						'top': index*(WINDOW_HEIGHT/3), 
						'background': 'rgba(255, 255, 0, 0.2)', 
						'border': DIV_SIDE_BORDER + 'px solid black', 
						'-webkit-border-radius': '15px', 
						'margin':  DIV_MARGINTB + 'px ' + DIV_MARGINLR + 'px'
					});
				});
				
				$("#solo_game, #vs_game").css({
					'position': 'absolute', 
					'height': BUTTON_HEIGHT, 
					'width': BUTTON_WIDTH, 
					'top': BUTTON_TOP, 
					'left': BUTTON_LEFT, 
					'font-family': 'Open Sans', 
					'font-size': BUTTON_TEXT_PX + 'px', 
					'line-height': BUTTON_HEIGHT-5 + 'px',
					'cursor': 'pointer' 
				});
				
				$("#vs_game").css({
					'left': BUTTON_LEFT + BUTTON_WIDTH + BUTTON_MARGIN
				});
				
				$(".column1").css({
					'width': DIV_WIDTH/3-5,
					'left': REGULAR_TEXT_LEFT_MARGIN = 5, 
					'position': 'absolute',
				});	
					
				$(".column2").css({
					'width': DIV_WIDTH/3,
					'left': DIV_WIDTH/3, 
					'position': 'absolute',
				});	
				
				$(".column3").css({
					'width': DIV_WIDTH/3,
					'left': DIV_WIDTH*2/3, 
					'position': 'absolute',
				});	
				
				$("#portrait_warning").css({'height': WARNING_HEIGHT, 'width': WARNING_WIDTH, 'top': WARNING_TOP, 'left': WARNING_LEFT, 'font': WARNING_FONT_PX + "px Pacifico", 'text-align': 'center', 'line-height': WARNING_LINE_HEIGHT + 'px'});
			
				var temp=0;
				var min=99999; 
				
				$(".column1, .column2, .column3").each( function (index) {
					temp = getMaxFontSizeByWidth($(this).width(), ($(this).height() * .8), "Droid Sans", $(this).text());
					if ( (temp < min) && (temp != 0) )
						min = temp;
				});	
				
				if (min > REGULAR_BAR_HEIGHT * .9) {
					min = REGULAR_BAR_HEIGHT * .9;
				}
					
				$(".column1, .column2, .column3").each( function (index) {
					$(this).css({'font-size': + min + 'px'});
				});
				

				
				// CLICK ON CURRENT GAME FROM TOP LIST
				
				$('.current_game').bind('click', selectCurrentGame);
				$('.current_game').bind('touchstart', selectCurrentGame);	
	
				
				function selectCurrentGame(event) {
					var game_id = this.id;
					var white_player;
					var black_player;
					var request = $.ajax({
					 	url: "php/get_game_from_db.php",
						type: "POST",
						data: {gameid: game_id},
						dataType: "json",
						async: false
					});
					request.success(function(data){
						white_player = data[1];
						black_player = data[2];
					});
					request.fail(function(error, status){Logger("games_lobby: (282) AJAX FAIL");});
					request.done(function(done){
						window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + white_player + "&black_player=" + black_player;
					});
					
				}	
				
				
				
				// CLICK ON OPEN GAME FROM SECOND LIST
				
				$('.open_game').bind('click', selectOpenGame);
				$('.open_game').bind('touchstart', selectOpenGame);
				
				function selectOpenGame(event) {
					var flag = 0;
					var game_id = this.id;
					var opponent = "";
					var request = $.ajax({
					 	url: "php/get_game_from_db.php",
						type: "POST",
						data: {gameid: game_id},
						dataType: "json",
						async: false
					});
					request.success(function(data) {
						opponent = data[1];
						if (data[1] !== "" && data[2] !== "") { // check if second player has already joined
							flag = 0;
							alert("Sorry, but somebody alredy took the open spot. Please try another game.");
						}
						else {
							flag = 1;
						}
						
					});	
				
					request.fail(function(jqXHR, textStatus) {
						//alert("FAIL");
						flag = 0;
					});	
				
				   	request.done(function(data) {
				    	if (flag) {
				    		writeSecondPlayerToDB(game_id);
							window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + opponent + "&black_player=" + NAME;
				    	}
				    	else {
				    		window.location = "games_lobby.php?name=" + NAME;
				    	}
				    });	
				    		
				}
				
				function writeSecondPlayerToDB(game_id) {
					var request = $.ajax({
					 	url: "php/add_second_player_to_db.php",
						type: "POST",
						data: {name: NAME, gameid: game_id},
						dataType: "json",
						async: false
					});
				}	
				
				// CLICK ON PRACTICE GAME
				
				var GAME_ID = 0;
				
				$('#solo_game').bind('click', selectStartSoloGame);
				$('#solo_game').bind('touchstart', selectStartSoloGame);	
					
				function selectStartSoloGame(event) {
					GAME_ID = 0;
					window.location = 'play_game.php?name=' + NAME + '&gameid=' + GAME_ID + '&white_player=' + NAME + '&black_player=' + NAME;
				}; 
				
				
				
				// CLICK ON PLAY VS ONLINE OPPONENT
								
				$('#vs_game').bind('click', selectStartOnlineGame);
				$('#vs_game').bind('touchstart', selectStartOnlineGame);	
					
				function selectStartOnlineGame(event) {
					var bequest = $.ajax({
					 	url: "php/add_game_to_db.php",
						type: "POST",
						data: {name: NAME},
						dataType: "html"
					});	
					bequest.success(function(data) {
						GAME_ID = data;
					});
					bequest.fail(function(jqXHR, textStatus) {
						//alert( "AJAX FAIL: " + textStatus + " / " + jqXHR.responseText);
					});			
					bequest.done(function(data) {
						
						var game_id = GAME_ID;
						var white_player;
						var black_player;
						var request = $.ajax({
						 	url: "php/get_game_from_db.php",
							type: "POST",
							data: {gameid: game_id},
							dataType: "json",
							async: false
						});
						request.success(function(data){
							white_player = data[1];
							black_player = data[2];
						});
						request.fail(function(error, status){});
						request.done(function(done){
							window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + white_player + "&black_player=" + black_player;
						});	
							
					});	
		
				} 
			
				$('.open_game, .current_game').bind('mouseover', function() {
					$(this).css({'background': '#ffff00' });
				});
				
				$('.open_game, .current_game').bind('mouseout', function() {
					$(this).css({'background': 'none' });
				});
		
				window.onorientationchange = function(event) {
					window.location.href = window.location.href;
				};
				
				document.ontouchmove = function(e) {e.preventDefault()};
				
			});			
		}	
	</script>

</body>

</html>








