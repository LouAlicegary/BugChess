<!DOCTYPE html>

<html>

<head>
	<meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, user-scalable=0"/>
	
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
			 
			 	echo "<div id='current_games_div' class='game_menu_div'><div class='header_text'>games you're currently in: </div><br />";
				
				$name = mysql_real_escape_string($name);
				$data = mysql_query("SELECT * FROM games WHERE (white_player = '" . $name . "' OR black_player = '" . $name . "') AND finished = 0 ORDER BY game_id DESC LIMIT 3") or die(mysql_error()); 
				
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
			     
				echo "<div id='opponents_looking_div' class='game_menu_div'><div class='header_text'>opponents looking for players: </div><br />";
				
				$data = mysql_query("SELECT * FROM games WHERE white_player LIKE '' OR black_player LIKE '' AND white_player NOT LIKE '" . $name . "' AND black_player NOT LIKE '" . $name . "' ORDER BY game_id DESC LIMIT 3") or die(mysql_error()); 
				
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
                echo "<div id='new_game_div' class='game_menu_div'>";
                echo "<div class='header_text'>start a new game:</div>";
                echo "<div id='solo_game'>solo practice mode</div>";
                echo "<div id='vs_game'>vs. online opponent</div>";
                echo "</div>";
                echo "</div>";			
			}
		?>	
	

	<div id='portrait_warning' style='position: absolute; font-family: 'Pacifico'; text-align: center; '>
	    This app is designed for use in landscape mode. Please flip your device.
	</div>
	
	

	<script>
	
        <?php // MAKES SURE A NAME WAS PASSED TO THE LOBBY SCRIPT. NO NAME = NO VIEW
            if( (isset($_GET['name']) && !empty($_GET['name'])) || (isset($_POST['name']) && !empty($_POST['name'])) ) {
                if ($_POST['name'])
                    $name = $_POST['name'];
                else
                    $name = $_GET['name'];
                echo "var NAME = '" . $name . "';"; 
                echo "showPage();";
            }
            else {
                echo "window.location = 'index.php';";
            }       
        ?>	
	
		function showPage() {
			$(document).ready(function(){

				//setInterval(function() {window.location = 'games_lobby.php?name=' + NAME;}, 15000);
					
                setPageAttributes();
				
				window.onorientationchange = function(event) {
                    window.location.href = window.location.href;
                };
                
                document.ontouchmove = function(e) {
                    e.preventDefault();
                };

				// CLICK ON CURRENT GAME FROM TOP LIST
				$('.current_game').bind('click', selectCurrentGame);
				$('.current_game').bind('touchstart', selectCurrentGame);	
	
				// CLICK ON OPEN GAME FROM SECOND LIST
                $('.open_game').bind('click', selectOpenGame);
                $('.open_game').bind('touchstart', selectOpenGame);
                
                // CLICK ON SOLO PRACTICE GAME
                $('#solo_game').bind('click', selectStartSoloGame);
                $('#solo_game').bind('touchstart', selectStartSoloGame);                
                
                // CLICK ON PLAY VS ONLINE OPPONENT
                $('#vs_game').bind('click', selectStartOnlineGame);
                $('#vs_game').bind('touchstart', selectStartOnlineGame);                
                
                // SHOW YELLOW RIBBON ON MOUSEOVER GAME
                $('.open_game, .current_game').bind('mouseover', function() {
                    $(this).css({'background': '#ffff00' });
                });
                
                // AND GET RID OF YELLOW RIBBON ON MOUSEOUT OF GAME
                $('.open_game, .current_game').bind('mouseout', function() {
                    $(this).css({'background': 'none' });
                });
                
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
					request.fail(function(error, status){
					    Logger("games_lobby: (282) AJAX FAIL");
					});
					request.done(function(done){
						window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + white_player + "&black_player=" + black_player;
					});
				}	
				
				

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
				
				function selectStartSoloGame(event) {
					GAME_ID = 0;
					window.location = 'play_game.php?name=' + NAME + '&gameid=' + GAME_ID + '&white_player=' + NAME + '&black_player=' + NAME;
				} 
				

				function selectStartOnlineGame(event) {
					var request = $.ajax({
					 	url: "php/add_game_to_db.php",
						type: "POST",
						data: {name: NAME},
						dataType: "html"
					});	
					request.success(function(data) {
						GAME_ID = data;
					});
					request.fail(function(jqXHR, textStatus) {
						//alert( "AJAX FAIL: " + textStatus + " / " + jqXHR.responseText);
					});			
					request.done(function(data) {
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
						request.fail(function(error, status){
						    // NOTHING RIGHT NOW
						});
						request.done(function(done){
							window.location = "play_game.php?gameid=" + game_id + "&name=" + NAME + "&white_player=" + white_player + "&black_player=" + black_player;
						});	
							
					});	
				} 
			});			
		}
		
		
        function setPageAttributes() {
        
            var WINDOW_HEIGHT = $(window).height();  
            var WINDOW_WIDTH = $(window).width();
             Logger("WINDOW RESIZE = " + WINDOW_WIDTH + "x" + WINDOW_HEIGHT);
             Logger("WINDOW (" + window.orientation + "). OuterW/H / InnerW/H = " + window.outerWidth + " " + window.outerHeight + " " + window.innerWidth + " " + window.innerHeight);
     
            $(".header_text").css({ 
                'font-size': getMaxFontSizeByWidth($(".header_text").width() * .8, $(".header_text").height() * .6, 'Pacifico', "BBBBBBBBBBBBBBB") + 'px',
                'line-height': ($(".header_text").height() * .8) + 'px'
            });  
        
            $(".regular_text").css({ 
                'font-size': getMaxFontSizeByWidth($(".regular_text").width() * .9, $(".regular_text").height() * .6, 'Pacifico', "BBBBBBBBBBBBBBB") + 'px',
                'line-height': ($(".regular_text").height() * .6) + 'px'
            });     
            
		}
			
	</script>

</body>

</html>








